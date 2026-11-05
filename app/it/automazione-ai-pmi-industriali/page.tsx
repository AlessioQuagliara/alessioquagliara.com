import type { Metadata } from "next";
import { ArchivedLanding } from "@/components/landing/archived-landing";
import { getMessages } from "@/lib/i18n";
import { buildLandingMetadata } from "@/lib/landings";

export function generateMetadata(): Metadata {
  return buildLandingMetadata("industrial", "it", getMessages("it").site.landings.industrial.metadata);
}

export default function Page() {
  return <ArchivedLanding landing="industrial" locale="it" />;
}
