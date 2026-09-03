import json

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config.settings import get_settings
from app.llm.prompts.risk_assessment_prompt import (
    RISK_ASSESSMENT_SYSTEM_PROMPT,
)
from app.schemas.investigation import RiskAssessmentResult


def assess_risk(
    triage_result: str,
    log_analysis: str,
    threat_intelligence: str,
) -> RiskAssessmentResult:
    """
    Assess the overall cybersecurity risk using the outputs
    from the Triage, Log Analysis, and Threat Intelligence agents.
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
                content=RISK_ASSESSMENT_SYSTEM_PROMPT
            ),
            HumanMessage(
                content=f"""
                Assess the overall risk of this cybersecurity investigation.

                Triage Result:
                {triage_result}

                Log Analysis:
                {log_analysis}

                Threat Intelligence:
                {threat_intelligence}

                Return ONLY a valid JSON object.
                Do not return Markdown.
                Do not return explanations.
                """
            ),
        ]
    )

    content = response.content.strip()

    # Remove Markdown JSON code fences if the model adds them.
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    data = json.loads(content)

    return RiskAssessmentResult.model_validate(data)