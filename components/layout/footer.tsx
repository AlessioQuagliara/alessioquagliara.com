"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getLocaleFromLang, getMessages, withLang } from "@/lib/i18n";

export function Footer() {
  const searchParams = useSearchParams();
  const locale = getLocaleFromLang(searchParams.get("lang"));
  const footer = getMessages(locale).site.layout.footer;
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const socialLinks = [
    {
      id: "linkedin",
      url: "https://www.linkedin.com/in/alessio-quagliara-a1a91b1a8/",
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      name: footer.social.linkedin.name,
      description: footer.social.linkedin.description,
    },
    {
      id: "github",
      url: "https://github.com/AlessioQuagliara",
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      name: footer.social.github.name,
      description: footer.social.github.description,
    },
    {
      id: "youtube",
      url: "https://www.youtube.com/@AlessioQuagliaraDev",
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      name: footer.social.youtube.name,
      description: footer.social.youtube.description,
    },
    {
      id: "instagram",
      url: "https://www.instagram.com/alessio_quagliara_/",
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      name: footer.social.instagram.name,
      description: footer.social.instagram.description,
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[#bdd5ff]/20 bg-[#0f2c6f]/55">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500/0 via-[#5f95ff]/50 to-blue-500/0"></div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#5f95ff] to-[#4080ff]">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{footer.brandName}</h3>
                <p className="text-sm text-[#9fc2ff]">{footer.brandSubtitle}</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#c8dcff]">
              {footer.brandDescription}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              {footer.section.legal}
            </h4>
            <div className="space-y-2">
              <Link
                href={withLang("/privacy-policy", locale)}
                className="block text-sm text-[#c8dcff] transition-colors duration-300 hover:text-[#5f95ff]"
              >
                {footer.links.privacyPolicy}
              </Link>
              <Link
                href={withLang("/contact", locale)}
                className="block text-sm text-[#c8dcff] transition-colors duration-300 hover:text-[#5f95ff]"
              >
                {footer.links.contact}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              {footer.section.contacts}
            </h4>
            <div className="space-y-2 text-sm text-[#c8dcff]">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{footer.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a href={`mailto:${footer.email}`} className="hover:text-[#5f95ff]">
                  {footer.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 border-t border-[#8cb4ff]/24"></div>

        <div className="flex flex-col items-center justify-between space-y-8 lg:flex-row lg:space-y-0">
          <div className="text-center lg:text-left">
            <p className="text-sm text-[#c8dcff]">
              © {currentYear} {footer.copyrightName}. {footer.allRightsReserved}
            </p>
            <p className="mt-1 text-xs text-[#9fc2ff]">{footer.builtWith}</p>
          </div>

          <div className="flex items-center space-x-3">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative rounded-xl border p-3 transition-all duration-300 ${
                  hoveredLink === social.id
                    ? "scale-110 border-[#5f95ff]/50 bg-[#5f95ff]/10 text-[#5f95ff]"
                    : "border-[#8cb4ff]/24 bg-[#081d48]/30 text-[#c8dcff] hover:border-[#5f95ff]/30 hover:bg-[#081d48]/50"
                }`}
                onMouseEnter={() => setHoveredLink(social.id)}
                onMouseLeave={() => setHoveredLink(null)}
                aria-label={`${social.name} - ${social.description}`}
              >
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {social.icon}
                </div>

                <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded-lg border border-[#8cb4ff]/24 bg-[#081d48]/95 px-3 py-2 text-xs text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <div className="font-semibold">{social.name}</div>
                  <div className="text-[#9fc2ff]">{social.description}</div>
                  <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform border-r border-b border-[#8cb4ff]/24 bg-[#081d48]/95"></div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 h-32 w-32 rounded-tl-full bg-gradient-to-tl from-[#5f95ff]/5 to-transparent"></div>
    </footer>
  );
}
