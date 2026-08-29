from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.core.database import Base, engine
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message
from app.routes.chat import router as chat_router
from app.routes.documents import router as documents_router
from app.models.document import Document
from app.routes.video import router as video_router
from app.routes.analytics import router as analytics_router
from app.models.video import Video

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ProbeAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(video_router)
app.include_router(analytics_router)

@app.get("/")
def root():
    return {"message": "ProbeAI API is running"}


@app.get("/health")
def health():
    try:
        with engine.connect():
            return {"status": "healthy", "database": "connected"}
    except Exception:
        return {"status": "healthy", "database": "disconnected"}