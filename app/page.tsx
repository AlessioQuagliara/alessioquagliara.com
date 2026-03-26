import type { Metadata } from "next";
import { HeroScene } from "@/components/home/hero-scene";
import { HomeSections } from "@/components/home/home-sections";
import { getFeaturedRepos } from "@/lib/github";
import { getLocaleFromLang, getMessages } from "@/lib/i18n";

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
  const home = getMessages(locale).site.home;
  const projects = getMessages(locale).site.projects;
  const repos = (await getFeaturedRepos()).slice(0, 3);

  return (
    <>
      <HeroScene
        locale={locale}
        content={{
          badge: home.badge,
          title: home.title,
          description: home.description,
          ctaProjects: home.ctaProjects,
          ctaContact: home.ctaContact,
        }}
      />
      <HomeSections
        locale={locale}
        repos={repos}
        noDescriptionLabel={projects.cardNoDescription}
        content={home.sections}
      />
    </>
  );
}
