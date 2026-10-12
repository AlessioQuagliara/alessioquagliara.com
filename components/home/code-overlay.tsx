"use client";

import { useImperativeHandle, useRef, type CSSProperties, type Ref } from "react";

import { CODE_MAX_COLUMNS, CODE_MAX_LINES, CODE_SNIPPETS } from "@/components/home/code-snippets";

export type CodeOverlayHandle = {
  /** 0 → 1: primo snippet nella prima metà, secondo nella seconda. */
  setProgress: (progress: number) => void;
  /** Elemento da posizionare sullo schermo del MacBook. */
  element: HTMLDivElement | null;
};

type CodeOverlayProps = {
  ref?: Ref<CodeOverlayHandle>;
  /** Progresso iniziale: 1 mostra il codice completo (reduced motion). */
  initialProgress?: number;
  className?: string;
  style?: CSSProperties;
};

/** Pausa tra i due snippet, in frazione del progresso. */
const SNIPPET_GAP = 0.04;

function snippetState(progress: number): { active: number; typed: number[] } {
  const half = (1 - SNIPPET_GAP) / 2;
  const first = Math.min(1, Math.max(0, progress / half));
  const second = Math.min(1, Math.max(0, (progress - half - SNIPPET_GAP) / half));

  return {
    active: progress < 0.5 ? 0 : 1,
    typed: [first, second].map((value, index) =>
      Math.round(value * CODE_SNIPPETS[index].code.length)
    ),
  };
}

/**
 * Codice "digitato" in base allo scroll, come HTML (<pre>) e non canvas:
 * testo nitido a qualsiasi DPR, selezionabile e leggero. Gli aggiornamenti
 * sono imperativi (textContent sugli span), quindi nessun re-render React.
 */
export function CodeOverlay({ ref, initialProgress = 0, className = "", style }: CodeOverlayProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tokenRefs = useRef<(HTMLSpanElement | null)[][]>(CODE_SNIPPETS.map(() => []));
  const tabRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const preRefs = useRef<(HTMLPreElement | null)[]>([]);
  const lastTyped = useRef<number[]>(CODE_SNIPPETS.map(() => -1));
  const lastActive = useRef(-1);

  useImperativeHandle(ref, () => ({
    get element() {
      return rootRef.current;
    },
    setProgress(progress: number) {
      const { active, typed } = snippetState(progress);

      if (active !== lastActive.current) {
        lastActive.current = active;
        CODE_SNIPPETS.forEach((_, index) => {
          const isActive = String(index === active);
          tabRefs.current[index]?.setAttribute("data-active", isActive);
          preRefs.current[index]?.setAttribute("data-active", isActive);
        });
      }

      CODE_SNIPPETS.forEach((snippet, snippetIndex) => {
        const count = typed[snippetIndex];
        if (count === lastTyped.current[snippetIndex]) return;
        lastTyped.current[snippetIndex] = count;

        let offset = 0;
        snippet.tokens.forEach((token, tokenIndex) => {
          const span = tokenRefs.current[snippetIndex][tokenIndex];
          const visible = token.text.slice(0, Math.max(0, count - offset));
          if (span && span.textContent !== visible) span.textContent = visible;
          offset += token.text.length;
        });
      });
    },
  }));

  const initial = snippetState(initialProgress);

  return (
    <div
      ref={rootRef}
      className={`code-overlay ${className}`}
      aria-hidden="true"
      style={
        {
          ...style,
          "--code-rows": CODE_MAX_LINES * 1.4 + 3.4,
          "--code-cols": CODE_MAX_COLUMNS * 0.6 + 2.2,
        } as CSSProperties
      }
    >
      <div className="code-overlay__tabs">
        {CODE_SNIPPETS.map((snippet, index) => (
          <span
            key={snippet.file}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            className="code-overlay__tab"
            data-active={String(index === initial.active)}
          >
            {snippet.file}
          </span>
        ))}
      </div>
      {CODE_SNIPPETS.map((snippet, snippetIndex) => {
        let offset = 0;
        return (
          <pre
            key={snippet.file}
            ref={(node) => {
              preRefs.current[snippetIndex] = node;
            }}
            className="code-overlay__code"
            data-active={String(snippetIndex === initial.active)}
          >
            <code>
              {snippet.tokens.map((token, tokenIndex) => {
                const visible = token.text.slice(
                  0,
                  Math.max(0, initial.typed[snippetIndex] - offset)
                );
                offset += token.text.length;
                return (
                  <span
                    key={tokenIndex}
                    ref={(node) => {
                      tokenRefs.current[snippetIndex][tokenIndex] = node;
                    }}
                    className={`tok-${token.kind}`}
                  >
                    {visible}
                  </span>
                );
              })}
              <span className="code-overlay__cursor" />
            </code>
          </pre>
        );
      })}
    </div>
  );
}
