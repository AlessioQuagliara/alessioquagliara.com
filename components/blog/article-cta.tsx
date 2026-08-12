import Link from "next/link";
import {
  faArrowRight,
  faEnvelope,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";

type NextPost = {
  href: string;
  title: string;
};

type ArticleCtaProps = {
  youtubeUrl?: string;
  nextPost?: NextPost;
  labels: {
    heading: string;
    subtitle: string;
    watchVideo: string;
    newsletterTitle: string;
    newsletterText: string;
    newsletterCta: string;
    nextLabel: string;
  };
  newsletterHref: string;
};

/**
 * Blocco CTA finale mostrato dopo l'ultimo paragrafo dell'articolo:
 * guarda il video, iscriviti alla newsletter, leggi il prossimo articolo.
 */
export function ArticleCta({
  youtubeUrl,
  nextPost,
  labels,
  newsletterHref,
}: ArticleCtaProps) {
  return (
    <aside className="article-cta" aria-label={labels.heading}>
      <div className="article-cta__intro">
        <h2 className="article-cta__heading">{labels.heading}</h2>
        <p className="article-cta__subtitle">{labels.subtitle}</p>
      </div>

      <div className="article-cta__grid">
        {youtubeUrl ? (
          <Link
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonClass({ variant: "primary", className: "gap-2" })}
          >
            <AnimatedFaIcon icon={faVideo} animation="shimmer" />
            {labels.watchVideo}
          </Link>
        ) : null}

        {nextPost ? (
          <Link
            href={nextPost.href}
            className={buttonClass({ variant: "outline", className: "gap-2" })}
          >
            {labels.nextLabel}
            <AnimatedFaIcon icon={faArrowRight} animation="float" />
          </Link>
        ) : null}
      </div>

      <div className="article-cta__newsletter">
        <div className="article-cta__newsletter-copy">
          <p className="article-cta__newsletter-title">
            <AnimatedFaIcon icon={faEnvelope} animation="pulse" />
            {labels.newsletterTitle}
          </p>
          <p className="article-cta__newsletter-text">{labels.newsletterText}</p>
        </div>
        <Link
          href={newsletterHref}
          className={buttonClass({ variant: "primary", className: "shrink-0" })}
        >
          {labels.newsletterCta}
        </Link>
      </div>
    </aside>
  );
}
