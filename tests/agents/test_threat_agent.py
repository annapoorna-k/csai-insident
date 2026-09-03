from app.agents.threat_agent import analyze_threat_intelligence
from app.schemas.investigation import ThreatIntelligenceResult


def test_threat_intelligence_agent():

    indicators = """
    Source IP: 185.10.20.30
    Domain: suspicious-example.com
    """

    result = analyze_threat_intelligence(indicators)

    assert isinstance(
        result,
        ThreatIntelligenceResult,
    )

    assert result.summary
    assert isinstance(
        result.threat_detected,
        bool,
    )

    assert isinstance(
        result.indicators,
        list,
    )

    assert result.recommended_action