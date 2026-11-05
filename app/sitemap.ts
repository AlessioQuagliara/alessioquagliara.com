import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getFeaturedRepos } from "@/lib/github";

function toDateOrNull(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  const d = new Date(value as string | number | Date);
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
      url: `${baseUrl}/blog`,
      lastModified: blogLastModified,
    },
    ...projectUrls,
    ...blogUrls,
  ];
}
