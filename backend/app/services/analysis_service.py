from app.schemas.analysis import (
    GitHubProfile,
    LanguageStat,
    RepositorySummary,
    Statistics,
)


class AnalysisService:
    def build_profile(self, profile_data: dict) -> GitHubProfile:
        return GitHubProfile(
            login=profile_data["login"],
            name=profile_data.get("name"),
            avatar_url=profile_data["avatar_url"],
            bio=profile_data.get("bio"),
            html_url=profile_data["html_url"],
            followers=profile_data.get("followers", 0),
            following=profile_data.get("following", 0),
            public_repos=profile_data.get("public_repos", 0),
        )

    def build_repositories(self, repos_data: list[dict]) -> list[RepositorySummary]:
        return [self._map_repository(repo) for repo in repos_data]

    def calculate_statistics(self, profile: GitHubProfile, repositories: list[RepositorySummary]) -> Statistics:
        total_stars = sum(repo.stars for repo in repositories)
        total_forks = sum(repo.forks for repo in repositories)
        languages = self._aggregate_languages(repositories)
        top_repositories = sorted(repositories, key=lambda repo: repo.stars, reverse=True)[:5]

        return Statistics(
            total_repos=profile.public_repos,
            followers=profile.followers,
            following=profile.following,
            total_stars=total_stars,
            total_forks=total_forks,
            languages=languages,
            top_repositories=top_repositories,
        )

    def _map_repository(self, repo_data: dict) -> RepositorySummary:
        return RepositorySummary(
            name=repo_data["name"],
            full_name=repo_data["full_name"],
            html_url=repo_data["html_url"],
            description=repo_data.get("description"),
            language=repo_data.get("language"),
            stars=repo_data.get("stargazers_count", 0),
            forks=repo_data.get("forks_count", 0),
        )

    def _aggregate_languages(self, repositories: list[RepositorySummary]) -> list[LanguageStat]:
        language_counts: dict[str, int] = {}
        for repo in repositories:
            if repo.language:
                language_counts[repo.language] = language_counts.get(repo.language, 0) + 1

        if not language_counts:
            return []

        total = sum(language_counts.values())
        stats = [
            LanguageStat(
                language=language,
                count=count,
                percentage=round((count / total) * 100, 1),
            )
            for language, count in language_counts.items()
        ]
        return sorted(stats, key=lambda item: item.count, reverse=True)
