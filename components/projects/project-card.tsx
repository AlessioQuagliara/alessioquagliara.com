import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";
import { GithubRepo } from "@/types/github";

type ProjectCardProps = {
  repo: GithubRepo;
  locale: Locale;
  noDescriptionLabel: string;
};

const MAX_VISIBLE_TOPICS = 4;

export function ProjectCard({ repo, locale, noDescriptionLabel }: ProjectCardProps) {
  // "featured" seleziona i repo da mostrare, non è un tag informativo.
  const topics = (repo.topics || [])
    .filter((topic) => topic.toLowerCase() !== "featured")
    .slice(0, MAX_VISIBLE_TOPICS);

  return (
    <Link
      href={withLang(`/projects/${repo.name}`, locale)}
      className="group flex h-full flex-col rounded-xl border border-white/10 bg-[#0b1f4b]/60 p-6 transition-colors hover:border-[#2664eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab0ff]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{repo.name}</h3>
        <span aria-hidden="true" className="text-[#8cb4ff] transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#c9ddff]">
        {repo.description || noDescriptionLabel}
      </p>
      {topics.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-5 font-mono text-xs text-[#8cb4ff]">
          {topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      ) : null}
    </Link>
  );
}
