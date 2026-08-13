"use client";

import type { BlogPathId } from "@/lib/blog-paths";

export type PathFilterOption = {
  id: BlogPathId;
  label: string;
  count: number;
};

type PathFiltersProps = {
  options: PathFilterOption[];
  activeId: BlogPathId;
  onSelect: (id: BlogPathId) => void;
  /** Etichetta accessibile del gruppo di filtri. */
  ariaLabel: string;
};

/**
 * Gruppo di filtri "a pillola" orizzontale. Semantica accessibile:
 * un gruppo (`role="group"`) di `button` con `aria-pressed` sul filtro
 * attivo. Su mobile scorre in orizzontale (scrollbar nascosta via CSS).
 */
export function PathFilters({
  options,
  activeId,
  onSelect,
  ariaLabel,
}: PathFiltersProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="blog-filters no-scrollbar -mx-6 flex gap-2.5 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((option) => {
        const isActive = option.id === activeId;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.id)}
            className={[
              "blog-filter-pill",
              isActive ? "blog-filter-pill--active" : "",
            ]
              .join(" ")
              .trim()}
          >
            <span>{option.label}</span>
            <span className="blog-filter-pill__count" aria-hidden="true">
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
