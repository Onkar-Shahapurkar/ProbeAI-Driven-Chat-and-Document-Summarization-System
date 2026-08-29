import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.video import Video
from app.services.video_service import transcribe_video
from app.services.video_summary_service import summarize_transcript


router = APIRouter(
    prefix="/api/video",
    tags=["Video"],
)


ALLOWED_VIDEO_TYPES = {
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
}


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/summarize")
async def summarize_video(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported video format",
        )

    os.makedirs("uploads/videos", exist_ok=True)

    filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        "uploads/videos",
        filename,
    )

    contents = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    try:
        transcript = transcribe_video(file_path)

        summary = await summarize_transcript(
            transcript
        )

        video = Video(
            user_id=current_user.id,
            original_filename=file.filename,
            file_type=extension,
            file_size=len(contents),
            transcript=transcript,
            summary=summary,
        )

        db.add(video)
        db.commit()
        db.refresh(video)

    except Exception as error:
        db.rollback()

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=500,
            detail=f"Video processing failed: {str(error)}",
        )

    return {
        "video_id": str(video.id),
        "filename": video.original_filename,
        "transcript": transcript,
        "summary": summary,
    }