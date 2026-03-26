import type { MetadataRoute } from "next";
import { getFeaturedRepos } from "@/lib/github";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://alessioquagliara.com";
  const repos = await getFeaturedRepos();

  const projectUrls: MetadataRoute.Sitemap = repos.map((repo) => ({
    url: `${baseUrl}/projects/${encodeURIComponent(repo.name)}`,
    lastModified: new Date(repo.updated_at),
  }));

  const projectsLastModified =
    repos.length > 0
      ? new Date(
          Math.max(...repos.map((repo) => new Date(repo.updated_at).getTime()))
        )
      : new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: projectsLastModified,
    },
    {
      url: `${baseUrl}/formazione`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    ...projectUrls,
  ];
}
