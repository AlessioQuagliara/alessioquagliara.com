import type { Metadata } from "next";
import { SaasLanding } from "@/components/landing/saas-landing";
import { getMessages } from "@/lib/i18n";
import { buildLandingMetadata } from "@/lib/landings";

export function generateMetadata(): Metadata {
  return buildLandingMetadata("saas", "it", getMessages("it").site.landings.saas.metadata);
}

export default function Page() {
  return <SaasLanding locale="it" />;
}
