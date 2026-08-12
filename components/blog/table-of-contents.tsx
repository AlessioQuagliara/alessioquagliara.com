"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import type { TocItem } from "@/lib/toc";

type TableOfContentsProps = {
  items: TocItem[];
  title: string;
};

/**
 * Table of Contents con stile scuro (sfondo #0f172a, testo chiaro).
 * - Desktop (>=1024px): sticky, sempre visibile.
 * - Mobile: pannello collassabile con pulsante (drawer inline).
 * La sezione corrente è evidenziata con un IntersectionObserver.
 */
export function TableOfContents({ items, title }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -66% 0px", threshold: [0, 1] }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
    setOpen(false); // chiude il drawer su mobile dopo il salto
  };

  return (
    <div>
      <button
        type="button"
        className="toc__toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{title}</span>
        <FontAwesomeIcon icon={faChevronDown} className="toc__toggle-icon" />
      </button>

      <nav className="toc" data-open={open} aria-label={title}>
        <p className="toc__title">{title}</p>
        <ul className="toc__list">
          {items.map((item) => (
            <li
              key={item.id}
              className={
                item.level === 3 ? "toc__item toc__item--sub" : "toc__item"
              }
            >
              <a
                href={`#${item.id}`}
                onClick={(event) => handleClick(event, item.id)}
                className={
                  activeId === item.id
                    ? "toc__link toc__link--active"
                    : "toc__link"
                }
                aria-current={activeId === item.id ? "location" : undefined}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
