import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Stesso valore di LOCALE_HEADER in lib/i18n.ts: non lo importo per non
// trascinare i dizionari dei messaggi dentro il proxy.
const LOCALE_HEADER = "x-site-locale";

// La lingua sta in `?lang=`: la passo al root layout per impostare
// <html lang> lato server.
export function proxy(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "it";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Solo pagine: niente asset statici né file con estensione.
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
