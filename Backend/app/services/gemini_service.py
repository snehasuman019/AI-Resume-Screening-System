import os
import json
import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_resume(resume_text, job_description):

    prompt = f"""
You are an expert technical recruiter.

Analyze the following resume against the given job description.

Resume:
{resume_text}

Job Description:
{job_description}

Return ONLY valid JSON.

Use exactly this format:

{{
    "summary": "",
    "strengths": [],
    "weaknesses": [],
    "missing_skills": [],
    "resume_improvements": [],
    "interview_questions": []
}}

Do not write markdown.

Do not write ```json.

Return JSON only.
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    elif text.startswith("```"):
        text = text.replace("```", "").strip()

    try:
        return json.loads(text)

    except Exception:

        return {
            "summary": text,
            "strengths": [],
            "weaknesses": [],
            "missing_skills": [],
            "resume_improvements": [],
            "interview_questions": []
        }