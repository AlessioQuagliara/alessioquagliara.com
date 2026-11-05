import type { Metadata } from "next";
import { ArchivedLanding } from "@/components/landing/archived-landing";
import { getMessages } from "@/lib/i18n";
import { buildLandingMetadata } from "@/lib/landings";

export function generateMetadata(): Metadata {
  return buildLandingMetadata("saas", "en", getMessages("en").site.landings.saas.metadata);
}

export default function Page() {
  return <ArchivedLanding landing="saas" locale="en" />;
}
