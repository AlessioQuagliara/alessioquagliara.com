import type { ReactNode } from "react";

/** Stessa superficie chiara del blog: i casi studio si leggono come articoli. */
export default function CaseStudiesLayout({ children }: { children: ReactNode }) {
  return <div className="blog-surface">{children}</div>;
}
