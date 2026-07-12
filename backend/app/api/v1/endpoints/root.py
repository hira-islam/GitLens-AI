from fastapi import APIRouter, Request
from fastapi.responses import PlainTextResponse

from app.schemas.analysis import HealthResponse

# Health status constants
HEALTHY = "healthy"
UNHEALTHY = "unhealthy"

CONNECTED = "connected"
DISCONNECTED = "disconnected"

router = APIRouter(tags=["root"])


@router.get("/", response_class=PlainTextResponse)
async def root() -> str:
    return "GitLens API Running"


@router.get("/health", response_model=HealthResponse)
async def health(request: Request) -> HealthResponse:
    database_service = request.app.state.database_service

    database_connected = await database_service.health_check()

    return HealthResponse(
        status=HEALTHY if database_connected else UNHEALTHY,
        database=CONNECTED if database_connected else DISCONNECTED,
    )