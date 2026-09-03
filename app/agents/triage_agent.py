import json

from langchain_core.messages import HumanMessage, SystemMessage

from app.llm.client import get_llm
from app.llm.prompts.triage_prompt import TRIAGE_SYSTEM_PROMPT
from app.schemas.incident import TriageResult


def triage_incident(incident: str) -> TriageResult:
    """
    Analyze a cybersecurity incident and return
    a validated triage result.
    """

    llm = get_llm()

    messages = [
        SystemMessage(
            content=TRIAGE_SYSTEM_PROMPT
        ),
        HumanMessage(
            content=f"""
            Analyze the following cybersecurity incident:

            {incident}

            Return ONLY valid JSON.
            Do not include explanations, Markdown,
            code fences, or any text outside the JSON object.
            """
        ),
    ]

    max_attempts = 2

    for attempt in range(max_attempts):
        response = llm.invoke(messages)

        content = response.content.strip()

        # Remove Markdown JSON code fences if the model adds them.
        if content.startswith("```json"):
            content = content[7:]

        elif content.startswith("```"):
            content = content[3:]

        if content.endswith("```"):
            content = content[:-3]

        content = content.strip()

        try:
            data = json.loads(content)

            return TriageResult.model_validate(data)

        except (json.JSONDecodeError, ValueError) as exc:

            if attempt == max_attempts - 1:
                raise ValueError(
                    "Triage Agent failed to return valid JSON "
                    f"after {max_attempts} attempts. "
                    f"Last model response: {content}"
                ) from exc

            messages.append(
                HumanMessage(
                    content="""
                    Your previous response was invalid.

                    Return ONLY a valid JSON object matching
                    the required triage schema.

                    Do not return safety messages,
                    explanations, Markdown, or any other text.
                    """
                )
            )

    raise RuntimeError(
        "Triage Agent failed unexpectedly."
    )