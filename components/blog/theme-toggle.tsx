"use client";

import { useSyncExternalStore } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

type Theme = "dark" | "light";

const STORAGE_KEY = "reading-theme";

/**
 * Piccolo store esterno sincronizzato con <html data-theme>.
 * Usare useSyncExternalStore evita di chiamare setState dentro un effect
 * (anti-pattern) e gestisce correttamente l'idratazione: in SSR il tema è
 * "dark", poi il client si allinea al valore reale impostato dallo script
 * inline in <head> (vedi layout.tsx), senza flash.
 */
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* localStorage non disponibile: il tema resta valido per la sessione */
  }
  listeners.forEach((listener) => listener());
}

type ThemeToggleProps = {
  labels: { toDark: string; toLight: string };
};

/** Toggle light/dark per l'esperienza di lettura (persistente in localStorage). */
export function ThemeToggle({ labels }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";
  const label = isDark ? labels.toLight : labels.toDark;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="theme-toggle"
      aria-label={label}
      title={label}
    >
      <FontAwesomeIcon
        icon={isDark ? faSun : faMoon}
        className="theme-toggle__icon"
      />
    </button>
  );
}
