#handles api requests

from fastapi import FastAPI, UploadFile, File
from app.services.pdf_parser import extract_text_from_pdf
from app.services.skill_extractor import extract_skills

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "Resume Screening System API Running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...)
):
    contents = await file.read()

    with open(
        f"uploads/{file.filename}",
        "wb"
    ) as f:
        f.write(contents)

    return {
        "message": "Resume saved successfully",
        "filename": file.filename
    }

@app.get("/parse-test")
def parse_test():

    text = extract_text_from_pdf(
        "uploads/CV Sneha.pdf"
    )

    return {
        "text": text[:1000]
    }

import os

@app.get("/where")
def where():
    return {
        "cwd": os.getcwd()
    }

import os

@app.get("/files")
def files():
    return {
        "files": os.listdir("uploads")
    }

@app.get("/skills")
def skills():

    text = extract_text_from_pdf(
        "uploads/CV Sneha.pdf"
    )

    skills = extract_skills(text)

    return {
        "skills": skills
    }