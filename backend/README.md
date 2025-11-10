# AI Language Flashcards - Backend

FastAPI backend for the AI Language Flashcards application with Google Gemini AI integration.

## Features

- **AI-Powered Translation**: Uses Google Gemini API for text translation
- **Image Analysis**: Gemini Vision API analyzes images to generate vocabulary
- **Text-to-Speech**: gTTS integration for audio pronunciation
- **Dual Storage**: MongoDB primary with in-memory fallback
- **RESTful API**: Complete CRUD operations for flashcards
- **CORS Enabled**: Configured for React frontend

## Tech Stack

- **Framework**: FastAPI 0.104.1
- **AI**: Google Generative AI (Gemini)
- **Database**: MongoDB with PyMongo
- **TTS**: Google Text-to-Speech (gTTS)
- **Server**: Uvicorn

## Prerequisites

- Python 3.8 or higher
- MongoDB (optional - will fallback to in-memory storage)
- Google Gemini API Key

## Installation

1. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/
   DATABASE_NAME=flashcard_db
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key to your `.env` file

## Running the Server

### Development Mode

```bash
# Activate virtual environment
source venv/bin/activate

# Run with uvicorn
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`

### Production Mode

```bash
python main.py
```

## API Endpoints

### Root
- `GET /` - API information and status

### Flashcard Generation
- `POST /generate-flashcard/` - Generate flashcard from text
  - Body: `{ "text": "Hello", "source_language": "en", "target_language": "th" }`
  
- `POST /generate-flashcard-from-image/` - Generate flashcard from image
  - Form data: `file` (image file)
  - Query param: `target_language` (default: "th")

### Flashcard CRUD
- `GET /flashcards/` - Get all flashcards
- `POST /flashcards/` - Create a new flashcard
- `GET /flashcards/{card_id}` - Get specific flashcard
- `PUT /flashcards/{card_id}` - Update flashcard
- `DELETE /flashcards/{card_id}` - Delete flashcard

### Text-to-Speech
- `GET /tts/?text=Hello` - Get audio file for text

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── main.py              # FastAPI application and endpoints
├── models.py            # Pydantic models and schemas
├── database.py          # Database manager with MongoDB/in-memory
├── gemini_service.py    # Google Gemini API integration
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (not in git)
└── .env.example         # Environment variables template
```

## Database

### MongoDB (Primary)
The application attempts to connect to MongoDB on startup. If successful, all flashcards are stored in MongoDB.

### In-Memory Fallback
If MongoDB connection fails, the application automatically falls back to in-memory storage using a Python dictionary. This ensures the application remains functional even without MongoDB.

## Error Handling

The API includes comprehensive error handling:
- 404: Resource not found
- 500: Server errors with descriptive messages
- Automatic fallback to in-memory storage on database failures

## Development

### Adding New Endpoints

1. Define Pydantic models in `models.py`
2. Add endpoint logic in `main.py`
3. Update database operations in `database.py` if needed

### Testing

Test endpoints using curl:

```bash
# Test root endpoint
curl http://localhost:8000/

# Get all flashcards
curl http://localhost:8000/flashcards/

# Create flashcard
curl -X POST http://localhost:8000/flashcards/ \
  -H "Content-Type: application/json" \
  -d '{"original_text":"Hello","translated_text":"สวัสดี","image_description":"A greeting"}'
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Application will automatically use in-memory storage if MongoDB is unavailable

### Gemini API Errors
- Verify API key is correct in `.env`
- Check API quota at [Google AI Studio](https://makersuite.google.com/)
- Ensure internet connection is active

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

## License

This project is part of the AI Language Flashcards application.

