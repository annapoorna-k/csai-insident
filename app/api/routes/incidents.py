from fastapi import APIRouter

from app.db.cosmos.connection import container


router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"],
)


@router.get("")
def list_incidents():
    """
    Retrieve input incidents from the Cosmos DB incidents container.
    """

    return list(
        container.query_items(
            query="SELECT * FROM c",
            enable_cross_partition_query=True,
        )
    )