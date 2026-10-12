import { fillTemplate, getMessages, type Locale } from "@/lib/i18n";
import { buildLandingJsonLd, getLandingPath, type LandingKey } from "@/lib/landings";
import {
  CALENDLY_URL,
  PILOT_OFFER,
  getPilotDeadlineLabel,
  isPilotOfferActive,
  mailtoWithSubject,
} from "@/lib/site-config";

/** Landing suggerita in fondo a ciascuna ("non è per te? prova di qua"). */
const CROSS_LINKS: Record<LandingKey, LandingKey> = {
  freelance: "industrial",
  industrial: "freelance",
  saas: "freelance",
};

/** Dati condivisi dalle landing: copy, stato del pilota, link, JSON-LD. */
export function getLandingData<K extends LandingKey>(key: K, locale: Locale) {
  const site = getMessages(locale).site;
  const content = site.landings[key];
  const common = site.landingCommon;

  const pilotActive = isPilotOfferActive();
  const templateValues = {
    slots: PILOT_OFFER.slots,
    deadline: getPilotDeadlineLabel(locale),
  };
  const pilotBadge = pilotActive ? fillTemplate(common.pilotBadge, templateValues) : null;

  // Le FAQ sul pilota spariscono insieme all'offerta, anche dal JSON-LD.
  const faq = content.faq.items
    .filter((item) => pilotActive || !item.pilot)
    .map((item) => ({
      question: item.question,
      answer: fillTemplate(item.answer, templateValues),
    }));

  return {
    content,
    common,
    pilotBadge,
    faq,
    hrefs: {
      calendly: CALENDLY_URL,
      email: mailtoWithSubject(content.hero.emailSubject),
      otherLanding: getLandingPath(CROSS_LINKS[key], locale),
    },
    jsonLd: buildLandingJsonLd({
      key,
      locale,
      seo: content.metadata,
      serviceName: content.schema.serviceName,
      serviceType: content.schema.serviceType,
      faq,
    }),
  };
}

export type LandingData = ReturnType<typeof getLandingData>;
