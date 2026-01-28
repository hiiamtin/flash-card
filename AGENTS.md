# Project Prompt: AI Language Flashcards

## Core Concept
The application should enable users to generate language flashcards by providing input in one of three ways: typing text, uploading an image, or capturing a photo with a device's camera. The system will use the Google Gemini AI API to process the input and generate relevant vocabulary, translations, and descriptions, which will then be used to create a flashcard. The flashcards will be stored in a database and displayed to the user. The application must also include text-to-speech (TTS) functionality for audio pronunciation.

## Key Features
1.  **Dual Language Support:** The primary languages for practice are Thai and English.
2.  **Flashcard Creation Methods:**
    *   **Text Input:** A user types a word or phrase. The backend sends this to the Gemini API to get the translation and an image description.
    *   **Image Upload:** A user uploads an image file (e.g., PNG, JPG). The backend sends the image to the Gemini Vision API(gemini-2.5-flash) to identify the object/scene and generate a descriptive word/phrase, its translation, and a description.
    *   **Camera Capture:** A user captures a photo using their device's camera. The captured image is processed the same way as an uploaded image.
        *   **Camera Switching:** Users can toggle between front/back cameras on mobile devices.
3.  **AI Integration (Google Gemini):**
    *   Use the Gemini API for all AI-powered generation tasks.
    *   For text input, generate a translation text.
    *   For image input, analyze the image and generate a word/phrase, its translation, and a description.
4.  **Database Storage:**
    *   Use MongoDB as the primary database for storing flashcards.
    *   Implement a fallback to an in-memory dictionary-based storage system in case the MongoDB connection fails. This ensures the application remains functional.
    *   The flashcard schema must include fields for the original text, translated text, image description, and the image itself (stored as a base64 encoded string).
5.  **Card Management System:**
    *   Implement full CRUD (Create, Read, Update, Delete) functionality for flashcards.
    *   Display all created flashcards in a list or grid format.
    *   Each card should display the image (or a placeholder if none exists), the original word, and the translated word.
6.  **Text-to-Speech (TTS):**
    *   Integrate a TTS service (like gTTS) to provide audio pronunciation for the vocabulary on the flashcards. Users should be able to click a button to hear the audio.

## Technical Stack and Architecture
*   **Frontend:**
    *   **Framework:** React (Create React App)
    *   **Styling:** Use a modern styling solution like Styled Components or a standard CSS file (`App.css`). The UI should be simple, clean, and responsive.
    *   **API Communication:** Use `axios` or `fetch` for making API calls to the backend. Configure a proxy in `package.json` to forward requests from `http://localhost:3000` to the backend at `http://localhost:8000`.
    *   **Components:**
        *   `FlashcardForm`: A component with tabs or buttons to switch between text input, file upload, and camera capture.
        *   `FlashcardList`: A component to display the list of all flashcards retrieved from the backend.
        *   `CameraComponent`: A component for capturing photos (you can use a library like `react-camera-pro`).
*   **Backend:**
    *   **Framework:** Python with FastAPI.
    *   **Dependencies:** `fastapi`, `uvicorn`, `google-generativeai`, `gtts`, `pymongo`, `pydantic`, `python-multipart`, `Pillow`.
    *   **API Endpoints:**
        *   `/generate-flashcard/` (POST): Takes text input, calls Gemini, and returns generated content.
        *   `/generate-flashcard-from-image/` (POST): Takes an image file, calls Gemini Vision, creates the flashcard, and returns the complete flashcard object.
        *   `/flashcards/` (GET, POST): `GET` to retrieve all flashcards, `POST` to create a new flashcard with provided data.
        *   `/flashcards/{card_id}` (GET, PUT, DELETE): Standard RESTful endpoints for managing a single flashcard.
        *   `/tts/` (GET): Takes text and returns an audio file.
    *   **Configuration:** Use a `.env` file to manage environment variables like `MONGO_URI`, `DATABASE_NAME`, and `GEMINI_API_KEY`.
    *   **CORS:** Configure CORS middleware to allow requests from the frontend's origin (`http://localhost:3000`).
*   **Database:**
    *   **Primary:** MongoDB.
    *   **Fallback:** In-memory Python dictionary.
    *   **Schema:**
        ```json
        {
          "id": "string",
          "original_text": "string",
          "translated_text": "string",
          "image_description": "string",
          "image": "string (base64 encoded)"
        }
        ```

## Coding Style Guidelines

*   **Frontend (React):**
    *   Use functional components with hooks.
    *   Follow React naming conventions: PascalCase for components, camelCase for variables and functions.
    *   Use meaningful component and variable names.
    *   Implement proper error handling and loading states.
    *   Use modern ES6+ JavaScript features (arrow functions, destructuring, async/await).
    *   Keep components focused and single-responsibility.

*   **Backend (Python/FastAPI):**
    *   Follow PEP 8 style guide.
    *   Use type hints for function parameters and return values.
    *   Implement proper error handling with FastAPI's HTTPException.
    *   Use async/await for I/O bound operations.
    *   Keep functions small and focused on single responsibilities.
    *   Use descriptive variable and function names.

*   **General:**
    *   Write clear, descriptive comments for complex logic.
    *   Maintain consistent indentation (2 spaces for frontend, 4 spaces for backend).
    *   Use meaningful commit messages.
    *   Follow RESTful API design principles for backend endpoints.

## Development Setup and Instructions
*   Provide clear `README.md` files for both the `frontend` and `backend` directories.
*   The frontend should be runnable with `npm install` and `npm start`.
*   The backend should be runnable with a Python package manager like `uv` and `uvicorn main:app --reload`.
*   The project should be structured with a root directory containing `frontend/` and `backend/` subdirectories.
*   Frontend: Use npm for all package management (never edit package.json manually)
*   Backend: Use pip/uv for Python dependencies (never edit requirements.txt manually, I recommend using `uv` for dependency management)

## Setup Commands

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies using uv (recommended):
   ```bash
   uv pip install -r requirements.txt
   ```
   Or using pip:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with your environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your credentials:
   ```
   MONGO_URI=mongodb://localhost:27017
   DATABASE_NAME=flashcard_db
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

### MongoDB Setup (Optional)
If you want to use MongoDB instead of the in-memory fallback:

1. Install MongoDB:
   - **macOS:** `brew install mongodb-community`
   - **Ubuntu:** `sudo apt-get install mongodb`
   - **Windows:** Download from [MongoDB官网](https://www.mongodb.com/try/download/community)

2. Start MongoDB service:
   - **macOS:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongodb`
   - **Windows:** Run MongoDB as a service

3. Verify MongoDB is running:
   ```bash
   mongosh
   ```
   Or:
   ```bash
   mongo
   ```

### Running the Application
1. Start MongoDB (if using MongoDB database)
2. Start the backend server (in one terminal)
3. Start the frontend server (in another terminal)
4. Open `http://localhost:3000` in your browser

### Environment Variables
Make sure to set the following environment variables in the backend `.env` file:
- `MONGO_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017`)
- `DATABASE_NAME`: Name of the database to use
- `GEMINI_API_KEY`: Your Google Gemini API key

### Troubleshooting
- If MongoDB connection fails, the application will automatically fall back to in-memory storage
- Make sure the backend is running before starting the frontend
- Check that the API proxy in `frontend/package.json` is correctly configured to `http://localhost:8000`