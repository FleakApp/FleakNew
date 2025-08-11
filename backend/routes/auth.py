from fastapi import APIRouter, HTTPException, Depends, status
from models import UserCreate, UserLogin, UserResponse, MessageResponse
from auth import hash_password, verify_password, create_access_token, get_current_user
from database import db_manager
import re

router = APIRouter(prefix="/auth", tags=["authentication"])

def validate_username(username: str) -> bool:
    """Validate username format"""
    pattern = r'^[a-zA-Z0-9_]{3,20}$'
    return bool(re.match(pattern, username))

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Validate username format
    if not validate_username(user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username must be 3-20 characters long and contain only letters, numbers, and underscores"
        )
    
    # Check if user already exists
    existing_user_email = await db_manager.get_user_by_email(user_data.email)
    if existing_user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    existing_user_username = await db_manager.get_user_by_username(user_data.username)
    if existing_user_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    user_dict = {
        "username": user_data.username,
        "email": user_data.email,
        "passwordHash": hashed_password,
        "avatar": f"https://images.unsplash.com/photo-{1500000000 + hash(user_data.username) % 100000000}?w=100&h=100&fit=crop&crop=face"
    }
    
    user = await db_manager.create_user(user_dict)
    return UserResponse(**user)

@router.post("/login")
async def login(login_data: UserLogin):
    """Login user and return access token"""
    user = await db_manager.get_user_by_email(login_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not verify_password(login_data.password, user["passwordHash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user["isActive"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user["id"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user)
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user_id: str = Depends(get_current_user)):
    """Get current user information"""
    user = await db_manager.get_user_by_id(current_user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse(**user)

@router.post("/logout", response_model=MessageResponse)
async def logout():
    """Logout user (client should remove token)"""
    return MessageResponse(message="Successfully logged out")