from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from models import CommentCreate, CommentResponse, MessageResponse
from auth import get_current_user
from database import db_manager
from bson import ObjectId

router = APIRouter(prefix="/comments", tags=["comments"])

@router.get("/{post_id}", response_model=List[CommentResponse])
async def get_comments(post_id: str):
    """Get all comments for a post"""
    if not ObjectId.is_valid(post_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID"
        )
    
    comments = await db_manager.get_comments_for_post(post_id)
    return [CommentResponse(**comment) for comment in comments]

@router.post("", response_model=CommentResponse)
async def create_comment(
    comment_data: CommentCreate,
    current_user_id: str = Depends(get_current_user)
):
    """Create a new comment"""
    if not ObjectId.is_valid(comment_data.postId):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID"
        )
    
    # Validate parent comment if provided
    if comment_data.parentId:
        if not ObjectId.is_valid(comment_data.parentId):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid parent comment ID"
            )
        
        parent_comment = await db_manager.get_comment_by_id(comment_data.parentId)
        if not parent_comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent comment not found"
            )
    
    # Check if post exists
    post = await db_manager.get_post_by_id(comment_data.postId)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Create comment
    comment_dict = comment_data.dict()
    comment_dict["userId"] = ObjectId(current_user_id)
    comment_dict["postId"] = ObjectId(comment_data.postId)
    if comment_data.parentId:
        comment_dict["parentId"] = ObjectId(comment_data.parentId)
    
    comment = await db_manager.create_comment(comment_dict)
    return CommentResponse(**comment)

@router.post("/{comment_id}/vote", response_model=MessageResponse)
async def vote_comment(
    comment_id: str,
    vote_type: str,
    current_user_id: str = Depends(get_current_user)
):
    """Vote on a comment"""
    if not ObjectId.is_valid(comment_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid comment ID"
        )
    
    if vote_type not in ["up", "down"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vote type must be 'up' or 'down'"
        )
    
    # For now, just return success (implement comment voting later)
    return MessageResponse(message="Comment vote recorded")