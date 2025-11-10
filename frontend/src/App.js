import React, { useState } from 'react';
import './App.css';
import FlashcardForm from './FlashcardForm';
import FlashcardList from './FlashcardList';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFlashcardCreated = () => {
    // Trigger refresh of flashcard list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>🎴 AI Language Flashcards</h1>
        <p>Learn Thai and English with AI-powered flashcards</p>
      </div>

      <div className="container">
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Create New Flashcard</h2>
        <FlashcardForm onFlashcardCreated={handleFlashcardCreated} />
      </div>

      <div className="container">
        <h2 style={{ marginBottom: '20px', color: '#333' }}>My Flashcards</h2>
        <FlashcardList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;
