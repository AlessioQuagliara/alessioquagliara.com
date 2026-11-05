import type { Metadata } from "next";
import { ArchivedLanding } from "@/components/landing/archived-landing";
import { getMessages } from "@/lib/i18n";
import { buildLandingMetadata } from "@/lib/landings";

export function generateMetadata(): Metadata {
  return buildLandingMetadata("freelance", "en", getMessages("en").site.landings.freelance.metadata);
}

export default function Page() {
  return <ArchivedLanding landing="freelance" locale="en" />;
}
