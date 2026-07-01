from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import AppException
from app.services.database_service import DatabaseService
from app.services.github_service import GitHubService


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    database_service = DatabaseService(settings.mongodb_url, settings.mongodb_db_name)
    await database_service.connect()
    app.state.database_service = database_service
    app.state.github_service = GitHubService(token=settings.github_token)
    yield
    await database_service.close()


app = FastAPI(title="GitLens AI", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppException)
async def app_exception_handler(_: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


app.include_router(api_router)
