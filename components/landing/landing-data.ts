import { getBlogPost } from "@/lib/blog";
import { fillTemplate, getMessages, withLang, type Locale } from "@/lib/i18n";
import { buildLandingJsonLd, getLandingPath, type LandingKey } from "@/lib/landings";
import {
  CALENDLY_URL,
  GITHUB_URL,
  PILOT_OFFER,
  getPilotDeadlineLabel,
  isPilotOfferActive,
  mailtoWithSubject,
} from "@/lib/site-config";

/** Dati condivisi dalle due landing: copy, stato del pilota, CTA, link di prova, JSON-LD. */
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

  const otherKey: LandingKey = key === "freelance" ? "industrial" : "freelance";

  const related = content.relatedPosts.flatMap((slug) => {
    const post = getBlogPost(slug);
    return post ? [{ title: post.title[locale], href: withLang(`/blog/${post.slug}`, locale) }] : [];
  });

  return {
    content,
    common,
    pilotBadge,
    faq,
    related,
    primaryCtaLabel: pilotActive ? common.pilotCta : common.callCta,
    hrefs: {
      calendly: CALENDLY_URL,
      email: mailtoWithSubject(content.hero.emailSubject),
      contact: withLang("/contact", locale),
      about: withLang("/about", locale),
      projects: withLang("/projects", locale),
      blog: withLang("/blog", locale),
      github: GITHUB_URL,
      otherLanding: getLandingPath(otherKey, locale),
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
