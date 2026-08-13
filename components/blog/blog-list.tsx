"use client";

import Image from "next/image";
import Link from "next/link";
import {
  faCalendarDays,
  faClock,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { buttonClass } from "@/components/ui/button";

/**
 * Dati di una card pronti al rendering: gia' localizzati e serializzabili,
 * cosi' possono attraversare il confine server -> client. I `tags` restano
 * disponibili per il filtro editoriale lato client.
 */
export type BlogCardData = {
  slug: string;
  href: string;
  cover: string;
  title: string;
  description: string;
  tags: string[];
  dateLabel: string;
  readingLabel: string;
  /** Etichetta "Video YouTube" se il post ha un video, altrimenti null. */
  youtubeLabel: string | null;
};

type BlogListProps = {
  cards: BlogCardData[];
  readPostLabel: string;
};

export function BlogList({ cards, readPostLabel }: BlogListProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {cards.map((card, index) => (
        <article
          key={card.slug}
          className="blog-card overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)]"
        >
          <Link href={card.href} className="group blog-card__link">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#07173c]">
              <Image
                src={card.cover}
                alt={card.title}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06112a]/76 to-transparent" />
            </div>
            <div className="blog-card__body p-6">
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#e5e7eb] bg-[#f1f5f9] px-3 py-1 text-xs font-medium text-[#1d4ed8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="mt-5 text-xl font-semibold leading-7 text-[#111827]">
                {card.title}
              </h2>
              <p className="blog-card__excerpt mt-3 text-[0.95rem] leading-7 text-[#4b5563]">
                {card.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#6b7280]">
                <span className="inline-flex items-center gap-2">
                  <AnimatedFaIcon icon={faCalendarDays} animation="pulse" />
                  {card.dateLabel}
                </span>
                <span className="inline-flex items-center gap-2">
                  <AnimatedFaIcon icon={faClock} animation="float" />
                  {card.readingLabel}
                </span>
                {card.youtubeLabel ? (
                  <span className="inline-flex items-center gap-2">
                    <AnimatedFaIcon icon={faVideo} animation="shimmer" />
                    {card.youtubeLabel}
                  </span>
                ) : null}
              </div>

              <span
                className={buttonClass({
                  variant: "outline",
                  className: "mt-6",
                })}
              >
                {readPostLabel}
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
