"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

function ServiceUnavailablePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 text-[#eef4ff] bg-[radial-gradient(1000px_circle_at_10%_-10%,rgba(38,100,235,0.35),transparent_55%),linear-gradient(135deg,#08142f_0%,#12347d_50%,#2664eb_100%)]">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#dce9ff]">
            <svg className="h-16 w-16 text-[#2664eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-white">503</h1>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Servizio <span className="text-[#bfd5ff]">Non Disponibile</span>
          </h2>
          <p className="mb-6 leading-relaxed text-[#d7e5ff]">
            Il servizio è temporaneamente non disponibile a causa di manutenzione o sovraccarico. 
            Torneremo online al più presto.
          </p>
          
          <div className="rounded-lg border border-[#b9d2ff]/40 bg-[#0e306f]/50 p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-[#96b7ff] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-semibold text-[#dce9ff]">Manutenzione in corso</span>
            </div>
            <p className="text-sm text-[#c8dcff]">
              Stiamo lavorando per migliorare il servizio. Torneremo tra pochi minuti.
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-6">
          <div className="rounded-lg border border-[#b9d2ff]/40 bg-[#0e306f]/50 p-4">
            <p className="mb-2 text-sm text-[#c8dcff]">Stimato tempo di ripristino:</p>
            <div className="text-2xl font-bold text-white">5-10 minuti</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className={buttonClass({ variant: "primary", fullWidth: true })}
          >
            Ricarica la Pagina
          </button>
          <Link
            href="/"
            className={buttonClass({ variant: "secondary", fullWidth: true })}
          >
            Torna alla Homepage
          </Link>
        </div>

        {/* Social Links */}
        <div className="mt-8 border-t border-[#bdd5ff]/30 pt-6">
          <p className="mb-3 text-sm text-[#c8dcff]">
            Seguimi per aggiornamenti:
          </p>
          <div className="flex justify-center space-x-4">
            <a href="https://linkedin.com/in/alessio-quagliara" className="text-[#c8dcff] transition-colors hover:text-white">
              LinkedIn
            </a>
            <a href="https://github.com/AlessioQuagliara" className="text-[#c8dcff] transition-colors hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceUnavailablePage;
