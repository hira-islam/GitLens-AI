import re

from app.core.exceptions import InvalidUsernameError

GITHUB_USERNAME_PATTERN = re.compile(r"^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$")


def normalize_username(username: str) -> str:
    return username.strip()


def validate_username(username: str) -> str:
    normalized = normalize_username(username)
    if not normalized or not GITHUB_USERNAME_PATTERN.match(normalized):
        raise InvalidUsernameError()
    return normalized
