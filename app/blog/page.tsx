import type { Metadata } from "next";
import { Suspense } from "react";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

import { BlogExplorer, type BlogExplorerCopy } from "@/components/blog/blog-explorer";
import { type BlogCardData } from "@/components/blog/blog-list";
import { type PathFilterOption } from "@/components/blog/path-filters";
import { SectionReveal } from "@/components/home/section-reveal";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { blogPaths, countPostsForPath } from "@/lib/blog-paths";
import { getLocalizedBlogPosts } from "@/lib/blog";
import { getLocaleFromLang, getMessages, withLang, type Locale } from "@/lib/i18n";

type BlogPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const locale = getLocaleFromLang((await searchParams).lang);
  const metadata = getMessages(locale).site.blog.metadata;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: "/blog",
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const locale = getLocaleFromLang((await searchParams).lang);
  const blog = getMessages(locale).site.blog;
  const posts = getLocalizedBlogPosts(locale);

  // Dati card serializzabili, gia' localizzati, pronti per il client.
  const cards: BlogCardData[] = posts.map((post) => ({
    slug: post.slug,
    href: withLang(`/blog/${post.slug}`, locale),
    cover: post.cover,
    title: post.title,
    description: post.description,
    tags: post.tags,
    dateLabel: formatDate(post.publishedAt, locale),
    readingLabel: blog.readingTime.replace("{minutes}", String(post.readingMinutes)),
    youtubeLabel: post.youtubeUrl ? blog.youtube : null,
  }));

  // Opzioni filtro con conteggio articoli per percorso (case-insensitive).
  const options: PathFilterOption[] = blogPaths.map((path) => ({
    id: path.id,
    label: path.label[locale],
    count: countPostsForPath(posts, path.id),
  }));

  const explorerCopy: BlogExplorerCopy = {
    title: blog.explore.title,
    subtitle: blog.explore.subtitle,
    ariaLabel: blog.explore.ariaLabel,
    readPost: blog.readPost,
    emptyTitle: blog.emptyPath.title,
    emptyText: blog.emptyPath.text,
    emptyCta: blog.emptyPath.cta,
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionReveal motionPreset="dynamic" className="space-y-12">
        <div className="max-w-3xl" data-reveal-item>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#1d4ed8]">
            <AnimatedFaIcon icon={faBookOpen} animation="shimmer" className="text-[#1d4ed8]" />
            <span>{blog.allPosts}</span>
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#0f172a] sm:text-6xl">
            {blog.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4b5563]">
            {blog.description}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-1.5 text-sm font-medium text-[#6b7280]">
            {blog.microcopy}
          </p>
        </div>

        {posts.length > 0 ? (
          <div data-reveal-item>
            <Suspense fallback={null}>
              <BlogExplorer cards={cards} options={options} copy={explorerCopy} />
            </Suspense>
          </div>
        ) : (
          <p className="rounded-2xl border border-[#e5e7eb] bg-white p-6 text-[#4b5563]">
            {blog.empty}
          </p>
        )}
      </SectionReveal>
    </section>
  );
}
