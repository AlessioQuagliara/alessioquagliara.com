import {
  faBrain,
  faCircleQuestion,
  faCompass,
  faEnvelope,
  faIndustry,
  faLayerGroup,
  faRoute,
  faTriangleExclamation,
  faUser,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";

import { getLandingData } from "@/components/landing/landing-data";
import {
  CheckList,
  CredibilityBlock,
  CtaLink,
  FaqList,
  FinalCta,
  FitColumns,
  FlowChain,
  JsonLd,
  LandingHero,
  LandingSection,
  SectionHeader,
  StepList,
} from "@/components/landing/landing-ui";
import type { Locale } from "@/lib/i18n";

export function IndustrialLanding({ locale }: { locale: Locale }) {
  const { content, common, pilotBadge, faq, related, primaryCtaLabel, hrefs, jsonLd } =
    getLandingData("industrial", locale);
  const { hero, problem, build, constraint, method, scenarios, ai, fit, credibility, finalCta } =
    content;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-24 sm:gap-14 sm:px-6 sm:pb-28">
      <JsonLd data={jsonLd} />

      <LandingHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        pilotBadge={pilotBadge}
        microcopy={hero.microcopy}
        actions={
          <>
            <CtaLink href={hrefs.calendly} newTabLabel={common.newTab}>
              {primaryCtaLabel}
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

      <LandingSection id="problem" tone="light">
        <SectionHeader
          id="problem"
          tone="light"
          eyebrow={problem.eyebrow}
          icon={faTriangleExclamation}
          title={problem.title}
          intro={problem.intro}
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problem.frictions.map((friction, index) => (
            <li key={friction.title} data-reveal-item>
              <article className="h-full rounded-[1.7rem] border border-[#d8e6ff] bg-white p-6 shadow-[0_25px_65px_-52px_rgba(15,52,125,0.55)]">
                <p className="font-mono text-xs text-[#3f63a8]" aria-hidden="true">
                  {String.fromCharCode(97 + index)}.
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#102e66]">{friction.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#35548c]">{friction.text}</p>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-base font-medium leading-8 text-[#163670]" data-reveal-item>
          {problem.closing}
        </p>
      </LandingSection>

      <LandingSection id="what-i-build" tone="dark">
        <SectionHeader
          id="what-i-build"
          tone="dark"
          eyebrow={build.eyebrow}
          icon={faLayerGroup}
          title={build.title}
          intro={build.intro}
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {build.cards.map((card) => (
            <li key={card.title} data-reveal-item>
              <article className="h-full rounded-3xl border border-white/10 bg-[#07173c]/40 p-6">
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#d8e7ff]">{card.text}</p>
              </article>
            </li>
          ))}
        </ul>
        <p
          className="mt-8 max-w-3xl rounded-2xl border border-[#8cb4ff]/30 bg-white/5 px-5 py-4 text-sm leading-7 text-[#d8e7ff]"
          data-reveal-item
        >
          {build.iotNote}
        </p>
      </LandingSection>

      <LandingSection id="constraints" tone="light">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeader
              id="constraints"
              tone="light"
              eyebrow={constraint.eyebrow}
              icon={faWarehouse}
              title={constraint.title}
            />
            <div className="mt-6 space-y-4">
              {constraint.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-[#163670]" data-reveal-item>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <ul className="space-y-4 self-center">
            {constraint.points.map((point) => (
              <li
                key={point}
                className="rounded-2xl border-l-4 border-[#2664eb] bg-white px-5 py-4 text-sm font-medium leading-7 text-[#163670] shadow-[0_25px_65px_-52px_rgba(15,52,125,0.55)]"
                data-reveal-item
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </LandingSection>

      <LandingSection id="method" tone="dark">
        <SectionHeader
          id="method"
          tone="dark"
          eyebrow={method.eyebrow}
          icon={faRoute}
          title={method.title}
          intro={method.intro}
        />
        <div className="mt-10">
          <StepList steps={method.steps} tone="dark" />
        </div>
        <p className="mt-8 max-w-3xl text-base font-medium leading-8 text-white" data-reveal-item>
          {method.stopNote}
        </p>
      </LandingSection>

      <LandingSection id="scenarios" tone="light">
        <SectionHeader
          id="scenarios"
          tone="light"
          eyebrow={scenarios.eyebrow}
          icon={faIndustry}
          title={scenarios.title}
          intro={scenarios.intro}
        />
        <p
          className="mt-5 inline-flex rounded-full border border-[#e0b25c] bg-[#fff6e5] px-3 py-1 text-xs font-medium text-[#7a4b00]"
          data-reveal-item
        >
          {scenarios.label}
        </p>
        <ul className="mt-8 grid gap-5 lg:grid-cols-2">
          {scenarios.items.map((scenario, index) => (
            <li key={scenario.title} data-reveal-item>
              <article className="h-full rounded-[1.7rem] border border-[#d8e6ff] bg-white p-6 shadow-[0_25px_65px_-52px_rgba(15,52,125,0.55)]">
                <h3 className="text-lg font-semibold text-[#102e66]">
                  <span className="mr-2 text-[#3f63a8]">{String.fromCharCode(65 + index)}.</span>
                  {scenario.title}
                </h3>
                <div className="mt-4">
                  <FlowChain steps={scenario.steps} tone="light" />
                </div>
                <p className="mt-4 text-sm leading-7 text-[#35548c]">{scenario.text}</p>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-sm leading-7 text-[#35548c]" data-reveal-item>
          {scenarios.disclaimer}
        </p>
      </LandingSection>

      <LandingSection id="ai" tone="dark">
        <SectionHeader
          id="ai"
          tone="dark"
          eyebrow={ai.eyebrow}
          icon={faBrain}
          title={ai.title}
          intro={ai.statement}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6" data-reveal-item>
            <h3 className="text-lg font-semibold text-white">{ai.usesTitle}</h3>
            <div className="mt-4">
              <CheckList items={ai.uses} tone="dark" />
            </div>
          </div>
          <div className="rounded-3xl border border-[#8cb4ff]/35 bg-[#1f55ca]/20 p-6" data-reveal-item>
            <h3 className="text-lg font-semibold text-white">{ai.guardrailsTitle}</h3>
            <div className="mt-4">
              <CheckList items={ai.guardrails} tone="dark" />
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection id="fit" tone="light">
        <SectionHeader id="fit" tone="light" eyebrow={fit.eyebrow} icon={faCompass} title={fit.title} />
        <FitColumns
          tone="light"
          forTitle={common.fitFor}
          forItems={fit.forItems}
          notForTitle={common.fitNotFor}
          notForItems={fit.notForItems}
          crossLink={{ text: fit.crossLinkText, label: fit.crossLinkLabel, href: hrefs.otherLanding }}
        />
      </LandingSection>

      <CredibilityBlock
        id="about"
        eyebrow={credibility.eyebrow}
        icon={faUser}
        title={credibility.title}
        paragraphs={credibility.paragraphs}
        principles={credibility.principles}
        photoAlt={common.photoAlt}
        linksTitle={common.linksTitle}
        links={[
          { label: common.aboutLink, href: hrefs.about },
          { label: common.projectsLink, href: hrefs.projects },
          { label: common.githubLink, href: hrefs.github, external: true },
          { label: common.blogLink, href: hrefs.blog },
          { label: common.contactLink, href: hrefs.contact },
        ]}
        relatedTitle={common.readArticle}
        related={related}
        newTabLabel={common.newTab}
      />

      <LandingSection id="faq" tone="light">
        <SectionHeader
          id="faq"
          tone="light"
          eyebrow={common.faqEyebrow}
          icon={faCircleQuestion}
          title={content.faq.title}
        />
        <FaqList items={faq} />
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
          {primaryCtaLabel}
        </CtaLink>
        <CtaLink href={hrefs.contact} variant="secondary">
          {common.contactCta}
        </CtaLink>
      </FinalCta>
    </div>
  );
}
