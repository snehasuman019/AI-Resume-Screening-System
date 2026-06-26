import os

from fastapi import APIRouter, UploadFile, File, HTTPException

import app.database.mongodb as mongodb

from app.database.mongodb import db
from app.services.pdf_parser import extract_text_from_pdf
from app.services.skill_extractor import extract_skills


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


def get_resume_path():

    if mongodb.latest_uploaded_resume is None:
        raise HTTPException(
            status_code=400,
            detail="Please upload a resume first."
        )

    return f"uploads/{mongodb.latest_uploaded_resume}"


@router.get("/")
def home():
    return {
        "message": "Resume Screening System API Running"
    }


@router.get("/health")
def health():
    return {
        "status": "healthy"
    }


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    # Allow only PDF files
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # Create uploads folder automatically
    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    contents = await file.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    # Save latest uploaded filename
    mongodb.latest_uploaded_resume = file.filename

    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "path": file_path
    }


@router.get("/parse")
def parse_resume():

    resume_path = get_resume_path()

    text = extract_text_from_pdf(resume_path)

    return {
        "resume": mongodb.latest_uploaded_resume,
        "text": text[:1000]
    }


@router.get("/skills")
def skills():

    resume_path = get_resume_path()

    text = extract_text_from_pdf(resume_path)

    skills = extract_skills(text)

    return {
        "resume": mongodb.latest_uploaded_resume,
        "skills": skills
    }


@router.get("/database-test")
def database_test():

    return {
        "database": db.name,
        "status": "Connected Successfully"
    }