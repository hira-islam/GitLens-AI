export interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
}

export interface RepositorySummary {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
}

export interface LanguageStat {
  language: string;
  count: number;
  percentage: number;
}

export interface Statistics {
  total_repos: number;
  followers: number;
  following: number;
  total_stars: number;
  total_forks: number;
  languages: LanguageStat[];
  top_repositories: RepositorySummary[];
}

export interface Analysis {
  username: string;
  github_profile: GitHubProfile;
  repositories: RepositorySummary[];
  statistics: Statistics;
  roast: string;
  created_at: string;
}

export interface ApiErrorBody {
  detail: string | { msg: string; type: string }[];
}
