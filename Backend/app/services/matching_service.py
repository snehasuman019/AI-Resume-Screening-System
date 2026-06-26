from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(resume_embedding, jd_embedding):

    similarity = cosine_similarity(
        [resume_embedding],
        [jd_embedding]
    )

    return float(similarity[0][0] * 100)