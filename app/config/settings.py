from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application
    app_name: str = "Cybersecurity AI Agent"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    # Langfuse
    langfuse_secret_key: str
    langfuse_public_key: str
    langfuse_base_url: str

    # PostgreSQL
    postgres_user: str
    postgres_password: str
    postgres_host: str
    postgres_port: int
    postgres_db: str
    database_url: str

    # Cosmos DB
    cosmos_endpoint: str
    cosmos_key: str
    cosmos_database_name: str
    cosmos_container_name: str

    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_password: str | None = None

    # OpenRouter
    openrouter_api_key: str
    openrouter_base_url: str
    default_model: str

    # News API
    news_api_key: str | None = None
    news_api_base_url: str = "https://newsapi.org/v2"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()