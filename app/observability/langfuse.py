from langfuse import Langfuse

from app.config.settings import get_settings


settings = get_settings()


langfuse = Langfuse(
    public_key=settings.langfuse_public_key,
    secret_key=settings.langfuse_secret_key,
    base_url=settings.langfuse_base_url,
)


def get_langfuse() -> Langfuse:
    return langfuse