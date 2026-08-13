import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getFeaturedRepos } from "@/lib/github";

function toDateOrNull(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  const d = new Date(value as any);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://alessioquagliara.com";
  const repos = await getFeaturedRepos();
  const posts = getAllBlogPosts();

  const projectUrls: MetadataRoute.Sitemap = repos.map((repo) => {
    const lastModified = toDateOrNull(repo.updated_at);
    return lastModified
      ? {
          url: `${baseUrl}/projects/${encodeURIComponent(repo.name)}`,
          lastModified,
        }
      : {
          url: `${baseUrl}/projects/${encodeURIComponent(repo.name)}`,
        };
  });

  const projectsTimestamps = repos
    .map((repo) => toDateOrNull(repo.updated_at))
    .filter((d): d is Date => d !== null)
    .map((d) => d.getTime());

  const projectsLastModified =
    projectsTimestamps.length > 0
      ? new Date(Math.max(...projectsTimestamps))
      : new Date();

  const blogTimestamps = posts
    .map((post) => toDateOrNull(post.updatedAt ?? post.publishedAt))
    .filter((d): d is Date => d !== null)
    .map((d) => d.getTime());

  const blogLastModified =
    blogTimestamps.length > 0 ? new Date(Math.max(...blogTimestamps)) : new Date();

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => {
    const lastModified = toDateOrNull(post.updatedAt ?? post.publishedAt);
    return lastModified
      ? {
          url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
          lastModified,
        }
      : {
          url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
        };
  });

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
      url: `${baseUrl}/blog`,
      lastModified: blogLastModified,
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
    ...blogUrls,
  ];
}
