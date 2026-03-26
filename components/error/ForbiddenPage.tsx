"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 text-[#eef4ff] bg-[radial-gradient(1000px_circle_at_10%_-10%,rgba(38,100,235,0.35),transparent_55%),linear-gradient(135deg,#08142f_0%,#12347d_50%,#2664eb_100%)]">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#dce9ff]">
            <svg className="h-16 w-16 text-[#2664eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-white">403</h1>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Accesso <span className="text-[#bfd5ff]">Negato</span>
          </h2>
          <p className="mb-6 leading-relaxed text-[#d7e5ff]">
            Non hai i permessi necessari per accedere a questa risorsa. 
            Se pensi che questo sia un errore, contatta l&apos;amministratore.
          </p>
          
          <div className="rounded-lg border border-[#b9d2ff]/40 bg-[#0e306f]/50 p-4">
            <h3 className="mb-2 flex items-center text-sm font-semibold text-[#dce9ff]">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Possibili motivi:
            </h3>
            <ul className="list-inside list-disc space-y-1 text-left text-sm text-[#c8dcff]">
              <li>Area riservata agli amministratori</li>
              <li>Session scaduta</li>
              <li>Credenziali insufficienti</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/contact"
            className={buttonClass({ variant: "primary", fullWidth: true })}
          >
            Contattami
          </Link>
          <div className="flex space-x-4">
            <Link
              href="/"
              className={buttonClass({ variant: "secondary", className: "flex-1" })}
            >
              Homepage
            </Link>
            <button
              onClick={() => window.history.back()}
              className={buttonClass({ variant: "secondary", className: "flex-1" })}
            >
              Indietro
            </button>
          </div>
        </div>

        {/* Contact Admin */}
        <div className="mt-8 border-t border-[#bdd5ff]/30 pt-6">
          <p className="text-sm text-[#c8dcff]">
            Problemi di accesso?{' '}
            <a
              href="https://discord.com/users/alessio_quagliara" 
              className="font-medium text-white hover:underline"
            >
              Contatta l&apos;amministratore
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForbiddenPage;
