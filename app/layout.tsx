import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import { CalendlyWidget } from "@/components/layout/calendly-widget";
import CookieConsent from "@/components/layout/cookie-consent";
import ScrollToTop from "@/components/layout/scroll-to-top";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getMessages } from "@/lib/i18n";

config.autoAddCss = false;

const siteMessages = getMessages("it").site;
const siteMetadata = siteMessages.metadata as Record<string, string>;

export const viewport: Viewport = {
  themeColor: "#2664eb",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://alessioquagliara.com"),
  title:
    siteMetadata.defaultTitle ??
    "Indie Hacker Building SaaS in Public | AI Engineering Student",
  description:
    siteMetadata.defaultDescription ??
    "Studente di Ingegneria Informatica appassionato di software, automazione industriale e AI. Documento in pubblico piccoli SaaS, esperimenti software e strumenti operativi.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/assets/favicon.ico" },
      { url: "/assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/assets/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/assets/site.webmanifest",
  other: {
    "msapplication-TileColor": "#2664eb",
  },
  openGraph: {
    title: siteMetadata.ogTitle ?? "Alessio Quagliara",
    description:
      siteMetadata.ogDescription ??
      "Indie hacker che costruisce in pubblico piccoli SaaS, esperimenti software, automazioni e tooling AI.",
    url: "https://alessioquagliara.com",
    siteName: siteMetadata.ogTitle ?? "Alessio Quagliara",
    locale: siteMetadata.locale ?? "it_IT",
    type: "website",
    images: [
      {
        url: "/assets/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: siteMetadata.ogTitle ?? "Alessio Quagliara",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="text-slate-50 antialiased">
        <div className="site-shell flex min-h-screen flex-col">
          <ScrollToTop />
          <Suspense
            fallback={<div className="h-16 border-b border-white/15 bg-[#12347d]/70" />}
          >
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <CalendlyWidget />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
