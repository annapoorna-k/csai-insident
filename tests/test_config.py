from app.config.settings import get_settings


def test_settings_load():
    settings = get_settings()

    assert settings.postgres_db == "cybersecurity_db"
    assert settings.cosmos_database_name == "cybersecurity_db"
    assert settings.default_model