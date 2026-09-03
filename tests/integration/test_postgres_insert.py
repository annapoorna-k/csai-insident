from uuid import uuid4

from sqlalchemy import select

from app.db.postgres.connection import SessionLocal
from app.db.postgres.models import Investigation


def test_create_investigation():

    investigation_id = f"INV-TEST-{uuid4().hex[:12]}"

    investigation = Investigation(
        id=investigation_id,
        incident="Multiple failed login attempts detected.",
        logs="Failed login attempts from 192.168.1.100",
        indicators="192.168.1.100",
        triage_result={
            "classification": "brute_force",
            "severity": "HIGH",
        },
        log_analysis={
            "summary": "Multiple failed login attempts detected.",
        },
        threat_intelligence={
            "summary": "IP requires investigation.",
        },
        risk_assessment={
            "risk_level": "HIGH",
            "risk_score": 85,
            "summary": "Potential brute-force attack.",
            "reasoning": "Multiple failed authentication attempts were detected.",
            "recommended_actions": [
                "Block the source IP",
                "Review authentication logs",
            ],
        },
        status="COMPLETED",
    )

    with SessionLocal() as session:
        session.add(investigation)
        session.commit()
        session.refresh(investigation)

        assert investigation.id == investigation_id
        assert investigation.status == "COMPLETED"

        result = session.execute(
            select(Investigation).where(
                Investigation.id == investigation_id
            )
        )

        saved_investigation = result.scalar_one()

        assert saved_investigation.id == investigation_id
        assert saved_investigation.risk_assessment["risk_level"] == "HIGH"
        assert saved_investigation.risk_assessment["risk_score"] == 85