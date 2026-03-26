import Link from "next/link";
import {
  faBrain,
  faCode,
  faCubes,
  faEnvelope,
  faFolderOpen,
  faGaugeHigh,
  faIndustry,
  faLightbulb,
  faLink,
  faMicrochip,
  faRocket,
  faScaleBalanced,
  faServer,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";

import { SectionReveal } from "@/components/home/section-reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";
import { type Messages, withLang, type Locale } from "@/lib/i18n";
import type { GithubRepo } from "@/types/github";

type HomeSectionsProps = {
  locale: Locale;
  repos: GithubRepo[];
  noDescriptionLabel: string;
  content: Messages["site"]["home"]["sections"];
};

export function HomeSections({ locale, repos, noDescriptionLabel, content }: HomeSectionsProps) {
  const whatIBuildIcons = [faRocket, faLink, faMicrochip];
  const howIWorkIcons = [faScaleBalanced, faGaugeHigh, faIndustry];
  const technicalFocusIcons = [faCode, faServer, faBrain, faMicrochip];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 sm:gap-14 sm:pb-28">
      <SectionReveal motionPreset="dynamic" className="rounded-4xl border border-[#bfd5ff]/45 bg-[#f5f9ff] text-[#12347d] shadow-[0_45px_100px_-70px_rgba(2,12,32,1)]">
        <div className="px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
        <div className="max-w-3xl" data-parallax>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#4a6daf]" data-reveal-item>
            <AnimatedFaIcon icon={faCubes} animation="shimmer" className="text-[#3f66ad]" />
            <span>{content.whatIBuild.title}</span>
          </p>
          <p className="mt-4 text-lg leading-8 text-[#163670]" data-reveal-item>
            {content.whatIBuild.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {content.whatIBuild.cards.map((card, index) => (
            <article
              key={card.title}
              data-reveal-item
              data-parallax
              className="rounded-[1.7rem] border border-[#d8e6ff] bg-white p-6 shadow-[0_25px_65px_-52px_rgba(15,52,125,0.55)]"
            >
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-[#102e66]">
                <AnimatedFaIcon
                  icon={whatIBuildIcons[index % whatIBuildIcons.length]}
                  animation="float"
                  className="text-base text-[#2e5bb6]"
                />
                <span>{card.title}</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#35548c]">{card.text}</p>
            </article>
          ))}
        </div>
        </div>
      </SectionReveal>

      <SectionReveal motionPreset="dynamic" className="rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(87,145,255,0.22),transparent_30%),linear-gradient(180deg,rgba(10,31,78,0.92),rgba(5,17,42,0.94))] shadow-[0_45px_100px_-70px_rgba(2,12,32,1)]">
        <div className="grid gap-8 px-8 py-10 sm:px-10 sm:py-12 lg:grid-cols-[0.72fr_1.28fr] lg:px-12 lg:py-14">
        <div className="max-w-md lg:sticky lg:top-28 lg:self-start" data-parallax>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#c9ddff]" data-reveal-item>
            <AnimatedFaIcon icon={faLightbulb} animation="pulse" className="text-[#d8e8ff]" />
            <span>{content.howIWork.title}</span>
          </p>
          <p className="mt-4 text-lg leading-8 text-[#edf4ff]" data-reveal-item>
            {content.howIWork.subtitle}
          </p>
          <p className="mt-8 max-w-sm text-2xl font-semibold leading-9 text-white" data-reveal-item>
            {content.howIWork.quote}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {content.howIWork.cards.map((card, index) => (
            <article
              key={card.title}
              data-reveal-item
              data-parallax
              className="rounded-3xl border border-white/10 bg-[#07173c]/40 p-6"
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <AnimatedFaIcon
                  icon={howIWorkIcons[index % howIWorkIcons.length]}
                  animation="shimmer"
                  className="text-sm text-[#cfe2ff]"
                />
                <span>{card.title}</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#d8e7ff]">{card.text}</p>
            </article>
          ))}
        </div>
        </div>
      </SectionReveal>

      <SectionReveal motionPreset="dynamic" className="rounded-4xl border border-[#bfd5ff]/45 bg-[#f7fbff] text-[#12347d] shadow-[0_45px_100px_-70px_rgba(2,12,32,1)]">
        <div className="px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl" data-parallax>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#4a6daf]" data-reveal-item>
              <AnimatedFaIcon icon={faFolderOpen} animation="pulse" className="text-[#3e63ab]" />
              <span>{content.selectedProjects.title}</span>
            </p>
            <p className="mt-4 text-lg leading-8 text-[#163670]" data-reveal-item>
              {content.selectedProjects.subtitle}
            </p>
            <p className="mt-4 text-sm leading-7 text-[#35548c]" data-reveal-item>
              {content.selectedProjects.intro}
            </p>
            <p className="mt-4 text-sm font-medium text-[#446bb1]" data-reveal-item>
              {content.selectedProjects.eyebrow}
            </p>
          </div>

          <Link
            href={withLang("/projects", locale)}
            className={buttonClass({ variant: "secondary", className: "self-start lg:self-auto" })}
            data-reveal-item
          >
            {content.selectedProjects.allProjects}
          </Link>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {repos.map((repo) => (
            <div key={repo.id} data-reveal-item data-parallax>
              <ProjectCard
                repo={repo}
                locale={locale}
                noDescriptionLabel={noDescriptionLabel}
              />
            </div>
          ))}
        </div>
        </div>
      </SectionReveal>

      <SectionReveal motionPreset="dynamic" className="rounded-4xl border border-white/10 bg-[linear-gradient(145deg,#06112a_0%,#0e2e73_55%,#1f55ca_100%)] shadow-[0_45px_100px_-70px_rgba(2,12,32,1)]">
        <div className="grid gap-8 px-8 py-10 sm:px-10 sm:py-12 lg:grid-cols-[0.72fr_1.28fr] lg:px-12 lg:py-14">
        <div className="max-w-md lg:sticky lg:top-28 lg:self-start" data-parallax>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#c9ddff]" data-reveal-item>
            <AnimatedFaIcon icon={faSitemap} animation="float" className="text-[#d8e8ff]" />
            <span>{content.technicalFocus.title}</span>
          </p>
          <p className="mt-4 text-lg leading-8 text-[#edf4ff]" data-reveal-item>
            {content.technicalFocus.subtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {content.technicalFocus.blocks.map((block, index) => (
            <article
              key={block.title}
              data-reveal-item
              data-parallax
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <AnimatedFaIcon
                  icon={technicalFocusIcons[index % technicalFocusIcons.length]}
                  animation="orbit"
                  className="text-sm text-[#d5e6ff]"
                />
                <span>{block.title}</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#d8e7ff]">{block.text}</p>
            </article>
          ))}
        </div>
        </div>
      </SectionReveal>

      <SectionReveal motionPreset="dynamic" className="rounded-[2.2rem] border border-[#8cb4ff]/18 bg-[radial-gradient(circle_at_top_left,rgba(67,120,255,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_45px_100px_-70px_rgba(2,12,32,1)] backdrop-blur-md">
        <div className="px-8 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        <div className="max-w-3xl" data-parallax>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#c9ddff]" data-reveal-item>
            <AnimatedFaIcon icon={faEnvelope} animation="pulse" className="text-[#d7e8ff]" />
            <span>{content.contactCta.title}</span>
          </p>
          <p className="mt-5 text-lg leading-8 text-[#edf4ff]" data-reveal-item>
            {content.contactCta.text}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4" data-reveal-item>
          <Link
            href="https://calendly.com/quagliara-alessio/meeting-conoscitivo"
            target="_blank"
            rel="noreferrer"
            className={buttonClass({ variant: "primary", size: "lg" })}
          >
            {content.contactCta.primary}
          </Link>

          <Link
            href={withLang("/contact", locale)}
            className={buttonClass({ variant: "secondary", size: "lg" })}
          >
            {content.contactCta.secondary}
          </Link>
        </div>
        </div>
      </SectionReveal>
    </div>
  );
}
