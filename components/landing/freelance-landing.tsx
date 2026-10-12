import Link from "next/link";
import {
  faArrowRightArrowLeft,
  faCircleQuestion,
  faDiagramProject,
  faEnvelope,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";

import { BeforeAfter } from "@/components/landing/before-after";
import { getLandingData } from "@/components/landing/landing-data";
import {
  CtaLink,
  FaqList,
  FinalCta,
  JsonLd,
  LandingHero,
  LandingSection,
  ProcessSteps,
  SectionHeader,
} from "@/components/landing/landing-ui";
import { QuickContactForm } from "@/components/landing/quick-contact-form";
import { TimeCalculator } from "@/components/landing/time-calculator";
import { UseCaseTabs } from "@/components/landing/use-case-tabs";
import type { Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site-config";

export function FreelanceLanding({ locale }: { locale: Locale }) {
  const { content, common, pilotBadge, faq, hrefs, jsonLd } = getLandingData("freelance", locale);
  const { hero, calculator, useCases, compare, process, finalCta, crossLink } = content;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-24 sm:gap-14 sm:px-6 sm:pb-28">
      <JsonLd data={jsonLd} />

      <LandingHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        badge={pilotBadge}
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
          <TimeCalculator
            title={calculator.title}
            intro={calculator.intro}
            tasks={calculator.tasks}
            perWeek={calculator.perWeek}
            perMonth={calculator.perMonth}
            empty={calculator.empty}
            note={calculator.note}
            locale={locale === "it" ? "it-IT" : "en-GB"}
          />
        }
      />

      <LandingSection id="use-cases" tone="dark">
        <SectionHeader
          id="use-cases"
          tone="dark"
          eyebrow={useCases.eyebrow}
          icon={faDiagramProject}
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

      <LandingSection id="compare" tone="light">
        <SectionHeader
          id="compare"
          tone="light"
          eyebrow={compare.eyebrow}
          icon={faArrowRightArrowLeft}
          title={compare.title}
        />
        <div className="mt-8" data-reveal-item>
          <BeforeAfter
            beforeLabel={compare.beforeLabel}
            afterLabel={compare.afterLabel}
            before={compare.before}
            after={compare.after}
          />
        </div>
      </LandingSection>

      <LandingSection id="method" tone="dark">
        <SectionHeader id="method" tone="dark" eyebrow={process.eyebrow} icon={faRoute} title={process.title} />
        <div className="mt-10">
          <ProcessSteps steps={process.steps} />
        </div>
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
        aside={
          <QuickContactForm
            email={CONTACT_EMAIL}
            title={finalCta.form.title}
            nameLabel={finalCta.form.nameLabel}
            flowLabel={finalCta.form.flowLabel}
            flowPlaceholder={finalCta.form.flowPlaceholder}
            submit={finalCta.form.submit}
            note={finalCta.form.note}
            subject={finalCta.form.subject}
          />
        }
      >
        <CtaLink href={hrefs.calendly} newTabLabel={common.newTab}>
          {finalCta.primaryCta}
        </CtaLink>
      </FinalCta>
    </div>
  );
}
