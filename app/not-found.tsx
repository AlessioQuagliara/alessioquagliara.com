import type { Metadata } from "next";

import NotFoundPage from "@/components/error/NotFoundPage";

export const metadata: Metadata = {
  title: "404 | Pagina Non Trovata",
  description: "La pagina richiesta non è disponibile.",
};

export default function NotFound() {
  return <NotFoundPage />;
}
