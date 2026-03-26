import type { Metadata } from "next";
import Link from "next/link";
import {
  faArrowRight,
  faBullseye,
  faCheck,
  faCircleInfo,
  faComments,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

import { SectionReveal } from "@/components/home/section-reveal";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";
import { getLocaleFromLang, getMessages, withLang } from "@/lib/i18n";

type AboutPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  searchParams,
}: AboutPageProps): Promise<Metadata> {
  const locale = getLocaleFromLang((await searchParams).lang);
  const metadata = getMessages(locale).site.about.metadata;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: "/about",
    },
  };
}

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const locale = getLocaleFromLang((await searchParams).lang);
  const about = getMessages(locale).site.about;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionReveal
        motionPreset="dynamic"
        className="rounded-3xl border border-[#8cb4ff]/24 bg-[radial-gradient(circle_at_top_left,rgba(67,120,255,0.2),transparent_36%),linear-gradient(180deg,rgba(8,24,60,0.92),rgba(4,14,38,0.95))] p-7 shadow-[0_30px_65px_-55px_rgba(2,12,32,1)] sm:p-10"
      >
        <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight sm:text-5xl" data-reveal-item>
          <AnimatedFaIcon icon={faCircleInfo} animation="shimmer" className="text-2xl text-[#cde0ff] sm:text-3xl" />
          <span>{about.title}</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-50/90" data-reveal-item>{about.intro}</p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {about.sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-2xl border border-white/12 bg-[#081d48]/45 p-5 shadow-[0_20px_40px_-35px_rgba(2,12,32,1)]"
              data-reveal-item
              data-parallax
            >
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <AnimatedFaIcon
                  icon={index % 2 === 0 ? faBullseye : faLayerGroup}
                  animation={index % 2 === 0 ? "pulse" : "float"}
                  className="text-sm text-[#d2e4ff]"
                />
                <span>{section.title}</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-blue-100/90">{section.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-[#c8dbff]/75 bg-white/90 p-6 text-[#12347d] shadow-[0_22px_46px_-36px_rgba(18,52,125,0.35)] sm:p-8" data-reveal-item>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#4a6daf]">
            <AnimatedFaIcon icon={faLayerGroup} animation="orbit" className="text-[#4368ae]" />
            <span>{about.focusAreasTitle}</span>
          </p>
          <ul className="mt-6 grid gap-3 text-sm leading-7 text-[#21467f] sm:grid-cols-2 lg:grid-cols-3">
            {about.focusAreas.map((area) => (
              <li key={area} className="flex items-center gap-2 rounded-xl border border-[#d7e5ff] bg-[#f7fbff] px-4 py-3">
                <AnimatedFaIcon icon={faCheck} animation="shimmer" className="text-xs text-[#2d5ab5]" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-4xl leading-8 text-[#21467f]">{about.closing}</p>
        </div>

        <div className="mt-10 rounded-3xl border border-[#8cb4ff]/28 bg-[#0a2152]/38 p-6 shadow-[0_24px_50px_-40px_rgba(2,12,32,1)] sm:p-8" data-reveal-item>
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
            <AnimatedFaIcon icon={faComments} animation="pulse" className="text-[#d1e4ff]" />
            <span>{about.cta.title}</span>
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-blue-100/90">{about.cta.text}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="https://calendly.com/quagliara-alessio/meeting-conoscitivo"
              target="_blank"
              rel="noreferrer"
              className={buttonClass({ variant: "primary", size: "lg" })}
            >
              <span className="inline-flex items-center gap-2">
                <AnimatedFaIcon icon={faArrowRight} animation="float" />
                <span>{about.cta.primary}</span>
              </span>
            </Link>
            <Link
              href={withLang("/contact", locale)}
              className={buttonClass({ variant: "secondary", size: "lg" })}
            >
              <span className="inline-flex items-center gap-2">
                <AnimatedFaIcon icon={faComments} animation="pulse" />
                <span>{about.cta.secondary}</span>
              </span>
            </Link>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
