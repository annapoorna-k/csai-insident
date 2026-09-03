from typing import Any

from sqlalchemy import select

from app.db.postgres.connection import SessionLocal
from app.db.postgres.models import Investigation


def create_investigation(
    investigation: dict[str, Any],
) -> dict[str, Any]:
    """
    Persist a completed investigation to PostgreSQL.
    """

    record = Investigation(
        id=investigation["id"],
        incident=investigation["incident"],
        logs=investigation.get("logs", ""),
        indicators=investigation.get("indicators", ""),
        triage_result=investigation.get("triage_result"),
        log_analysis=investigation.get("log_analysis"),
        threat_intelligence=investigation.get(
            "threat_intelligence"
        ),
        risk_assessment=investigation.get(
            "risk_assessment"
        ),
        status=investigation.get(
            "status",
            "COMPLETED",
        ),
    )

    with SessionLocal() as session:
        session.add(record)
        session.commit()
        session.refresh(record)

        return _to_dict(record)


def get_investigation(
    investigation_id: str,
) -> dict[str, Any] | None:
    """
    Retrieve one investigation from PostgreSQL.
    """

    with SessionLocal() as session:
        result = session.execute(
            select(Investigation).where(
                Investigation.id == investigation_id
            )
        )

        record = result.scalar_one_or_none()

        if record is None:
            return None

        return _to_dict(record)


def list_investigations() -> list[dict[str, Any]]:
    """
    Retrieve all investigations from PostgreSQL.
    """

    with SessionLocal() as session:
        result = session.execute(
            select(Investigation).order_by(
                Investigation.created_at.desc()
            )
        )

        records = result.scalars().all()

        return [
            _to_dict(record)
            for record in records
        ]


def _to_dict(
    investigation: Investigation,
) -> dict[str, Any]:
    """
    Convert a SQLAlchemy Investigation model
    into a dictionary used by the API layer.
    """

    return {
        "id": investigation.id,
        "incident": investigation.incident,
        "logs": investigation.logs,
        "indicators": investigation.indicators,
        "triage_result": investigation.triage_result,
        "log_analysis": investigation.log_analysis,
        "threat_intelligence": investigation.threat_intelligence,
        "risk_assessment": investigation.risk_assessment,
        "status": investigation.status,
        "created_at": (
            investigation.created_at.isoformat()
            if investigation.created_at
            else None
        ),
    }