import { MarkdownContent } from "@/components/projects/markdown-content";
import { getRepoByName, getRepoReadme } from "@/lib/github";
import { getLocaleFromLang, getMessages } from "@/lib/i18n";
import { buttonClass } from "@/components/ui/button";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import {
  faBookOpen,
  faCodeBranch,
  faFolderOpen,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = getLocaleFromLang((await searchParams).lang);
  const messages = getMessages(locale).site;
  const projects = messages.projects;
  const repo = await getRepoByName(slug);

  if (!repo) {
    return {
      title: projects.notFoundTitle,
      description: projects.notFoundDescription,
    };
  }

  return {
    title: `${repo.name} | ${projects.title} | ${messages.layout.navbar.brand}`,
    description: repo.description ?? projects.detailsFallbackDescription,
  };
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const locale = getLocaleFromLang((await searchParams).lang);
  const projects = getMessages(locale).site.projects;

  const repo = await getRepoByName(slug);
  if (!repo) {
    notFound();
  }

  const readme = await getRepoReadme(slug);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <div className="mb-10">
        <h1 className="flex items-center gap-3 text-4xl font-bold">
          <AnimatedFaIcon icon={faFolderOpen} animation="shimmer" className="text-[#cfe2ff]" />
          <span>{repo.name}</span>
        </h1>

        {repo.description ? (
          <p className="mt-4 text-lg text-[#e6f0ff]">{repo.description}</p>
        ) : null}

        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className={`mt-6 ${buttonClass({ variant: "secondary" })}`}
        >
          <span className="inline-flex items-center gap-2">
            <AnimatedFaIcon icon={faCodeBranch} animation="pulse" />
            <span>{projects.viewRepository}</span>
          </span>
        </a>
      </div>

      {readme ? (
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#c8dcff]">
            <AnimatedFaIcon icon={faBookOpen} animation="float" />
            <span>README</span>
          </p>
          <MarkdownContent content={readme} />
        </div>
      ) : (
        <p className="text-[#c8dcff]">
          <span className="inline-flex items-center gap-2">
            <AnimatedFaIcon icon={faTriangleExclamation} animation="pulse" />
            <span>{projects.readmeUnavailable}</span>
          </span>
        </p>
      )}
    </section>
  );
}
