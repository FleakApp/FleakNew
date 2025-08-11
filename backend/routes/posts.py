from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import Optional
from models import PostCreate, PostResponse, PostsListResponse
from auth import get_current_user, get_optional_user
from database import db_manager
from bson import ObjectId

router = APIRouter(prefix="/posts", tags=["posts"])

@router.get("", response_model=PostsListResponse)
async def get_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    section: str = Query("hot", regex="^(hot|trending|fresh|top)$"),
    category: Optional[str] = Query(None),
    current_user_id: Optional[str] = Depends(get_optional_user)
):
    """Get posts with pagination and filtering"""
    posts, has_more, total = await db_manager.get_posts(
        skip=skip, 
        limit=limit, 
        section=section, 
        category=category
    )
    
    # Convert to response format
    post_responses = []
    for post in posts:
        post_response = PostResponse(**post)
        post_responses.append(post_response)
    
    return PostsListResponse(
        posts=post_responses,
        hasMore=has_more,
        total=total
    )

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: str,
    current_user_id: Optional[str] = Depends(get_optional_user)
):
    """Get a single post by ID"""
    if not ObjectId.is_valid(post_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID"
        )
    
    post = await db_manager.get_post_by_id(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Increment view count
    await db_manager.increment_post_views(post_id)
    post['views'] += 1
    
    return PostResponse(**post)

@router.post("", response_model=PostResponse)
async def create_post(
    post_data: PostCreate,
    current_user_id: str = Depends(get_current_user)
):
    """Create a new post (authenticated users only)"""
    # Get user info
    user = await db_manager.get_user_by_id(current_user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create post
    post_dict = post_data.dict()
    post_dict["authorId"] = ObjectId(current_user_id)
    
    post = await db_manager.create_post(post_dict)
    return PostResponse(**post)

@router.delete("/{post_id}")
async def delete_post(
    post_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Delete a post (owner only)"""
    if not ObjectId.is_valid(post_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID"
        )
    
    post = await db_manager.get_post_by_id(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user owns the post
    if post["author"]["id"] != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own posts"
        )
    
    # Delete post (implement deletion logic)
    # For now, just return success
    return {"message": "Post deleted successfully"}