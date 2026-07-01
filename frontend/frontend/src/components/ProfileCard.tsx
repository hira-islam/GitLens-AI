import type { GitHubProfile } from "../types/analysis";

interface ProfileCardProps {
  profile: GitHubProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <img
          src={profile.avatar_url}
          alt={`${profile.login} avatar`}
          className="h-24 w-24 rounded-2xl border-4 border-white shadow-md ring-2 ring-slate-100"
        />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-bold text-slate-900">
            {profile.name ?? profile.login}
          </h2>
          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            @{profile.login}
          </a>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {profile.bio || "No bio provided — mysterious developer energy."}
          </p>
        </div>
      </div>
    </div>
  );
}
