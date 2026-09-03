import json

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config.settings import get_settings
from app.llm.prompts.log_analysis_prompt import (
    LOG_ANALYSIS_SYSTEM_PROMPT,
)
from app.schemas.investigation import LogAnalysisResult


def analyze_logs(logs: str) -> LogAnalysisResult:
    """
    Analyze cybersecurity logs and return
    a validated log analysis result.
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
                content=LOG_ANALYSIS_SYSTEM_PROMPT
            ),
            HumanMessage(
                content=f"""
                Analyze the following security logs:

                {logs}

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

    return LogAnalysisResult.model_validate(data)