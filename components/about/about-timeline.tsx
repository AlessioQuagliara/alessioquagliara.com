"use client";

import { type KeyboardEvent, useId, useRef, useState } from "react";

type TimelineStep = { period: string; title: string; text: string };
type TimelineTab = { id: string; label: string; steps: TimelineStep[] };

type AboutTimelineProps = {
  tabs: TimelineTab[];
};

/** Timeline a tab: un percorso alla volta, frecce ←/→ per cambiare tab. */
export function AboutTimeline({ tabs }: AboutTimelineProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const tab = tabs[active];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#061536]/60 p-1.5 sm:inline-flex"
        onKeyDown={onKeyDown}
      >
        {tabs.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${item.id}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className="about-tab"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${tab.id}`}
        className="mt-8"
      >
        {/* La key rimonta la lista: l'animazione d'ingresso riparte a ogni tab. */}
        <ol key={tab.id} className="about-timeline">
          {tab.steps.map((step, index) => (
            <li
              key={step.title}
              className="about-timeline__step"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <span className="about-timeline__dot" aria-hidden="true" />
              <p className="about-timeline__period">{step.period}</p>
              <h3 className="mt-2 text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-7 text-[#c9ddff]">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
