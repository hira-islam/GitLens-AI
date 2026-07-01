from fastapi import APIRouter

from app.api.v1.endpoints import analyze, history, root

api_router = APIRouter()
api_router.include_router(root.router)
api_router.include_router(analyze.router)
api_router.include_router(history.router)
