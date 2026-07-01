from fastapi import APIRouter, Depends

from app.api.deps import get_database_service
from app.core.config import settings
from app.schemas.analysis import AnalysisResponse
from app.services.database_service import DatabaseService

router = APIRouter(tags=["history"])


@router.get("/history", response_model=list[AnalysisResponse])
async def get_history(
    database_service: DatabaseService = Depends(get_database_service),
) -> list[AnalysisResponse]:
    return await database_service.get_history(limit=settings.history_limit)
