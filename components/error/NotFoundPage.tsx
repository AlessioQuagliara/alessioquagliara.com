"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 text-[#eef4ff] bg-[radial-gradient(1000px_circle_at_10%_-10%,rgba(38,100,235,0.35),transparent_55%),linear-gradient(135deg,#08142f_0%,#12347d_50%,#2664eb_100%)]">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#dce9ff]">
            <svg className="h-16 w-16 text-[#2664eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Pagina <span className="text-[#bfd5ff]">Non Trovata</span>
          </h2>
          <p className="mb-6 leading-relaxed text-[#d7e5ff]">
            Sembra che la pagina che stai cercando non esista più o sia stata spostata. 
            Potrebbe essere un errore di digitazione o un link obsoleto.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/"
            className={buttonClass({ variant: "primary", fullWidth: true })}
          >
            Torna alla Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className={buttonClass({ variant: "secondary", fullWidth: true })}
          >
            Torna Indietro
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 border-t border-[#bdd5ff]/30 pt-6">
          <p className="mb-4 text-sm text-[#c8dcff]">
            Se pensi che questo sia un errore, puoi contattarmi:
          </p>
          <a
            href="https://discord.com/users/alessio_quagliara" 
            className="font-medium text-[#eef4ff] hover:underline"
          >
            alessio_quagliara
          </a>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
