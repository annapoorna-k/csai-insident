from azure.cosmos import CosmosClient

from app.config.settings import get_settings


settings = get_settings()


client = CosmosClient(
    url=settings.cosmos_endpoint,
    credential=settings.cosmos_key,
    connection_verify=False,
)

database = client.get_database_client(
    settings.cosmos_database_name
)

container = database.get_container_client("incidents")