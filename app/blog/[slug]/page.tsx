import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  faArrowLeft,
  faCalendarDays,
  faClock,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

import { SectionReveal } from "@/components/home/section-reveal";
import { ArticleCta } from "@/components/blog/article-cta";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { SectionBlocks } from "@/components/blog/section-blocks";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";
import {
  getAllBlogPosts,
  getBlogPost,
  getLocalizedBlogPost,
  getLocalizedBlogPosts,
} from "@/lib/blog";
import { extractToc } from "@/lib/toc";
import { getLocaleFromLang, getMessages, withLang, type Locale } from "@/lib/i18n";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = getLocaleFromLang((await searchParams).lang);
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: getMessages(locale).site.projects.notFoundTitle,
    };
  }

  const localizedPost = getLocalizedBlogPost(post, locale);

  return {
    title: `${localizedPost.title} | Alessio Quagliara`,
    description: localizedPost.description,
    alternates: {
      canonical: `/blog/${localizedPost.slug}`,
    },
    openGraph: {
      title: localizedPost.title,
      description: localizedPost.description,
      type: "article",
      publishedTime: localizedPost.publishedAt,
      modifiedTime: localizedPost.updatedAt,
      images: [
        {
          url: localizedPost.cover,
          alt: localizedPost.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({
  params,
  searchParams,
}: BlogPostPageProps) {
  const { slug } = await params;
  const locale = getLocaleFromLang((await searchParams).lang);
  const blog = getMessages(locale).site.blog;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const localizedPost = getLocalizedBlogPost(post, locale);

  // TOC costruita dalle sezioni (H2 = titolo sezione) + eventuali H3 nel body.
  // Mostrata solo quando ci sono >= 3 sezioni con titolo.
  const titledSections = localizedPost.sections.filter((section) => section.title);
  const toc = titledSections.flatMap((section) => [
    { id: section.id, text: section.title, level: 2 as const },
    ...extractToc(section.body).filter((item) => item.level === 3),
  ]);
  const hasToc = titledSections.length >= 3;

  // "Prossimo articolo": quello successivo in ordine cronologico, con wrap
  const allPosts = getLocalizedBlogPosts(locale);
  const currentIndex = allPosts.findIndex((item) => item.slug === localizedPost.slug);
  const nextPost =
    allPosts.length > 1
      ? allPosts[(currentIndex + 1) % allPosts.length]
      : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: localizedPost.title,
    description: localizedPost.description,
    image: [new URL(localizedPost.cover, "https://alessioquagliara.com").toString()],
    datePublished: localizedPost.publishedAt,
    dateModified: localizedPost.updatedAt ?? localizedPost.publishedAt,
    author: {
      "@type": "Person",
      name: "Alessio Quagliara",
      url: "https://alessioquagliara.com",
    },
    publisher: {
      "@type": "Person",
      name: "Alessio Quagliara",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://alessioquagliara.com/blog/${localizedPost.slug}`,
    },
  };

  return (
    <article className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SectionReveal motionPreset="dynamic" className="space-y-10">
        <div data-reveal-item>
          <Link
            href={withLang("/blog", locale)}
            className={buttonClass({ variant: "outline", className: "w-fit" })}
          >
            <span className="inline-flex items-center gap-2">
              <AnimatedFaIcon icon={faArrowLeft} animation="float" />
              <span>{blog.back}</span>
            </span>
          </Link>
        </div>

        <header className="max-w-4xl" data-reveal-item>
          <div className="flex flex-wrap gap-2">
            {localizedPost.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#e5e7eb] bg-[#f1f5f9] px-3 py-1 text-xs font-medium text-[#1d4ed8]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight text-[#0f172a] sm:text-6xl">
            {localizedPost.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#4b5563]">
            {localizedPost.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#6b7280]">
            <span className="inline-flex items-center gap-2">
              <AnimatedFaIcon icon={faCalendarDays} animation="pulse" />
              {blog.published} {formatDate(localizedPost.publishedAt, locale)}
            </span>
            <span className="inline-flex items-center gap-2">
              <AnimatedFaIcon icon={faClock} animation="float" />
              {blog.readingTime.replace(
                "{minutes}",
                String(localizedPost.readingMinutes)
              )}
            </span>
            {localizedPost.youtubeUrl ? (
              <Link
                href={localizedPost.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-medium text-[#1d4ed8] hover:text-[#1e3a8a]"
              >
                <AnimatedFaIcon icon={faVideo} animation="shimmer" />
                {blog.youtube}
              </Link>
            ) : null}
          </div>
        </header>

        <div
          className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-[#e5e7eb] bg-[#f1f5f9] shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]"
          data-reveal-item
        >
          <Image
            src={localizedPost.cover}
            alt={localizedPost.title}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
        </div>

        <div
          className={
            hasToc ? "article-layout article-layout--with-toc" : "article-layout"
          }
          data-reveal-item
        >
          <div className="article-main">
            <SectionBlocks
              sections={localizedPost.sections}
              calloutLabels={{
                takeaway: blog.callouts.takeaway,
                note: blog.callouts.note,
                tip: blog.callouts.tip,
                warning: blog.callouts.warning,
              }}
            />

            <ArticleCta
              youtubeUrl={localizedPost.youtubeUrl}
              nextPost={
                nextPost
                  ? {
                      href: withLang(`/blog/${nextPost.slug}`, locale),
                      title: nextPost.title,
                    }
                  : undefined
              }
              newsletterHref={withLang("/contact", locale)}
              labels={{
                heading: blog.cta.heading,
                subtitle: blog.cta.subtitle,
                watchVideo: blog.cta.watchVideo,
                newsletterTitle: blog.cta.newsletterTitle,
                newsletterText: blog.cta.newsletterText,
                newsletterCta: blog.cta.newsletterCta,
                nextLabel: blog.cta.nextLabel,
              }}
            />
          </div>

          {hasToc ? (
            <aside className="article-aside">
              <TableOfContents items={toc} title={blog.toc} />
            </aside>
          ) : null}
        </div>
      </SectionReveal>
    </article>
  );
}
