import Link from "next/link";
import {
  faCircleQuestion,
  faClock,
  faEnvelope,
  faIndustry,
  faPlug,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";

import { getLandingData } from "@/components/landing/landing-data";
import {
  CtaLink,
  FaqList,
  FinalCta,
  JsonLd,
  LandingHero,
  LandingSection,
  SectionHeader,
} from "@/components/landing/landing-ui";
import { UseCaseTabs } from "@/components/landing/use-case-tabs";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import type { Locale } from "@/lib/i18n";

/** Icona e taglio della bento grid delle garanzie, nello stesso ordine dei testi. */
const GUARANTEE_LAYOUT = [
  { icon: faPlug, span: "lg:col-span-2 lg:row-span-2" },
  { icon: faClock, span: "" },
  { icon: faUnlock, span: "" },
];

export function IndustrialLanding({ locale }: { locale: Locale }) {
  const { content, common, pilotBadge, faq, hrefs, jsonLd } = getLandingData("industrial", locale);
  const { hero, useCases, guarantees, finalCta, crossLink } = content;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-24 sm:gap-14 sm:px-6 sm:pb-28">
      <JsonLd data={jsonLd} />

      <LandingHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        badge={hero.badge}
        microcopy={hero.microcopy}
        actions={
          <>
            <CtaLink href={hrefs.calendly} newTabLabel={common.newTab}>
              {hero.primaryCta}
            </CtaLink>
            <CtaLink href={hrefs.email} variant="secondary">
              {hero.secondaryCta}
            </CtaLink>
          </>
        }
        visual={
          <figure className="rounded-4xl border border-[#8cb4ff]/25 bg-[#081d48]/55 p-6 shadow-[0_30px_65px_-55px_rgba(2,12,32,1)] backdrop-blur-sm sm:p-8">
            <figcaption className="text-xs uppercase tracking-[0.24em] text-[#c9ddff]">
              {hero.visualTitle}
            </figcaption>
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {hero.visualSystems.map((system) => (
                <li
                  key={system}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center text-sm text-[#edf4ff]"
                >
                  {system}
                </li>
              ))}
            </ul>
            <div aria-hidden="true" className="my-3 flex justify-around text-[#9cbcff]">
              <span>↓</span>
              <span>↓</span>
            </div>
            <p className="rounded-xl border border-[#8cb4ff]/45 bg-[#1f55ca]/45 px-4 py-3 text-center text-sm font-semibold text-white">
              {hero.visualLayer}
            </p>
            <div aria-hidden="true" className="my-3 text-center text-[#9cbcff]">
              ↓
            </div>
            <p className="rounded-xl border border-[#9be3c0]/40 bg-[#0f5c45]/40 px-4 py-3 text-center text-sm text-[#e3fff2]">
              {hero.visualOutcome}
            </p>
          </figure>
        }
      />

      <LandingSection id="use-cases" tone="dark">
        <SectionHeader
          id="use-cases"
          tone="dark"
          eyebrow={useCases.eyebrow}
          icon={faIndustry}
          title={useCases.title}
        />
        <p
          className="mt-5 inline-flex rounded-full border border-[#ffd59a]/50 bg-[#ffd59a]/10 px-3 py-1 text-xs font-medium text-[#ffe2b8]"
          data-reveal-item
        >
          {common.illustrativeLabel}
        </p>
        <div className="mt-8" data-reveal-item>
          <UseCaseTabs labels={useCases.labels} items={useCases.items} />
        </div>
      </LandingSection>

      <LandingSection id="method" tone="light">
        <SectionHeader
          id="method"
          tone="light"
          eyebrow={guarantees.eyebrow}
          icon={faPlug}
          title={guarantees.title}
        />
        <ul className="mt-10 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          {guarantees.items.map((item, index) => {
            const layout = GUARANTEE_LAYOUT[index % GUARANTEE_LAYOUT.length];
            return (
              <li key={item.title} className={`guarantee-card ${layout.span}`} data-reveal-item>
                <span className="guarantee-card__icon">
                  <AnimatedFaIcon icon={layout.icon} animation="pulse" />
                </span>
                <h3 className={`mt-6 font-bold text-[#102e66] ${index === 0 ? "text-2xl sm:text-3xl" : "text-xl"}`}>
                  {item.title}
                </h3>
                <p className={`mt-3 leading-7 text-[#35548c] ${index === 0 ? "max-w-md text-base sm:text-lg sm:leading-8" : "text-sm"}`}>
                  {item.text}
                </p>
                {index === 0 ? (
                  // I sistemi che restano dove sono, collegati da uno strato sopra.
                  <div className="mt-8 lg:mt-auto lg:pt-8" aria-hidden="true">
                    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {hero.visualSystems.map((system) => (
                        <li
                          key={system}
                          className="rounded-xl border border-[#d8e6ff] bg-[#f5f9ff] px-3 py-2.5 text-center text-xs font-semibold text-[#24498f]"
                        >
                          {system}
                        </li>
                      ))}
                    </ul>
                    <div className="my-2 hidden grid-cols-4 text-center text-[#5b7fc4] sm:grid">
                      <span>↓</span>
                      <span>↓</span>
                      <span>↓</span>
                      <span>↓</span>
                    </div>
                    <p className="rounded-xl bg-[#2664eb] px-4 py-3 text-center text-sm font-semibold text-white">
                      {hero.visualLayer}
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </LandingSection>

      <LandingSection id="faq" tone="light">
        <SectionHeader
          id="faq"
          tone="light"
          eyebrow={common.faqEyebrow}
          icon={faCircleQuestion}
          title={content.faq.title}
        />
        <FaqList items={faq} />
        <p className="mt-8 text-sm leading-7 text-[#35548c]" data-reveal-item>
          {crossLink.text}{" "}
          <Link
            href={hrefs.otherLanding}
            className="font-semibold text-[#1d4ed8] underline underline-offset-4 hover:text-[#1e3a8a]"
          >
            {crossLink.label}
          </Link>
        </p>
      </LandingSection>

      <FinalCta
        id="contact"
        eyebrow={common.contactLink}
        icon={faEnvelope}
        title={finalCta.title}
        text={finalCta.text}
        pilotBadge={pilotBadge}
      >
        <CtaLink href={hrefs.calendly} newTabLabel={common.newTab}>
          {finalCta.primaryCta}
        </CtaLink>
        <CtaLink href={hrefs.email} variant="secondary">
          {hero.secondaryCta}
        </CtaLink>
      </FinalCta>
    </div>
  );
}
