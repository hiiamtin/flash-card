import os
from typing import Dict, List, Optional
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv
from models import Flashcard

# Load environment variables
load_dotenv()

# MongoDB configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "flashcard_db")


class DatabaseManager:
    """Manages database operations with MongoDB primary and in-memory fallback"""
    
    def __init__(self):
        self.use_mongodb = False
        self.client = None
        self.db = None
        self.collection = None
        self.in_memory_storage: Dict[str, dict] = {}
        
        # Try to connect to MongoDB
        self._connect_mongodb()
    
    def _connect_mongodb(self):
        """Attempt to connect to MongoDB"""
        try:
            self.client = MongoClient(
                MONGO_URI,
                serverSelectionTimeoutMS=5000,  # 5 second timeout
                connectTimeoutMS=5000
            )
            # Test the connection
            self.client.admin.command('ping')
            self.db = self.client[DATABASE_NAME]
            self.collection = self.db["flashcards"]
            self.use_mongodb = True
            print("✓ Successfully connected to MongoDB")
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            print(f"⚠ MongoDB connection failed: {e}")
            print("⚠ Falling back to in-memory storage")
            self.use_mongodb = False
    
    def create_flashcard(self, flashcard: Flashcard) -> Flashcard:
        """Create a new flashcard"""
        flashcard_dict = flashcard.model_dump()
        
        if self.use_mongodb:
            try:
                self.collection.insert_one(flashcard_dict)
                return flashcard
            except Exception as e:
                print(f"MongoDB insert failed: {e}, using in-memory storage")
                self.use_mongodb = False
        
        # Use in-memory storage
        self.in_memory_storage[flashcard.id] = flashcard_dict
        return flashcard
    
    def get_flashcard(self, flashcard_id: str) -> Optional[Flashcard]:
        """Get a flashcard by ID"""
        if self.use_mongodb:
            try:
                result = self.collection.find_one({"id": flashcard_id})
                if result:
                    result.pop("_id", None)  # Remove MongoDB's _id field
                    return Flashcard(**result)
                return None
            except Exception as e:
                print(f"MongoDB query failed: {e}, using in-memory storage")
                self.use_mongodb = False
        
        # Use in-memory storage
        flashcard_dict = self.in_memory_storage.get(flashcard_id)
        if flashcard_dict:
            return Flashcard(**flashcard_dict)
        return None
    
    def get_all_flashcards(self) -> List[Flashcard]:
        """Get all flashcards"""
        if self.use_mongodb:
            try:
                results = list(self.collection.find())
                flashcards = []
                for result in results:
                    result.pop("_id", None)  # Remove MongoDB's _id field
                    flashcards.append(Flashcard(**result))
                return flashcards
            except Exception as e:
                print(f"MongoDB query failed: {e}, using in-memory storage")
                self.use_mongodb = False
        
        # Use in-memory storage
        return [Flashcard(**data) for data in self.in_memory_storage.values()]
    
    def update_flashcard(self, flashcard_id: str, update_data: dict) -> Optional[Flashcard]:
        """Update a flashcard"""
        # Remove None values from update_data
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        if self.use_mongodb:
            try:
                result = self.collection.find_one_and_update(
                    {"id": flashcard_id},
                    {"$set": update_data},
                    return_document=True
                )
                if result:
                    result.pop("_id", None)
                    return Flashcard(**result)
                return None
            except Exception as e:
                print(f"MongoDB update failed: {e}, using in-memory storage")
                self.use_mongodb = False
        
        # Use in-memory storage
        if flashcard_id in self.in_memory_storage:
            self.in_memory_storage[flashcard_id].update(update_data)
            return Flashcard(**self.in_memory_storage[flashcard_id])
        return None
    
    def delete_flashcard(self, flashcard_id: str) -> bool:
        """Delete a flashcard"""
        if self.use_mongodb:
            try:
                result = self.collection.delete_one({"id": flashcard_id})
                return result.deleted_count > 0
            except Exception as e:
                print(f"MongoDB delete failed: {e}, using in-memory storage")
                self.use_mongodb = False
        
        # Use in-memory storage
        if flashcard_id in self.in_memory_storage:
            del self.in_memory_storage[flashcard_id]
            return True
        return False
    
    def close(self):
        """Close database connection"""
        if self.client:
            self.client.close()


# Global database instance
db_manager = DatabaseManager()

