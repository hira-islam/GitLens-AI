from datetime import datetime

from pydantic import BaseModel


class GitHubProfile(BaseModel):
    login: str
    name: str | None = None
    avatar_url: str
    bio: str | None = None
    html_url: str
    followers: int
    following: int
    public_repos: int


class RepositorySummary(BaseModel):
    name: str
    full_name: str
    html_url: str
    description: str | None = None
    language: str | None = None
    stars: int
    forks: int


class LanguageStat(BaseModel):
    language: str
    count: int
    percentage: float


class Statistics(BaseModel):
    total_repos: int
    followers: int
    following: int
    total_stars: int
    total_forks: int
    languages: list[LanguageStat]
    top_repositories: list[RepositorySummary]


class AnalysisResponse(BaseModel):
    username: str
    github_profile: GitHubProfile
    repositories: list[RepositorySummary]
    statistics: Statistics
    roast: str
    created_at: datetime


class HealthResponse(BaseModel):
    status: str = "healthy"
