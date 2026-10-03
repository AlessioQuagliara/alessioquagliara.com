import en from "@/messages/en.json";
import it from "@/messages/it.json";

export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];

export type Messages = typeof it;

/** Header impostato da proxy.ts per le pagine con prefisso di lingua. */
export const LOCALE_HEADER = "x-site-locale";

const dictionaries: Record<Locale, Messages> = {
  it,
  en,
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && locales.includes(value as Locale);
}

export function getLocaleFromLang(
  lang?: string | string[] | null
): Locale {
  const value = Array.isArray(lang) ? lang[0] : lang;
  return isLocale(value) ? value : "it";
}

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

/** Locale dal prefisso del path (/it/..., /en/...), se presente. */
export function getLocaleFromPathname(pathname?: string | null): Locale | null {
  const segment = pathname?.split("/")[1];
  return isLocale(segment) ? segment : null;
}

/** Sostituisce i placeholder `{chiave}` nei testi dei messaggi. */
export function fillTemplate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  );
}

export function withLang(path: string, locale: Locale): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}lang=${locale}`;
}
