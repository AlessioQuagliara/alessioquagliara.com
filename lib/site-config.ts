import type { Locale } from "@/lib/i18n";

// URL e contatti reali del sito, in un solo posto.
export const SITE_URL = "https://alessioquagliara.com";
export const CALENDLY_URL = "https://calendly.com/quagliara-alessio/meeting-conoscitivo";
export const CONTACT_EMAIL = "quagliara.alessio@gmail.com";
export const GITHUB_URL = "https://github.com/AlessioQuagliara";
export const LINKEDIN_URL = "https://www.linkedin.com/in/alessio-quagliara-a1a91b1a8/";
export const YOUTUBE_URL = "https://www.youtube.com/@AlessioQuagliaraDev";
export const INSTAGRAM_URL = "https://www.instagram.com/alessio_quagliara_/";

/** Profili reali, usati nel JSON-LD (sameAs). */
export const SAME_AS = [LINKEDIN_URL, GITHUB_URL, YOUTUBE_URL, INSTAGRAM_URL];

/**
 * Pilota gratuito delle landing servizi.
 * - `enabled: false` spegne badge, CTA e FAQ dedicate su tutte le pagine.
 * - Dopo `endsOn` l'offerta si disattiva da sola (le pagine sono dinamiche).
 */
export const PILOT_OFFER = {
  enabled: true,
  slots: 2,
  endsOn: "2026-10-31",
} as const;

export function isPilotOfferActive(now: Date = new Date()): boolean {
  if (!PILOT_OFFER.enabled) return false;
  return now <= new Date(`${PILOT_OFFER.endsOn}T23:59:59+01:00`);
}

/** "ottobre 2026" / "October 2026", derivato da `endsOn`. */
export function getPilotDeadlineLabel(locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(new Date(`${PILOT_OFFER.endsOn}T12:00:00+01:00`));
}

export function mailtoWithSubject(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
