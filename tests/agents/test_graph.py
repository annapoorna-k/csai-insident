from app.graph.state import InvestigationState
from app.graph.workflow import build_investigation_graph
from app.schemas.incident import TriageResult
from app.schemas.investigation import (
    LogAnalysisResult,
    RiskAssessmentResult,
    ThreatIntelligenceResult,
)


def test_investigation_graph():

    graph = build_investigation_graph()

    initial_state = InvestigationState(
        incident="""
        Multiple failed login attempts were detected
        from the same external IP address within 5 minutes.
        """,
        logs="""
        10:01:02 - Failed login - user: admin - IP: 185.10.20.30
        10:01:05 - Failed login - user: admin - IP: 185.10.20.30
        10:01:08 - Failed login - user: admin - IP: 185.10.20.30
        10:02:15 - Successful login - user: admin - IP: 185.10.20.30
        """,
        indicators="""
        Source IP: 185.10.20.30
        Domain: suspicious-example.com
        """,
    )

    result = graph.invoke(initial_state)

    # Triage
    assert result["triage_result"] is not None
    assert isinstance(
        result["triage_result"],
        TriageResult,
    )

    # Log Analysis
    assert result["log_analysis"] is not None
    assert isinstance(
        result["log_analysis"],
        LogAnalysisResult,
    )

    # Threat Intelligence
    assert result["threat_intelligence"] is not None
    assert isinstance(
        result["threat_intelligence"],
        ThreatIntelligenceResult,
    )

    # Risk Assessment
    assert result["risk_assessment"] is not None
    assert isinstance(
        result["risk_assessment"],
        RiskAssessmentResult,
    )

    # Persistence
    assert result["investigation_id"] is not None
    assert isinstance(
        result["investigation_id"],
        str,
    )