"use client";

import { type KeyboardEvent, useId, useRef, useState } from "react";

type UseCase = { id: string; label: string; problem: string; solution: string; result: string };

type UseCaseTabsProps = {
  labels: { problem: string; solution: string; result: string };
  items: UseCase[];
};

/** Casi d'uso a tab: problema → soluzione → risultato. Frecce ←/→ per cambiare tab. */
export function UseCaseTabs({ labels, items }: UseCaseTabsProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const item = items[active];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + items.length) % items.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const columns = [
    { key: "problem", label: labels.problem, text: item.problem, tone: "usecase-step--problem" },
    { key: "solution", label: labels.solution, text: item.solution, tone: "usecase-step--solution" },
    { key: "result", label: labels.result, text: item.result, tone: "usecase-step--result" },
  ];

  return (
    <div>
      <div
        role="tablist"
        className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#061536]/60 p-1.5 sm:inline-flex"
        onKeyDown={onKeyDown}
      >
        {items.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className="ui-tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${item.id}`} className="mt-8">
        {/* La key rimonta la griglia: l'animazione d'ingresso riparte a ogni tab. */}
        <ol key={item.id} className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {columns.map((column, index) => (
            <li key={column.key} className="contents">
              <div className={`usecase-step ${column.tone}`} style={{ animationDelay: `${index * 80}ms` }}>
                <p className="usecase-step__label">{column.label}</p>
                <p className="mt-3 text-base leading-7">{column.text}</p>
              </div>
              {index < columns.length - 1 ? (
                <span className="usecase-arrow" aria-hidden="true">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
