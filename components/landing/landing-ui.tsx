import type { ReactNode } from "react";
import Link from "next/link";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { SectionReveal } from "@/components/home/section-reveal";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";

export type Tone = "light" | "dark";

const surfaceClasses: Record<Tone, string> = {
  light:
    "rounded-4xl border border-[#bfd5ff]/45 bg-[#f5f9ff] text-[#12347d] shadow-[0_45px_100px_-70px_rgba(2,12,32,1)]",
  dark: "rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(87,145,255,0.22),transparent_30%),linear-gradient(180deg,rgba(10,31,78,0.92),rgba(5,17,42,0.94))] text-white shadow-[0_45px_100px_-70px_rgba(2,12,32,1)]",
};

const eyebrowClasses: Record<Tone, string> = {
  light: "text-[#3f63a8]",
  dark: "text-[#c9ddff]",
};

const introClasses: Record<Tone, string> = {
  light: "text-[#163670]",
  dark: "text-[#edf4ff]",
};

/** Hero delle landing: niente animazione d'ingresso, il testo è l'LCP. */
export function LandingHero({
  eyebrow,
  title,
  subtitle,
  badge,
  microcopy,
  actions,
  visual,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string | null;
  microcopy: string;
  actions: ReactNode;
  visual: ReactNode;
}) {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid gap-10 pt-10 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:pt-20"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#c9ddff]">{eyebrow}</p>
        {badge ? (
          <div className="mt-4">
            <PilotBadge text={badge} />
          </div>
        ) : null}
        <h1
          id="hero-title"
          className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#e6f0ff] sm:text-lg">{subtitle}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">{actions}</div>
        <p className="mt-5 text-sm text-[#c8dcff]">{microcopy}</p>
      </div>
      <div>{visual}</div>
    </section>
  );
}

/** Sezione della landing: superficie del design system + reveal on scroll. */
export function LandingSection({
  id,
  tone,
  children,
}: {
  id: string;
  tone: Tone;
  children: ReactNode;
}) {
  return (
    <SectionReveal id={id} labelledBy={`${id}-title`} className={surfaceClasses[tone]}>
      <div className="px-5 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">{children}</div>
    </SectionReveal>
  );
}

export function SectionHeader({
  id,
  tone,
  eyebrow,
  icon,
  title,
  intro,
}: {
  id: string;
  tone: Tone;
  eyebrow: string;
  icon: IconDefinition;
  title: string;
  intro?: string;
}) {
  return (
    <header className="max-w-3xl">
      <p
        className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] ${eyebrowClasses[tone]}`}
        data-reveal-item
      >
        <AnimatedFaIcon icon={icon} animation="shimmer" />
        <span>{eyebrow}</span>
      </p>
      <h2
        id={`${id}-title`}
        className={`mt-4 text-2xl font-semibold leading-tight sm:text-3xl ${
          tone === "light" ? "text-[#102e66]" : "text-white"
        }`}
        data-reveal-item
      >
        {title}
      </h2>
      {intro ? (
        <p className={`mt-4 text-base leading-8 sm:text-lg ${introClasses[tone]}`} data-reveal-item>
          {intro}
        </p>
      ) : null}
    </header>
  );
}

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  newTabLabel?: string;
  className?: string;
};

/** CTA: se riceve `newTabLabel` apre una nuova scheda e lo annuncia agli screen reader. */
export function CtaLink({
  href,
  children,
  variant = "primary",
  newTabLabel,
  className = "",
}: CtaLinkProps) {
  const classes = buttonClass({ variant, size: "lg", className: `gap-2 text-center ${className}` });

  if (newTabLabel) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        <span>{children}</span>
        <AnimatedFaIcon icon={faArrowRight} animation="float" className="text-sm" />
        <span className="sr-only"> {newTabLabel}</span>
      </a>
    );
  }

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function PilotBadge({ text }: { text: string }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-[#8cb4ff]/40 bg-[#1f55ca]/25 px-3 py-1 text-xs font-medium text-[#edf4ff]">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#8cb4ff] opacity-70 motion-safe:animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8cb4ff]" />
      </span>
      <span>{text}</span>
    </p>
  );
}

/** Processo in pochi step: numero, durata/esito in evidenza, freccia tra uno step e l'altro. */
export function ProcessSteps({ steps }: { steps: { title: string; meta: string; text: string }[] }) {
  return (
    <ol className="grid gap-4 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={step.title}
          data-reveal-item
          className="process-step relative rounded-3xl border border-white/10 bg-[#07173c]/50 p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2664eb] text-sm font-bold text-white"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span className="rounded-full border border-[#7cf0b5]/40 bg-[#7cf0b5]/10 px-3 py-1 text-xs font-semibold text-[#d9ffe9]">
              {step.meta}
            </span>
          </div>
          <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
          <p className="mt-2 text-sm leading-7 text-[#d8e7ff]">{step.text}</p>
          {index < steps.length - 1 ? (
            <span className="process-step__arrow" aria-hidden="true">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="mt-10 space-y-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-2xl border border-[#d8e6ff] bg-white open:shadow-[0_25px_65px_-52px_rgba(15,52,125,0.55)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2664eb] [&::-webkit-details-marker]:hidden">
            <h3 className="text-base font-semibold text-[#102e66]">{item.question}</h3>
            <FontAwesomeIcon
              icon={faChevronDown}
              aria-hidden="true"
              className="shrink-0 text-xs text-[#2d5ab5] transition-transform group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <p className="px-5 pb-5 text-sm leading-7 text-[#35548c] sm:text-base">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FinalCta({
  id,
  eyebrow,
  icon,
  title,
  text,
  pilotBadge,
  children,
  aside,
}: {
  id: string;
  eyebrow: string;
  icon: IconDefinition;
  title: string;
  text: string;
  pilotBadge: string | null;
  children: ReactNode;
  /** Colonna a destra (es. form rapido). */
  aside?: ReactNode;
}) {
  return (
    <SectionReveal
      id={id}
      labelledBy={`${id}-title`}
      className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(145deg,#06112a_0%,#0e2e73_55%,#1f55ca_100%)] shadow-[0_45px_100px_-70px_rgba(2,12,32,1)]"
    >
      <div
        className={`px-5 py-12 sm:px-10 lg:px-14 lg:py-16 ${
          aside ? "grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""
        }`}
      >
        <div>
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#c9ddff]" data-reveal-item>
              <AnimatedFaIcon icon={icon} animation="pulse" />
              <span>{eyebrow}</span>
            </p>
            <h2 id={`${id}-title`} className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl" data-reveal-item>
              {title}
            </h2>
            {pilotBadge ? (
              <div className="mt-5" data-reveal-item>
                <PilotBadge text={pilotBadge} />
              </div>
            ) : null}
            <p className="mt-5 text-base leading-8 text-[#edf4ff] sm:text-lg" data-reveal-item>
              {text}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4" data-reveal-item>
            {children}
          </div>
        </div>
        {aside ? <div data-reveal-item>{aside}</div> : null}
      </div>
    </SectionReveal>
  );
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
