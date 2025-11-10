from pydantic import BaseModel, Field
from typing import Optional
import uuid


def generate_uuid():
    """Generate a unique ID for flashcards"""
    return str(uuid.uuid4())


class FlashcardBase(BaseModel):
    """Base model for flashcard data"""
    original_text: str
    translated_text: str
    image_description: Optional[str] = ""
    image: Optional[str] = ""  # Base64 encoded image


class FlashcardCreate(FlashcardBase):
    """Model for creating a new flashcard"""
    pass


class FlashcardUpdate(BaseModel):
    """Model for updating a flashcard"""
    original_text: Optional[str] = None
    translated_text: Optional[str] = None
    image_description: Optional[str] = None
    image: Optional[str] = None


class Flashcard(FlashcardBase):
    """Complete flashcard model with ID"""
    id: str = Field(default_factory=generate_uuid)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "original_text": "Hello",
                "translated_text": "สวัสดี",
                "image_description": "A greeting gesture",
                "image": "base64_encoded_string_here"
            }
        }


class GenerateFlashcardRequest(BaseModel):
    """Request model for generating flashcard from text"""
    text: str
    source_language: str = "en"  # Default to English
    target_language: str = "th"  # Default to Thai


class GenerateFlashcardResponse(BaseModel):
    """Response model for generated flashcard content"""
    original_text: str
    translated_text: str
    image_description: str

