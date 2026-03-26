import type { Metadata } from "next";

import ServerErrorPage from "@/components/error/ServerErrorPage";

export const metadata: Metadata = {
  title: "500 | Errore Server",
  description: "Si è verificato un errore interno del server.",
};

export default function ServerErrorRoutePage() {
  return <ServerErrorPage />;
}
