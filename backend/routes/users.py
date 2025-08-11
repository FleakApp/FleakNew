from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from models import UserResponse, PostsListResponse
from auth import get_optional_user
from database import db_manager

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{username}", response_model=UserResponse)
async def get_user_profile(username: str):
    """Get user profile by username"""
    user = await db_manager.get_user_by_username(username)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return UserResponse(**user)

@router.get("/{username}/posts", response_model=PostsListResponse)
async def get_user_posts(
    username: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    current_user_id: Optional[str] = Depends(get_optional_user)
):
    """Get posts by a specific user"""
    user = await db_manager.get_user_by_username(username)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Get user's posts using the same posts method but filtered by author
    posts, has_more, total = await db_manager.get_posts(
        skip=skip,
        limit=limit,
        section="fresh",  # Default to chronological order
        category=None
    )
    
    # Filter posts by this user
    user_posts = [post for post in posts if post['author']['username'] == username]
    
    return PostsListResponse(
        posts=user_posts,
        hasMore=len(user_posts) == limit,  # Simple check
        total=len(user_posts)
    )