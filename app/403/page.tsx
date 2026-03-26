import type { Metadata } from "next";

import ForbiddenPage from "@/components/error/ForbiddenPage";

export const metadata: Metadata = {
  title: "403 | Accesso Negato",
  description: "Non hai i permessi necessari per accedere a questa risorsa.",
};

export default function ForbiddenRoutePage() {
  return <ForbiddenPage />;
}
