import os
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
import io
import base64

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)


class GeminiService:
    """Service for interacting with Google Gemini API"""
    
    def __init__(self):
        # Use gemini-2.5-flash for text and gemini-pro-vision for images
        self.text_model = genai.GenerativeModel('gemini-2.5-flash')
        self.vision_model = genai.GenerativeModel('gemini-2.5-flash')
    
    def generate_translation(self, text: str, source_lang: str = "en", target_lang: str = "th") -> dict:
        """
        Generate translation and description for text input
        
        Args:
            text: The text to translate
            source_lang: Source language code (default: "en")
            target_lang: Target language code (default: "th")
        
        Returns:
            dict with original_text, translated_text, and image_description
        """
        # Map language codes to full names
        lang_map = {
            "en": "English",
            "th": "Thai"
        }
        
        source_language = lang_map.get(source_lang, source_lang)
        target_language = lang_map.get(target_lang, target_lang)
        
        prompt = f"""
You are a language learning assistant. Given a word or phrase in {source_language}, provide:
1. The translation in {target_language}
2. A brief description of the word/phrase that would help create a visual representation

Input: "{text}"

Please respond in the following format:
Translation: [translation here]
Description: [brief visual description here]
"""
        
        try:
            response = self.text_model.generate_content(prompt)
            result_text = response.text
            
            # Parse the response
            translation = ""
            description = ""
            
            for line in result_text.split('\n'):
                if line.startswith('Translation:'):
                    translation = line.replace('Translation:', '').strip()
                elif line.startswith('Description:'):
                    description = line.replace('Description:', '').strip()
            
            return {
                "original_text": text,
                "translated_text": translation if translation else text,
                "image_description": description if description else f"Visual representation of {text}"
            }
        except Exception as e:
            print(f"Error generating translation: {e}")
            # Fallback response
            return {
                "original_text": text,
                "translated_text": text,
                "image_description": f"Visual representation of {text}"
            }
    
    def analyze_image(self, image_data: bytes, target_lang: str = "th") -> dict:
        """
        Analyze an image and generate vocabulary with translation
        
        Args:
            image_data: Image data in bytes
            target_lang: Target language for translation (default: "th")
        
        Returns:
            dict with original_text, translated_text, and image_description
        """
        # Map language codes to full names
        lang_map = {
            "en": "English",
            "th": "Thai"
        }
        
        target_language = lang_map.get(target_lang, target_lang)
        
        try:
            # Open image from bytes
            image = Image.open(io.BytesIO(image_data))
            
            prompt = f"""
Analyze this image and provide:
1. A single word or short phrase in English that best describes the main subject or object in the image
2. The translation of that word/phrase in {target_language}
3. A brief description of what you see in the image

Please respond in the following format:
Word: [English word/phrase]
Translation: [translation in {target_language}]
Description: [brief description of the image]
"""
            
            response = self.vision_model.generate_content([prompt, image])
            result_text = response.text
            
            # Parse the response
            word = ""
            translation = ""
            description = ""
            
            for line in result_text.split('\n'):
                if line.startswith('Word:'):
                    word = line.replace('Word:', '').strip()
                elif line.startswith('Translation:'):
                    translation = line.replace('Translation:', '').strip()
                elif line.startswith('Description:'):
                    description = line.replace('Description:', '').strip()
            
            return {
                "original_text": word if word else "Unknown",
                "translated_text": translation if translation else "Unknown",
                "image_description": description if description else "Image content"
            }
        except Exception as e:
            print(f"Error analyzing image: {e}")
            # Fallback response
            return {
                "original_text": "Unknown",
                "translated_text": "ไม่ทราบ",
                "image_description": "Unable to analyze image"
            }
    
    def analyze_image_base64(self, image_base64: str, target_lang: str = "th") -> dict:
        """
        Analyze a base64 encoded image
        
        Args:
            image_base64: Base64 encoded image string
            target_lang: Target language for translation
        
        Returns:
            dict with original_text, translated_text, and image_description
        """
        try:
            # Decode base64 to bytes
            image_data = base64.b64decode(image_base64)
            return self.analyze_image(image_data, target_lang)
        except Exception as e:
            print(f"Error decoding base64 image: {e}")
            return {
                "original_text": "Unknown",
                "translated_text": "ไม่ทราบ",
                "image_description": "Unable to decode image"
            }


# Global Gemini service instance
gemini_service = GeminiService()

