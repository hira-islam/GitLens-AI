import { useState } from "react";

import ErrorAlert from "../components/ErrorAlert";
import SearchBox from "../components/SearchBox";
import { useAnalyze } from "../hooks/useAnalyze";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const { analyze, loading, error, clearError } = useAnalyze();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/60 via-slate-50 to-slate-50" />
      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            GitHub Profile Analyzer | GitLens AI 🚀 CI/CD Working
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            GitLens <span className="text-indigo-600">AI</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Enter any public GitHub username to get profile insights, repository stats,
            language breakdown, and a playful AI roast.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
          {error && (
            <div className="mb-4">
              <ErrorAlert message={error} onDismiss={clearError} />
            </div>
          )}
          <SearchBox
            value={username}
            onChange={setUsername}
            onSubmit={analyze}
            loading={loading}
          />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Profile Stats", desc: "Followers, repos, stars & forks" },
            { title: "Top Repos", desc: "Best projects ranked by stars" },
            { title: "AI Roast", desc: "Rule-based humor, zero LLM bills" },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white/80 p-5 text-center backdrop-blur-sm"
            >
              <h3 className="font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
