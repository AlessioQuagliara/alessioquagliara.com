type PrivacyPolicyProps = {
  lastUpdated?: string;
};

function PrivacyPolicy({ lastUpdated }: PrivacyPolicyProps) {

  return (
    <div className="relative z-10 py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy <span className="text-blue-600 underline decoration-blue-300">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Informativa sulla privacy e gestione dei cookie
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-8">
            {/* Introduzione */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduzione</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Benvenuto nel sito web di Alessio Quagliara. La tua privacy è importante per me. 
                Questa politica spiega come raccolgo, uso e proteggo le tue informazioni personali.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Sono un sviluppatore autonomo che crede nella trasparenza e nel rispetto della privacy degli utenti. 
                Questa policy è scritta in linguaggio semplice per essere comprensibile a tutti.
              </p>
            </section>

            {/* Raccolta Dati */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quali Dati Raccolgo</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Dati che fornisci volontariamente</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Nome e indirizzo email (tramite form di contatto)</li>
                    <li>Messaggi che mi invii</li>
                    <li>Informazioni sul tuo progetto</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Dati raccolti automaticamente</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Indirizzo IP e informazioni sul browser</li>
                    <li>Pagine visitate e tempo di permanenza</li>
                    <li>Dati tecnici sul dispositivo utilizzato</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookie */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Utilizzo dei Cookie</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Cookie Necessari
                  </h3>
                  <p className="text-blue-800 text-sm">
                    Questi cookie sono essenziali per il funzionamento del sito e non possono essere disattivati. 
                    Includono cookie per ricordare le tue preferenze sulla privacy.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cookie di Prestazione
                  </h3>
                  <p className="text-green-800 text-sm">
                    Questi cookie ci aiutano a capire come i visitatori interagiscono con il sito, 
                    fornendo informazioni sulle aree visitate e il tempo trascorso sul sito.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    </svg>
                    Cookie di Marketing
                  </h3>
                  <p className="text-purple-800 text-sm">
                    Utilizzati per tracciare i visitatori attraverso i siti web. L&apos;intenzione è quella di 
                    visualizzare annunci pertinenti e coinvolgenti per il singolo utente.
                  </p>
                </div>
              </div>
            </section>

            {/* Finalità */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Come Utilizzo i Tuoi Dati</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Rispondere alle Richieste</h3>
                  <p className="text-gray-700 text-sm">Per rispondere alle tue domande via email o form di contatto</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Migliorare il Sito</h3>
                  <p className="text-gray-700 text-sm">Analisi dell&apos;uso del sito per ottimizzare contenuti e esperienza utente</p>
                </div>
              </div>
            </section>

            {/* Diritti */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">I Tuoi Diritti</h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Diritto di accesso:</strong> Puoi chiedere quali dati personali possiedo su di te</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Diritto alla rettifica:</strong> Puoi chiedere di correggere dati inesatti</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Diritto alla cancellazione:</strong> Puoi chiedere la cancellazione dei tuoi dati</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Diritto di opposizione:</strong> Puoi opporti al trattamento dei tuoi dati</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contatti */}
            <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-xl font-bold text-blue-900 mb-3">Contatti</h2>
              <p className="text-blue-800 mb-4">
                Per qualsiasi domanda sulla privacy o per esercitare i tuoi diritti, 
                puoi contattarmi su discord:
              </p>
              <a 
                href="https://discord.com/users/alessio_quagliara" 
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                alessio_quagliara
              </a>
            </section>

            {/* Ultimo Aggiornamento */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                <strong>Ultimo aggiornamento:</strong>{" "}
                {lastUpdated ?? new Date().toLocaleDateString("it-IT")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
