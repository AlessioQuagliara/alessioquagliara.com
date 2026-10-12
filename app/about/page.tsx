import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  faArrowRight,
  faBullhorn,
  faComments,
  faCompass,
  faLayerGroup,
  faMicrochip,
  faRoute,
  faScrewdriverWrench,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

import { AboutStack } from "@/components/about/about-stack";
import { AboutTimeline } from "@/components/about/about-timeline";
import { SectionReveal } from "@/components/home/section-reveal";
import { ServiceLinks } from "@/components/landing/service-links";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";
import { getLocaleFromLang, getMessages, withLang } from "@/lib/i18n";
import { CALENDLY_URL } from "@/lib/site-config";

type AboutPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

/** Icona e taglio della bento grid, nello stesso ordine dei principi. */
const PRINCIPLE_LAYOUT = [
  { icon: faScrewdriverWrench, span: "lg:col-span-4" },
  { icon: faBullhorn, span: "lg:col-span-2" },
  { icon: faMicrochip, span: "lg:col-span-2" },
  { icon: faShieldHalved, span: "lg:col-span-4" },
];

/** Posizione dei badge fluttuanti attorno alla foto. */
const BADGE_POSITIONS = [
  "left-[-6%] top-[8%]",
  "right-[-8%] top-[14%]",
  "left-[-10%] top-[46%]",
  "right-[-4%] top-[52%]",
  "left-[2%] bottom-[6%]",
  "right-[6%] bottom-[-2%]",
];

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
  const { hero, principles, timeline, stack, cta } = getMessages(locale).site.about;

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-6 py-16 sm:space-y-28 sm:py-24">
      {/* Hero: testo a sinistra, foto con i badge a destra. */}
      <SectionReveal motionPreset="dynamic" className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p
            className="inline-flex items-center gap-2 rounded-full border border-[#7cf0b5]/30 bg-[#7cf0b5]/10 px-3.5 py-1.5 text-xs font-medium text-[#d9ffe9]"
            data-reveal-item
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7cf0b5] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7cf0b5]" />
            </span>
            {hero.status}
          </p>
          <h1
            className="mt-6 max-w-[19ch] text-4xl font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl"
            data-reveal-item
          >
            {hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#dbe8ff]" data-reveal-item>
            {hero.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-4" data-reveal-item>
            <Link
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className={buttonClass({ variant: "primary", size: "lg" })}
            >
              {hero.primary}
            </Link>
            <Link href={withLang("/projects", locale)} className={buttonClass({ variant: "secondary", size: "lg" })}>
              {hero.secondary}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[16rem] sm:max-w-sm" data-reveal-item>
          <div
            className="absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgba(67,120,255,0.45),transparent_65%)] blur-2xl"
            aria-hidden="true"
          />
          <Image
            src="/profile_image.jpg"
            alt={hero.photoAlt}
            width={800}
            height={800}
            sizes="(min-width: 1024px) 384px, 80vw"
            loading="eager"
            fetchPriority="high"
            className="relative aspect-square w-full rounded-[2.5rem] border border-white/15 object-cover shadow-[0_40px_80px_-45px_rgba(2,12,32,1)]"
          />
          <ul aria-hidden="true">
            {hero.badges.map((badge, index) => (
              <li
                key={badge}
                className={`about-float absolute ${BADGE_POSITIONS[index % BADGE_POSITIONS.length]}`}
                style={{ animationDelay: `${index * -1.1}s` }}
              >
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </SectionReveal>

      {/* Principi: bento grid. */}
      <SectionReveal motionPreset="dynamic">
        <p className="about-eyebrow" data-reveal-item>
          <AnimatedFaIcon icon={faCompass} animation="orbit" />
          {principles.eyebrow}
        </p>
        <h2 className="about-heading" data-reveal-item>{principles.title}</h2>
        <ul className="mt-10 grid gap-4 lg:grid-cols-6">
          {principles.items.map((item, index) => {
            const layout = PRINCIPLE_LAYOUT[index % PRINCIPLE_LAYOUT.length];
            return (
              <li key={item.title} className={`about-bento ${layout.span}`} data-reveal-item>
                <span className="about-bento__icon">
                  <AnimatedFaIcon icon={layout.icon} animation="pulse" />
                </span>
                <h3 className="mt-6 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-7 text-[#c9ddff]">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </SectionReveal>

      {/* Percorso: timeline a tab. */}
      <SectionReveal motionPreset="dynamic">
        <p className="about-eyebrow" data-reveal-item>
          <AnimatedFaIcon icon={faRoute} animation="float" />
          {timeline.eyebrow}
        </p>
        <h2 className="about-heading" data-reveal-item>{timeline.title}</h2>
        <div className="mt-8" data-reveal-item>
          <AboutTimeline tabs={timeline.tabs} />
        </div>
      </SectionReveal>

      {/* Competenze filtrabili. */}
      <SectionReveal motionPreset="dynamic">
        <p className="about-eyebrow" data-reveal-item>
          <AnimatedFaIcon icon={faLayerGroup} animation="float" />
          {stack.eyebrow}
        </p>
        <h2 className="about-heading" data-reveal-item>{stack.title}</h2>
        <div className="mt-8" data-reveal-item>
          <AboutStack
            hint={stack.hint}
            filtersLabel={stack.filtersLabel}
            allLabel={stack.all}
            categories={stack.categories}
            items={stack.items}
          />
        </div>
      </SectionReveal>

      <SectionReveal
        motionPreset="dynamic"
        className="rounded-3xl border border-[#8cb4ff]/28 bg-[radial-gradient(circle_at_top_left,rgba(67,120,255,0.2),transparent_40%),linear-gradient(180deg,rgba(8,24,60,0.92),rgba(4,14,38,0.95))] p-7 shadow-[0_30px_65px_-55px_rgba(2,12,32,1)] sm:p-10"
      >
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-white" data-reveal-item>
          <AnimatedFaIcon icon={faComments} animation="pulse" className="text-[#d1e4ff]" />
          <span>{cta.title}</span>
        </h2>
        <p className="mt-4 max-w-3xl leading-8 text-blue-100/90" data-reveal-item>{cta.text}</p>
        <div className="mt-8 flex flex-wrap gap-4" data-reveal-item>
          <Link
            href={CALENDLY_URL}
            target="_blank"
            rel="noreferrer"
            className={buttonClass({ variant: "primary", size: "lg" })}
          >
            <span className="inline-flex items-center gap-2">
              <AnimatedFaIcon icon={faArrowRight} animation="float" />
              <span>{cta.primary}</span>
            </span>
          </Link>
          <Link href={withLang("/contact", locale)} className={buttonClass({ variant: "secondary", size: "lg" })}>
            <span className="inline-flex items-center gap-2">
              <AnimatedFaIcon icon={faComments} animation="pulse" />
              <span>{cta.secondary}</span>
            </span>
          </Link>
        </div>
        <div className="mt-10" data-reveal-item>
          <ServiceLinks locale={locale} tone="dark" showIntro={false} />
        </div>
      </SectionReveal>
    </div>
  );
}
