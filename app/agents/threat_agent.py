import json

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config.settings import get_settings
from app.llm.prompts.threat_intel_prompt import (
    THREAT_INTEL_SYSTEM_PROMPT,
)
from app.schemas.investigation import ThreatIntelligenceResult


def analyze_threat_intelligence(
    indicators: str,
) -> ThreatIntelligenceResult:
    """
    Analyze indicators of compromise and return
    a validated threat intelligence result.
    """

    settings = get_settings()

    llm = ChatOpenAI(
        model="ibm-granite/granite-4.2-8b",
        api_key=settings.openrouter_api_key,
        base_url=settings.openrouter_base_url,
        temperature=0,
        timeout=30,
    )

    response = llm.invoke(
        [
            SystemMessage(
                content=THREAT_INTEL_SYSTEM_PROMPT
            ),
            HumanMessage(
                content=f"""
                Analyze the following indicators of compromise:

                {indicators}

                Return ONLY a valid JSON object.
                Do not return Markdown.
                Do not return explanations.
                """
            ),
        ]
    )

    content = response.content.strip()

    # Remove Markdown JSON code fences if present.
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    data = json.loads(content)

    return ThreatIntelligenceResult.model_validate(data)