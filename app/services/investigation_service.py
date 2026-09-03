from typing import Any

from app.db.postgres.repositories.investigation_repository import (
    get_investigation,
    list_investigations,
)


def retrieve_investigation(
    investigation_id: str,
) -> dict[str, Any]:
    """
    Retrieve an investigation by its ID from PostgreSQL.

    Raises:
        ValueError: If the investigation does not exist.
    """

    investigation = get_investigation(
        investigation_id
    )

    if investigation is None:
        raise ValueError(
            f"Investigation not found: {investigation_id}"
        )

    return investigation


def retrieve_investigations() -> list[dict[str, Any]]:
    """
    Retrieve all completed investigations from PostgreSQL
    and normalize them for the investigation list API.
    """

    investigations = list_investigations()

    result = []

    for investigation in investigations:
        risk_assessment = (
            investigation.get("risk_assessment")
            or {}
        )

        result.append(
            {
                "id": investigation.get("id", ""),
                "incident": investigation.get(
                    "incident"
                ),
                "status": investigation.get(
                    "status",
                    "UNKNOWN",
                ),
                "risk_level": risk_assessment.get(
                    "risk_level"
                ),
                "risk_score": risk_assessment.get(
                    "risk_score"
                ),
                "created_at": investigation.get(
                    "created_at"
                ),
            }
        )

    return result