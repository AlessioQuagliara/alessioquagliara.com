import type { Metadata } from "next";
import { FreelanceLanding } from "@/components/landing/freelance-landing";
import { getMessages } from "@/lib/i18n";
import { buildLandingMetadata } from "@/lib/landings";

export function generateMetadata(): Metadata {
  return buildLandingMetadata("freelance", "it", getMessages("it").site.landings.freelance.metadata);
}

export default function Page() {
  return <FreelanceLanding locale="it" />;
}
