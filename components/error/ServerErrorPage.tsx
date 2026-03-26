"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 text-[#eef4ff] bg-[radial-gradient(1000px_circle_at_10%_-10%,rgba(38,100,235,0.35),transparent_55%),linear-gradient(135deg,#08142f_0%,#12347d_50%,#2664eb_100%)]">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#dce9ff]">
            <svg className="h-16 w-16 text-[#2664eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-white">500</h1>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Errore <span className="text-[#bfd5ff]">Interno del Server</span>
          </h2>
          <p className="mb-6 leading-relaxed text-[#d7e5ff]">
            Si è verificato un errore imprevisto sul server. Stiamo lavorando per risolvere il problema il prima possibile.
          </p>
          
          <div className="rounded-lg border border-[#b9d2ff]/40 bg-[#0e306f]/50 p-4 text-left">
            <h3 className="mb-2 flex items-center text-sm font-semibold text-[#dce9ff]">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cosa puoi fare:
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-[#c8dcff]">
              <li>Riprova a caricare la pagina</li>
              <li>Attendi qualche minuto</li>
              <li>Controlla la tua connessione internet</li>
            </ul>
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

        {/* Contact */}
        <div className="mt-8 border-t border-[#bdd5ff]/30 pt-6">
          <p className="text-sm text-[#c8dcff]">
            Se il problema persiste,{' '}
            <a
              href="https://discord.com/users/alessio_quagliara" 
              className="font-medium text-white hover:underline"
            >
              contattami
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServerErrorPage;
