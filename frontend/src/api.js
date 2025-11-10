import axios from 'axios';

const API_BASE_URL = '';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generate flashcard from text input
 * @param {string} text - Text to translate
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {Promise} Generated flashcard data
 */
export const generateFlashcardFromText = async (text, sourceLanguage = 'en', targetLanguage = 'th') => {
  try {
    const response = await api.post('/generate-flashcard/', {
      text,
      source_language: sourceLanguage,
      target_language: targetLanguage,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating flashcard from text:', error);
    throw error;
  }
};

/**
 * Generate and create flashcard from image
 * @param {File} imageFile - Image file to analyze
 * @param {string} targetLanguage - Target language code
 * @returns {Promise} Created flashcard object
 */
export const generateFlashcardFromImage = async (imageFile, targetLanguage = 'th') => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await axios.post(
      `/generate-flashcard-from-image/?target_language=${targetLanguage}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating flashcard from image:', error);
    throw error;
  }
};

/**
 * Get all flashcards
 * @returns {Promise} Array of flashcards
 */
export const getAllFlashcards = async () => {
  try {
    const response = await api.get('/flashcards/');
    return response.data;
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
};

/**
 * Create a new flashcard
 * @param {Object} flashcardData - Flashcard data
 * @returns {Promise} Created flashcard
 */
export const createFlashcard = async (flashcardData) => {
  try {
    const response = await api.post('/flashcards/', flashcardData);
    return response.data;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
};

/**
 * Get a specific flashcard by ID
 * @param {string} cardId - Flashcard ID
 * @returns {Promise} Flashcard object
 */
export const getFlashcard = async (cardId) => {
  try {
    const response = await api.get(`/flashcards/${cardId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flashcard:', error);
    throw error;
  }
};

/**
 * Update a flashcard
 * @param {string} cardId - Flashcard ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} Updated flashcard
 */
export const updateFlashcard = async (cardId, updateData) => {
  try {
    const response = await api.put(`/flashcards/${cardId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating flashcard:', error);
    throw error;
  }
};

/**
 * Delete a flashcard
 * @param {string} cardId - Flashcard ID
 * @returns {Promise} Success message
 */
export const deleteFlashcard = async (cardId) => {
  try {
    const response = await api.delete(`/flashcards/${cardId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    throw error;
  }
};

/**
 * Get TTS audio URL for text
 * @param {string} text - Text to convert to speech
 * @returns {string} URL for TTS audio
 */
export const getTTSUrl = (text) => {
  return `/tts/?text=${encodeURIComponent(text)}`;
};

/**
 * Play TTS audio for text
 * @param {string} text - Text to convert to speech
 */
export const playTTS = (text) => {
  const audio = new Audio(getTTSUrl(text));
  audio.play().catch(error => {
    console.error('Error playing audio:', error);
  });
};

const apiService = {
  generateFlashcardFromText,
  generateFlashcardFromImage,
  getAllFlashcards,
  createFlashcard,
  getFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getTTSUrl,
  playTTS,
};

export default apiService;

