import re


def extract_skills(text):

    predefined_skills = [
        "Python",
        "Java",
        "C++",
        "C",
        "SQL",
        "HTML",
        "CSS",
        "JavaScript",
        "Docker",
        "Jenkins",
        "Git",
        "GitHub",
        "AWS",
        "Azure",
        "MongoDB",
        "MySQL",
        "Machine Learning",
        "Deep Learning",
        "FastAPI",
        "Flask",
        "React",
        "Kubernetes",
        "Pandas",
        "NumPy",
        "Scikit-Learn"
    ]

    found_skills = []

    for skill in predefined_skills:

        # Create a regex pattern that matches the complete skill only
        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text, re.IGNORECASE):
            found_skills.append(skill)

    return found_skills