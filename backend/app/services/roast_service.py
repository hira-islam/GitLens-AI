from app.schemas.analysis import GitHubProfile, Statistics


class RoastService:
    def generate(self, profile: GitHubProfile, statistics: Statistics) -> str:
        top_language = statistics.languages[0] if statistics.languages else None

        if top_language and top_language.language == "Python" and top_language.percentage >= 40:
            return "If Python is your first language, coffee is your second."

        if statistics.total_repos > 52:
            return "You have more repositories than finished weekends."

        if statistics.total_stars > 10_000:
            return "GitHub should pay you rent at this point."

        if statistics.total_forks > statistics.total_stars and statistics.total_stars > 0:
            return "People fork your code more than they star it. Interesting life choices."

        if top_language and top_language.percentage >= 60:
            return f"You clearly love {top_language.language} more than sleep."

        if statistics.total_repos == 0:
            return "A GitHub profile with zero repos? Bold strategy."

        if not profile.bio:
            return "No bio, all code. Mysterious."

        return "Solid GitHub presence. Nothing roast-worthy yet."
