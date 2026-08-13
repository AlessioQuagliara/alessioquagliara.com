"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { BlogList, type BlogCardData } from "@/components/blog/blog-list";
import { PathFilters, type PathFilterOption } from "@/components/blog/path-filters";
import {
  filterPostsByPath,
  resolveBlogPathId,
  type BlogPathId,
} from "@/lib/blog-paths";

export type BlogExplorerCopy = {
  title: string;
  subtitle: string;
  ariaLabel: string;
  readPost: string;
  emptyTitle: string;
  emptyText: string;
  emptyCta: string;
};

type BlogExplorerProps = {
  cards: BlogCardData[];
  options: PathFilterOption[];
  copy: BlogExplorerCopy;
};

export function BlogExplorer({ cards, options, copy }: BlogExplorerProps) {
  const searchParams = useSearchParams();
  // Fonte di verita': la query string. `path` mancante/non valido => "all".
  const activeId = resolveBlogPathId(searchParams.get("path"));

  const visibleCards = useMemo(
    () => filterPostsByPath(cards, activeId),
    [cards, activeId]
  );

  const handleSelect = useCallback(
    (id: BlogPathId) => {
      if (id === activeId) {
        return;
      }
      // Aggiorna la URL senza refresh completo, preservando gli altri
      // parametri (es. `lang`). `history.pushState` si integra con
      // useSearchParams e abilita il back/forward del browser.
      const params = new URLSearchParams(searchParams.toString());
      if (id === "all") {
        params.delete("path");
      } else {
        params.set("path", id);
      }
      const query = params.toString();
      window.history.pushState(null, "", query ? `?${query}` : "?");
    },
    [activeId, searchParams]
  );

  const selectAll = useCallback(() => handleSelect("all"), [handleSelect]);

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
            {copy.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-[#4b5563]">
            {copy.subtitle}
          </p>
        </div>

        <PathFilters
          options={options}
          activeId={activeId}
          onSelect={handleSelect}
          ariaLabel={copy.ariaLabel}
        />
      </div>

      {visibleCards.length > 0 ? (
        <div key={activeId} className="blog-list-enter" aria-live="polite">
          <BlogList cards={visibleCards} readPostLabel={copy.readPost} />
        </div>
      ) : (
        <div
          key={activeId}
          className="blog-list-enter mx-auto max-w-xl rounded-3xl border border-dashed border-[#cbd5e1] bg-white/70 px-8 py-14 text-center"
          aria-live="polite"
        >
          <h3 className="text-xl font-semibold text-[#0f172a]">
            {copy.emptyTitle}
          </h3>
          <p className="mt-3 text-base leading-7 text-[#4b5563]">
            {copy.emptyText}
          </p>
          <button
            type="button"
            onClick={selectAll}
            className="mt-6 inline-flex items-center justify-center rounded-xl border border-[#d0d7e2] bg-white px-5 py-3 text-sm font-medium text-[#1d4ed8] transition duration-200 ease-out hover:border-[#1d4ed8] hover:bg-[#f1f5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab0ff] focus-visible:ring-offset-2"
          >
            {copy.emptyCta}
          </button>
        </div>
      )}
    </div>
  );
}
