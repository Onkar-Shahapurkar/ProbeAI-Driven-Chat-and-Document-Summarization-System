from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.dependencies.auth import get_current_user
from app.models.conversation import Conversation
from app.models.user import User
from app.models.message import Message
from app.schemas.message import MessageCreate
from app.services.ai_service import generate_response
from fastapi.responses import StreamingResponse
from app.services.ai_service import stream_response


router = APIRouter(
    prefix="/api/conversations",
    tags=["Conversations"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("")
def create_conversation(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = Conversation(
        user_id=current_user.id,
        title="New Chat",
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return {
        "id": str(conversation.id),
        "title": conversation.title,
        "created_at": conversation.created_at,
    }


@router.get("")
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )

    return [
        {
            "id": str(conversation.id),
            "title": conversation.title,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
        }
        for conversation in conversations
    ]


@router.post("/{conversation_id}/stream")
async def stream_chat(
    conversation_id: str,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=message_data.content,
    )

    db.add(user_message)
    db.commit()

    if conversation.title == "New Chat":
        title = message_data.content.strip()

        if len(title) > 50:
            title = title[:50] + "..."

        conversation.title = title
        db.commit()

    messages = (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation.id
        )
        .order_by(Message.created_at.asc())
        .all()
    )

    ai_messages = [
        {
            "role": "system",
            "content": (
                "You are ProbeAI, a helpful and intelligent "
                "AI assistant. Give clear, accurate and useful "
                "answers."
            ),
        }
    ]

    for message in messages:
        ai_messages.append(
            {
                "role": message.role,
                "content": message.content,
            }
        )

    async def generate():
        full_response = ""

        try:
            async for chunk in stream_response(ai_messages):
                full_response += chunk
                yield chunk

            assistant_message = Message(
                conversation_id=conversation.id,
                role="assistant",
                content=full_response,
            )

            db.add(assistant_message)

            conversation.updated_at = datetime.utcnow()

            db.commit()

        except Exception:
            db.rollback()
            raise

    return StreamingResponse(
        generate(),
        media_type="text/plain",
    )


@router.get("/{conversation_id}")
def get_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    return {
        "id": str(conversation.id),
        "title": conversation.title,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "messages": [
            {
                "id": str(message.id),
                "role": message.role,
                "content": message.content,
                "created_at": message.created_at,
            }
            for message in conversation.messages
        ],
    }


@router.patch("/{conversation_id}")
def update_conversation(
    conversation_id: str,
    title: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    conversation.title = title

    db.commit()
    db.refresh(conversation)

    return {
        "id": str(conversation.id),
        "title": conversation.title,
    }


@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    db.delete(conversation)
    db.commit()

    return {
        "message": "Conversation deleted successfully"
    }

@router.post("/{conversation_id}/messages")
def add_message(
    conversation_id: str,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    if message_data.role not in ["user", "assistant"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid message role",
        )

    message = Message(
        conversation_id=conversation.id,
        role=message_data.role,
        content=message_data.content,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return {
        "id": str(message.id),
        "role": message.role,
        "content": message.content,
        "created_at": message.created_at,
    }


@router.post("/test-ai")
async def test_ai():
    messages = [
        {
            "role": "system",
            "content": "You are ProbeAI, a helpful AI assistant.",
        },
        {
            "role": "user",
            "content": "Introduce yourself in one sentence.",
        },
    ]

    response = await generate_response(messages)

    return {
        "response": response,
    }

@router.post("/{conversation_id}/chat")
async def chat(
    conversation_id: str,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    # Save user message
    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=message_data.content,
    )

    db.add(user_message)
    db.commit()

    if conversation.title == "New conversation":
        conversation.title = user_message.content[:40]

    title = user_message.content.strip()

    conversation.title = (
        title[:40] + "..."
        if len(title) > 40
        else title
    )

    db.commit()

    # Get conversation history
    messages = (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation.id
        )
        .order_by(Message.created_at.asc())
        .all()
    )

    ai_messages = [
        {
            "role": "system",
            "content": (
                "You are ProbeAI, a helpful and intelligent "
                "AI assistant. Give clear, accurate and useful "
                "answers."
            ),
        }
    ]

    for message in messages:
        ai_messages.append(
            {
                "role": message.role,
                "content": message.content,
            }
        )

    # Generate AI response
    ai_response = await generate_response(ai_messages)

    # Save assistant message
    assistant_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=ai_response,
    )

    db.add(assistant_message)

    conversation.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(assistant_message)

    return {
        "message": {
            "id": str(assistant_message.id),
            "role": "assistant",
            "content": assistant_message.content,
            "created_at": assistant_message.created_at,
        }
    }