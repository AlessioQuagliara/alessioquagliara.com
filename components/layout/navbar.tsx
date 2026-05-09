"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getLocaleFromLang, getMessages, withLang } from "@/lib/i18n";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = getLocaleFromLang(searchParams.get("lang"));
  const navbar = getMessages(locale).site.layout.navbar;
  const currentPath = pathname || "/";
  const openMenuLabel = locale === "it" ? "Apri menu" : "Open menu";
  const closeMenuLabel = locale === "it" ? "Chiudi menu" : "Close menu";

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-60 border-b border-[#bdd5ff]/20 bg-[#12347d]/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href={withLang("/", locale)}
          className="group inline-flex items-center gap-3 text-sm font-semibold tracking-wide text-[#eef4ff]"
        >
          <div className="relative">
            {/* Icona decorativa */}
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            {/* Effetto glow hover */}
            <div className="absolute inset-0 bg-blue-500 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
          {navbar.brand}
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#bdd5ff]/40 bg-white/10 text-white transition hover:bg-white/20 md:hidden"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? closeMenuLabel : openMenuLabel}
        >
          <span className="sr-only">{isMenuOpen ? closeMenuLabel : openMenuLabel}</span>
          <svg
            className={`h-5 w-5 transition-transform duration-300 ${isMenuOpen ? "rotate-90" : "rotate-0"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        <nav className="hidden items-center gap-6 text-sm text-[#d9e7ff] md:flex">
          <Link
            href={withLang("/about", locale)}
            className="hover:text-white transition-colors"
          >
            {navbar.about}
          </Link>
          <Link
            href={withLang("/formazione", locale)}
            className="hover:text-white transition-colors"
          >
            {navbar.education}
          </Link>
          <Link
            href={withLang("/projects", locale)}
            className="hover:text-white transition-colors"
          >
            {navbar.projects}
          </Link>
          <Link
            href={withLang("/blog", locale)}
            className="hover:text-white transition-colors"
          >
            {navbar.blog}
          </Link>
          <Link
            href={withLang("/contact", locale)}
            className="hover:text-white transition-colors"
          >
            {navbar.contact}
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-2 py-1 text-xs">
            <span className="text-[#bfd5ff]">{navbar.languageLabel}</span>
            <Link
              href={withLang(currentPath, "it")}
              className={
                locale === "it"
                  ? "text-white font-semibold"
                  : "text-[#bfd5ff] hover:text-white"
              }
            >
              {navbar.languageIt}
            </Link>
            <span className="text-[#9cbcff]">/</span>
            <Link
              href={withLang(currentPath, "en")}
              className={
                locale === "en"
                  ? "text-white font-semibold"
                  : "text-[#bfd5ff] hover:text-white"
              }
            >
              {navbar.languageEn}
            </Link>
          </div>
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-all duration-500 md:hidden ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div
          className={`relative flex h-dvh w-full flex-col border-l border-[#d6e5ff]/25 bg-[#091a46]/80 px-8 pb-8 pt-24 transition-all duration-500 ${
            isMenuOpen ? "translate-y-0" : "translate-y-8"
          }`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, rgba(38,100,235,0.45), transparent 45%), linear-gradient(145deg, #040d22 0%, #0a2156 45%, #1f55ca 100%)",
          }}
        >
          <div className="mb-10 text-xs uppercase tracking-[0.26em] text-[#c3d8ff]">
            {navbar.languageLabel}
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-7">
            <Link
              href={withLang("/about", locale)}
              className="mobile-menu-link"
              onClick={() => setIsMenuOpen(false)}
              style={{ transitionDelay: isMenuOpen ? "80ms" : "0ms" }}
            >
              {navbar.about}
            </Link>
            <Link
              href={withLang("/formazione", locale)}
              className="mobile-menu-link"
              onClick={() => setIsMenuOpen(false)}
              style={{ transitionDelay: isMenuOpen ? "120ms" : "0ms" }}
            >
              {navbar.education}
            </Link>
            <Link
              href={withLang("/projects", locale)}
              className="mobile-menu-link"
              onClick={() => setIsMenuOpen(false)}
              style={{ transitionDelay: isMenuOpen ? "170ms" : "0ms" }}
            >
              {navbar.projects}
            </Link>
            <Link
              href={withLang("/blog", locale)}
              className="mobile-menu-link"
              onClick={() => setIsMenuOpen(false)}
              style={{ transitionDelay: isMenuOpen ? "210ms" : "0ms" }}
            >
              {navbar.blog}
            </Link>
            <Link
              href={withLang("/contact", locale)}
              className="mobile-menu-link"
              onClick={() => setIsMenuOpen(false)}
              style={{ transitionDelay: isMenuOpen ? "250ms" : "0ms" }}
            >
              {navbar.contact}
            </Link>
          </nav>

          <div className="mt-auto flex items-center justify-between rounded-xl border border-[#bfd5ff]/35 bg-white/8 p-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#bfd5ff]">Lang</span>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href={withLang(currentPath, "it")}
                onClick={() => setIsMenuOpen(false)}
                className={locale === "it" ? "font-semibold text-white" : "text-[#bfd5ff]"}
              >
                {navbar.languageIt}
              </Link>
              <span className="text-[#9cbcff]">/</span>
              <Link
                href={withLang(currentPath, "en")}
                onClick={() => setIsMenuOpen(false)}
                className={locale === "en" ? "font-semibold text-white" : "text-[#bfd5ff]"}
              >
                {navbar.languageEn}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
