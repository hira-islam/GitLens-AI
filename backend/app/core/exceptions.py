class AppException(Exception):
    def __init__(self, message: str, status_code: int = 500) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class InvalidUsernameError(AppException):
    def __init__(self, message: str = "Invalid GitHub username format") -> None:
        super().__init__(message, status_code=400)


class UserNotFoundError(AppException):
    def __init__(self, username: str) -> None:
        super().__init__(f"GitHub user '{username}' not found", status_code=404)


class GitHubRateLimitError(AppException):
    def __init__(self) -> None:
        super().__init__("GitHub API rate limit exceeded. Try again later.", status_code=429)


class GitHubAPIError(AppException):
    def __init__(self, message: str = "GitHub API returned an unexpected error") -> None:
        super().__init__(message, status_code=502)


class NetworkError(AppException):
    def __init__(self, message: str = "Unable to reach GitHub API") -> None:
        super().__init__(message, status_code=503)


class DatabaseError(AppException):
    def __init__(self, message: str = "Database operation failed") -> None:
        super().__init__(message, status_code=503)
