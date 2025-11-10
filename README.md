# 🎴 AI Language Flashcards

An intelligent language learning application that helps you create flashcards for Thai-English vocabulary using AI-powered translation and image analysis.

![Language Learning](https://img.shields.io/badge/Language-Thai%20%7C%20English-blue)
![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini-orange)
![Status](https://img.shields.io/badge/Status-Active-green)

## 🌟 Features

### Multiple Input Methods
- **📝 Text Input**: Type a word or phrase to get instant translation
- **📁 Image Upload**: Upload an image to identify objects and learn vocabulary
- **📷 Camera Capture**: Take a photo with your device camera for real-time learning

### AI-Powered Learning
- **Google Gemini AI**: Advanced translation and image analysis
- **Gemini Vision**: Intelligent object recognition in images
- **Context-Aware**: Generates descriptions to help visualize vocabulary

### Interactive Features
- **🔊 Text-to-Speech**: Audio pronunciation for both Thai and English
- **💾 Persistent Storage**: MongoDB database with in-memory fallback
- **🎨 Beautiful UI**: Modern, responsive design with smooth animations
- **📱 Mobile Friendly**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

```
flashcard/
├── backend/          # FastAPI backend
│   ├── main.py              # API endpoints
│   ├── models.py            # Data models
│   ├── database.py          # Database manager
│   ├── gemini_service.py    # AI integration
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
│
├── frontend/         # React frontend
│   ├── src/
│   │   ├── App.js           # Main component
│   │   ├── FlashcardForm.js # Creation form
│   │   ├── FlashcardList.js # Display component
│   │   ├── CameraComponent.js # Camera handler
│   │   └── api.js           # API service
│   └── package.json         # Node dependencies
│
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** for backend
- **Node.js 14+** for frontend
- **MongoDB** (optional - will use in-memory storage as fallback)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd flashcard
   ```

2. **Set up the backend**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key
   ```

4. **Set up the frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend** (in `backend/` directory):
   ```bash
   source venv/bin/activate
   python main.py
   ```
   Backend runs at `http://localhost:8000`

2. **Start the frontend** (in `frontend/` directory):
   ```bash
   npm start
   ```
   Frontend opens at `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 📖 Usage Guide

### Creating Flashcards

#### Method 1: Text Input
1. Click the "✏️ Text Input" tab
2. Enter a word or phrase (e.g., "Hello", "Apple")
3. Select source and target languages
4. Click "Create Flashcard"
5. AI generates translation and description

#### Method 2: Image Upload
1. Click the "📁 Upload Image" tab
2. Choose an image file from your device
3. Preview the image
4. Click "Create Flashcard from Image"
5. AI analyzes the image and creates vocabulary

#### Method 3: Camera Capture
1. Click the "📷 Camera" tab
2. Click "Start Camera" (allow camera permissions)
3. Point camera at an object
4. Click "Capture" to take photo
5. Review and click "Use Photo"
6. AI processes the image

### Managing Flashcards

- **View**: All flashcards appear in a grid below the creation form
- **Listen**: Click 🔊 to hear pronunciation
- **Delete**: Click 🗑️ to remove a flashcard

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Google Generative AI**: Gemini API for translation and vision
- **MongoDB**: Primary database (with in-memory fallback)
- **gTTS**: Google Text-to-Speech
- **Uvicorn**: ASGI server

### Frontend
- **React**: UI library
- **Axios**: HTTP client
- **react-camera-pro**: Camera integration
- **CSS**: Custom responsive styling

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=flashcard_db

# Google Gemini API
GEMINI_API_KEY=your_api_key_here
```

### Frontend Proxy

The frontend proxies API requests to the backend. This is configured in `frontend/package.json`:

```json
"proxy": "http://localhost:8000"
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

- `POST /generate-flashcard/` - Generate from text
- `POST /generate-flashcard-from-image/` - Generate from image
- `GET /flashcards/` - Get all flashcards
- `POST /flashcards/` - Create flashcard
- `DELETE /flashcards/{id}` - Delete flashcard
- `GET /tts/?text=...` - Get audio pronunciation

## 🎨 Features in Detail

### Dual Language Support
- Primary languages: Thai (ไทย) and English
- Automatic language detection for TTS
- Bidirectional translation support

### Database Resilience
- **Primary**: MongoDB for persistent storage
- **Fallback**: In-memory dictionary if MongoDB unavailable
- Automatic failover with no user intervention

### Image Processing
- Supports common formats (JPG, PNG, etc.)
- Base64 encoding for storage
- AI-powered object recognition
- Contextual vocabulary generation

### Text-to-Speech
- Automatic language detection
- Thai and English pronunciation
- On-demand audio generation
- Browser-based playback

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Application automatically uses in-memory storage
- Check MongoDB is running: `mongod`
- Verify connection string in `.env`

**Gemini API Errors**
- Verify API key in `backend/.env`
- Check quota at [Google AI Studio](https://makersuite.google.com/)
- Ensure internet connection

### Frontend Issues

**Cannot Connect to Backend**
- Ensure backend is running on port 8000
- Check proxy configuration in `package.json`
- Look for CORS errors in browser console

**Camera Not Working**
- Allow camera permissions in browser
- Use HTTPS or localhost (required for camera)
- Check if camera is used by another app

## 📝 Development

### Adding Features

1. **Backend**: Add endpoints in `backend/main.py`
2. **Frontend**: Create components in `frontend/src/`
3. **API**: Update `frontend/src/api.js`
4. **Styles**: Modify `frontend/src/App.css`

### Testing

**Backend**:
```bash
curl http://localhost:8000/flashcards/
```

**Frontend**:
```bash
npm test
```

## 🚢 Deployment

### Backend Deployment
- Use a WSGI server like Gunicorn
- Set environment variables on hosting platform
- Ensure MongoDB is accessible
- Configure CORS for production domain

### Frontend Deployment
- Build: `npm run build`
- Deploy `build/` directory to static hosting
- Update API proxy for production backend URL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is created for educational purposes as part of an AI language learning initiative.

## 🙏 Acknowledgments

- **Google Gemini AI** for translation and vision capabilities
- **FastAPI** for the excellent Python framework
- **React** for the powerful UI library
- **MongoDB** for flexible data storage

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review backend/frontend README files
3. Check API documentation at `/docs`

---

**Happy Learning! 🎓📚**

Made with ❤️ for language learners

