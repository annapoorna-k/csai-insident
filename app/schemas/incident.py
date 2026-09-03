from typing import Literal

from pydantic import BaseModel


class TriageResult(BaseModel):
    incident_type: str
    severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    risk_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    recommended_action: str