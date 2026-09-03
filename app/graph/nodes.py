from app.agents.log_agent import analyze_logs
from app.agents.risk_agent import assess_risk
from app.agents.threat_agent import analyze_threat_intelligence
from app.agents.triage_agent import triage_incident
from app.graph.state import InvestigationState


def triage_node(state: InvestigationState) -> InvestigationState:
    """
    Execute the Triage Agent and update the investigation state.
    """

    result = triage_incident(
        state.incident
    )

    state.triage_result = result

    return state


def log_analysis_node(
    state: InvestigationState,
) -> InvestigationState:
    """
    Execute the Log Analysis Agent and update
    the investigation state.
    """

    result = analyze_logs(
        state.logs
    )

    state.log_analysis = result

    return state


def threat_intelligence_node(
    state: InvestigationState,
) -> InvestigationState:
    """
    Execute the Threat Intelligence Agent and update
    the investigation state.
    """

    result = analyze_threat_intelligence(
        state.indicators
    )

    state.threat_intelligence = result

    return state


def risk_assessment_node(
    state: InvestigationState,
) -> InvestigationState:
    """
    Execute the Risk Assessment Agent using the outputs
    from the Triage, Log Analysis, and Threat Intelligence agents.
    """

    result = assess_risk(
        str(state.triage_result),
        str(state.log_analysis),
        str(state.threat_intelligence),
    )

    state.risk_assessment = result

    return state