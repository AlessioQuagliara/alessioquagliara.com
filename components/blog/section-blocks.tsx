import type { Section } from "@/lib/blog";
import { ArticleContent } from "@/components/blog/article-content";

type CalloutLabels = {
  takeaway: string;
  note: string;
  tip: string;
  warning: string;
};

type SectionBlocksProps = {
  sections: Section[];
  calloutLabels: CalloutLabels;
};

/**
 * Rende l'articolo come sequenza di "blocchi da quaderno": ogni sezione
 * (H2) è una card staccata, collegata alle altre da una linea verticale
 * (gestita in CSS via .section-flow / .section-block). Il testo prima del
 * primo H2 è un blocco "intro" senza titolo né nodo.
 */
export function SectionBlocks({ sections, calloutLabels }: SectionBlocksProps) {
  return (
    <div className="section-flow">
      {sections.map((section, index) => {
        const isIntro = !section.title;
        return (
          <section
            key={section.id || `section-${index}`}
            className={
              isIntro ? "section-block section-block--intro" : "section-block"
            }
            data-reveal-item
          >
            {section.title ? (
              <h2 id={section.id} className="section-block__title">
                {section.title}
              </h2>
            ) : null}

            {section.image ? (
              // Immagine opzionale della sezione. Uso <img> nativo perché il
              // path è arbitrario e a ratio ignoto: così resta responsive e
              // senza distorsione (width:100% / height:auto via .section-image).
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={section.image}
                alt={section.title || ""}
                loading="lazy"
                decoding="async"
                className="section-image"
              />
            ) : null}

            <ArticleContent content={section.body} calloutLabels={calloutLabels} />
          </section>
        );
      })}
    </div>
  );
}
