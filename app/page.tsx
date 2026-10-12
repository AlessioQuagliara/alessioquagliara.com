import type { Metadata } from "next";
import { HOME_CONTACT_ID, HomeSections } from "@/components/home/home-sections";
import { ScrollExperience } from "@/components/home/scroll-experience";
import { getLocaleFromLang, getMessages, withLang } from "@/lib/i18n";
import { getLandingPath, type LandingKey } from "@/lib/landings";

/** Landing servizi e progetti linkati nell'ultimo capitolo dello scrollytelling. */
const SERVICE_KEYS: LandingKey[] = ["freelance", "industrial"];
const FEATURED_PROJECTS = ["RStudy", "PivotCut", "LinkBay-CMS"];

type HomePageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const locale = getLocaleFromLang((await searchParams).lang);
  const metadata = getMessages(locale).site.home.metadata;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: "/",
    },
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const locale = getLocaleFromLang((await searchParams).lang);
  const site = getMessages(locale).site;
  const { home } = site;
  const { experience } = home;

  return (
    <>
      <ScrollExperience
        skipTo={`#${HOME_CONTACT_ID}`}
        content={{
          canvasLabel: experience.canvasLabel,
          skipLabel: experience.skip,
          hero: {
            badge: home.badge,
            title: home.title,
            description: home.description,
            primary: { label: home.ctaProjects, href: withLang("/projects", locale) },
            secondary: { label: home.ctaContact, href: withLang("/contact", locale) },
          },
          hardware: experience.hardware,
          saas: experience.saas,
          code: {
            ...experience.code,
            services: SERVICE_KEYS.map((key) => ({
              label: site.services[key].label,
              href: getLandingPath(key, locale),
            })),
            projects: FEATURED_PROJECTS.map((name) => ({
              label: name,
              href: withLang(`/projects/${name}`, locale),
            })),
          },
        }}
      />
      <HomeSections locale={locale} content={home.sections} />
    </>
  );
}
