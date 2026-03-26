import type { Metadata } from "next";

import BadGatewayPage from "@/components/error/BadGatewayPage";

export const metadata: Metadata = {
  title: "502 | Bad Gateway",
  description: "Il server ha ricevuto una risposta non valida dal servizio upstream.",
};

export default function BadGatewayRoutePage() {
  return <BadGatewayPage />;
}
