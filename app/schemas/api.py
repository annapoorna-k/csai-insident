from typing import Any
from pydantic import BaseModel, Field

from app.schemas.incident import TriageResult
from app.schemas.investigation import (
    LogAnalysisResult,
    RiskAssessmentResult,
    ThreatIntelligenceResult,
)


class InvestigationRequest(BaseModel):
    """
    Request body for creating a cybersecurity investigation.
    """

    incident: str = Field(
        ...,
        min_length=1,
        description="Description of the security incident.",
    )

    logs: str = Field(
        default="",
        description="Security logs related to the incident.",
    )

    indicators: str = Field(
        default="",
        description="Indicators of compromise such as IPs or domains.",
    )


class InvestigationResponse(BaseModel):
    """
    Response returned after starting an investigation.
    """

    investigation_id: str
    status: str
    risk_assessment: RiskAssessmentResult


class InvestigationListItem(BaseModel):
    """
    Investigation returned in the investigation list.
    """

    id: str
    investigation_id: str | None = None
    incident: str | None = None
    logs: str = ""
    indicators: str = ""

    status: str
    risk_level: str | None = None
    risk_score: int | None = None

    risk_assessment: dict[str, Any] | None = None

    created_at: str | None = None


class InvestigationDetailResponse(BaseModel):
    """
    Complete investigation returned by the API.
    """

    id: str
    incident: str
    logs: str
    indicators: str

    triage_result: TriageResult | None = None

    log_analysis: LogAnalysisResult | None = None

    threat_intelligence: ThreatIntelligenceResult | None = None

    risk_assessment: RiskAssessmentResult | None = None

    status: str