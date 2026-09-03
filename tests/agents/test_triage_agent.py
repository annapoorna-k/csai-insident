from app.agents.triage_agent import triage_incident
from app.schemas.incident import TriageResult


def test_triage_agent():

    incident = """
    Multiple failed login attempts were detected
    from the same external IP address within 5 minutes.
    """

    result = triage_incident(incident)

    assert isinstance(result, TriageResult)

    assert result.incident_type
    assert result.severity in [
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    ]

    assert result.risk_level in [
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    ]

    assert result.recommended_action