from datetime import datetime
from typing import Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection

from app.core.exceptions import DatabaseError
from app.schemas.analysis import AnalysisResponse


class DatabaseService:
    def __init__(self, mongodb_url: str, db_name: str) -> None:
        self._client: AsyncIOMotorClient | None = None
        self._mongodb_url = mongodb_url
        self._db_name = db_name
        self._collection: AsyncIOMotorCollection | None = None

    async def connect(self) -> None:
        try:
            self._client = AsyncIOMotorClient(self._mongodb_url)
            self._collection = self._client[self._db_name]["analyses"]
            await self._client.admin.command("ping")
        except Exception as exc:
            raise DatabaseError(f"Failed to connect to MongoDB: {exc}") from exc

    async def close(self) -> None:
        if self._client is not None:
            self._client.close()
            self._client = None
            self._collection = None

    async def save_analysis(self, analysis: AnalysisResponse) -> AnalysisResponse:
        if self._collection is None:
            raise DatabaseError("Database is not connected")

        document = analysis.model_dump(mode="json")
        try:
            await self._collection.insert_one(document)
        except Exception as exc:
            raise DatabaseError(f"Failed to save analysis: {exc}") from exc

        return analysis

    async def get_history(self, limit: int = 50) -> list[AnalysisResponse]:
        if self._collection is None:
            raise DatabaseError("Database is not connected")

        try:
            cursor = self._collection.find().sort("created_at", -1).limit(limit)
            documents = await cursor.to_list(length=limit)
        except Exception as exc:
            raise DatabaseError(f"Failed to fetch history: {exc}") from exc

        return [self._document_to_response(doc) for doc in documents]

    def _document_to_response(self, document: dict[str, Any]) -> AnalysisResponse:
        payload = {key: value for key, value in document.items() if key != "_id"}
        if isinstance(payload.get("created_at"), str):
            payload["created_at"] = datetime.fromisoformat(payload["created_at"].replace("Z", "+00:00"))
        return AnalysisResponse.model_validate(payload)
