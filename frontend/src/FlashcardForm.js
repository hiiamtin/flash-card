import React, { useState } from 'react';
import CameraComponent from './CameraComponent';
import { generateFlashcardFromText, generateFlashcardFromImage, createFlashcard } from './api';

const FlashcardForm = ({ onFlashcardCreated }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Text input state
  const [textInput, setTextInput] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('th');

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) {
      setError('Please enter some text');
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      // Generate flashcard content
      const generatedData = await generateFlashcardFromText(textInput, sourceLanguage, targetLanguage);
      
      // Create flashcard
      const flashcard = await createFlashcard({
        original_text: generatedData.original_text,
        translated_text: generatedData.translated_text,
        image_description: generatedData.image_description,
        image: '',
      });

      setSuccess('Flashcard created successfully!');
      setTextInput('');
      
      if (onFlashcardCreated) {
        onFlashcardCreated(flashcard);
      }
    } catch (err) {
      setError('Failed to create flashcard. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      const flashcard = await generateFlashcardFromImage(selectedFile, targetLanguage);
      setSuccess('Flashcard created successfully from image!');
      setSelectedFile(null);
      setFilePreview(null);
      
      if (onFlashcardCreated) {
        onFlashcardCreated(flashcard);
      }
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraCapture = async (imageFile) => {
    clearMessages();
    setLoading(true);

    try {
      const flashcard = await generateFlashcardFromImage(imageFile, targetLanguage);
      setSuccess('Flashcard created successfully from camera!');
      
      if (onFlashcardCreated) {
        onFlashcardCreated(flashcard);
      }
    } catch (err) {
      setError('Failed to process camera image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="flashcard-form">
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          ✏️ Text Input
        </button>
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📁 Upload Image
        </button>
        <button
          className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          📷 Camera
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'text' && (
          <form onSubmit={handleTextSubmit}>
            <div className="input-group">
              <label htmlFor="text-input">Enter a word or phrase:</label>
              <input
                id="text-input"
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="e.g., Hello, Apple, Good morning"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="source-lang">Source Language:</label>
              <select
                id="source-lang"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                disabled={loading}
              >
                <option value="en">English</option>
                <option value="th">Thai</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="target-lang">Target Language:</label>
              <select
                id="target-lang"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={loading}
              >
                <option value="th">Thai</option>
                <option value="en">English</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Flashcard'}
            </button>
          </form>
        )}

        {activeTab === 'upload' && (
          <form onSubmit={handleFileSubmit}>
            <div className="input-group">
              <label htmlFor="target-lang-upload">Target Language:</label>
              <select
                id="target-lang-upload"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={loading}
              >
                <option value="th">Thai</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="input-group">
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <label htmlFor="file-input" className="file-input-label">
                  {selectedFile ? selectedFile.name : '📁 Choose an image file'}
                </label>
              </div>
            </div>

            {filePreview && (
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <img
                  src={filePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading || !selectedFile}>
              {loading ? 'Processing...' : 'Create Flashcard from Image'}
            </button>
          </form>
        )}

        {activeTab === 'camera' && (
          <div>
            <div className="input-group">
              <label htmlFor="target-lang-camera">Target Language:</label>
              <select
                id="target-lang-camera"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={loading}
              >
                <option value="th">Thai</option>
                <option value="en">English</option>
              </select>
            </div>

            {loading ? (
              <div className="loading">Processing image...</div>
            ) : (
              <CameraComponent onCapture={handleCameraCapture} onError={handleCameraError} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardForm;

