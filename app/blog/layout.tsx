import type { ReactNode } from "react";

/**
 * Layout del segmento /blog: applica la superficie chiara permanente
 * (light-only) all'esperienza di lettura, senza alterare navbar, footer
 * e le altre sezioni del sito che mantengono la loro identità dark.
 */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div className="blog-surface">{children}</div>;
}
