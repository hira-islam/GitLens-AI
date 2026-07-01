from datetime import UTC, datetime

from fastapi import APIRouter, Depends

from app.api.deps import (
    get_analysis_service,
    get_database_service,
    get_github_service,
    get_roast_service,
)
from app.schemas.analysis import AnalysisResponse
from app.schemas.analyze import AnalyzeRequest
from app.services.analysis_service import AnalysisService
from app.services.database_service import DatabaseService
from app.services.github_service import GitHubService
from app.services.roast_service import RoastService

router = APIRouter(tags=["analyze"])


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_user(
    payload: AnalyzeRequest,
    github_service: GitHubService = Depends(get_github_service),
    analysis_service: AnalysisService = Depends(get_analysis_service),
    roast_service: RoastService = Depends(get_roast_service),
    database_service: DatabaseService = Depends(get_database_service),
) -> AnalysisResponse:
    profile_data = await github_service.fetch_profile(payload.username)
    repos_data = await github_service.fetch_repositories(payload.username)

    profile = analysis_service.build_profile(profile_data)
    repositories = analysis_service.build_repositories(repos_data)
    statistics = analysis_service.calculate_statistics(profile, repositories)
    roast = roast_service.generate(profile, statistics)

    analysis = AnalysisResponse(
        username=profile.login,
        github_profile=profile,
        repositories=repositories,
        statistics=statistics,
        roast=roast,
        created_at=datetime.now(UTC),
    )

    return await database_service.save_analysis(analysis)
