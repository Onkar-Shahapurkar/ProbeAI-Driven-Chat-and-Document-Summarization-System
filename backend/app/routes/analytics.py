from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.document import Document
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.video import Video

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("")
def get_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.user_id == current_user.id
        )
        .count()
    )

    documents = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id
        )
        .count()
    )

    videos = (
        db.query(Video)
        .filter(
            Video.user_id == current_user.id
        )
        .count()
    )

    messages = (
        db.query(Message)
        .join(Conversation)
        .filter(
            Conversation.user_id == current_user.id
        )
        .count()
    )

    return {
        "conversations": conversations,
        "documents": documents,
        "messages": messages,
        "videos": videos,
    }