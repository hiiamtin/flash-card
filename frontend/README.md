# AI Language Flashcards - Frontend

React frontend for the AI Language Flashcards application with support for text input, image upload, and camera capture.

## Features

- **Multiple Input Methods**: Text, image upload, or camera capture
- **Real-time Translation**: AI-powered translation display
- **Audio Pronunciation**: Text-to-speech for both languages
- **Flashcard Management**: View, delete flashcards
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, gradient-based design with smooth animations

## Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Create React App
- **HTTP Client**: Axios
- **Camera**: react-camera-pro
- **Styling**: CSS with custom styles

## Prerequisites

- Node.js 14 or higher
- npm or yarn
- Backend server running on `http://localhost:8000`

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

   Or with yarn:
   ```bash
   yarn install
   ```

## Running the Application

### Development Mode

```bash
npm start
```

The application will open at `http://localhost:3000`

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Application styles
│   ├── api.js          # API service layer
│   ├── FlashcardForm.js    # Form component for creating flashcards
│   ├── FlashcardList.js    # Component for displaying flashcards
│   ├── CameraComponent.js  # Camera capture component
│   └── index.js        # Application entry point
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Components

### App.js
Main application component that manages state and renders the form and list components.

### FlashcardForm.js
Tabbed interface for creating flashcards with three methods:
- **Text Input**: Enter a word/phrase for translation
- **Upload Image**: Select an image file to analyze
- **Camera**: Capture a photo using device camera

### FlashcardList.js
Displays all created flashcards in a responsive grid with:
- Image preview
- Original and translated text
- Audio playback buttons
- Delete functionality

### CameraComponent.js
Handles camera access and photo capture using react-camera-pro.

### api.js
Service layer for all backend API calls:
- Generate flashcards from text
- Generate flashcards from images
- CRUD operations for flashcards
- Text-to-speech requests

## Features in Detail

### Text Input
1. Enter a word or phrase
2. Select source and target languages
3. Click "Create Flashcard"
4. AI generates translation and description

### Image Upload
1. Click "Upload Image" tab
2. Select an image file
3. Preview the image
4. Click "Create Flashcard from Image"
5. AI analyzes image and generates vocabulary

### Camera Capture
1. Click "Camera" tab
2. Click "Start Camera" to activate
3. Click "Capture" to take photo
4. Review and click "Use Photo"
5. AI processes the image

### Audio Pronunciation
- Click the 🔊 button next to any text
- Automatically detects language (Thai/English)
- Plays audio pronunciation

## Configuration

### Backend Proxy
The frontend is configured to proxy API requests to the backend:

```json
"proxy": "http://localhost:8000"
```

This is set in `package.json` and allows the frontend to make requests to `/api/*` which are forwarded to the backend.

### API Base URL
If you need to change the backend URL, update the `API_BASE_URL` in `src/api.js`:

```javascript
const API_BASE_URL = '/api';
```

## Styling

The application uses custom CSS with:
- Gradient backgrounds
- Card-based layout
- Responsive grid system
- Smooth transitions and hover effects
- Mobile-friendly design

### Color Scheme
- Primary: Purple gradient (#667eea to #764ba2)
- Background: White cards on gradient background
- Text: Dark gray (#333) for readability

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers with camera support

## Camera Permissions

The camera feature requires browser permissions:
1. Browser will prompt for camera access
2. Allow camera permissions
3. If denied, refresh and try again

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Verify proxy configuration in `package.json`

### Camera Not Working
- Check browser permissions
- Ensure HTTPS or localhost (required for camera access)
- Try a different browser
- Check if camera is being used by another application

### Build Warnings
The application may show deprecation warnings from dependencies. These are non-critical and don't affect functionality.

### Styled Components Warning
If you see warnings about styled-components, ensure it's installed:
```bash
npm install styled-components --legacy-peer-deps
```

## Development

### Adding New Features

1. Create new component in `src/`
2. Import and use in `App.js`
3. Add API calls to `api.js` if needed
4. Update styles in `App.css`

### Testing

```bash
npm test
```

### Linting

The project uses ESLint with React configuration. Warnings are shown during development but don't prevent compilation.

## Performance

- Images are stored as base64 in the database
- Large images may impact performance
- Consider implementing image compression for production
- Lazy loading for large flashcard lists

## Accessibility

- Semantic HTML elements
- Keyboard navigation support
- ARIA labels on interactive elements
- High contrast text for readability

## Future Enhancements

- Edit flashcard functionality
- Flashcard categories/tags
- Study mode with flip cards
- Progress tracking
- Export/import flashcards
- Offline support with service workers

## License

This project is part of the AI Language Flashcards application.

