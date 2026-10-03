import type { Metadata } from "next";
import { IndustrialLanding } from "@/components/landing/industrial-landing";
import { getMessages } from "@/lib/i18n";
import { buildLandingMetadata } from "@/lib/landings";

export function generateMetadata(): Metadata {
  return buildLandingMetadata("industrial", "en", getMessages("en").site.landings.industrial.metadata);
}

export default function Page() {
  return <IndustrialLanding locale="en" />;
}
