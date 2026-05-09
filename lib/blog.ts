import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { type Locale } from "@/lib/i18n";

type LocalizedText = Record<Locale, string>;

export type BlogPost = {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  cover: string;
  tags: string[];
  youtubeUrl?: string;
  title: LocalizedText;
  description: LocalizedText;
  body: LocalizedText;
};

export type LocalizedBlogPost = Omit<
  BlogPost,
  "title" | "description" | "body"
> & {
  title: string;
  description: string;
  body: string;
  readingMinutes: number;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

function readPost(fileName: string): BlogPost {
  const filePath = path.join(postsDirectory, fileName);
  return JSON.parse(readFileSync(filePath, "utf8")) as BlogPost;
}

function getReadingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function getAllBlogPosts(): BlogPost[] {
  return readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".json"))
    .map(readPost)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getBlogPost(slug: string): BlogPost | null {
  return getAllBlogPosts().find((post) => post.slug === slug) ?? null;
}

export function getLocalizedBlogPost(
  post: BlogPost,
  locale: Locale
): LocalizedBlogPost {
  const body = post.body[locale] ?? post.body.it;

  return {
    ...post,
    title: post.title[locale] ?? post.title.it,
    description: post.description[locale] ?? post.description.it,
    body,
    readingMinutes: getReadingMinutes(body),
  };
}

export function getLocalizedBlogPosts(locale: Locale): LocalizedBlogPost[] {
  return getAllBlogPosts().map((post) => getLocalizedBlogPost(post, locale));
}
