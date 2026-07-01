import type { RepositorySummary } from "../types/analysis";

interface RepositoryListProps {
  repositories: RepositorySummary[];
  title?: string;
}

export default function RepositoryList({
  repositories,
  title = "Top Repositories",
}: RepositoryListProps) {
  if (repositories.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">No repositories found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <ul className="divide-y divide-slate-100">
        {repositories.map((repo, index) => (
          <li key={repo.full_name} className="px-6 py-4 transition hover:bg-slate-50">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-xs font-bold text-indigo-600">
                    {index + 1}
                  </span>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate font-semibold text-slate-900 hover:text-indigo-600"
                  >
                    {repo.name}
                  </a>
                  {repo.language && (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {repo.language}
                    </span>
                  )}
                </div>
                {repo.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{repo.description}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span aria-hidden>⭐</span>
                  {repo.stars.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <span aria-hidden>🍴</span>
                  {repo.forks.toLocaleString()}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
