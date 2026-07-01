import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-sm">
            GL
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            GitLens <span className="text-indigo-600">AI</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Analyze
          </Link>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-slate-600 transition hover:text-indigo-600 sm:inline"
          >
            API Docs
          </a>
        </nav>
      </div>
    </header>
  );
}
