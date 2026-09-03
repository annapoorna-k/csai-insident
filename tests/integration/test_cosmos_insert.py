from uuid import uuid4

from app.db.cosmos.connection import container


def test_create_investigation():
    incident_id = f"INC-COSMOS-{uuid4().hex[:8]}"

    investigation = {
        "id": incident_id,
        "incident_id": incident_id,
        "type": "security_investigation",
        "status": "IN_PROGRESS",
        "severity": "HIGH",
        "findings": [
            "Multiple failed login attempts detected"
        ],
    }

    created = container.create_item(
        body=investigation
    )

    assert created["id"] == incident_id
    assert created["incident_id"] == incident_id
    assert created["status"] == "IN_PROGRESS"