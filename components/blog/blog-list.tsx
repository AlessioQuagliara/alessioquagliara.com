"use client";

import Link from "next/link";

/**
 * Dati di un articolo pronti al rendering: gia' localizzati e serializzabili,
 * cosi' possono attraversare il confine server -> client. I `tags` restano
 * disponibili per il filtro editoriale lato client.
 */
export type BlogCardData = {
  slug: string;
  href: string;
  title: string;
  description: string;
  tags: string[];
  dateLabel: string;
  readingLabel: string;
  /** Etichetta "Video YouTube" se il post ha un video, altrimenti null. */
  youtubeLabel: string | null;
  /** true nei primi 3 giorni dalla pubblicazione: mostra il badge "New". */
  isNew: boolean;
};

type BlogListProps = {
  cards: BlogCardData[];
};

/** Elenco a righe: data a sinistra, titolo e sommario a destra. */
export function BlogList({ cards }: BlogListProps) {
  return (
    <ul>
      {cards.map((card) => (
        <li key={card.slug} className="blog-row">
          <Link href={card.href} className="blog-row__link">
            <div className="font-mono text-xs leading-7 text-[#6b7280]">
              <p>{card.dateLabel}</p>
              <p>{card.readingLabel}</p>
            </div>
            <div>
              <h2 className="blog-row__title text-xl font-semibold leading-snug text-[#0f172a]">
                {card.title}
                {card.isNew ? (
                  <span className="ml-3 rounded bg-[#2664eb] px-2 py-0.5 align-middle text-xs font-semibold text-white">
                    New
                  </span>
                ) : null}
              </h2>
              <p className="mt-2 leading-7 text-[#4b5563]">{card.description}</p>
              <p className="mt-3 font-mono text-xs text-[#1d4ed8]">
                {[...card.tags.slice(0, 4), card.youtubeLabel].filter(Boolean).join(" · ")}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
