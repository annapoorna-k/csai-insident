from app.db.cosmos.connection import client


def test_cosmos_connection():
    databases = list(client.list_databases())

    assert databases is not None