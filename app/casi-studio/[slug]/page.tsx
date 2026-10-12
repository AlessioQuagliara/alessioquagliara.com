import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  faArrowLeft,
  faBuilding,
  faClock,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";

import { SectionReveal } from "@/components/home/section-reveal";
import { ArticleCta } from "@/components/blog/article-cta";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { SectionBlocks } from "@/components/blog/section-blocks";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";
import { getBlogPost, getLocalizedBlogPost, type Section } from "@/lib/blog";
import {
  getAllCaseStudies,
  getCaseStudy,
  getLocalizedCaseStudies,
  getLocalizedCaseStudy,
} from "@/lib/case-studies";
import { fillTemplate, getLocaleFromLang, getMessages, withLang } from "@/lib/i18n";
import { getLandingPath } from "@/lib/landings";
import { SITE_URL } from "@/lib/site-config";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

// Solo i casi pubblicati vanno in build: gli altri slug danno 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCaseStudies().map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = getLocaleFromLang((await searchParams).lang);
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    return {};
  }

  const localized = getLocalizedCaseStudy(caseStudy, locale);

  return {
    title:
      localized.title.length > 40 ? localized.title : `${localized.title} | Alessio Quagliara`,
    description: localized.summary,
    alternates: {
      canonical: `/casi-studio/${localized.slug}`,
    },
    robots: caseStudy.published ? undefined : { index: false, follow: false },
    openGraph: {
      title: localized.title,
      description: localized.summary,
      type: "article",
      publishedTime: localized.publishedAt,
      modifiedTime: localized.updatedAt,
      images: [{ url: localized.cover, alt: localized.client }],
    },
  };
}

