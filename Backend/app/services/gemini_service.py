import os

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

Analyze the following resume against the job description.

Resume:
{resume_text}

Job Description:
{job_description}

Return your response in the following format:

Summary:
<2-3 sentences>

Strengths:
- point 1
- point 2
- point 3

Weaknesses:
- point 1
- point 2

Missing Skills:
- skill 1
- skill 2

Resume Improvements:
- suggestion 1
- suggestion 2

Interview Questions:
- question 1
- question 2
- question 3
"""

    response = model.generate_content(prompt)

    return response.text