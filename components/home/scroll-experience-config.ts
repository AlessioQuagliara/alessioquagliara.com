/**
 * Configurazione dello scrollytelling a tutto schermo della home.
 * Tutto ciò che va calibrato a occhio sta qui.
 */

/** Frame generati da `scripts/convert-site-frames.sh`: site_0000 … site_0200. */
export const TOTAL_FRAMES = 201;

/** Sotto questa larghezza si caricano i frame da 960px (`site-sm`). */
export const MOBILE_BREAKPOINT = 768;

/** Rapporto dei frame sorgente (1600×900). */
export const FRAME_ASPECT = 16 / 9;

/** Il frame col MacBook di fronte: qui la sequenza si ferma e si digita il codice. */
export const CODE_FRAME = 180;

export function frameUrl(index: number, mobile: boolean): string {
  const safe = Math.min(TOTAL_FRAMES - 1, Math.max(0, index));
  return `/frames/${mobile ? "site-sm" : "site"}/site_${String(safe).padStart(4, "0")}.webp`;
}

/**
 * Progresso dello scroll (0 → 1) → frame, a tratti lineari.
 * 0–20% hero · 20–60% banco ESP32 · 60–80% volo verso la scrivania ·
 * 78–95% fermo sul frame 180 (codice) · 95–100% la camera scende e torna blu.
 */
const FRAME_KEYS: readonly (readonly [progress: number, frame: number])[] = [
  [0, 0],
  [0.2, 40],
  [0.58, 140],
  [0.78, CODE_FRAME],
  [0.95, CODE_FRAME],
  [1, TOTAL_FRAMES - 1],
];

/** Finestra in cui il codice si digita (dentro il fermo sul frame 180). */
export const CODE_TYPING = { start: 0.79, end: 0.93 } as const;

/** Oltre questo frame la camera si muove: il codice sparisce. */
export const CODE_LAST_FRAME = 186;

/**
 * Capitoli di testo: attivi tra `start` e `end` (nei buchi non si vede niente,
 * così un testo esce prima che entri il successivo). `poster` è il frame
 * mostrato nel layout a card (reduced motion / senza JS).
 */
export const CHAPTERS = [
  { id: "hero", start: 0, end: 0.16, poster: 0 },
  { id: "hardware", start: 0.21, end: 0.55, poster: 110 },
  { id: "saas", start: 0.59, end: 0.76, poster: 166 },
  { id: "code", start: 0.78, end: 1, poster: CODE_FRAME },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

/**
 * Schermo del MacBook sul frame 180, in frazioni dell'immagine.
 * Misurato sui pixel del frame; calibrare con `?debug=1`.
 */
export const SCREEN_BOUNDS = {
  left: 0.469,
  top: 0.161,
  width: 0.352,
  height: 0.424,
} as const;

/** Altezza dello scroll: più alto = animazione più lenta. */
export const TRACK_HEIGHT_VH = 800;

/**
 * Viewport "stretti" (rapporto sotto questa soglia, cioè mobile in verticale):
 * il frame non copre tutto lo schermo ma sta in una fascia in basso, sotto al testo.
 */
export const NARROW_ASPECT = 1.1;

/** Nella fascia mobile si vede questa frazione della larghezza del frame. */
export const NARROW_VISIBLE_WIDTH = 0.42;

/**
 * Punto del frame da tenere al centro quando si ritaglia (x, 0 → 1).
 * Serve soprattutto su mobile, dove si vede meno del 50% della larghezza.
 */
const FOCUS_KEYS: readonly (readonly [frame: number, x: number])[] = [
  [0, 0.78],
  [30, 0.7],
  [45, 0.6],
  [70, 0.72],
  [140, 0.72],
  [152, 0.55],
  [170, 0.62],
  [CODE_FRAME, 0.645],
  [TOTAL_FRAMES - 1, 0.5],
];

function interpolate(keys: readonly (readonly [number, number])[], value: number): number {
  if (value <= keys[0][0]) return keys[0][1];
  for (let index = 1; index < keys.length; index++) {
    const [x1, y1] = keys[index];
    if (value <= x1) {
      const [x0, y0] = keys[index - 1];
      return x1 === x0 ? y1 : y0 + ((value - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return keys[keys.length - 1][1];
}

export function frameIndexForProgress(progress: number): number {
  return Math.round(interpolate(FRAME_KEYS, progress));
}

export function focusForFrame(frame: number): number {
  return interpolate(FOCUS_KEYS, frame);
}

export function chapterForProgress(progress: number): ChapterId | null {
  return CHAPTERS.find((chapter) => progress >= chapter.start && progress <= chapter.end)?.id ?? null;
}

export type DrawRect = { x: number; y: number; width: number; height: number };

/**
 * Dove disegnare il frame nel canvas (in px CSS).
 * Largo: "cover" centrato sul punto di fuoco. Stretto: fascia in basso.
 */
export function drawRectFor(frame: number, width: number, height: number): DrawRect {
  const narrow = width / height < NARROW_ASPECT;
  const drawWidth = narrow
    ? width / NARROW_VISIBLE_WIDTH
    : Math.max(width, height * FRAME_ASPECT);
  const drawHeight = drawWidth / FRAME_ASPECT;
  const clamp = (value: number, min: number) => Math.min(0, Math.max(min, value));

  return {
    x: clamp(width / 2 - focusForFrame(frame) * drawWidth, width - drawWidth),
    y: narrow ? height - drawHeight : clamp((height - drawHeight) / 2, height - drawHeight),
    width: drawWidth,
    height: drawHeight,
  };
}
