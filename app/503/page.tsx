import type { Metadata } from "next";

import ServiceUnavailablePage from "@/components/error/ServiceUnavailablePage";

export const metadata: Metadata = {
  title: "503 | Servizio Non Disponibile",
  description: "Il servizio è temporaneamente non disponibile.",
};

export default function ServiceUnavailableRoutePage() {
  return <ServiceUnavailablePage />;
}
