from datetime import datetime
from uuid import uuid4

from app.db.postgres.repositories.investigation_repository import (
    create_investigation,
)
from app.graph.state import InvestigationState


def persist_investigation(
    state: InvestigationState,
) -> InvestigationState:
    """
    Persist the completed investigation to PostgreSQL
    and store the generated ID in the investigation state.
    """

    investigation_id = str(uuid4())

    # Get severity from the Triage Agent result.
    severity = (
        state.triage_result.severity
        if state.triage_result
        else None
    )

    investigation = {
        "id": investigation_id,
        "incident": state.incident,
        "logs": state.logs,
        "indicators": state.indicators,

        "severity": severity,

        "triage_result": (
            state.triage_result.model_dump()
            if state.triage_result
            else None
        ),

        "log_analysis": (
            state.log_analysis.model_dump()
            if state.log_analysis
            else None
        ),

        "threat_intelligence": (
            state.threat_intelligence.model_dump()
            if state.threat_intelligence
            else None
        ),

        "risk_assessment": (
            state.risk_assessment.model_dump()
            if state.risk_assessment
            else None
        ),

        "status": "COMPLETED",
    }

    create_investigation(
        investigation
    )

    state.investigation_id = (
        investigation_id
    )

    return state