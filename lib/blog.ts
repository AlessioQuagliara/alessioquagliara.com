import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { type Locale } from "@/lib/i18n";
import { slugify } from "@/lib/toc";

type LocalizedText = Record<Locale, string>;

/** Una sezione dell'articolo (blocco "quaderno"). */
export type Section = {
  id: string;
  title: string;
  /** Immagine opzionale mostrata sotto il titolo, prima del testo. */
  image?: string;
  body: string;
};

type LocalizedSections = Partial<Record<Locale, Section[]>>;

export type BlogPost = {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  cover: string;
  tags: string[];
  youtubeUrl?: string;
  title: LocalizedText;
  description: LocalizedText;
  /**
   * Corpo markdown "classico" (formato legacy). Opzionale: i post nuovi
   * possono fornire direttamente `sections`.
   */
  body?: LocalizedText;
  /** Nuovo formato a sezioni, localizzato per lingua. */
  sections?: LocalizedSections;
};

export type LocalizedBlogPost = Omit<
  BlogPost,
  "title" | "description" | "body" | "sections"
> & {
  title: string;
  description: string;
  /** Markdown completo (utile per stats/estratti). */
  body: string;
  /** Sezioni pronte al rendering: da `sections` o parse del `body`. */
  sections: Section[];
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

/**
 * Parser di fallback: trasforma un markdown "classico" in sezioni,
 * spezzando sugli heading H2 (## ) e rispettando i blocchi di codice
 * recintati. Il testo prima del primo H2 diventa una sezione "intro"
 * senza titolo. Garantisce compatibilità con i post non ancora migrati.
 */
export function parseSections(markdown: string): Section[] {
  const lines = markdown.split("\n");
  const sections: Section[] = [];
  let insideFence = false;
  let current: Section | null = null;
  let intro: string[] = [];

  const pushCurrent = () => {
    if (current) {
      current.body = current.body.replace(/\s+$/, "");
      sections.push(current);
      current = null;
    }
  };

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      insideFence = !insideFence;
    }

    const h2 = !insideFence ? /^##\s+(.*)$/.exec(line) : null;

    if (h2) {
      // Chiude l'eventuale intro accumulata prima del primo H2.
      if (!current && intro.join("").trim()) {
        sections.push({
          id: "intro",
          title: "",
          body: intro.join("\n").trim(),
        });
        intro = [];
      }
      pushCurrent();
      const title = h2[1].replace(/[*_`]/g, "").trim();
      current = { id: slugify(title) || `sezione-${sections.length + 1}`, title, body: "" };
      continue;
    }

    if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      intro.push(line);
    }
  }

  if (!current && intro.join("").trim()) {
    sections.push({ id: "intro", title: "", body: intro.join("\n").trim() });
  }
  pushCurrent();

  return sections;
}

/** Normalizza le sezioni provenienti dal JSON (id di fallback, trim). */
function normalizeSections(sections: Section[]): Section[] {
  return sections.map((section, index) => ({
    id: section.id || slugify(section.title) || `sezione-${index + 1}`,
    title: section.title ?? "",
    image: section.image?.trim() ? section.image.trim() : undefined,
    body: section.body ?? "",
  }));
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
  const legacyBody = post.body?.[locale] ?? post.body?.it ?? "";
  const jsonSections = post.sections?.[locale] ?? post.sections?.it;

  const sections = jsonSections
    ? normalizeSections(jsonSections)
    : parseSections(legacyBody);

  // Testo completo usato per reading time (e come fallback estratti).
  const fullText = legacyBody
    ? legacyBody
    : sections.map((section) => `${section.title}\n${section.body}`).join("\n\n");

  return {
    ...post,
    title: post.title[locale] ?? post.title.it,
    description: post.description[locale] ?? post.description.it,
    body: fullText,
    sections,
    readingMinutes: getReadingMinutes(fullText),
  };
}

export function getLocalizedBlogPosts(locale: Locale): LocalizedBlogPost[] {
  return getAllBlogPosts().map((post) => getLocalizedBlogPost(post, locale));
}
