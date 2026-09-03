from fastapi import APIRouter, HTTPException
from langfuse import propagate_attributes
from langfuse.langchain import CallbackHandler

from app.graph.state import InvestigationState
from app.graph.workflow import build_investigation_graph
from app.observability.langfuse import get_langfuse
from app.schemas.api import (
    InvestigationDetailResponse,
    InvestigationListItem,
    InvestigationRequest,
    InvestigationResponse,
)
from app.services.investigation_service import (
    retrieve_investigation,
    retrieve_investigations,
)


router = APIRouter(
    prefix="/investigations",
    tags=["Investigations"],
)


@router.post(
    "",
    response_model=InvestigationResponse,
)
def create_investigation(
    request: InvestigationRequest,
):
    """
    Run a cybersecurity investigation and persist the result.
    """

    state = InvestigationState(
        incident=request.incident,
        logs=request.logs,
        indicators=request.indicators,
    )

    graph = build_investigation_graph()

    langfuse = get_langfuse()
    langfuse_handler = CallbackHandler()

    with propagate_attributes(
        trace_name="Cybersecurity Investigation",
        tags=[
            "cybersecurity",
            "langgraph",
            "multi-agent",
        ],
        metadata={
            "framework": "langgraph",
            "application": "cybersecurity-ai-agent",
        },
    ):
        result = graph.invoke(
            state,
            config={
                "callbacks": [langfuse_handler],
                "run_name": "investigation-workflow",
            },
        )

    langfuse.flush()

    return InvestigationResponse(
        investigation_id=result["investigation_id"],
        status="COMPLETED",
        risk_assessment=result["risk_assessment"],
    )


@router.get(
    "",
    response_model=list[InvestigationListItem],
)
def list_investigations():
    """
    Retrieve all investigations.
    """

    return retrieve_investigations()


@router.get(
    "/{investigation_id}",
    response_model=InvestigationDetailResponse,
)
def get_investigation(
    investigation_id: str,
):
    """
    Retrieve a completed investigation by ID.
    """

    try:
        return retrieve_investigation(
            investigation_id
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc