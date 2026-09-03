from app.agents.log_agent import analyze_logs
from app.schemas.investigation import LogAnalysisResult


def test_log_agent():

    logs = """
    10:01:02 - Failed login - user: admin - IP: 185.10.20.30
    10:01:05 - Failed login - user: admin - IP: 185.10.20.30
    10:01:08 - Failed login - user: admin - IP: 185.10.20.30
    10:02:15 - Successful login - user: admin - IP: 185.10.20.30
    """

    result = analyze_logs(logs)

    assert isinstance(result, LogAnalysisResult)

    assert result.summary
    assert isinstance(result.suspicious, bool)
    assert len(result.findings) > 0
    assert result.recommended_action