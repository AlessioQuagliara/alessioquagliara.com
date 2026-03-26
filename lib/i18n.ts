import en from "@/messages/en.json";
import it from "@/messages/it.json";

export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];

export type Messages = typeof it;

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

export function withLang(path: string, locale: Locale): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}lang=${locale}`;
}
