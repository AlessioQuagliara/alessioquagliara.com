import type { Metadata } from "next";
import { HOME_CONTACT_ID, HomeSections } from "@/components/home/home-sections";
import { ScrollExperience } from "@/components/home/scroll-experience";
import { getLocaleFromLang, getMessages, withLang } from "@/lib/i18n";
import { getLandingPath } from "@/lib/landings";

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
  const { home } = getMessages(locale).site;
  const { experience } = home;
  const { projects, ...saas } = experience.saas;

  // Servizi: dritti al box contatti delle landing (automazioni, web app & SaaS).
  const serviceHrefs = [
    `${getLandingPath("freelance", locale)}#contact`,
    `${getLandingPath("saas", locale)}#contact`,
  ];
  const services = home.sections.services.items.map((item, index) => ({
    ...item,
    href: serviceHrefs[index],
  }));

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
          saas: {
            ...saas,
            projects: Object.entries(projects).map(([name, note]) => ({
              label: name,
              note,
              href: withLang(`/projects/${name}`, locale),
            })),
          },
          code: {
            ...experience.code,
            services: services.map(({ title, href }) => ({ label: title, href })),
          },
        }}
      />
      <HomeSections locale={locale} content={home.sections} services={services} />
    </>
  );
}
