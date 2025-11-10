from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from typing import List
import base64
import io
from gtts import gTTS
import os
import tempfile

from models import (
    Flashcard,
    FlashcardCreate,
    FlashcardUpdate,
    GenerateFlashcardRequest,
    GenerateFlashcardResponse
)
from database import db_manager
from gemini_service import gemini_service

# Create FastAPI app
app = FastAPI(
    title="AI Language Flashcards API",
    description="API for creating and managing language learning flashcards with AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
def shutdown_event():
    """Close database connection on shutdown"""
    db_manager.close()


@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "AI Language Flashcards API",
        "version": "1.0.0",
        "database": "MongoDB" if db_manager.use_mongodb else "In-Memory"
    }


@app.post("/generate-flashcard/", response_model=GenerateFlashcardResponse)
def generate_flashcard(request: GenerateFlashcardRequest):
    """
    Generate flashcard content from text input using Gemini API
    
    Args:
        request: Contains text and language preferences
    
    Returns:
        Generated flashcard content with translation and description
    """
    try:
        result = gemini_service.generate_translation(
            text=request.text,
            source_lang=request.source_language,
            target_lang=request.target_language
        )
        return GenerateFlashcardResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating flashcard: {str(e)}")


@app.post("/generate-flashcard-from-image/", response_model=Flashcard)
async def generate_flashcard_from_image(
    file: UploadFile = File(...),
    target_language: str = Query(default="th", description="Target language for translation")
):
    """
    Generate and create a flashcard from an uploaded image using Gemini Vision API
    
    Args:
        file: Uploaded image file
        target_language: Target language for translation (default: "th")
    
    Returns:
        Complete flashcard object with generated content
    """
    try:
        # Read image file
        image_data = await file.read()
        
        # Convert to base64 for storage
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Analyze image with Gemini
        analysis_result = gemini_service.analyze_image(image_data, target_language)
        
        # Create flashcard
        flashcard = Flashcard(
            original_text=analysis_result["original_text"],
            translated_text=analysis_result["translated_text"],
            image_description=analysis_result["image_description"],
            image=image_base64
        )
        
        # Save to database
        saved_flashcard = db_manager.create_flashcard(flashcard)
        
        return saved_flashcard
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@app.get("/flashcards/", response_model=List[Flashcard])
def get_all_flashcards():
    """
    Get all flashcards
    
    Returns:
        List of all flashcards
    """
    try:
        flashcards = db_manager.get_all_flashcards()
        return flashcards
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving flashcards: {str(e)}")


@app.post("/flashcards/", response_model=Flashcard)
def create_flashcard(flashcard: FlashcardCreate):
    """
    Create a new flashcard with provided data
    
    Args:
        flashcard: Flashcard data
    
    Returns:
        Created flashcard with generated ID
    """
    try:
        new_flashcard = Flashcard(**flashcard.model_dump())
        saved_flashcard = db_manager.create_flashcard(new_flashcard)
        return saved_flashcard
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating flashcard: {str(e)}")


@app.get("/flashcards/{card_id}", response_model=Flashcard)
def get_flashcard(card_id: str):
    """
    Get a specific flashcard by ID
    
    Args:
        card_id: Flashcard ID
    
    Returns:
        Flashcard object
    """
    flashcard = db_manager.get_flashcard(card_id)
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return flashcard


@app.put("/flashcards/{card_id}", response_model=Flashcard)
def update_flashcard(card_id: str, update_data: FlashcardUpdate):
    """
    Update a flashcard
    
    Args:
        card_id: Flashcard ID
        update_data: Fields to update
    
    Returns:
        Updated flashcard
    """
    updated_flashcard = db_manager.update_flashcard(
        card_id,
        update_data.model_dump(exclude_unset=True)
    )
    if not updated_flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return updated_flashcard


@app.delete("/flashcards/{card_id}")
def delete_flashcard(card_id: str):
    """
    Delete a flashcard
    
    Args:
        card_id: Flashcard ID
    
    Returns:
        Success message
    """
    success = db_manager.delete_flashcard(card_id)
    if not success:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return {"message": "Flashcard deleted successfully"}


@app.get("/tts/")
def text_to_speech(text: str = Query(..., description="Text to convert to speech")):
    """
    Convert text to speech and return audio file
    
    Args:
        text: Text to convert to speech
    
    Returns:
        MP3 audio file
    """
    try:
        # Detect language (simple heuristic: if contains Thai characters, use Thai)
        lang = 'th' if any('\u0E00' <= char <= '\u0E7F' for char in text) else 'en'
        
        # Generate speech
        tts = gTTS(text=text, lang=lang, slow=False)
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as fp:
            tts.save(fp.name)
            temp_file = fp.name
        
        # Return file and schedule deletion
        def iterfile():
            with open(temp_file, mode="rb") as file_like:
                yield from file_like
            os.unlink(temp_file)  # Delete after sending
        
        return StreamingResponse(
            iterfile(),
            media_type="audio/mpeg",
            headers={"Content-Disposition": f"attachment; filename=tts.mp3"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating speech: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

