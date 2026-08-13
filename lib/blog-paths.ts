import { type Locale } from "@/lib/i18n";

/**
 * Percorsi editoriali del blog.
 *
 * I tag restano tecnici e granulari nei JSON dei post; qui li mappiamo su
 * "percorsi" pubblici, comprensibili e narrativi. La configurazione e'
 * centralizzata di proposito: per aggiungere/modificare un percorso basta
 * intervenire su questo array, senza toccare la UI.
 *
 * Regole:
 * - Il percorso `all` non ha tag e include ogni articolo.
 * - Un post appartiene a un percorso se possiede almeno un tag compatibile.
 * - La comparazione dei tag e' case-insensitive (vedi `normalizeTag`).
 * - Un post puo' comparire in piu' percorsi.
 */
export type BlogPathId =
  | "all"
  | "build-in-public"
  | "business"
  | "saas"
  | "ecommerce"
  | "ai-vibe-coding"
  | "tech"
  | "side-projects";

export type BlogPath = {
  id: BlogPathId;
  label: Record<Locale, string>;
  /** Tag tecnici (case-insensitive) che attivano questo percorso. */
  tags: string[];
};

export const blogPaths: BlogPath[] = [
  {
    id: "all",
    label: { it: "Tutto", en: "All" },
    tags: [],
  },
  {
    id: "build-in-public",
    label: { it: "Build in Public", en: "Build in Public" },
    tags: ["build in public", "build-in-public", "validazione", "idea-validation", "startup"],
  },
  {
    id: "business",
    label: { it: "Business reale", en: "Real business" },
    tags: [
      "e-commerce",
      "dropshipping",
      "white label",
      "marketing",
      "imprenditoria",
      "agency",
      "software house",
      "consulenza",
      "business",
      "freelance",
    ],
  },
  {
    id: "saas",
    label: { it: "SaaS & prodotti", en: "SaaS & products" },
    tags: ["saas", "software", "product", "product-thinking", "micro-saas", "industrial saas"],
  },
  {
    id: "ecommerce",
    label: { it: "E-commerce", en: "E-commerce" },
    tags: ["e-commerce", "shopify", "dropshipping", "white label", "facebook ads"],
  },
  {
    id: "ai-vibe-coding",
    label: { it: "AI & Vibe Coding", en: "AI & Vibe Coding" },
    tags: ["ai", "ai engineering", "vibe coding", "cursor", "lovable", "v0", "bolt", "replit"],
  },
  {
    id: "tech",
    label: { it: "Tech & sviluppo", en: "Tech & development" },
    tags: [
      "programming",
      "programmazione",
      "web development",
      "architecture",
      "docker",
      "nextjs",
      "python",
      "javascript",
      "flask",
      "quart",
      "c",
      "algoritmi",
    ],
  },
  {
    id: "side-projects",
    label: { it: "Side projects", en: "Side projects" },
    tags: ["game dev", "iot", "animation", "blender", "creative coding", "learning"],
  },
];

const DEFAULT_PATH_ID: BlogPathId = "all";

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

/** Type guard: verifica che una stringa sia un id di percorso valido. */
export function isBlogPathId(value: string | null | undefined): value is BlogPathId {
  return !!value && blogPaths.some((path) => path.id === value);
}

/** Ritorna un id valido, con fallback a `all` per valori assenti/sconosciuti. */
export function resolveBlogPathId(value: string | null | undefined): BlogPathId {
  return isBlogPathId(value) ? value : DEFAULT_PATH_ID;
}

/** Ritorna la configurazione di un percorso (fallback: `all`). */
export function getBlogPath(id: BlogPathId): BlogPath {
  return blogPaths.find((path) => path.id === id) ?? blogPaths[0];
}

/**
 * Un post appartiene al percorso se condivide almeno un tag (case-insensitive).
 * Il percorso `all` (o qualsiasi percorso senza tag) include tutti i post.
 */
export function postMatchesPath(tags: string[], path: BlogPath): boolean {
  if (path.tags.length === 0) {
    return true;
  }
  const postTags = new Set(tags.map(normalizeTag));
  return path.tags.some((tag) => postTags.has(normalizeTag(tag)));
}

/** Filtra una lista di post (o oggetti con `tags`) per id di percorso. */
export function filterPostsByPath<T extends { tags: string[] }>(
  posts: T[],
  id: BlogPathId
): T[] {
  const path = getBlogPath(id);
  return posts.filter((post) => postMatchesPath(post.tags, path));
}

/** Numero di articoli disponibili per un percorso. */
export function countPostsForPath<T extends { tags: string[] }>(
  posts: T[],
  id: BlogPathId
): number {
  const path = getBlogPath(id);
  return posts.reduce(
    (total, post) => (postMatchesPath(post.tags, path) ? total + 1 : total),
    0
  );
}
