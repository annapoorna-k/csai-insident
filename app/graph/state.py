from typing import Optional

from pydantic import BaseModel

from app.schemas.incident import TriageResult
from app.schemas.investigation import (
    LogAnalysisResult,
    RiskAssessmentResult,
    ThreatIntelligenceResult,
)


class InvestigationState(BaseModel):
    """
    Shared state for the cybersecurity investigation workflow.
    """

    investigation_id: Optional[str] = None

    incident: str

    logs: str = ""

    indicators: str = ""

    triage_result: Optional[TriageResult] = None

    log_analysis: Optional[LogAnalysisResult] = None

    threat_intelligence: Optional[ThreatIntelligenceResult] = None

    risk_assessment: Optional[RiskAssessmentResult] = None