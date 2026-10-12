"use client";

import { useState } from "react";

type StackItem = { name: string; category: string; use: string };

type AboutStackProps = {
  hint: string;
  filtersLabel: string;
  allLabel: string;
  categories: Record<string, string>;
  items: StackItem[];
};

const ALL = "all";

/** Competenze filtrabili: hover, focus o tap su un badge mostra il caso d'uso. */
export function AboutStack({ hint, filtersLabel, allLabel, categories, items }: AboutStackProps) {
  const [filter, setFilter] = useState(ALL);
  const [selected, setSelected] = useState<string | null>(null);

  const visible = filter === ALL ? items : items.filter((item) => item.category === filter);
  const current = visible.find((item) => item.name === selected) ?? null;
  const filters = [[ALL, allLabel], ...Object.entries(categories)];

  return (
    <div>
      <div role="group" aria-label={filtersLabel} className="flex flex-wrap gap-2">
        {filters.map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => {
              setFilter(key);
              setSelected(null);
            }}
            className="about-filter"
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap gap-2.5">
        {visible.map((item) => (
          <li key={item.name} className="about-chip-enter">
            <button
              type="button"
              aria-pressed={item.name === current?.name}
              aria-describedby="about-stack-use"
              onMouseEnter={() => setSelected(item.name)}
              onFocus={() => setSelected(item.name)}
              onClick={() => setSelected(item.name)}
              className="about-chip"
            >
              <span className="about-chip__dot" data-category={item.category} aria-hidden="true" />
              {item.name}
            </button>
          </li>
        ))}
      </ul>

      <div
        id="about-stack-use"
        aria-live="polite"
        className="mt-6 min-h-24 rounded-2xl border border-white/10 bg-[#061536]/60 p-5"
      >
        {current ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9fc2ff]">
              {categories[current.category]} · {current.name}
            </p>
            <p className="mt-2 text-base leading-7 text-white">{current.use}</p>
          </>
        ) : (
          <p className="text-sm leading-7 text-[#9fb8e6]">{hint}</p>
        )}
      </div>
    </div>
  );
}
