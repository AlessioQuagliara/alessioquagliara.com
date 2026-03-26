"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Calendly?: {
      initBadgeWidget: (options: {
        url: string;
        text: string;
        color: string;
        textColor: string;
        branding: boolean;
      }) => void;
    };
  }
}

const CALENDLY_SCRIPT_ID = "calendly-widget-script";
const CALENDLY_STYLESHEET_ID = "calendly-widget-stylesheet";
const CALENDLY_URL = "https://calendly.com/quagliara-alessio/meeting-conoscitivo";

function cleanupCalendlyBadge() {
  document
    .querySelectorAll(".calendly-badge-widget")
    .forEach((element) => element.remove());
}

function ensureCalendlyStylesheet() {
  if (document.getElementById(CALENDLY_STYLESHEET_ID)) {
    return;
  }

  const link = document.createElement("link");
  link.id = CALENDLY_STYLESHEET_ID;
  link.rel = "stylesheet";
  link.href = "https://assets.calendly.com/assets/external/widget.css";
  document.head.appendChild(link);
}

function ensureCalendlyScript(onReady: () => void) {
  const existingScript = document.getElementById(
    CALENDLY_SCRIPT_ID
  ) as HTMLScriptElement | null;

  if (window.Calendly) {
    onReady();
    return;
  }

  if (existingScript) {
    existingScript.addEventListener("load", onReady, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.id = CALENDLY_SCRIPT_ID;
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  script.addEventListener("load", onReady, { once: true });
  document.body.appendChild(script);
}

export function CalendlyWidget() {
  const badgeText = "Schedule time with me";

  useEffect(() => {
    const initBadge = () => {
      cleanupCalendlyBadge();

      window.Calendly?.initBadgeWidget({
        url: CALENDLY_URL,
        text: badgeText,
        color: "#0069ff",
        textColor: "#ffffff",
        branding: true,
      });
    };

    ensureCalendlyStylesheet();
    ensureCalendlyScript(initBadge);

    return () => {
      cleanupCalendlyBadge();
    };
  }, [badgeText]);

  return null;
}