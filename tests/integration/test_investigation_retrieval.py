from uuid import uuid4

from app.db.cosmos.repositories.investigation_repository import (
    save_investigation,
)
from app.services.investigation_service import retrieve_investigation


def test_retrieve_investigation():
    investigation_id = str(uuid4())

    document = {
        "id": investigation_id,
        "incident": "Test investigation retrieval",
        "logs": "Test logs",
        "indicators": "Test indicators",
        "status": "COMPLETED",
        "risk_assessment": {
            "risk_level": "LOW",
            "risk_score": 20,
        },
    }

    save_investigation(document)

    result = retrieve_investigation(investigation_id)

    assert result["id"] == investigation_id
    assert result["status"] == "COMPLETED"
    assert result["incident"] == "Test investigation retrieval"
    assert result["risk_assessment"]["risk_level"] == "LOW"
    assert result["risk_assessment"]["risk_score"] == 20