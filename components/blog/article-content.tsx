"use client";

import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { slugify } from "@/lib/toc";

type ArticleContentProps = {
  content: string;
  /** Etichette localizzate per i callout (blockquote con [!TIPO]). */
  calloutLabels: {
    takeaway: string;
    note: string;
    tip: string;
    warning: string;
  };
};

/** Estrae ricorsivamente il testo puro da un albero di nodi React. */
function nodeToText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (isValidElement(node)) {
    return nodeToText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

// Sintassi supportata: blockquote che inizia con [!TAKEAWAY] / [!NOTE] / [!TIP] / [!WARNING]
const CALLOUT_PATTERN = /^\[!(TAKEAWAY|KEY|NOTE|TIP|WARNING)\]\s*/i;

type CalloutType = "takeaway" | "note" | "tip" | "warning";

const CALLOUT_ICONS: Record<CalloutType, string> = {
  takeaway: "💡",
  note: "📝",
  tip: "✅",
  warning: "⚠️",
};

/**
 * Rendering del corpo articolo con:
 * - id sugli heading H2/H3 (anchor per la TOC),
 * - callout stilizzati da blockquote con marcatore [!TIPO],
 * - syntax highlighting per i blocchi di codice.
 */
export function ArticleContent({ content, calloutLabels }: ArticleContentProps) {
  return (
    <div className="article-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkEmoji]}
        components={{
          h2({ children }) {
            return <h2 id={slugify(nodeToText(children))}>{children}</h2>;
          },
          h3({ children }) {
            return <h3 id={slugify(nodeToText(children))}>{children}</h3>;
          },
          blockquote({ children }) {
            // Cerca il marcatore [!TIPO] nel primo paragrafo del blockquote.
            const raw = nodeToText(children);
            const match = CALLOUT_PATTERN.exec(raw.trimStart());

            if (!match) {
              return <blockquote>{children}</blockquote>;
            }

            const keyword = match[1].toUpperCase();
            const type: CalloutType =
              keyword === "KEY" || keyword === "TAKEAWAY"
                ? "takeaway"
                : (keyword.toLowerCase() as CalloutType);

            // Rimuove il marcatore [!TIPO] dal testo mostrato.
            const cleaned = stripMarker(children);

            return (
              <aside className={`callout callout--${type}`} role="note">
                <p className="callout__label">
                  <span aria-hidden="true">{CALLOUT_ICONS[type]}</span>
                  {calloutLabels[type]}
                </p>
                <div className="callout__body">{cleaned}</div>
              </aside>
            );
          },
          code({ className, children, ...props }) {
            const match = /language-([\w-]+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  borderRadius: "10px",
                  background: "#161b22",
                  border: "1px solid #30363d",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Rimuove il marcatore [!TIPO] dall'inizio del contenuto del callout,
 * preservando la restante struttura React.
 */
function stripMarker(children: ReactNode): ReactNode {
  const array = Children.toArray(children);
  return array.map((child, index) => {
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === "p") {
      const inner = Children.toArray(child.props.children);
      if (inner.length > 0 && typeof inner[0] === "string") {
        inner[0] = inner[0].replace(CALLOUT_PATTERN, "");
      }
      return <p key={`callout-p-${index}`}>{inner}</p>;
    }
    return child;
  });
}
