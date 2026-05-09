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
import { MarkdownContent } from "@/components/projects/markdown-content";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";
import {
  getAllBlogPosts,
  getBlogPost,
  getLocalizedBlogPost,
} from "@/lib/blog";
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

  return (
    <article className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <SectionReveal motionPreset="dynamic" className="space-y-10">
        <Link
          href={withLang("/blog", locale)}
          className={buttonClass({ variant: "secondary", className: "w-fit" })}
          data-reveal-item
        >
          <span className="inline-flex items-center gap-2">
            <AnimatedFaIcon icon={faArrowLeft} animation="float" />
            <span>{blog.back}</span>
          </span>
        </Link>

        <header className="max-w-4xl" data-reveal-item>
          <div className="flex flex-wrap gap-2">
            {localizedPost.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#8cb4ff]/28 bg-white/8 px-3 py-1 text-xs text-[#cfe1ff]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-6xl">
            {localizedPost.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f0ff]">
            {localizedPost.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#bdd5ff]">
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
                className="inline-flex items-center gap-2 text-[#d8e8ff] hover:text-white"
              >
                <AnimatedFaIcon icon={faVideo} animation="shimmer" />
                {blog.youtube}
              </Link>
            ) : null}
          </div>
        </header>

        <div
          className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-[#8cb4ff]/24 bg-[#07173c] shadow-[0_32px_80px_-58px_rgba(2,12,32,1)]"
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#06112a]/66 to-transparent" />
        </div>

        <MarkdownContent content={localizedPost.body} />
      </SectionReveal>
    </article>
  );
}
