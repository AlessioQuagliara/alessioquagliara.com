"use client";

import { useState } from "react";

type Flow = { summary: string; steps: string[] };

type BeforeAfterProps = {
  beforeLabel: string;
  afterLabel: string;
  before: Flow;
  after: Flow;
};

/** Toggle prima/dopo: il flusso a mano (sparpagliato) contro quello automatizzato (in fila). */
export function BeforeAfter({ beforeLabel, afterLabel, before, after }: BeforeAfterProps) {
  const [showAfter, setShowAfter] = useState(true);
  const flow = showAfter ? after : before;

  return (
    <div className="rounded-3xl border border-[#d8e6ff] bg-white p-5 shadow-[0_25px_65px_-52px_rgba(15,52,125,0.55)] sm:p-8">
      <div className="inline-flex rounded-full border border-[#d8e6ff] bg-[#f5f9ff] p-1" role="group">
        {[
          { value: false, label: beforeLabel },
          { value: true, label: afterLabel },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            aria-pressed={showAfter === option.value}
            onClick={() => setShowAfter(option.value)}
            className="compare-toggle"
            data-variant={option.value ? "after" : "before"}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ol key={String(showAfter)} className="compare-flow mt-8" data-state={showAfter ? "after" : "before"}>
        {flow.steps.map((step, index) => (
          <li key={step} className="compare-flow__item" style={{ animationDelay: `${index * 50}ms` }}>
            <span className="compare-flow__chip">
              <span className="compare-flow__mark" aria-hidden="true">
                {showAfter ? "✓" : "✕"}
              </span>
              {step}
            </span>
            {index < flow.steps.length - 1 ? (
              <span className="compare-flow__arrow" aria-hidden="true">
                {showAfter ? "→" : "↯"}
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <p className="mt-6 text-base font-semibold text-[#102e66]" aria-live="polite">
        {flow.summary}
      </p>
    </div>
  );
}
