import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";
import { GithubRepo } from "@/types/github";

type ProjectCardProps = {
  repo: GithubRepo;
  locale: Locale;
  noDescriptionLabel: string;
};

export function ProjectCard({
  repo,
  locale,
  noDescriptionLabel,
}: ProjectCardProps) {
  return (
    <Link
      href={withLang(`/projects/${repo.name}`, locale)}
      className="group block rounded-2xl border border-[#95bbff]/28 bg-[#081d48]/56 p-6 shadow-[0_20px_42px_-34px_rgba(2,12,32,0.85)] transition hover:-translate-y-0.5 hover:border-[#5f95ff] sm:p-7"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-xl font-semibold leading-tight text-white sm:text-2xl">
          {repo.name || "Repository"}
        </h2>
        <span className="text-[11px] uppercase tracking-[0.16em] text-white group-hover:text-[#d9e8ff] sm:text-xs">-&gt;</span>
      </div>

      <p className="mt-3 max-w-4xl text-sm leading-6 text-white/90 sm:mt-4 sm:leading-7">
        {repo.description || noDescriptionLabel}
      </p>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 sm:mt-6">
        {repo.topics?.map((topic) => (
          <span
            key={topic}
            className="rounded-full border border-[#9fc2ff]/45 bg-[#0b265e]/40 px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-blue-100/95 sm:text-xs"
          >
            {topic}
          </span>
        ))}
      </div>
    </Link>
  );
}
