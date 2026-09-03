from fastapi import APIRouter


router = APIRouter(
    tags=["Health"],
)


@router.get("/health")
def health_check():
    """
    Check whether the API is running.
    """

    return {
        "status": "ok",
        "service": "cybersecurity-ai-agent",
    }