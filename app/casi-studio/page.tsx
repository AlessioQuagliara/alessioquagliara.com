import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { faBriefcase, faBuilding, faClock } from "@fortawesome/free-solid-svg-icons";

import { SectionReveal } from "@/components/home/section-reveal";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";
import { getLocalizedCaseStudies } from "@/lib/case-studies";
import { getLocaleFromLang, getMessages, withLang } from "@/lib/i18n";

type CaseStudiesPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  searchParams,
}: CaseStudiesPageProps): Promise<Metadata> {
  const locale = getLocaleFromLang((await searchParams).lang);
  const metadata = getMessages(locale).site.caseStudies.metadata;
  const hasCases = getLocalizedCaseStudies(locale).length > 0;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: "/casi-studio",
    },
    // Una pagina vuota non deve finire su Google.
    robots: hasCases ? undefined : { index: false, follow: true },
  };
}

export default async function CaseStudiesPage({ searchParams }: CaseStudiesPageProps) {
  const locale = getLocaleFromLang((await searchParams).lang);
  const { caseStudies: copy, blog } = getMessages(locale).site;
  const caseStudies = getLocalizedCaseStudies(locale);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionReveal motionPreset="dynamic" className="space-y-12">
        <div className="max-w-3xl" data-reveal-item>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#1d4ed8]">
            <AnimatedFaIcon icon={faBriefcase} animation="shimmer" className="text-[#1d4ed8]" />
            <span>{copy.eyebrow}</span>
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#0f172a] sm:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4b5563]">
            {copy.description}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-1.5 text-sm font-medium text-[#6b7280]">
            {copy.microcopy}
          </p>
        </div>

        {caseStudies.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3" data-reveal-item>
            {caseStudies.map((caseStudy, index) => (
              <article
                key={caseStudy.slug}
                className="blog-card overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)]"
              >
                <Link
                  href={withLang(`/casi-studio/${caseStudy.slug}`, locale)}
                  className="group blog-card__link"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#07173c]">
                    <Image
                      src={caseStudy.cover}
                      alt={caseStudy.client}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06112a]/76 to-transparent" />
                  </div>
                  <div className="blog-card__body p-6">
                    <div className="flex flex-wrap gap-2">
                      {!caseStudy.published ? (
                        <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-medium text-[#b45309]">
                          {copy.draft}
                        </span>
                      ) : null}
                      {caseStudy.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-[#e5e7eb] bg-[#f1f5f9] px-3 py-1 text-xs font-medium text-[#1d4ed8]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-5 text-xl font-semibold leading-7 text-[#111827]">
                      {caseStudy.title}
                    </h2>
                    <p className="blog-card__excerpt mt-3 text-[0.95rem] leading-7 text-[#4b5563]">
                      {caseStudy.summary}
                    </p>
                    {caseStudy.results[0] ? (
                      <p className="mt-5 rounded-2xl bg-[#f1f5f9] px-4 py-3 text-sm text-[#0f172a]">
                        <span className="font-bold">{caseStudy.results[0].value}</span>{" "}
                        <span className="text-[#4b5563]">{caseStudy.results[0].label}</span>
                      </p>
                    ) : null}
                    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#6b7280]">
                      <span className="inline-flex items-center gap-2">
                        <AnimatedFaIcon icon={faBuilding} animation="pulse" />
                        {caseStudy.client}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <AnimatedFaIcon icon={faClock} animation="float" />
                        {blog.readingTime.replace("{minutes}", String(caseStudy.readingMinutes))}
                      </span>
                    </div>
                    <span className={buttonClass({ variant: "outline", className: "mt-6" })}>
                      {copy.readCase}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-[#e5e7eb] bg-white p-6 text-[#4b5563]">
            {copy.empty}
          </p>
        )}
      </SectionReveal>
    </section>
  );
}
