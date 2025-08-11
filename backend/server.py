from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Import route modules
from routes import auth, posts, votes, comments, users, upload

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="9GAG Clone API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Hello world endpoint
@api_router.get("/")
async def root():
    return {"message": "9GAG Clone API is running!"}

# Include all route modules
api_router.include_router(auth.router)
api_router.include_router(posts.router)
api_router.include_router(votes.router)
api_router.include_router(comments.router)
api_router.include_router(users.router)
api_router.include_router(upload.router)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
