from app.llm.client import llm


def test_llm_connection():

    response = llm.invoke(
        "Return a JSON object with exactly this field: "
        '{"status":"CYBERSECURITY AI READY"}'
    )

    assert response.content

    assert "CYBERSECURITY AI READY" in (
        response.content.upper()
    )