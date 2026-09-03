from langchain_core.messages import HumanMessage, SystemMessage

from app.llm.client import get_llm
from app.llm.prompts.triage_prompt import TRIAGE_SYSTEM_PROMPT


def test_triage_prompt():

    llm = get_llm()

    response = llm.invoke(
        [
            SystemMessage(content=TRIAGE_SYSTEM_PROMPT),
            HumanMessage(
                content="""
                Incident:
                Multiple failed login attempts were detected
                from the same external IP address within 5 minutes.
                """
            ),
        ]
    )

    assert response.content
    assert len(response.content.strip()) > 0