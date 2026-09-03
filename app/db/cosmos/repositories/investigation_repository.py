from typing import Any

from app.db.cosmos.connection import container


def save_investigation(investigation: dict[str, Any]) -> dict[str, Any]:
    """
    Save an investigation document to Cosmos DB.
    """

    return container.upsert_item(investigation)


def get_investigation(investigation_id: str) -> dict[str, Any]:
    """
    Retrieve an investigation document from Cosmos DB.
    """

    return container.read_item(
        item=investigation_id,
        partition_key=investigation_id,
    )


def list_investigations() -> list[dict[str, Any]]:
    """
    Retrieve all investigation documents from Cosmos DB.
    """

    query = """
        SELECT *
        FROM c
        ORDER BY c.created_at DESC
    """

    return list(
        container.query_items(
            query=query,
            enable_cross_partition_query=True,
        )
    )