from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from app.database.mongodb import candidate_collection

router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)


def serialize_candidate(candidate):

    if candidate:
        candidate["_id"] = str(candidate["_id"])

    return candidate


@router.get("/stats")
def candidate_stats():

    total = candidate_collection.count_documents({})

    highest = candidate_collection.find_one(
        sort=[("match_score", -1)]
    )

    lowest = candidate_collection.find_one(
        sort=[("match_score", 1)]
    )

    average = list(
        candidate_collection.aggregate([
            {
                "$group": {
                    "_id": None,
                    "avg": {
                        "$avg": "$match_score"
                    }
                }
            }
        ])
    )

    return {
        "total_candidates": total,
        "highest_match_score":
            highest["match_score"] if highest else 0,
        "lowest_match_score":
            lowest["match_score"] if lowest else 0,
        "average_match_score":
            round(average[0]["avg"], 2) if average else 0
    }


@router.get("/top/{limit}")
def top_candidates(limit: int):

    candidates = []

    cursor = (
        candidate_collection
        .find()
        .sort("match_score", -1)
        .limit(limit)
    )

    for candidate in cursor:

        candidate = serialize_candidate(candidate)

        candidate.pop("resume_text", None)

        candidates.append(candidate)

    return candidates


@router.get("/search/{skill}")
def search_by_skill(skill: str):

    candidates = []

    cursor = (
        candidate_collection.find(
            {
                "skills_found": {
                    "$regex": f"^{skill}$",
                    "$options": "i"
                }
            }
        )
        .limit(20)
    )

    for candidate in cursor:

        candidate = serialize_candidate(candidate)

        candidate.pop("resume_text", None)

        candidates.append(candidate)

    return candidates


@router.get("/")
def get_all_candidates():

    candidates = []

    cursor = candidate_collection.find().sort(
        "created_at",
        -1
    )

    for candidate in cursor:

        candidate = serialize_candidate(candidate)

        candidate.pop("resume_text", None)

        candidates.append(candidate)

    return candidates


@router.get("/{candidate_id}")
def get_candidate(candidate_id: str):

    try:

        candidate = candidate_collection.find_one(
            {
                "_id": ObjectId(candidate_id)
            }
        )

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid Candidate ID"
        )

    if candidate is None:

        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    candidate = serialize_candidate(candidate)

    return candidate


@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: str):

    try:

        result = candidate_collection.delete_one(
            {
                "_id": ObjectId(candidate_id)
            }
        )

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid Candidate ID"
        )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    return {
        "message": "Candidate deleted successfully",
        "candidate_id": candidate_id
    }