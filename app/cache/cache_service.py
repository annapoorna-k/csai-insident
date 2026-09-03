import json

from app.cache.redis import redis_client


def set_cache(key: str, value: dict, ttl: int = 300):
    redis_client.setex(
        key,
        ttl,
        json.dumps(value),
    )


def get_cache(key: str):
    value = redis_client.get(key)

    if value is None:
        return None

    return json.loads(value)


def delete_cache(key: str):
    redis_client.delete(key)