"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getLocaleFromLang, getMessages, withLang, type Locale } from "@/lib/i18n";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname() || "/";
  const locale = getLocaleFromLang(searchParams.get("lang"));
  const navbar = getMessages(locale).site.layout.navbar;
  const home = withLang("/", locale);

  const links = [
    { href: `${home}#chi-sono`, label: navbar.about },
    { href: `${home}#esperienza`, label: navbar.experience },
    { href: `${home}#progetti`, label: navbar.projects },
    { href: withLang("/blog", locale), label: navbar.blog },
    { href: `${home}#contatti`, label: navbar.contact },
  ];

  const languages: { locale: Locale; label: string }[] = [
    { locale: "it", label: navbar.languageIt },
    { locale: "en", label: navbar.languageEn },
  ];

  const languageSwitch = (
    <div className="flex items-center gap-1 font-mono text-xs" aria-label={navbar.languageLabel}>
      {languages.map((item) => (
        <Link
          key={item.locale}
          href={withLang(pathname, item.locale)}
          hrefLang={item.locale}
          aria-current={item.locale === locale ? "true" : undefined}
          onClick={() => setIsMenuOpen(false)}
          className={`rounded-md px-2 py-1 transition-colors ${
            item.locale === locale
              ? "bg-[#2664eb] text-white"
              : "text-[#c9ddff] hover:text-white"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-60 border-b border-white/10 bg-[#06112a]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href={home} className="inline-flex items-center gap-3 font-semibold text-white">
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-lg bg-[#2664eb] font-mono text-xs font-bold"
          >
            AQ
          </span>
          {navbar.brand}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label={navbar.brand}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#c9ddff] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {languageSwitch}
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className="rounded-lg p-2 text-white md:hidden"
        >
          <span className="sr-only">{isMenuOpen ? navbar.closeMenu : navbar.openMenu}</span>
          <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen ? (
        <nav id="mobile-menu" className="border-t border-white/10 px-6 pb-6 md:hidden" aria-label={navbar.brand}>
          <ul className="py-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 text-lg text-[#eef4ff]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {languageSwitch}
        </nav>
      ) : null}
    </header>
  );
}
