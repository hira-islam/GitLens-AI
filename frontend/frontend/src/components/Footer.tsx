export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left">
        <p className="text-sm text-slate-500">
          GitLens AI — GitHub profile insights with a playful roast.
        </p>
        <p className="text-xs text-slate-400">Built with React, FastAPI & MongoDB</p>
      </div>
    </footer>
  );
}
