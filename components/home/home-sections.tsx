import Link from "next/link";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import { SectionReveal } from "@/components/home/section-reveal";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";
import { type Messages, withLang, type Locale } from "@/lib/i18n";
import { CALENDLY_URL } from "@/lib/site-config";

/** Ancora del box contatti: ci punta il link "salta l'animazione". */
export const HOME_CONTACT_ID = "contatti";

type HomeSectionsProps = {
  locale: Locale;
  content: Messages["site"]["home"]["sections"];
};

/** Dopo lo scrollytelling resta solo il box contatti, poi il footer. */
export function HomeSections({ locale, content }: HomeSectionsProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-24 sm:pt-20 sm:pb-28">
      <SectionReveal motionPreset="dynamic" id={HOME_CONTACT_ID} className="scroll-mt-24 rounded-[2.2rem] border border-[#8cb4ff]/18 bg-[radial-gradient(circle_at_top_left,rgba(67,120,255,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_45px_100px_-70px_rgba(2,12,32,1)] backdrop-blur-md">
        <div className="px-8 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        <div className="max-w-3xl" data-parallax>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#c9ddff]" data-reveal-item>
            <AnimatedFaIcon icon={faEnvelope} animation="pulse" className="text-[#d7e8ff]" />
            <span>{content.contactCta.title}</span>
          </p>
          <p
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#8cb4ff]/40 bg-[#1f55ca]/25 px-3 py-1 text-xs font-medium text-[#edf4ff]"
            data-reveal-item
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8cb4ff] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8cb4ff]" />
            </span>
            <span>{content.contactCta.badge}</span>
          </p>
          <p className="mt-5 text-lg leading-8 text-[#edf4ff]" data-reveal-item>
            {content.contactCta.text}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4" data-reveal-item>
          <Link
            href={CALENDLY_URL}
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
