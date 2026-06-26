from fastapi import APIRouter
from datetime import datetime
from app.models.job_description import JobDescriptionRequest
from app.database.mongodb import candidate_collection
from app.services.pdf_parser import extract_text_from_pdf
from app.services.embedding_service import get_embedding
from app.services.matching_service import calculate_similarity
from app.services.skill_gap_service import analyze_skill_gap

router = APIRouter(
    prefix="/matching",
    tags=["Matching"]
)


@router.get("/embedding")
def embedding():

    text = extract_text_from_pdf(
        "uploads/CV Sneha.pdf"
    )

    embedding = get_embedding(text)

    return {
        "vector_length": len(embedding),
        "first_10_values": embedding[:10].tolist()
    }


@router.post("/match")
def match(request: JobDescriptionRequest):

    resume_text = extract_text_from_pdf(
        "uploads/CV Sneha.pdf"
    )

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
    
    candidate = {
        "resume_filename": "CV Sneha.pdf",
        "resume_text": resume_text,
        "job_description": request.job_description,
        "match_score": round(score, 2),
        "skills_found": skills_found,
        "missing_skills": missing_skills,
        "created_at": datetime.utcnow()
    }
    result = candidate_collection.insert_one(candidate)
    return {
    "candidate_id": str(result.inserted_id),
    "match_score": round(score, 2),
    "skills_found": skills_found,
    "missing_skills": missing_skills
}