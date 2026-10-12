import Image from "next/image";
import Link from "next/link";
import {
  faArrowRight,
  faCircleQuestion,
  faCubes,
  faDatabase,
  faDesktop,
  faEnvelope,
  faLayerGroup,
  faRocket,
  faRoute,
  faServer,
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
import { QuickContactForm } from "@/components/landing/quick-contact-form";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { withLang, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site-config";

/** Icona e taglio della bento grid dello stack, nello stesso ordine dei testi. */
const STACK_LAYOUT = [
  { icon: faDesktop, span: "lg:col-span-2" },
  { icon: faServer, span: "" },
  { icon: faDatabase, span: "" },
  { icon: faRocket, span: "lg:col-span-2" },
];

/** Sfondo dietro gli screenshot: ognuno ha i suoi colori. */
const PRODUCT_BACKDROP: Record<string, string> = {
  RStudy: "bg-[#0b0f17]",
  PivotCut: "bg-[#1b2333]",
  "LinkBay-CMS": "bg-white",
};

export function SaasLanding({ locale }: { locale: Locale }) {
  const { content, common, faq, hrefs, jsonLd } = getLandingData("saas", locale);
  const { hero, stack, projects, roadmap, finalCta, crossLink } = content;

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
            <CtaLink href="#contact">{hero.primaryCta}</CtaLink>
            <CtaLink href="#projects" variant="secondary">
              {hero.secondaryCta}
            </CtaLink>
          </>
        }
        visual={
          <figure className="rounded-4xl border border-[#8cb4ff]/25 bg-[#081d48]/55 p-6 shadow-[0_30px_65px_-55px_rgba(2,12,32,1)] backdrop-blur-sm sm:p-8">
            <figcaption className="text-xs uppercase tracking-[0.24em] text-[#c9ddff]">
              {hero.visualTitle}
            </figcaption>
            <ol className="mt-6 space-y-2">
              {hero.visualLayers.map((layer, index) => (
                <li
                  key={layer.name}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/10 px-4 py-3"
                  style={{ background: `rgba(38, 100, 235, ${0.12 + index * 0.1})` }}
                >
                  <span className="text-sm font-semibold text-white">{layer.name}</span>
                  <span className="font-mono text-xs text-[#c9ddff]">{layer.tech}</span>
                </li>
              ))}
            </ol>
          </figure>
        }
      />

      <LandingSection id="stack" tone="light">
        <SectionHeader id="stack" tone="light" eyebrow={stack.eyebrow} icon={faLayerGroup} title={stack.title} />
        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {stack.items.map((item, index) => {
            const layout = STACK_LAYOUT[index % STACK_LAYOUT.length];
            return (
              <li key={item.title} className={`guarantee-card ${layout.span}`} data-reveal-item>
                <span className="guarantee-card__icon">
                  <AnimatedFaIcon icon={layout.icon} animation="pulse" />
                </span>
                <h3 className="mt-6 text-xl font-bold text-[#102e66]">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#35548c]">{item.text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-[#c9dbff] bg-[#eaf2ff] px-3 py-1 font-mono text-xs font-semibold text-[#1d4596]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </LandingSection>

      <LandingSection id="projects" tone="dark">
        <SectionHeader id="projects" tone="dark" eyebrow={projects.eyebrow} icon={faCubes} title={projects.title} />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {projects.items.map((project) => (
            <li key={project.name} data-reveal-item>
              <Link
                href={withLang(`/projects/${project.name}`, locale)}
                className="product-card group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#07173c]/50 transition-colors hover:border-[#8cb4ff]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab0ff]"
              >
                <div className={`relative aspect-video overflow-hidden ${PRODUCT_BACKDROP[project.name] ?? "bg-white"}`}>
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-contain p-4"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    <span className="rounded-full border border-[#7cf0b5]/40 bg-[#7cf0b5]/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#d9ffe9]">
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#d8e7ff]">{project.text}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <li key={tag} className="rounded-md bg-white/8 px-2 py-0.5 font-mono text-[0.7rem] text-[#c9ddff]">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-white">
                    {projects.viewLabel}
                    <AnimatedFaIcon icon={faArrowRight} animation="float" className="text-xs" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </LandingSection>

      <LandingSection id="roadmap" tone="light">
        <SectionHeader id="roadmap" tone="light" eyebrow={roadmap.eyebrow} icon={faRoute} title={roadmap.title} />
        <ol className="roadmap mt-12">
          {roadmap.steps.map((step, index) => (
            <li key={step.title} className="roadmap__step" data-reveal-item>
              <span className="roadmap__dot" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-[#102e66]">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#35548c]">{step.text}</p>
            </li>
          ))}
        </ol>
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
        pilotBadge={null}
        aside={
          <QuickContactForm
            email={CONTACT_EMAIL}
            title={finalCta.form.title}
            choice={{ label: finalCta.form.choiceLabel, options: finalCta.form.options }}
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
