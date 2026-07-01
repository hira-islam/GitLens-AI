import LoadingSpinner from "./LoadingSpinner";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (username: string) => void;
  loading?: boolean;
  placeholder?: string;
  buttonLabel?: string;
}

export default function SearchBox({
  value,
  onChange,
  onSubmit,
  loading = false,
  placeholder = "Enter GitHub username",
  buttonLabel = "Analyze",
}: SearchBoxProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed && !loading) {
      onSubmit(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
            @
          </span>
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pr-4 pl-9 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="GitHub username"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Analyzing...
            </>
          ) : (
            buttonLabel
          )}
        </button>
      </div>
      {loading && (
        <div className="mt-6">
          <LoadingSpinner label="Fetching GitHub data and generating insights..." size="sm" />
        </div>
      )}
    </form>
  );
}
