from pydantic import BaseModel


class LogAnalysisResult(BaseModel):
    summary: str
    suspicious: bool
    findings: list[str]
    recommended_action: str


class ThreatIndicator(BaseModel):
    type: str
    value: str
    reason: str


class ThreatIntelligenceResult(BaseModel):
    summary: str
    threat_detected: bool
    indicators: list[ThreatIndicator]
    recommended_action: str


class RiskAssessmentResult(BaseModel):
    risk_level: str
    risk_score: int
    summary: str
    reasoning: list[str]
    recommended_actions: list[str]