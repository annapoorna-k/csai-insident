from sqlalchemy import text

from app.db.postgres.connection import engine
from app.db.cosmos.connection import client
from app.cache.redis import redis_client


def test_postgres():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        assert result.scalar() == 1


def test_cosmos():
    databases = list(client.list_databases())

    database_ids = [db["id"] for db in databases]

    assert "cybersecurity_db" in database_ids


def test_redis():
    assert redis_client.ping() is True