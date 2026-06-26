from fastapi import APIRouter, UploadFile, File
from app.services.pdf_parser import extract_text_from_pdf
from app.services.skill_extractor import extract_skills

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


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

    contents = await file.read()

    with open(f"uploads/{file.filename}", "wb") as f:
        f.write(contents)

    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "path": f"uploads/{file.filename}"
    }


@router.get("/parse")
def parse_resume():

    text = extract_text_from_pdf(
        "uploads/CV Sneha.pdf"
    )

    return {
        "text": text[:1000]
    }


@router.get("/skills")
def skills():

    text = extract_text_from_pdf(
        "uploads/CV Sneha.pdf"
    )

    skills = extract_skills(text)

    return {
        "skills": skills
    }

from app.database.mongodb import db

@router.get("/database-test")
def database_test():
    return {
        "database": db.name,
        "status": "Connected Successfully"
    }