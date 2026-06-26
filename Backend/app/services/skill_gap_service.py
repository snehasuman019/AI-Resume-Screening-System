from app.services.skill_extractor import extract_skills

def analyze_skill_gap(
    resume_text,
    job_description
):

    resume_skills = set(
        extract_skills(resume_text)
    )

    jd_skills = set(
        extract_skills(job_description)
    )

    skills_found = list(
        resume_skills.intersection(
            jd_skills
        )
    )

    missing_skills = list(
        jd_skills - resume_skills
    )

    return (
        skills_found,
        missing_skills
    )