"use client";

import { useId, useState } from "react";

type Task = { label: string; hours: number };

type TimeCalculatorProps = {
  title: string;
  intro: string;
  tasks: Task[];
  perWeek: string;
  /** Con il segnaposto `{hours}`. */
  perMonth: string;
  empty: string;
  note: string;
  locale: string;
};

const WEEKS_PER_MONTH = 4.33;

/** Calcolatore delle ore perse: spunti i compiti manuali, somma le ore. */
export function TimeCalculator({
  title,
  intro,
  tasks,
  perWeek,
  perMonth,
  empty,
  note,
  locale,
}: TimeCalculatorProps) {
  const [checked, setChecked] = useState<boolean[]>(() => tasks.map((_, index) => index < 2));
  const baseId = useId();

  const weekly = tasks.reduce((sum, task, index) => sum + (checked[index] ? task.hours : 0), 0);
  const monthly = Math.round(weekly * WEEKS_PER_MONTH);
  const format = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });

  return (
    <figure className="rounded-4xl border border-[#8cb4ff]/25 bg-[#081d48]/70 p-6 shadow-[0_30px_65px_-55px_rgba(2,12,32,1)] backdrop-blur-sm sm:p-7">
      <figcaption>
        <p className="text-lg font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-[#c9ddff]">{intro}</p>
      </figcaption>

      <fieldset className="mt-5 space-y-2">
        <legend className="sr-only">{intro}</legend>
        {tasks.map((task, index) => {
          const id = `${baseId}-${index}`;
          return (
            <label key={task.label} htmlFor={id} className="calc-task">
              <input
                id={id}
                type="checkbox"
                checked={checked[index]}
                onChange={(event) =>
                  setChecked((current) =>
                    current.map((value, i) => (i === index ? event.target.checked : value))
                  )
                }
                className="calc-task__input"
              />
              <span className="flex-1">{task.label}</span>
              <span className="shrink-0 text-xs font-semibold text-[#9fc2ff]">{format.format(task.hours)}h</span>
            </label>
          );
        })}
      </fieldset>

      <div className="mt-5 rounded-2xl bg-[#2664eb] p-5 text-white" aria-live="polite">
        {weekly > 0 ? (
          <>
            <p className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight">{format.format(weekly)}</span>
              <span className="text-sm font-medium text-[#dbe8ff]">{perWeek}</span>
            </p>
            <p className="mt-1 text-sm text-[#dbe8ff]">{perMonth.replace("{hours}", format.format(monthly))}</p>
          </>
        ) : (
          <p className="text-sm font-medium">{empty}</p>
        )}
      </div>
      <p className="mt-3 text-xs leading-5 text-[#9fb8e6]">{note}</p>
    </figure>
  );
}
