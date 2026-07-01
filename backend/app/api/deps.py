from fastapi import Request

from app.services.analysis_service import AnalysisService
from app.services.database_service import DatabaseService
from app.services.github_service import GitHubService
from app.services.roast_service import RoastService


def get_database_service(request: Request) -> DatabaseService:
    return request.app.state.database_service


def get_github_service(request: Request) -> GitHubService:
    return request.app.state.github_service


def get_analysis_service() -> AnalysisService:
    return AnalysisService()


def get_roast_service() -> RoastService:
    return RoastService()
