import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { ProjectCard } from "@/components/projects/project-card";
import { buttonClass } from "@/components/ui/button";
import { getLocalizedBlogPosts } from "@/lib/blog";
import { getFeaturedRepos } from "@/lib/github";
import { getLocaleFromLang, getMessages, withLang, type Locale } from "@/lib/i18n";
import { CALENDLY_URL, CONTACT_EMAIL, GITHUB_URL } from "@/lib/site-config";

type HomePageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const locale = getLocaleFromLang((await searchParams).lang);
  const metadata = getMessages(locale).site.home.metadata;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: "/",
    },
  };
}

function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/** Sezione della home: ancora, etichetta e titolo sempre uguali. */
function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 border-t border-white/10 py-20 sm:py-24">
      <p className="section-label">{label}</p>
      <h2 id={`${id}-title`} className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

/** Righe periodo / titolo / testo per lavoro e formazione. */
function Timeline({ title, items }: { title: string; items: { period: string; title: string; text: string }[] }) {
  return (
    <div>
      <h3 className="font-mono text-sm text-[#8cb4ff]">{title}</h3>
      <ol className="mt-4 border-l border-white/15">
        {items.map((item) => (
          <li key={item.title} className="relative pb-8 pl-6 last:pb-0">
            <span aria-hidden="true" className="absolute top-2 -left-[5px] h-2.5 w-2.5 rounded-full bg-[#2664eb]" />
            <p className="font-mono text-xs text-[#8cb4ff]">{item.period}</p>
            <p className="mt-1 font-semibold text-white">{item.title}</p>
            <p className="mt-1 leading-7 text-[#c9ddff]">{item.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Chips({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-mono text-sm text-[#8cb4ff]">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-md border border-white/15 px-3 py-1 font-mono text-xs text-[#eef4ff]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const locale = getLocaleFromLang((await searchParams).lang);
  const { home, projects: projectCopy } = getMessages(locale).site;
  const { hero, about, experience, projects, posts, contact } = home;
  const repos = await getFeaturedRepos();
  const latestPosts = getLocalizedBlogPosts(locale).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="grid items-center gap-12 py-20 sm:py-28 md:grid-cols-[1fr_auto]">
        <div>
          <p className="section-label">{hero.eyebrow}</p>
          <h1 className="mt-5 text-5xl font-bold tracking-tight text-white sm:text-6xl">{hero.title}</h1>
          <p className="mt-4 text-2xl font-medium text-[#8cb4ff] sm:text-3xl">{hero.subtitle}</p>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#c9ddff]">{hero.description}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="#progetti" className={buttonClass({ variant: "primary", size: "lg" })}>
              {hero.ctaProjects}
            </Link>
            <Link href={withLang("/blog", locale)} className={buttonClass({ variant: "secondary", size: "lg" })}>
              {hero.ctaBlog}
            </Link>
          </div>
        </div>
        <Image
          src="/profile_image.jpg"
          alt={hero.photoAlt}
          width={800}
          height={800}
          priority
          sizes="(min-width: 768px) 288px, 192px"
          className="h-48 w-48 rounded-2xl border border-white/15 object-cover shadow-[12px_12px_0_0_#2664eb] md:h-72 md:w-72"
        />
      </section>

      <Section id="chi-sono" label={about.label} title={about.title}>
        <div className="grid gap-12 md:grid-cols-[3fr_2fr]">
          <div className="space-y-5 text-lg leading-8 text-[#c9ddff]">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Chips title={about.stackTitle} items={about.stack} />
        </div>
      </Section>

      <Section id="esperienza" label={experience.label} title={experience.title}>
        <div className="grid gap-12 md:grid-cols-2">
          <Timeline title={experience.workTitle} items={experience.work} />
          <Timeline title={experience.educationTitle} items={experience.education} />
        </div>
      </Section>

      <Section id="progetti" label={projects.label} title={projects.title}>
        <p className="-mt-4 mb-8 text-[#c9ddff]">{projects.intro}</p>
        {repos.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {repos.map((repo) => (
              <ProjectCard
                key={repo.id}
                repo={repo}
                locale={locale}
                noDescriptionLabel={projectCopy.cardNoDescription}
              />
            ))}
          </div>
        ) : (
          <p className="text-[#c9ddff]">{projects.empty}</p>
        )}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block font-mono text-sm text-[#8cb4ff] hover:text-white"
        >
          {projects.github} →
        </a>
      </Section>

      <Section id="articoli" label={posts.label} title={posts.title}>
        <ul>
          {latestPosts.map((post) => (
            <li key={post.slug} className="border-t border-white/10 last:border-b">
              <Link
                href={withLang(`/blog/${post.slug}`, locale)}
                className="group grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6"
              >
                <span className="font-mono text-xs leading-7 text-[#8cb4ff]">
                  {formatDate(post.publishedAt, locale)}
                </span>
                <span className="font-semibold text-white transition-colors group-hover:text-[#8cb4ff]">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={withLang("/blog", locale)}
          className="mt-8 inline-block font-mono text-sm text-[#8cb4ff] hover:text-white"
        >
          {posts.all} →
        </Link>
      </Section>

      <Section id="contatti" label={contact.label} title={contact.title}>
        <p className="max-w-xl text-lg leading-8 text-[#c9ddff]">{contact.text}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href={`mailto:${CONTACT_EMAIL}`} className={buttonClass({ variant: "primary", size: "lg" })}>
            {contact.cta}
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noreferrer"
            className={buttonClass({ variant: "secondary", size: "lg" })}
          >
            {contact.book}
          </a>
        </div>
      </Section>
    </div>
  );
}
