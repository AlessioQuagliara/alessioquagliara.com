"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getLocaleFromLang, getMessages, type Locale, withLang } from "@/lib/i18n";
import { buttonClass } from "@/components/ui/button";

function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [locale, setLocale] = useState<Locale>("it");
  const messages = getMessages(locale);

  useEffect(() => {
    // Controlla se l'utente ha già dato il consenso
    const hasConsent = localStorage.getItem('cookieConsent');
    
    if (!hasConsent) {
      const currentLocale = getLocaleFromLang(
        new URLSearchParams(window.location.search).get("lang")
      );

      // Mostra il banner dopo un piccolo delay
      const timer = setTimeout(() => {
        setLocale(currentLocale);
        setShowConsent(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
    
    // Inizializza i cookie di tracciamento (Google Analytics, etc.)
    initializeTrackingCookies();
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowConsent(false);
    
    // Rimuovi i cookie di tracciamento esistenti
    removeTrackingCookies();
  };

  const initializeTrackingCookies = () => {
    // Esempio: Inizializza Google Analytics
    // gtag('config', 'GA_MEASUREMENT_ID');
  };

  const removeTrackingCookies = () => {
    // Rimuovi tutti i cookie di tracciamento
    const cookies = document.cookie.split(";");
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // Rimuovi cookie di tracciamento (aggiungi altri domini se necessario)
      if (name.includes('_ga') || name.includes('_gid') || name.includes('_gat')) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=." + window.location.hostname + "; path=/";
      }
    }
  };

  // Se l'utente ha già dato il consenso o non deve vedere il banner, non renderizzare nulla
  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-90 flex items-end justify-center px-4 py-6 sm:p-6 sm:items-start sm:justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 z-90 bg-[#020b1f]/55 backdrop-blur-[1px] transition-opacity"></div>
      
      {/* Cookie Banner */}
      <div className="relative z-91 w-full max-w-lg transform rounded-2xl border border-[#b9d2ff] bg-[#f7faff] shadow-xl transition-all duration-300 ease-in-out">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-[#dbe8ff] flex items-center justify-center">
              <svg className="h-6 w-6 text-[#2664eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-bold text-[#0d265f]">
                {messages.cookie.title}
              </h3>
              <p className="text-sm text-[#35579f]">
                {messages.cookie.subtitle}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="mb-3 text-sm leading-relaxed text-[#1f3870]">
              {messages.cookie.description}
            </p>
            
            <div className="rounded-lg border border-[#c5daff] bg-[#e8f0ff] p-4">
              <h4 className="mb-2 flex items-center text-sm font-semibold text-[#12347d]">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {messages.cookie.whatAreCookiesTitle}
              </h4>
              <p className="text-xs leading-relaxed text-[#1f4ea9]">
                {messages.cookie.whatAreCookiesText}
              </p>
            </div>
          </div>

          {/* Cookie Types */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-[#2664eb]"></div>
                <span className="text-sm font-medium text-gray-900">{messages.cookie.necessaryLabel}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{messages.cookie.necessaryHint}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-[#4f8fff]"></div>
                <span className="text-sm font-medium text-gray-900">{messages.cookie.performanceLabel}</span>
              </div>
              <span className="text-xs text-gray-500">{messages.cookie.performanceHint}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-[#1f55ca]"></div>
                <span className="text-sm font-medium text-gray-900">{messages.cookie.marketingLabel}</span>
              </div>
              <span className="text-xs text-gray-500">{messages.cookie.marketingHint}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              className={buttonClass({ variant: "primary", fullWidth: true })}
            >
              {messages.cookie.acceptAll}
            </button>
            <button
              onClick={handleReject}
              className={buttonClass({ variant: "secondary", fullWidth: true, className: "text-[#1f3b77]!" })}
            >
              {messages.cookie.reject}
            </button>
          </div>

          {/* Privacy Policy Link */}
          <div className="mt-4 text-center">
            <Link
              href={withLang("/privacy-policy", locale)}
              className="text-sm text-[#2664eb] transition-colors hover:text-[#1f55ca] hover:underline"
            >
              {messages.cookie.privacyLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
