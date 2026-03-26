import type { Metadata } from "next";
import { faFolderOpen, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { SectionReveal } from "@/components/home/section-reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { getFeaturedRepos } from "@/lib/github";
import { getLocaleFromLang, getMessages } from "@/lib/i18n";

type ProjectsPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  searchParams,
}: ProjectsPageProps): Promise<Metadata> {
  const locale = getLocaleFromLang((await searchParams).lang);
  const metadata = getMessages(locale).site.projects.metadata;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: "/projects",
    },
  };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const locale = getLocaleFromLang((await searchParams).lang);
  const projects = getMessages(locale).site.projects;
  const repos = await getFeaturedRepos();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionReveal
        motionPreset="dynamic"
        className="rounded-3xl border border-[#8cb4ff]/24 bg-[radial-gradient(circle_at_top_left,rgba(67,120,255,0.2),transparent_36%),linear-gradient(180deg,rgba(8,24,60,0.92),rgba(4,14,38,0.95))] p-7 shadow-[0_30px_65px_-55px_rgba(2,12,32,1)] sm:p-10"
      >
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-5xl" data-reveal-item>
          <AnimatedFaIcon icon={faFolderOpen} animation="shimmer" className="text-2xl text-[#cee1ff] sm:text-3xl" />
          <span>{projects.title}</span>
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-[#e6f0ff] sm:text-lg sm:leading-8" data-reveal-item>
          {projects.description}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {repos.map((repo) => (
            <ProjectCard
              key={repo.id}
              repo={repo}
              locale={locale}
              noDescriptionLabel={projects.cardNoDescription}
            />
          ))}
        </div>

        {repos.length === 0 ? (
          <p className="mt-8 text-[#c8dcff]" data-reveal-item>
            <span className="inline-flex items-start gap-2">
              <AnimatedFaIcon icon={faTriangleExclamation} animation="pulse" className="mt-1 text-[#d3e5ff]" />
              <span>{projects.empty}</span>
            </span>
          </p>
        ) : null}
      </SectionReveal>
    </section>
  );
}
