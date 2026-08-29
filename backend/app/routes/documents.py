
import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.models.document import Document

from app.core.database import SessionLocal
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.document_service import extract_text
from app.services.retrieval_service import (
    retrieve_from_document,
)
from pydantic import BaseModel
from app.services.document_qa import answer_from_document
from app.services.summarization_service import summarize_document

class DocumentQuestion(BaseModel):
    question: str

router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
}


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type",
        )

    os.makedirs("uploads", exist_ok=True)

    filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join("uploads", filename)

    contents = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    try:
        text = extract_text(file_path)
    except Exception:
        os.remove(file_path)

        raise HTTPException(
            status_code=400,
            detail="Unable to extract document text",
        )

    document = Document(
        user_id=current_user.id,
        original_filename=file.filename,
        stored_filename=filename,
        file_type=extension,
        file_size=len(contents),
        extracted_text=text,
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return {
        "message": "Document uploaded successfully",
        "document_id": str(document.id),
        "filename": document.original_filename,
        "file_type": document.file_type,
        "file_size": document.file_size,
        "text_length": len(document.extracted_text),
        "text_preview": document.extracted_text[:500],
    }

@router.get("")
def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
        .all()
    )

    return [
        {
            "id": str(document.id),
            "original_filename": document.original_filename,
            "file_type": document.file_type,
            "file_size": document.file_size,
            "created_at": document.created_at,
        }
        for document in documents
    ]

@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    # Delete the physical file from uploads/
    file_path = os.path.join(
        "uploads",
        document.stored_filename,
    )

    if os.path.exists(file_path):
        os.remove(file_path)

    # Delete document from database
    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully",
        "document_id": str(document_id),
    }

@router.post("/{document_id}/search")
def search_document(
    document_id: str,
    query: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    results = retrieve_from_document(
        query=query,
        document_text=document.extracted_text,
        top_k=3,
    )

    return {
        "query": query,
        "results": [
            {
                "text": chunk,
                "score": score,
            }
            for chunk, score in results
        ],
    }

@router.post("/{document_id}/ask")
async def ask_document(
    document_id: str,
    question_data: DocumentQuestion,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    answer, sources = await answer_from_document(
        question=question_data.question,
        document_text=document.extracted_text,
    )

    return {
        "answer": answer,
        "sources": sources,
    }

@router.post("/{document_id}/summarize")
async def summarize(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    summary = await summarize_document(
        document.extracted_text
    )

    return {
        "document_id": str(document.id),
        "filename": document.original_filename,
        "summary": summary,
    }
