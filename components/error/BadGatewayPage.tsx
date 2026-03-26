"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

function BadGatewayPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 text-[#eef4ff] bg-[radial-gradient(1000px_circle_at_10%_-10%,rgba(38,100,235,0.35),transparent_55%),linear-gradient(135deg,#08142f_0%,#12347d_50%,#2664eb_100%)]">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#dce9ff]">
            <svg className="h-16 w-16 text-[#2664eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-white">502</h1>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Bad <span className="text-[#bfd5ff]">Gateway</span>
          </h2>
          <p className="mb-6 leading-relaxed text-[#d7e5ff]">
            Il server ha ricevuto una risposta non valida dal server upstream. 
            Questo potrebbe essere temporaneo mentre i servizi vengono aggiornati.
          </p>
          
          <div className="rounded-lg border border-[#b9d2ff]/40 bg-[#0e306f]/50 p-4">
            <h3 className="mb-2 flex items-center text-sm font-semibold text-[#dce9ff]">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Probabile causa:
            </h3>
            <p className="text-sm text-[#c8dcff]">
              Manutenzione del server o problemi di comunicazione tra servizi
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className={buttonClass({ variant: "primary", fullWidth: true })}
          >
            Riprova Ora
          </button>
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

        {/* Status */}
        <div className="mt-8 border-t border-[#bdd5ff]/30 pt-6">
          <div className="flex items-center justify-center space-x-2 text-sm text-[#c8dcff]">
            <div className="h-2 w-2 rounded-full bg-[#2664eb] animate-pulse"></div>
            <span>Stato: Manutenzione temporanea</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BadGatewayPage;
