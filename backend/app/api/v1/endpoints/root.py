from fastapi import APIRouter, Request
from fastapi.responses import PlainTextResponse

import os
from app.schemas.analysis import HealthResponse, ReadyResponse
from fastapi import HTTPException

# Health status constants
HEALTHY = "healthy"
UNHEALTHY = "unhealthy"

CONNECTED = "connected"
DISCONNECTED = "disconnected"

READY = "ready"
NOT_READY = "not_ready"

CONFIGURED = "configured"
MISSING = "missing"

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

# @router.get("/ready", response_model=ReadyResponse)
# async def ready(request: Request) -> ReadyResponse:

#     database_service = request.app.state.database_service

#     database_connected = await database_service.health_check()

#     github_configured = bool(os.getenv("GH_PAT"))

#     ready = database_connected and github_configured

#     return ReadyResponse(
#         status=READY if ready else NOT_READY,
#         database=CONNECTED if database_connected else DISCONNECTED,
#         github=CONFIGURED if github_configured else MISSING,
#     )


@router.get("/ready", response_model=ReadyResponse)
async def ready(request: Request) -> ReadyResponse:
    raise HTTPException(
        status_code=500,
        detail="Rollback test"
    )