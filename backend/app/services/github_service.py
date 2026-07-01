import httpx

from app.core.exceptions import (
    GitHubAPIError,
    GitHubRateLimitError,
    NetworkError,
    UserNotFoundError,
)

GITHUB_API_BASE = "https://api.github.com"


class GitHubService:
    def __init__(self, token: str | None = None) -> None:
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"
        self._headers = headers

    async def fetch_profile(self, username: str) -> dict:
        result = await self._request("GET", f"/users/{username}", username=username)
        if not isinstance(result, dict):
            raise GitHubAPIError("Unexpected GitHub profile response")
        return result

    async def fetch_repositories(self, username: str) -> list[dict]:
        result = await self._request(
            "GET",
            f"/users/{username}/repos",
            params={"per_page": 100, "sort": "updated"},
            username=username,
        )
        if not isinstance(result, list):
            raise GitHubAPIError("Unexpected GitHub repositories response")
        return result

    async def _request(
        self,
        method: str,
        path: str,
        params: dict | None = None,
        username: str | None = None,
    ) -> dict | list:
        url = f"{GITHUB_API_BASE}{path}"
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.request(method, url, headers=self._headers, params=params)
        except httpx.RequestError as exc:
            raise NetworkError(str(exc)) from exc

        if response.status_code == 404 and username:
            raise UserNotFoundError(username)

        if response.status_code == 404:
            raise UserNotFoundError(path.rstrip("/").split("/")[-1])

        remaining = response.headers.get("X-RateLimit-Remaining")
        if response.status_code == 403 and remaining == "0":
            raise GitHubRateLimitError()

        if response.status_code == 429:
            raise GitHubRateLimitError()

        if response.status_code >= 500:
            raise GitHubAPIError(f"GitHub server error ({response.status_code})")

        if response.status_code >= 400:
            raise GitHubAPIError(f"GitHub API error ({response.status_code})")

        return response.json()  # type: ignore[no-any-return]
