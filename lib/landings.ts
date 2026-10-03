import type { Metadata } from "next";
import { getLocaleFromPathname, withLang, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL, SAME_AS, SITE_URL } from "@/lib/site-config";

export type LandingKey = "freelance" | "industrial";

/** URL canoniche delle landing servizi, per lingua. */
export const LANDING_PATHS: Record<LandingKey, Record<Locale, string>> = {
  freelance: {
    it: "/it/automazioni-freelance",
    en: "/en/automation-for-freelancers",
  },
  industrial: {
    it: "/it/automazione-ai-pmi-industriali",
    en: "/en/industrial-ai-automation",
  },
};

// x-default punta alla versione inglese: è quella per chi non legge italiano.
export const X_DEFAULT_LOCALE: Locale = "en";

const OG_LOCALES: Record<Locale, string> = { it: "it_IT", en: "en_GB" };

export function getLandingPath(key: LandingKey, locale: Locale): string {
  return LANDING_PATHS[key][locale];
}

function findLandingByPath(pathname: string): LandingKey | null {
  const keys = Object.keys(LANDING_PATHS) as LandingKey[];
  return (
    keys.find((key) =>
      Object.values(LANDING_PATHS[key]).includes(pathname.replace(/\/$/, ""))
    ) ?? null
  );
}

/**
 * Link del selettore lingua: le landing hanno URL diversi per lingua,
 * il resto del sito usa ancora `?lang=`.
 */
export function getLocaleSwitchHref(pathname: string, target: Locale): string {
  const landing = findLandingByPath(pathname);
  if (landing) return getLandingPath(landing, target);
  return withLang(pathname, target);
}

/** Locale corrente: prima il prefisso del path, poi `?lang=`. */
export function resolveLocale(pathname: string | null, langParam: Locale): Locale {
  return getLocaleFromPathname(pathname) ?? langParam;
}

type LandingSeo = { title: string; description: string };

export function buildLandingMetadata(
  key: LandingKey,
  locale: Locale,
  seo: LandingSeo
): Metadata {
  const path = getLandingPath(key, locale);
  const otherLocale: Locale = locale === "it" ? "en" : "it";

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: path,
      languages: {
        it: getLandingPath(key, "it"),
        en: getLandingPath(key, "en"),
        "x-default": getLandingPath(key, X_DEFAULT_LOCALE),
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      url: path,
      siteName: "Alessio Quagliara",
      locale: OG_LOCALES[locale],
      alternateLocale: [OG_LOCALES[otherLocale]],
      images: [
        {
          url: "/profile_image.jpeg",
          width: 800,
          height: 800,
          alt: "Alessio Quagliara",
        },
      ],
    },
    // Il ritratto è quadrato: card "summary" invece di "summary_large_image".
    twitter: {
      card: "summary",
      title: seo.title,
      description: seo.description,
      images: ["/profile_image.jpeg"],
    },
    robots: { index: true, follow: true },
  };
}

type FaqItem = { question: string; answer: string };

type LandingJsonLdInput = {
  key: LandingKey;
  locale: Locale;
  seo: LandingSeo;
  serviceName: string;
  serviceType: string;
  faq: FaqItem[];
};

/**
 * Grafo JSON-LD: la pagina (FAQPage, sottotipo di WebPage) descrive un
 * Service offerto da una Person. Nessuna Organization: è un personal brand.
 */
export function buildLandingJsonLd({
  key,
  locale,
  seo,
  serviceName,
  serviceType,
  faq,
}: LandingJsonLdInput) {
  const url = `${SITE_URL}${getLandingPath(key, locale)}`;
  const personId = `${SITE_URL}/#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "Alessio Quagliara",
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/profile_image.jpeg`,
        jobTitle: "Full Stack Developer",
        knowsLanguage: ["it", "en"],
        sameAs: SAME_AS,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: locale === "it" ? "richieste di lavoro" : "work enquiries",
          email: CONTACT_EMAIL,
          url: `${SITE_URL}${withLang("/contact", locale)}`,
          availableLanguage: ["Italian", "English"],
        },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: serviceName,
        serviceType,
        description: seo.description,
        url,
        provider: { "@id": personId },
        ...(key === "industrial"
          ? { areaServed: { "@type": "Country", name: "Italy" } }
          : {}),
      },
      {
        "@type": faq.length > 0 ? "FAQPage" : "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: seo.title,
        description: seo.description,
        inLanguage: locale,
        about: { "@id": `${url}#service` },
        author: { "@id": personId },
        ...(faq.length > 0
          ? {
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }
          : {}),
      },
    ],
  };
}
