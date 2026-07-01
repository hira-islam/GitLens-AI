import type { Statistics } from "../types/analysis";

interface StatisticsCardsProps {
  statistics: Statistics;
}

const statConfig = [
  { key: "followers", label: "Followers", icon: "👥" },
  { key: "following", label: "Following", icon: "➡️" },
  { key: "total_repos", label: "Public Repos", icon: "📦" },
  { key: "total_stars", label: "Total Stars", icon: "⭐" },
  { key: "total_forks", label: "Total Forks", icon: "🍴" },
] as const;

export default function StatisticsCards({ statistics }: StatisticsCardsProps) {
  const values: Record<string, number> = {
    followers: statistics.followers,
    following: statistics.following,
    total_repos: statistics.total_repos,
    total_stars: statistics.total_stars,
    total_forks: statistics.total_forks,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {statConfig.map((stat) => (
          <div
            key={stat.key}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <span className="text-lg" aria-hidden>
              {stat.icon}
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {values[stat.key].toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Languages Used</h3>
        {statistics.languages.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No language data available.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {statistics.languages.map((lang) => (
              <div key={lang.language}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{lang.language}</span>
                  <span className="text-slate-500">
                    {lang.count} repos · {lang.percentage}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
