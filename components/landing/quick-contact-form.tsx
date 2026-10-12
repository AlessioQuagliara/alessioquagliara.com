"use client";

import { type FormEvent, useId } from "react";

type QuickContactFormProps = {
  email: string;
  title: string;
  nameLabel: string;
  flowLabel: string;
  flowPlaceholder: string;
  submit: string;
  note: string;
  /** Oggetto dell'email, con i segnaposto `{name}` e (se c'è la scelta) `{choice}`. */
  subject: string;
  /** Selezione rapida opzionale (es. tipo di progetto): la prima opzione è preselezionata. */
  choice?: { label: string; options: string[] };
};

/**
 * Form rapido senza backend: prepara un'email nel client di posta
 * dell'utente. Nessun dato passa dal sito.
 */
export function QuickContactForm({
  email,
  title,
  nameLabel,
  flowLabel,
  flowPlaceholder,
  submit,
  note,
  subject,
  choice,
}: QuickContactFormProps) {
  const baseId = useId();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const flow = String(data.get("flow") ?? "").trim();
    const picked = String(data.get("choice") ?? "");
    const query = new URLSearchParams({
      subject: subject.replace("{name}", name).replace("{choice}", picked),
      body: flow,
    });
    // URLSearchParams codifica gli spazi come "+": i client di posta vogliono %20.
    window.location.href = `mailto:${email}?${query.toString().replace(/\+/g, "%20")}`;
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-white/15 bg-white/8 p-5 backdrop-blur-sm sm:p-6">
      <p className="text-lg font-semibold text-white">{title}</p>
      <div className="mt-4 space-y-3">
        {choice ? (
          <fieldset>
            <legend className="text-sm font-medium text-[#dbe8ff]">{choice.label}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {choice.options.map((option, index) => (
                <label key={option} className="quick-form__choice">
                  <input
                    type="radio"
                    name="choice"
                    value={option}
                    defaultChecked={index === 0}
                    className="sr-only"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
        <div>
          <label htmlFor={`${baseId}-name`} className="text-sm font-medium text-[#dbe8ff]">
            {nameLabel}
          </label>
          <input
            id={`${baseId}-name`}
            name="name"
            required
            autoComplete="name"
            maxLength={80}
            className="quick-form__field mt-1.5"
          />
        </div>
        <div>
          <label htmlFor={`${baseId}-flow`} className="text-sm font-medium text-[#dbe8ff]">
            {flowLabel}
          </label>
          <textarea
            id={`${baseId}-flow`}
            name="flow"
            required
            rows={3}
            maxLength={1000}
            placeholder={flowPlaceholder}
            className="quick-form__field mt-1.5 resize-y"
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0b2a6b] transition hover:bg-[#dbe8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1f4b]"
      >
        {submit}
      </button>
      <p className="mt-3 text-xs leading-5 text-[#b9cff5]">{note}</p>
    </form>
  );
}
