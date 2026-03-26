import type { Metadata } from "next";

import PrivacyPolicy from "@/components/layout/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy | Informativa sulla Privacy",
  description:
    "Informativa privacy del sito di Alessio Quagliara: trattamento dati personali e preferenze cookie.",
  keywords: [
    "privacy policy",
    "informativa privacy",
    "cookie",
    "dati personali",
    "Alessio Quagliara",
  ],
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy lastUpdated="25/03/2026" />;
}
