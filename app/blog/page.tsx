import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  faBookOpen,
  faCalendarDays,
  faClock,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

import { SectionReveal } from "@/components/home/section-reveal";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";
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
          <div className="grid gap-6 lg:grid-cols-3">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className="blog-card overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)]"
                data-reveal-item
                data-parallax
              >
                <Link
                  href={withLang(`/blog/${post.slug}`, locale)}
                  className="group blog-card__link"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#07173c]">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06112a]/76 to-transparent" />
                  </div>
                  <div className="blog-card__body p-6">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#e5e7eb] bg-[#f1f5f9] px-3 py-1 text-xs font-medium text-[#1d4ed8]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="mt-5 text-xl font-semibold leading-7 text-[#111827]">
                      {post.title}
                    </h2>
                    <p className="blog-card__excerpt mt-3 text-[0.95rem] leading-7 text-[#4b5563]">
                      {post.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#6b7280]">
                      <span className="inline-flex items-center gap-2">
                        <AnimatedFaIcon icon={faCalendarDays} animation="pulse" />
                        {formatDate(post.publishedAt, locale)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <AnimatedFaIcon icon={faClock} animation="float" />
                        {blog.readingTime.replace(
                          "{minutes}",
                          String(post.readingMinutes)
                        )}
                      </span>
                      {post.youtubeUrl ? (
                        <span className="inline-flex items-center gap-2">
                          <AnimatedFaIcon icon={faVideo} animation="shimmer" />
                          {blog.youtube}
                        </span>
                      ) : null}
                    </div>

                    <span
                      className={buttonClass({
                        variant: "outline",
                        className: "mt-6",
                      })}
                    >
                      {blog.readPost}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
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
