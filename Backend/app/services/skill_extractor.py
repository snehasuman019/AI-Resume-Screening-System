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

    text_lower = text.lower()

    for skill in predefined_skills:

        if skill.lower() in text_lower:
            found_skills.append(skill)

    return found_skills