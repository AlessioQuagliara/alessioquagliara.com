import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getFeaturedRepos } from "@/lib/github";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://alessioquagliara.com";
  const repos = await getFeaturedRepos();
  const posts = getAllBlogPosts();

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
  const blogLastModified =
    posts.length > 0
      ? new Date(
          Math.max(
            ...posts.map((post) =>
              new Date(post.updatedAt ?? post.publishedAt).getTime()
            )
          )
        )
      : new Date();

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
  }));

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
