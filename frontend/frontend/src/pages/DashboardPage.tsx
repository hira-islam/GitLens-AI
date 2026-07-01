import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import HistoryList from "../components/HistoryList";
import ProfileCard from "../components/ProfileCard";
import RepositoryList from "../components/RepositoryList";
import RoastCard from "../components/RoastCard";
import SearchBox from "../components/SearchBox";
import StatisticsCards from "../components/StatisticsCards";
import { useAnalyze } from "../hooks/useAnalyze";
import { useHistory } from "../hooks/useHistory";
import type { Analysis } from "../types/analysis";

interface LocationState {
  analysis?: Analysis;
}

export default function DashboardPage() {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { history, loading: historyLoading, error: historyError, refetch } = useHistory();
  const { analyze, loading: analyzeLoading } = useAnalyze();
  const [searchUsername, setSearchUsername] = useState("");

  const analysis = useMemo(() => {
    if (state?.analysis) {
      return state.analysis;
    }
    return history.find((item) => item.username.toLowerCase() === username?.toLowerCase());
  }, [state?.analysis, history, username]);

  const handleAnalyze = async (value: string) => {
    await analyze(value);
    void refetch();
  };

  if (!analysis) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">No analysis found</h2>
          <p className="mt-2 text-sm text-slate-500">
            We couldn&apos;t find data for <strong>@{username}</strong>. Run a new analysis
            from the home page.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Analysis for @{analysis.username}
          </h1>
        </div>
        <div className="w-full max-w-md">
          <SearchBox
            value={searchUsername}
            onChange={setSearchUsername}
            onSubmit={handleAnalyze}
            loading={analyzeLoading}
            placeholder="Analyze another user..."
            buttonLabel="Search"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileCard profile={analysis.github_profile} />
          <StatisticsCards statistics={analysis.statistics} />
          <RepositoryList
            repositories={analysis.statistics.top_repositories}
            title="Top 5 Repositories"
          />
          <RoastCard roast={analysis.roast} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <HistoryList
              history={history}
              loading={historyLoading}
              error={historyError}
              activeUsername={analysis.username}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
