from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, status
from models import UploadResponse, MessageResponse
from auth import get_current_user
import cloudinary
import cloudinary.uploader
import os
from typing import Optional

router = APIRouter(prefix="/upload", tags=["upload"])

# Configure Cloudinary (will be set via environment variables)
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME", ""),
    api_key=os.environ.get("CLOUDINARY_API_KEY", ""),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET", "")
)

@router.post("/media", response_model=UploadResponse)
async def upload_media(
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user)
):
    """Upload media file to Cloudinary"""
    
    # Validate file type
    allowed_types = {
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/mpeg', 'video/quicktime'
    }
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type not supported. Please upload images, GIFs, or videos."
        )
    
    # Validate file size (5MB for images, 10MB for videos)
    max_size = 10 * 1024 * 1024 if file.content_type.startswith('video/') else 5 * 1024 * 1024
    file_content = await file.read()
    
    if len(file_content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size is {max_size // (1024*1024)}MB"
        )
    
    try:
        # For now, return a mock response since Cloudinary needs API keys
        # In production, this would upload to Cloudinary
        mock_url = f"https://images.unsplash.com/photo-{hash(file.filename) % 1000000000}?w=600&h=400&fit=crop"
        
        # Determine media type
        media_type = "image"
        if file.content_type.startswith('video/'):
            media_type = "video"
        elif file.content_type == 'image/gif':
            media_type = "gif"
        
        return UploadResponse(
            url=mock_url,
            publicId=f"mock_{current_user_id}_{file.filename}",
            mediaType=media_type
        )
        
        # Real Cloudinary upload (uncomment when keys are provided):
        # result = cloudinary.uploader.upload(
        #     file_content,
        #     resource_type="auto",  # Automatically detect file type
        #     folder=f"9gag_clone/user_{current_user_id}",
        #     use_filename=True,
        #     unique_filename=True
        # )
        # 
        # media_type = "image"
        # if result.get("resource_type") == "video":
        #     media_type = "video"
        # elif result.get("format") == "gif":
        #     media_type = "gif"
        # 
        # return UploadResponse(
        #     url=result["secure_url"],
        #     publicId=result["public_id"],
        #     mediaType=media_type
        # )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )