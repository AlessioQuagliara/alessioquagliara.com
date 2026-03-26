import type { Metadata } from "next";
import Link from "next/link";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarDays,
  faCheck,
  faCircleInfo,
  faComments,
  faEnvelope,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { SectionReveal } from "@/components/home/section-reveal";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { getLocaleFromLang, getMessages } from "@/lib/i18n";

type ContactPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  searchParams,
}: ContactPageProps): Promise<Metadata> {
  const locale = getLocaleFromLang((await searchParams).lang);
  const metadata = getMessages(locale).site.contact.metadata;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: "/contact",
    },
  };
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const locale = getLocaleFromLang((await searchParams).lang);
  const contact = getMessages(locale).site.contact;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <SectionReveal
        motionPreset="dynamic"
        className="rounded-3xl border border-[#8cb4ff]/24 bg-[radial-gradient(circle_at_top_left,rgba(67,120,255,0.2),transparent_36%),linear-gradient(180deg,rgba(8,24,60,0.92),rgba(4,14,38,0.95))] p-7 shadow-[0_30px_65px_-55px_rgba(2,12,32,1)] sm:p-10"
      >
        <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight sm:text-5xl" data-reveal-item>
          <AnimatedFaIcon icon={faComments} animation="shimmer" className="text-2xl text-[#cde0ff] sm:text-3xl" />
          <span>{contact.title}</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6f0ff]" data-reveal-item>{contact.intro}</p>
        <p className="mt-4 max-w-3xl leading-8 text-[#c8dcff]" data-reveal-item>{contact.description}</p>

        <div className="mt-10 rounded-3xl border border-white/12 bg-[#081d48]/45 p-6 shadow-[0_20px_40px_-35px_rgba(2,12,32,1)] sm:p-8" data-reveal-item>
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
            <AnimatedFaIcon icon={faCircleInfo} animation="pulse" className="text-[#d0e3ff]" />
            <span>{contact.helpTitle}</span>
          </h2>
          <ul className="mt-7 grid gap-4 text-[#e6f0ff] sm:grid-cols-2">
            {contact.bullets.map((item) => (
              <li key={item} className="flex items-start gap-2 rounded-xl border border-[#8db9ff]/25 bg-[#0a255d]/42 px-4 py-3 leading-7" data-parallax>
                <AnimatedFaIcon icon={faCheck} animation="shimmer" className="mt-1 shrink-0 text-xs text-[#d8e8ff]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-3xl border border-[#c8dbff]/75 bg-white/90 p-6 text-[#12347d] shadow-[0_22px_46px_-36px_rgba(18,52,125,0.35)] sm:p-8" data-reveal-item>
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <AnimatedFaIcon icon={faIdCard} animation="float" className="text-[#2d5ab6]" />
            <span>{contact.directContactsTitle}</span>
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#d7e5ff] bg-[#f7fbff] px-4 py-3 text-center text-[#24498f] transition-colors hover:text-[#0d2d72]"
            >
              <AnimatedFaIcon icon={faEnvelope} animation="pulse" className="text-sm" />
              <span>{contact.emailLabel}</span>
            </a>
            <a
              href={contact.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#d7e5ff] bg-[#f7fbff] px-4 py-3 text-center text-[#24498f] transition-colors hover:text-[#0d2d72]"
            >
              <AnimatedFaIcon icon={faGithub} animation="float" className="text-sm" />
              <span>{contact.githubLabel}</span>
            </a>
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#d7e5ff] bg-[#f7fbff] px-4 py-3 text-center text-[#24498f] transition-colors hover:text-[#0d2d72]"
            >
              <AnimatedFaIcon icon={faLinkedin} animation="float" className="text-sm" />
              <span>{contact.linkedinLabel}</span>
            </a>
            <Link
              href={contact.calendlyUrl}
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#d7e5ff] bg-[#f7fbff] px-4 py-3 text-center font-medium text-[#24498f] transition-colors hover:text-[#0d2d72]"
            >
              <AnimatedFaIcon icon={faCalendarDays} animation="pulse" className="text-sm" />
              <span>{contact.calendlyLabel}</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-[#8cb4ff]/28 bg-[#0a2152]/38 p-6 shadow-[0_24px_50px_-40px_rgba(2,12,32,1)] sm:p-8" data-reveal-item>
          <p className="max-w-3xl text-sm leading-7 text-[#c8dcff]/90">
            <span className="inline-flex items-center gap-2">
              <AnimatedFaIcon icon={faComments} animation="shimmer" className="text-[#cde2ff]" />
              <span>{contact.secondaryCta}</span>
            </span>
          </p>
        </div>
      </SectionReveal>
    </section>
  );
}
