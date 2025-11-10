import React, { useState, useEffect } from 'react';
import { getAllFlashcards, deleteFlashcard, playTTS } from './api';

const FlashcardList = ({ refreshTrigger }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlashcards();
  }, [refreshTrigger]);

  const fetchFlashcards = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllFlashcards();
      setFlashcards(data);
    } catch (err) {
      setError('Failed to load flashcards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this flashcard?')) {
      return;
    }

    try {
      await deleteFlashcard(cardId);
      setFlashcards(flashcards.filter(card => card.id !== cardId));
    } catch (err) {
      alert('Failed to delete flashcard');
      console.error(err);
    }
  };

  const handlePlayAudio = (text) => {
    playTTS(text);
  };

  if (loading) {
    return <div className="loading">Loading flashcards...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (flashcards.length === 0) {
    return (
      <div className="empty-state">
        <h3>No flashcards yet</h3>
        <p>Create your first flashcard using the form above!</p>
      </div>
    );
  }

  return (
    <div className="flashcard-list">
      {flashcards.map((card) => (
        <div key={card.id} className="flashcard">
          {card.image && (
            <img
              src={`data:image/jpeg;base64,${card.image}`}
              alt={card.original_text}
              className="flashcard-image"
            />
          )}
          {!card.image && (
            <div className="flashcard-image" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '3rem'
            }}>
              📚
            </div>
          )}

          <div className="flashcard-content">
            <div className="flashcard-text">
              <strong>Original:</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{card.original_text}</span>
                <button
                  className="icon-btn btn-secondary"
                  onClick={() => handlePlayAudio(card.original_text)}
                  style={{ flex: 'none', padding: '4px 8px' }}
                  title="Play pronunciation"
                >
                  🔊
                </button>
              </div>
            </div>

            <div className="flashcard-text">
              <strong>Translation:</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{card.translated_text}</span>
                <button
                  className="icon-btn btn-secondary"
                  onClick={() => handlePlayAudio(card.translated_text)}
                  style={{ flex: 'none', padding: '4px 8px' }}
                  title="Play pronunciation"
                >
                  🔊
                </button>
              </div>
            </div>

            {card.image_description && (
              <div className="flashcard-description">
                {card.image_description}
              </div>
            )}
          </div>

          <div className="flashcard-actions">
            <button
              className="icon-btn btn-danger"
              onClick={() => handleDelete(card.id)}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashcardList;

