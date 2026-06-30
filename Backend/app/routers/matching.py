from datetime import datetime

from fastapi import APIRouter, HTTPException

import app.database.mongodb as mongodb

from app.database.mongodb import candidate_collection
from app.models.job_description import JobDescriptionRequest

from app.services.embedding_service import get_embedding
from app.services.matching_service import calculate_similarity
from app.services.pdf_parser import extract_text_from_pdf
from app.services.skill_extractor import extract_skills
from app.services.skill_gap_service import analyze_skill_gap
from app.services.gemini_service import analyze_resume

router = APIRouter(
    prefix="/matching",
    tags=["Matching"]
)


def get_resume_path():

    if mongodb.latest_uploaded_resume is None:
        raise HTTPException(
            status_code=400,
            detail="Please upload a resume first."
        )

    return f"uploads/{mongodb.latest_uploaded_resume}"


@router.get("/embedding")
def embedding():

    resume_path = get_resume_path()

    text = extract_text_from_pdf(resume_path)

    embedding = get_embedding(text)

    return {
        "resume": mongodb.latest_uploaded_resume,
        "vector_length": len(embedding),
        "first_10_values": embedding[:10].tolist()
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


@router.post("/match")
def match(request: JobDescriptionRequest):

    resume_path = get_resume_path()

    print("Latest uploaded:", mongodb.latest_uploaded_resume)
    print("Resume path:", resume_path)
    resume_text = extract_text_from_pdf(resume_path)

    resume_embedding = get_embedding(
        resume_text
    )

    jd_embedding = get_embedding(
        request.job_description
    )

    score = calculate_similarity(
        resume_embedding,
        jd_embedding
    )

    skills_found, missing_skills = analyze_skill_gap(
        resume_text,
        request.job_description
    )
    ai_feedback = analyze_resume(
    resume_text,
    request.job_description
)

    candidate = {
        "resume_filename": mongodb.latest_uploaded_resume,
        "resume_text": resume_text,
        "job_description": request.job_description,
        "match_score": round(score, 2),
        "skills_found": skills_found,
        "missing_skills": missing_skills,
        "ai_feedback": ai_feedback,
        "created_at": datetime.utcnow()
    }

    result = candidate_collection.insert_one(candidate)

    return {
        "candidate_id": str(result.inserted_id),
        "resume_filename": mongodb.latest_uploaded_resume,
        "match_score": round(score, 2),
        "skills_found": skills_found,
        "missing_skills": missing_skills,
        "ai_feedback": ai_feedback
    }


@router.get("/gemini-test")
def gemini_test():

    resume_text = """
Python Developer
Machine Learning
Docker
Git
SQL
FastAPI
"""

    job_description = """
Looking for a Machine Learning Engineer with
Python,
Docker,
SQL,
Git,
AWS
and Kubernetes.
"""

    feedback = analyze_resume(
        resume_text,
        job_description
    )

    return {
        "feedback": feedback
    }