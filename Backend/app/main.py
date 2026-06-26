# #handles api requests

# from fastapi import FastAPI, UploadFile, File
# from app.services.pdf_parser import extract_text_from_pdf
# from app.services.skill_extractor import extract_skills
# from app.services.embedding_service import get_embedding
# from app.services.matching_service import calculate_similarity
# from app.models.job_description import JobDescriptionRequest
# from app.services.skill_gap_service import analyze_skill_gap

# app = FastAPI()

# @app.get("/")
# def home():
#     return {
#         "message": "Resume Screening System API Running"
#     }

# @app.get("/health")
# def health():
#     return {
#         "status": "healthy"
#     }

# @app.post("/upload-resume")
# async def upload_resume(
#     file: UploadFile = File(...)
# ):
#     contents = await file.read()

#     with open(
#         f"uploads/{file.filename}",
#         "wb"
#     ) as f:
#         f.write(contents)

#     return {
#         "message": "Resume saved successfully",
#         "filename": file.filename
#     }

# @app.get("/parse-test")
# def parse_test():

#     text = extract_text_from_pdf(
#         "uploads/CV Sneha.pdf"
#     )

#     return {
#         "text": text[:1000]
#     }

# import os

# @app.get("/where")
# def where():
#     return {
#         "cwd": os.getcwd()
#     }

# import os

# @app.get("/files")
# def files():
#     return {
#         "files": os.listdir("uploads")
#     }

# @app.get("/skills")
# def skills():

#     text = extract_text_from_pdf(
#         "uploads/CV Sneha.pdf"
#     )

#     skills = extract_skills(text)

#     return {
#         "skills": skills
#     }

# @app.get("/embedding-test")
# def embedding_test():

#     text = extract_text_from_pdf(
#         "uploads/CV Sneha.pdf"
#     )

#     embedding = get_embedding(text)

#     return {
#         "vector_length": len(embedding),
#         "first_10_values": embedding[:10].tolist()
#     }

# @app.get("/match-test")
# def match_test():

#     resume_text = extract_text_from_pdf(
#         "uploads/CV Sneha.pdf"
#     )

#     job_description = """
#     Looking for a Machine Learning Engineer.

#     Required:
#     Python
#     Machine Learning
#     Docker
#     Git
#     SQL
#     """

#     resume_embedding = get_embedding(
#         resume_text
#     )

#     jd_embedding = get_embedding(
#         job_description
#     )

#     score = calculate_similarity(
#         resume_embedding,
#         jd_embedding
#     )

#     return {
#         "match_score": round(score, 2)
#     }
# @app.post("/match-resume")
# def match_resume(request: JobDescriptionRequest):

#     resume_text = extract_text_from_pdf(
#         "uploads/CV Sneha.pdf"
#     )

#     resume_embedding = get_embedding(
#         resume_text
#     )

#     jd_embedding = get_embedding(
#         request.job_description
#     )

#     score = calculate_similarity(
#         resume_embedding,
#         jd_embedding
#     )
#     skills_found, missing_skills = analyze_skill_gap(
#         resume_text,
#         request.job_description
#     )
#     return {
#         "match_score": round(score, 2),
#         "skills_found": skills_found,
#         "missing_skills": missing_skills
#     }



from fastapi import FastAPI

from app.routers.resume import router as resume_router
from app.routers.matching import router as matching_router
from app.routers.candidate import router as candidate_router

app = FastAPI(
    title="AI Resume Screening System",
    version="1.0.0",
    description="AI-powered Resume Screening and Candidate Matching System"
)

app.include_router(resume_router)
app.include_router(matching_router)
app.include_router(candidate_router)