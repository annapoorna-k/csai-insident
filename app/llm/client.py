from langchain_openai import ChatOpenAI

from app.config.settings import get_settings


settings = get_settings()


llm = ChatOpenAI(
    model=settings.default_model,
    api_key=settings.openrouter_api_key,
    base_url=settings.openrouter_base_url,
    temperature=0,
    timeout=30,
    model_kwargs={
        "response_format": {
            "type": "json_object",
        }
    },
)


def get_llm() -> ChatOpenAI:
    return llm