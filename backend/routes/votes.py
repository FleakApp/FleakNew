from fastapi import APIRouter, HTTPException, Depends, status
from models import VoteCreate, VoteResponse, MessageResponse
from auth import get_current_user
from database import db_manager
from bson import ObjectId

router = APIRouter(prefix="/votes", tags=["votes"])

@router.post("", response_model=MessageResponse)
async def create_or_update_vote(
    vote_data: VoteCreate,
    current_user_id: str = Depends(get_current_user)
):
    """Create or update a vote on a post"""
    if not ObjectId.is_valid(vote_data.postId):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID"
        )
    
    # Check if post exists
    post = await db_manager.get_post_by_id(vote_data.postId)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Create or update vote
    await db_manager.create_or_update_vote(
        current_user_id, 
        vote_data.postId, 
        vote_data.voteType
    )
    
    return MessageResponse(message="Vote recorded successfully")

@router.delete("/{post_id}", response_model=MessageResponse)
async def remove_vote(
    post_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Remove user's vote from a post"""
    if not ObjectId.is_valid(post_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID"
        )
    
    await db_manager.remove_vote(current_user_id, post_id)
    return MessageResponse(message="Vote removed successfully")

@router.get("/{post_id}")
async def get_user_vote(
    post_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Get user's vote on a specific post"""
    if not ObjectId.is_valid(post_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID"
        )
    
    vote = await db_manager.get_user_vote(current_user_id, post_id)
    return {"vote": vote["voteType"] if vote else None}