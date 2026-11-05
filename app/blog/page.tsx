import type { Metadata } from "next";
import { Suspense } from "react";

import { BlogExplorer, type BlogExplorerCopy } from "@/components/blog/blog-explorer";
import { type BlogCardData } from "@/components/blog/blog-list";
import { type PathFilterOption } from "@/components/blog/path-filters";
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
      types: { "application/rss+xml": "/blog/rss.xml" },
    },
    // Senza questo l'archivio eredita og:title e og:url della home dal root layout.
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: "/blog",
      type: "website",
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const locale = getLocaleFromLang((await searchParams).lang);
  const blog = getMessages(locale).site.blog;
  const posts = getLocalizedBlogPosts(locale);

  // Dati card serializzabili, gia' localizzati, pronti per il client.
  // Server component reso a ogni richiesta: l'ora corrente serve per il badge "nuovo".
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const cards: BlogCardData[] = posts.map((post) => ({
    slug: post.slug,
    href: withLang(`/blog/${post.slug}`, locale),
    title: post.title,
    description: post.description,
    tags: post.tags,
    dateLabel: formatDate(post.publishedAt, locale),
    readingLabel: blog.readingTime.replace("{minutes}", String(post.readingMinutes)),
    youtubeLabel: post.youtubeUrl ? blog.youtube : null,
    isNew: now - new Date(post.publishedAt).getTime() < 3 * 24 * 60 * 60 * 1000,
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
    emptyTitle: blog.emptyPath.title,
    emptyText: blog.emptyPath.text,
    emptyCta: blog.emptyPath.cta,
  };

  return (
    <section className="mx-auto max-w-4xl space-y-12 px-6 py-16 sm:py-24">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#1d4ed8]">{blog.allPosts}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#0f172a] sm:text-5xl">
          {blog.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4b5563]">
          {blog.description}
        </p>
      </div>

      {posts.length > 0 ? (
        <Suspense fallback={null}>
          <BlogExplorer cards={cards} options={options} copy={explorerCopy} />
        </Suspense>
      ) : (
        <p className="rounded-xl border border-[#e5e7eb] bg-white p-6 text-[#4b5563]">
          {blog.empty}
        </p>
      )}
    </section>
  );
}
