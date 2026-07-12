from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "gitlens_ai"
    GH_PAT: str | None = None
    cors_origins: str = "http://localhost:5173"
    history_limit: int = 50

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
