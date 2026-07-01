from pydantic import BaseModel, Field, field_validator

from app.utils.github import validate_username


class AnalyzeRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=39)

    @field_validator("username")
    @classmethod
    def validate_github_username(cls, value: str) -> str:
        return validate_username(value)
