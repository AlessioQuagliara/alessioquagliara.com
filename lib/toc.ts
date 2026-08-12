/**
 * Utility condivise per la Table of Contents degli articoli.
 * Lo stesso slugify viene usato sia lato server (estrazione heading dal
 * markdown grezzo) sia lato client (id generati in fase di rendering),
 * così gli anchor combaciano sempre.
 */

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

// Combining diacritical marks: U+0300–U+036F (à, è, ù, ç...)
const DIACRITICS = /[̀-ͯ]/g;

/** Trasforma un testo di heading in uno slug stabile e URL-safe. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .replace(/[^a-z0-9\s-]/g, "") // rimuove la punteggiatura
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Estrae gli heading H2/H3 dal markdown grezzo, ignorando i blocchi di
 * codice recintati (```), per costruire la TOC.
 */
export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const items: TocItem[] = [];
  let insideFence = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;

    const level = match[1].length === 2 ? 2 : 3;
    const text = match[2].replace(/[*_`]/g, "").trim();
    if (!text) continue;

    items.push({ id: slugify(text), text, level });
  }

  return items;
}
