from app.cache.cache_service import (
    get_cache,
    set_cache,
    delete_cache,
)


def test_redis_cache():

    key = "test:incident:001"

    data = {
        "incident_id": "INC-TEST-001",
        "severity": "HIGH",
        "status": "NEW",
    }

    set_cache(key, data, ttl=60)

    cached_data = get_cache(key)

    assert cached_data == data

    delete_cache(key)

    assert get_cache(key) is None