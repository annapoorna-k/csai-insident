from langgraph.graph import END, START, StateGraph

from app.graph.nodes import (
    log_analysis_node,
    risk_assessment_node,
    threat_intelligence_node,
    triage_node,
)
from app.graph.persistence import persist_investigation
from app.graph.state import InvestigationState


def build_investigation_graph():
    graph = StateGraph(InvestigationState)

    graph.add_node(
        "triage",
        triage_node,
    )

    graph.add_node(
        "log_analysis",
        log_analysis_node,
    )

    graph.add_node(
        "threat_intelligence",
        threat_intelligence_node,
    )

    graph.add_node(
        "risk_assessment",
        risk_assessment_node,
    )

    graph.add_node(
        "persistence",
        persist_investigation,
    )

    graph.add_edge(
        START,
        "triage",
    )

    graph.add_edge(
        "triage",
        "log_analysis",
    )

    graph.add_edge(
        "log_analysis",
        "threat_intelligence",
    )

    graph.add_edge(
        "threat_intelligence",
        "risk_assessment",
    )

    graph.add_edge(
        "risk_assessment",
        "persistence",
    )

    graph.add_edge(
        "persistence",
        END,
    )

    return graph.compile()