export default async function CaseStudyPage({ params, searchParams }: CaseStudyPageProps) {
  const { slug } = await params;
  const locale = getLocaleFromLang((await searchParams).lang);
  const messages = getMessages(locale).site;
  const copy = messages.caseStudies;
  const blog = messages.blog;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const localized = getLocalizedCaseStudy(caseStudy, locale);
  const pageUrl = `${SITE_URL}/casi-studio/${localized.slug}`;

  const relatedPosts = localized.relatedPosts
    .map((postSlug) => getBlogPost(postSlug))
    .filter((post) => post !== null)
    .map((post) => getLocalizedBlogPost(post, locale));

  // Il contesto Spotex va scritto in chiaro, non solo nel JSON-LD.
  const spotexNote = [
    fillTemplate(copy.spotexCredit, {
      company: localized.company,
      period: localized.periodLabel ? ` (${localized.periodLabel})` : "",
    }),
    copy.spotexNote,
    localized.anonymous ? copy.anonymousNote : "",
  ]
    .filter(Boolean)
    .join(" ");

  const resultsBody =
    localized.results.length > 0
      ? localized.results
          .map(
            (result) =>
              `- **${result.value}** ${result.label}` +
              (result.source ? ` _(${copy.source}: ${result.source})_` : "")
          )
          .join("\n")
      : copy.noResults;

  const linksBody = [
    ...relatedPosts.map(
      (post) => `- [${post.title}](${withLang(`/blog/${post.slug}`, locale)})`
    ),
    "",
    copy.servicesLinks,
    "",
    `- [${messages.services.freelance.label}](${getLandingPath("freelance", locale)})`,
    `- [${messages.services.industrial.label}](${getLandingPath("industrial", locale)})`,
  ].join("\n");

  // Il caso diventa una sequenza di sezioni come un post del blog:
  // stessi blocchi, stessa TOC. Le sezioni vuote restano fuori.
  const sections: Section[] = [
    { id: "intro", title: "", body: `${localized.summary}\n\n> [!NOTE] ${spotexNote}` },
    { id: "problema", title: copy.problem, body: localized.problem },
    {
      id: "vincoli",
      title: copy.constraints,
      body: localized.constraints.map((constraint) => `- ${constraint}`).join("\n"),
    },
    { id: "soluzione", title: copy.solution, body: localized.solution },
    { id: "risultati", title: copy.results, body: resultsBody },
    { id: "lezioni", title: copy.lessons, body: localized.lessons },
    { id: "approfondimenti", title: copy.related, body: linksBody },
  ].filter((section) => section.body.trim());

  const toc = sections
    .filter((section) => section.title)
    .map((section) => ({ id: section.id, text: section.title, level: 2 as const }));
  const hasToc = toc.length >= 3;

  // "Prossimo caso": quello successivo nell'indice, con wrap
  const allCases = getLocalizedCaseStudies(locale);
  const currentIndex = allCases.findIndex((item) => item.slug === localized.slug);
  const nextCase =
    allCases.length > 1 ? allCases[(currentIndex + 1) % allCases.length] : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: localized.title,
        description: localized.summary,
        image: [new URL(localized.cover, SITE_URL).toString()],
        datePublished: localized.publishedAt,
        dateModified: localized.updatedAt,
        author: {
          "@type": "Person",
          name: "Alessio Quagliara",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Person",
          name: "Alessio Quagliara",
        },
        sourceOrganization: {
          "@type": "Organization",
          name: localized.company,
        },
        // Cliente anonimo: niente entità con nome nel markup.
        ...(localized.anonymous
          ? {}
          : { about: { "@type": "Organization", name: localized.client } }),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: copy.breadcrumb,
            item: `${SITE_URL}/casi-studio`,
          },
          { "@type": "ListItem", position: 3, name: localized.title, item: pageUrl },
        ],
      },
    ],
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
            href={withLang("/casi-studio", locale)}
            className={buttonClass({ variant: "outline", className: "w-fit" })}
          >
            <span className="inline-flex items-center gap-2">
              <AnimatedFaIcon icon={faArrowLeft} animation="float" />
              <span>{copy.back}</span>
            </span>
          </Link>
        </div>

        <header className="max-w-4xl" data-reveal-item>
          <div className="flex flex-wrap gap-2">
            {!caseStudy.published ? (
              <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-medium text-[#b45309]">
                {copy.draft}
              </span>
            ) : null}
            {localized.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[#e5e7eb] bg-[#f1f5f9] px-3 py-1 text-xs font-medium text-[#1d4ed8]"
              >
                {tech}
              </span>
            ))}
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight text-[#0f172a] sm:text-6xl">
            {localized.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#4b5563]">{localized.client}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#6b7280]">
            <span className="inline-flex items-center gap-2">
              <AnimatedFaIcon icon={faBuilding} animation="pulse" />
              {localized.company}
              {localized.periodLabel ? ` · ${localized.periodLabel}` : ""}
            </span>
            {localized.role ? (
              <span className="inline-flex items-center gap-2">
                <AnimatedFaIcon icon={faUserGear} animation="pulse" />
                {localized.role}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <AnimatedFaIcon icon={faClock} animation="float" />
              {blog.readingTime.replace("{minutes}", String(localized.readingMinutes))}
            </span>
          </div>
        </header>

        <div
          className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-[#e5e7eb] bg-[#f1f5f9] shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]"
          data-reveal-item
        >
          <Image
            src={localized.cover}
            alt={localized.title}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
        </div>

        <div
          className={hasToc ? "article-layout article-layout--with-toc" : "article-layout"}
          data-reveal-item
        >
          <div className="article-main">
            <SectionBlocks
              sections={sections}
              calloutLabels={{
                takeaway: blog.callouts.takeaway,
                note: blog.callouts.note,
                tip: blog.callouts.tip,
                warning: blog.callouts.warning,
              }}
            />

            <ArticleCta
              nextPost={
                nextCase
                  ? {
                      href: withLang(`/casi-studio/${nextCase.slug}`, locale),
                      title: nextCase.title,
                    }
                  : undefined
              }
              newsletterHref={withLang("/contact", locale)}
              labels={{
                heading: copy.cta.heading,
                subtitle: copy.cta.subtitle,
                watchVideo: blog.cta.watchVideo,
                newsletterTitle: copy.cta.contactTitle,
                newsletterText: copy.cta.contactText,
                newsletterCta: copy.cta.contactCta,
                nextLabel: copy.cta.nextLabel,
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
