from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_get_investigation_not_found():
    response = client.get(
        "/investigations/does-not-exist-999"
    )

    assert response.status_code == 404

    assert response.json() == {
        "detail": "Investigation not found: does-not-exist-999"
    }