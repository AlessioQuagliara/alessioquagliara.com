"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SocialLinks } from "@/components/layout/social-links";
import { getLocaleFromLang, getMessages, withLang } from "@/lib/i18n";

export function Footer() {
  const locale = getLocaleFromLang(useSearchParams().get("lang"));
  const { navbar, footer } = getMessages(locale).site.layout;

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 text-sm text-[#c9ddff] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {navbar.brand}. {footer.allRightsReserved}{" "}
          <Link href={withLang("/privacy-policy", locale)} className="underline-offset-4 hover:text-white hover:underline">
            {footer.privacyPolicy}
          </Link>
        </p>
        <SocialLinks label={footer.social} />
      </div>
    </footer>
  );
}
