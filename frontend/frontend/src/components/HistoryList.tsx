import { useNavigate } from "react-router-dom";

import type { Analysis } from "../types/analysis";
import ErrorAlert from "./ErrorAlert";
import LoadingSpinner from "./LoadingSpinner";

interface HistoryListProps {
  history: Analysis[];
  loading: boolean;
  error: string | null;
  activeUsername?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryList({
  history,
  loading,
  error,
  activeUsername,
}: HistoryListProps) {
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner label="Loading search history..." size="sm" />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-sm font-medium text-slate-600">No search history yet</p>
        <p className="mt-1 text-xs text-slate-500">Analyze a GitHub user to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Search History</h3>
        <p className="mt-0.5 text-xs text-slate-500">{history.length} recent analyses</p>
      </div>
      <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
        {history.map((item) => {
          const isActive = item.username === activeUsername;
          return (
            <li key={`${item.username}-${item.created_at}`}>
              <button
                type="button"
                onClick={() =>
                  navigate(`/dashboard/${item.username}`, { state: { analysis: item } })
                }
                className={`flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-slate-50 ${
                  isActive ? "bg-indigo-50/60" : ""
                }`}
              >
                <img
                  src={item.github_profile.avatar_url}
                  alt=""
                  className="h-9 w-9 rounded-lg ring-1 ring-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    @{item.username}
                  </p>
                  <p className="truncate text-xs text-slate-500">{formatDate(item.created_at)}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {item.statistics.total_stars.toLocaleString()} ★
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
