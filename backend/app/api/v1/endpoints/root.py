from fastapi import APIRouter, HTTPException, Request
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
    raise HTTPException(
        status_code=500,
        detail="Testing GitHub Actions deployment failure",
    )