import type { Metadata } from "next";
import Image from "next/image";
import {
  faAward,
  faBookOpen,
  faCalendarDays,
  faCheck,
  faGraduationCap,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

import { SectionReveal } from "@/components/home/section-reveal";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { getLocaleFromLang, getMessages } from "@/lib/i18n";

type FormazionePageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  searchParams,
}: FormazionePageProps): Promise<Metadata> {
  const locale = getLocaleFromLang((await searchParams).lang);
  const metadata = getMessages(locale).site.education.metadata;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: "/formazione",
    },
  };
}

export default async function FormazionePage({ searchParams }: FormazionePageProps) {
  const locale = getLocaleFromLang((await searchParams).lang);
  const education = getMessages(locale).site.education;
  const learningYears = new Date().getFullYear() - 1998;
  const learningStatement = education.learningStatement.includes("{years}")
    ? education.learningStatement.replace("{years}", String(learningYears))
    : education.learningStatement;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionReveal
        motionPreset="dynamic"
        className="rounded-3xl border border-[#8cb4ff]/24 bg-[radial-gradient(circle_at_top_left,rgba(67,120,255,0.2),transparent_36%),linear-gradient(180deg,rgba(8,24,60,0.92),rgba(4,14,38,0.95))] p-7 shadow-[0_30px_65px_-55px_rgba(2,12,32,1)] sm:p-10"
      >
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#c9ddff]" data-reveal-item>
          <AnimatedFaIcon icon={faGraduationCap} animation="shimmer" className="text-[#d5e7ff]" />
          <span>{education.eyebrow}</span>
        </p>
        <h1 className="mt-4 flex max-w-4xl items-center gap-3 text-3xl font-bold tracking-tight sm:text-5xl" data-reveal-item>
          <AnimatedFaIcon icon={faGraduationCap} animation="float" className="text-xl text-[#d1e4ff] sm:text-3xl" />
          <span>{education.title}</span>
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-blue-50/90 sm:text-lg sm:leading-8" data-reveal-item>
          {education.intro}
        </p>
        <p className="mt-7 max-w-4xl rounded-xl border border-[#8cb4ff]/35 bg-[#081d48]/56 px-5 py-4 text-sm leading-7 text-blue-100/95" data-reveal-item>
          <span className="inline-flex items-start gap-2">
            <AnimatedFaIcon icon={faLightbulb} animation="pulse" className="mt-1 text-[#d4e7ff]" />
            <span>{learningStatement}</span>
          </span>
        </p>
        <div className="mt-9 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {education.pillars.map((pillar) => (
            <p
              key={pillar}
              className="flex items-center gap-2 rounded-xl border border-[#8cb4ff]/35 bg-[#0a255d]/42 px-4 py-3 text-sm font-semibold text-[#e5efff]"
              data-reveal-item
            >
              <AnimatedFaIcon icon={faCheck} animation="shimmer" className="text-xs text-[#d8e8ff]" />
              <span>{pillar}</span>
            </p>
          ))}
        </div>
      </SectionReveal>

      <div className="mt-8 grid gap-6">
      {education.items.map((item, index) => {
        const isLightBand = index % 2 === 1;

        return (
          <SectionReveal
            key={`${item.institution}-${item.period}`}
            motionPreset="dynamic"
            className={`rounded-3xl border p-6 shadow-[0_20px_40px_-34px_rgba(2,12,32,1)] sm:p-8 ${
              isLightBand
                ? "border-[#cadeff] bg-[#f6faff] text-[#12347d]"
                : "border-white/12 bg-[#081d48]/52 text-[#e9f2ff]"
            }`}
          >
            <article data-reveal-item>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className={`inline-flex items-center gap-2 text-sm font-medium ${isLightBand ? "text-[#2f4f97]" : "text-[#d7e7ff]"}`}>
                  <AnimatedFaIcon
                    icon={faCalendarDays}
                    animation="float"
                    className={isLightBand ? "text-[#2f4f97]" : "text-[#d7e7ff]"}
                  />
                  <span>{item.period}</span>
                </p>
                {item.status ? (
                  <span
                    className={`inline-flex items-center gap-2 border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] sm:text-xs ${
                      isLightBand
                        ? "border-[#b9d0ff] bg-[#ebf2ff] text-[#2e5ab6]"
                        : "border-[#8cb4ff]/35 bg-[#1e4fb8]/35 text-[#d7e7ff]"
                    }`}
                  >
                    <AnimatedFaIcon icon={faAward} animation="pulse" className="text-[10px]" />
                    <span>{item.status}</span>
                  </span>
                ) : null}
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <p className={`text-[11px] uppercase tracking-[0.14em] sm:text-sm ${isLightBand ? "text-[#32579f]" : "text-[#c7dcff]"}`}>
                    {item.institution}
                  </p>
                  <h2 className={`mt-2 flex items-center gap-2 text-xl font-semibold sm:text-2xl ${isLightBand ? "text-[#0e2f73]" : "text-white"}`}>
                    <AnimatedFaIcon
                      icon={faGraduationCap}
                      animation="shimmer"
                      className={isLightBand ? "text-[#2d5ab6]" : "text-[#d6e8ff]"}
                    />
                    <span>{item.title}</span>
                  </h2>
                  <p className={`mt-3 max-w-3xl text-sm leading-7 sm:mt-4 sm:text-base ${isLightBand ? "text-[#214687]" : "text-blue-100/95"}`}>
                    {item.description}
                  </p>
                </div>

                {item.image ? (
                  <div
                    className={`relative h-20 w-20 shrink-0 rounded-sm border sm:h-24 sm:w-24 ${
                      isLightBand ? "border-[#d1e0ff] bg-[#f5f9ff]" : "border-white/15 bg-[#06163c]/70"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.institution}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </div>
                ) : null}
              </div>

              <ul className="mt-7 grid gap-3 text-[13px] leading-6 sm:mt-8 sm:grid-cols-2 sm:text-sm lg:grid-cols-4">
                {item.topics.map((topic) => (
                  <li
                    key={topic}
                    className={`flex items-center gap-2 border-b pb-2 ${
                      isLightBand ? "border-[#b9d1f8] text-[#214687]" : "border-white/25 text-blue-100/95"
                    }`}
                  >
                    <AnimatedFaIcon icon={faBookOpen} animation="pulse" className="text-[11px]" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </article>
          </SectionReveal>
        );
      })}
      </div>
    </section>
  );
}
