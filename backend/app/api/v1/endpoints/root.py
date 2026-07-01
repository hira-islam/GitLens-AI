from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

from app.schemas.analysis import HealthResponse

router = APIRouter(tags=["root"])


@router.get("/", response_class=PlainTextResponse)
async def root() -> str:
    return "GitLens API Running"


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse()
