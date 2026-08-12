import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";
import { GithubRepo } from "@/types/github";

type ProjectCardProps = {
  repo: GithubRepo;
  locale: Locale;
  noDescriptionLabel: string;
  /** Etichetta localizzata per i progetti in evidenza (topic "featured"). */
  featuredLabel?: string;
};

const MAX_VISIBLE_TOPICS = 6;

export function ProjectCard({
  repo,
  locale,
  noDescriptionLabel,
  featuredLabel,
}: ProjectCardProps) {
  const name = repo.name || "Repository";
  // "featured" seleziona i repo, non è un tag informativo: lo tolgo dai tag
  // e lo mostro come badge dedicato, così le card restano coerenti.
  const isFeatured = (repo.topics || []).some(
    (topic) => topic.toLowerCase() === "featured"
  );
  const topics = (repo.topics || [])
    .filter((topic) => topic.toLowerCase() !== "featured")
    .slice(0, MAX_VISIBLE_TOPICS);

  return (
    <Link
      href={withLang(`/projects/${repo.name}`, locale)}
      aria-label={name}
      className="group flex h-full flex-col rounded-2xl border border-[#95bbff]/28 bg-[#081d48]/56 p-6 shadow-[0_20px_42px_-34px_rgba(2,12,32,0.85)] transition hover:-translate-y-0.5 hover:border-[#5f95ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1f4b] sm:p-7"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold leading-tight text-white sm:text-2xl">
          {name}
        </h2>
        <span
          aria-hidden="true"
          className="mt-1 shrink-0 text-sm text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:text-[#d9e8ff]"
        >
          →
        </span>
      </div>

      {isFeatured && featuredLabel ? (
        <span className="mt-3 inline-flex w-fit items-center rounded-full border border-[#9fc2ff]/50 bg-[#1e4fb8]/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#dbe8ff]">
          {featuredLabel}
        </span>
      ) : null}

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/90 sm:mt-4 sm:leading-7">
        {repo.description || noDescriptionLabel}
      </p>

      {topics.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-x-3 gap-y-2 pt-5 sm:pt-6">
          {topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-[#9fc2ff]/45 bg-[#0b265e]/40 px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-blue-100/95 sm:text-xs"
            >
              {topic}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
