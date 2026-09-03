from app.cache.redis import redis_client


def test_redis_connection():
    result = redis_client.ping()

    assert result is True