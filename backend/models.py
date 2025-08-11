from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
import uuid

# Custom ObjectId type for Pydantic
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# User Models
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    followers: int = 0
    following: int = 0
    upvotesReceived: int = 0
    joinDate: datetime
    isActive: bool = True

class UserUpdate(BaseModel):
    bio: Optional[str] = None
    avatar: Optional[str] = None

# Post Models
class PostCreate(BaseModel):
    title: str = Field(..., max_length=200)
    mediaType: str
    mediaUrl: str
    category: str
    tags: List[str] = []
    nsfw: bool = False

class PostResponse(BaseModel):
    id: str
    title: str
    mediaType: str
    mediaUrl: str
    category: str
    tags: List[str]
    author: UserResponse
    upvotes: int
    downvotes: int
    score: int
    commentCount: int
    views: int
    nsfw: bool
    createdAt: datetime

class PostsListResponse(BaseModel):
    posts: List[PostResponse]
    hasMore: bool
    total: int

# Vote Models
class VoteCreate(BaseModel):
    postId: str
    voteType: str

class VoteResponse(BaseModel):
    id: str
    userId: str
    postId: str
    voteType: str
    createdAt: datetime

# Comment Models
class CommentCreate(BaseModel):
    postId: str
    text: str = Field(..., max_length=1000)
    parentId: Optional[str] = None

class CommentResponse(BaseModel):
    id: str
    postId: str
    user: UserResponse
    text: str
    parentId: Optional[str]
    upvotes: int
    downvotes: int
    score: int
    replies: List['CommentResponse'] = []
    createdAt: datetime

# Update forward reference
CommentResponse.model_rebuild()

# Upload Models
class UploadResponse(BaseModel):
    url: str
    publicId: str
    mediaType: str

# Generic Response Models
class MessageResponse(BaseModel):
    message: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None