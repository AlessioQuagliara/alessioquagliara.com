import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { type Locale } from "@/lib/i18n";

type LocalizedText = Record<Locale, string>;

export type CaseStudyResult = {
  label: LocalizedText;
  /** Valore reale (es. "+38% clic organici"). Vuoto = non ancora verificato, non viene mostrato. */
  value: string;
  /** Da dove arriva il numero (es. "Google Search Console, gen–giu 2025"). */
  source: string;
};

export type CaseStudy = {
  slug: string;
  /**
   * `false` finché mancano dati veri: la pagina non va in build,
   * non compare nell'indice né nella sitemap. In `next dev` resta visibile.
   */
  published: boolean;
  /** Descrizione generica del cliente se `anonymous`: niente nomi, città, link. */
  client: LocalizedText;
  /** Cliente non identificabile: mostra la nota di riservatezza. */
  anonymous: boolean;
  company: string;
  /** Periodo reale del progetto, in anni. `to` vuoto = anno singolo. `null` = da compilare. */
  period: { from: number | null; to?: number | null };
  cover: string;
  publishedAt: string;
  updatedAt: string;
  stack: string[];
  title: LocalizedText;
  summary: LocalizedText;
  role: LocalizedText;
  problem: LocalizedText;
  constraints: Record<Locale, string[]>;
  solution: LocalizedText;
  results: CaseStudyResult[];
  /** Vuoto = da completare, non viene mostrato. */
  lessons: LocalizedText;
  /** Slug di articoli del blog collegati (es. quelli su Spotex). */
  relatedPosts: string[];
};

export type LocalizedCaseStudy = Omit<
  CaseStudy,
  "client" | "title" | "summary" | "role" | "problem" | "constraints" | "solution" | "results" | "lessons"
> & {
  client: string;
  title: string;
  summary: string;
  role: string;
  problem: string;
  constraints: string[];
  solution: string;
  lessons: string;
  /** Solo i risultati con un valore compilato. */
  results: { label: string; value: string; source: string }[];
  periodLabel: string;
  readingMinutes: number;
};

const caseStudiesDirectory = path.join(process.cwd(), "content", "case-studies");

// In dev le bozze si vedono, così si può lavorare sui testi prima di pubblicarli.
const showDrafts = process.env.NODE_ENV === "development";

function readCaseStudy(fileName: string): CaseStudy {
  const filePath = path.join(caseStudiesDirectory, fileName);
  return JSON.parse(readFileSync(filePath, "utf8")) as CaseStudy;
}

export function getAllCaseStudies(): CaseStudy[] {
  return readdirSync(caseStudiesDirectory)
    .filter((fileName) => fileName.endsWith(".json"))
    .map(readCaseStudy)
    .filter((caseStudy) => caseStudy.published || showDrafts)
    .sort(
      (a, b) =>
        (b.period.to ?? b.period.from ?? 0) - (a.period.to ?? a.period.from ?? 0)
    );
}

export function getCaseStudy(slug: string): CaseStudy | null {
  return getAllCaseStudies().find((caseStudy) => caseStudy.slug === slug) ?? null;
}

function pick(text: LocalizedText, locale: Locale): string {
  return text[locale] || text.it;
}

function getReadingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function getLocalizedCaseStudy(
  caseStudy: CaseStudy,
  locale: Locale
): LocalizedCaseStudy {
  const { from, to } = caseStudy.period;
  const problem = pick(caseStudy.problem, locale);
  const solution = pick(caseStudy.solution, locale);
  const lessons = pick(caseStudy.lessons, locale);

  return {
    ...caseStudy,
    client: pick(caseStudy.client, locale),
    title: pick(caseStudy.title, locale),
    summary: pick(caseStudy.summary, locale),
    role: pick(caseStudy.role, locale),
    problem,
    constraints: caseStudy.constraints[locale]?.length
      ? caseStudy.constraints[locale]
      : caseStudy.constraints.it,
    solution,
    lessons,
    results: caseStudy.results
      .filter((result) => result.value.trim())
      .map((result) => ({
        label: pick(result.label, locale),
        value: result.value,
        source: result.source,
      })),
    readingMinutes: getReadingMinutes(`${problem} ${solution} ${lessons}`),
    periodLabel: !from ? "" : to && to !== from ? `${from}–${to}` : String(from),
  };
}

export function getLocalizedCaseStudies(locale: Locale): LocalizedCaseStudy[] {
  return getAllCaseStudies().map((caseStudy) => getLocalizedCaseStudy(caseStudy, locale));
}
