import {
  faCircleQuestion,
  faCompass,
  faDiagramProject,
  faEnvelope,
  faListCheck,
  faPuzzlePiece,
  faRoute,
  faUser,
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

export function FreelanceLanding({ locale }: { locale: Locale }) {
  const { content, common, pilotBadge, faq, related, primaryCtaLabel, hrefs, jsonLd } =
    getLandingData("freelance", locale);
  const { hero, problem, automations, method, example, fit, credibility, finalCta } = content;

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
            <ol className="mt-6 space-y-3">
              {hero.visualSteps.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8cb4ff]/40 bg-[#1f55ca]/40 text-xs font-semibold text-white"
                  >
                    {index + 1}
                  </span>
                  <span className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#edf4ff]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </figure>
        }
      />

      <LandingSection id="problem" tone="light">
        <SectionHeader
          id="problem"
          tone="light"
          eyebrow={problem.eyebrow}
          icon={faPuzzlePiece}
          title={problem.title}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            {problem.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 text-[#163670]" data-reveal-item>
                {paragraph}
              </p>
            ))}
            <div data-reveal-item>
              <h3 className="text-lg font-semibold text-[#102e66]">{problem.symptomsTitle}</h3>
              <div className="mt-4">
                <CheckList items={problem.symptoms} tone="light" />
              </div>
            </div>
          </div>

          <figure
            className="rounded-[1.7rem] border border-[#d8e6ff] bg-white p-5 shadow-[0_25px_65px_-52px_rgba(15,52,125,0.55)] sm:p-6"
            data-reveal-item
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[#3f63a8]">{problem.chaosTitle}</p>
            <ul className="mt-5 grid grid-cols-3 gap-3">
              {problem.chaosTools.slice(0, 4).map((tool, index) => (
                <li
                  key={tool}
                  className={`flex min-h-14 items-center justify-center rounded-xl border border-dashed border-[#9fb9e8] bg-[#f5f9ff] px-2 text-center text-sm font-medium text-[#24498f] ${
                    index % 2 === 0 ? "-rotate-2" : "rotate-2"
                  }`}
                >
                  {tool}
                </li>
              ))}
              <li className="flex min-h-14 items-center justify-center rounded-xl border border-[#e2a3b3] bg-[#fff1f4] px-2 text-center text-xs font-semibold text-[#9b1c3d]">
                {problem.chaosCenter}
              </li>
              {problem.chaosTools.slice(4).map((tool, index) => (
                <li
                  key={tool}
                  className={`flex min-h-14 items-center justify-center rounded-xl border border-dashed border-[#9fb9e8] bg-[#f5f9ff] px-2 text-center text-sm font-medium text-[#24498f] ${
                    index % 2 === 0 ? "rotate-1" : "-rotate-3"
                  }`}
                >
                  {tool}
                </li>
              ))}
            </ul>
            <figcaption className="mt-5 text-sm leading-7 text-[#35548c]">{problem.chaosCaption}</figcaption>
          </figure>
        </div>
      </LandingSection>

      <LandingSection id="automations" tone="dark">
        <SectionHeader
          id="automations"
          tone="dark"
          eyebrow={automations.eyebrow}
          icon={faDiagramProject}
          title={automations.title}
          intro={automations.intro}
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {automations.cards.map((card) => (
            <li key={card.title} data-reveal-item>
              <article className="h-full rounded-3xl border border-white/10 bg-[#07173c]/40 p-6">
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2 font-mono text-xs leading-6 text-[#9fc2ff]">{card.flow}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#c9ddff]">
                  {automations.changeLabel}
                </p>
                <p className="mt-1 text-sm leading-7 text-[#d8e7ff]">{card.change}</p>
              </article>
            </li>
          ))}
        </ul>
      </LandingSection>

      <LandingSection id="method" tone="light">
        <SectionHeader
          id="method"
          tone="light"
          eyebrow={method.eyebrow}
          icon={faRoute}
          title={method.title}
          intro={method.intro}
        />
        <div className="mt-10">
          <StepList steps={method.steps} tone="light" />
        </div>
        <ul className="mt-8 flex flex-wrap gap-3" data-reveal-item>
          {method.notes.map((note) => (
            <li
              key={note}
              className="rounded-full border border-[#9fc0ff] bg-[#eaf2ff] px-4 py-2 text-sm font-medium text-[#1d4596]"
            >
              {note}
            </li>
          ))}
        </ul>
      </LandingSection>

      <LandingSection id="example" tone="dark">
        <SectionHeader
          id="example"
          tone="dark"
          eyebrow={example.eyebrow}
          icon={faListCheck}
          title={example.title}
        />
        <p
          className="mt-5 inline-flex rounded-full border border-[#ffd59a]/50 bg-[#ffd59a]/10 px-3 py-1 text-xs font-medium text-[#ffe2b8]"
          data-reveal-item
        >
          {common.illustrativeLabel}
        </p>

        <div className="mt-8" data-reveal-item>
          <h3 className="text-sm uppercase tracking-[0.2em] text-[#c9ddff]">{example.flowTitle}</h3>
          <div className="mt-4">
            <FlowChain steps={example.flow} tone="dark" />
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6" data-reveal-item>
            <h3 className="text-lg font-semibold text-white">{example.before.title}</h3>
            <div className="mt-4">
              <CheckList items={example.before.items} tone="dark" negative />
            </div>
          </div>
          <div className="rounded-3xl border border-[#8cb4ff]/35 bg-[#1f55ca]/20 p-6" data-reveal-item>
            <h3 className="text-lg font-semibold text-white">{example.after.title}</h3>
            <div className="mt-4">
              <CheckList items={example.after.items} tone="dark" />
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-[#07173c]/40 p-6 sm:p-8" data-reveal-item>
          <h3 className="text-xl font-semibold text-white">{example.aiTitle}</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#bcd6ff]">
                {example.aiCan.title}
              </h4>
              <div className="mt-3">
                <CheckList items={example.aiCan.items} tone="dark" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#bcd6ff]">
                {example.aiCannot.title}
              </h4>
              <div className="mt-3">
                <CheckList items={example.aiCannot.items} tone="dark" />
              </div>
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
