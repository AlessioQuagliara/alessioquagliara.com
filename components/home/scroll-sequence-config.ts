/**
 * Configurazione dello scrollytelling della home. Tutto ciò che va
 * calibrato a occhio sta qui.
 */

/** Frame generati da `scripts/convert-frames.sh` (vedi public/frames). */
export const FRAME_SEQUENCES = [
  { prefix: "esp", count: 120 },
  { prefix: "mac", count: 121 },
] as const;

export const TOTAL_FRAMES = FRAME_SEQUENCES.reduce((total, sequence) => total + sequence.count, 0);

/** Sotto questa larghezza si caricano i frame da 800px. */
export const MOBILE_BREAKPOINT = 768;

/**
 * Su mobile i frame hanno troppo vuoto ai lati: si disegnano più grandi
 * (centrati, i bordi escono dal canvas). Il MacBook finale sta nel 20–80%
 * della larghezza, quindi fino a ~1.6 resta intero.
 */
export const MOBILE_FRAME_ZOOM = 1.5;

/** Rapporto dei frame sorgente (1600×900). */
export const FRAME_ASPECT = 16 / 9;

export function frameUrl(index: number, mobile: boolean): string {
  let local = index;
  for (const sequence of FRAME_SEQUENCES) {
    if (local < sequence.count) {
      const folder = mobile ? `${sequence.prefix}-sm` : sequence.prefix;
      return `/frames/${folder}/${sequence.prefix}_${String(local + 1).padStart(4, "0")}.webp`;
    }
    local -= sequence.count;
  }
  return frameUrl(TOTAL_FRAMES - 1, mobile);
}

/**
 * Timeline sul progresso dello scroll (0 → 1).
 * L'ESP32 che si rimpicciolisce e il MacBook che compare sono già nei frame
 * (l'ultimo frame ESP coincide col primo frame Mac): niente dissolvenza.
 */
export const TIMELINE = {
  /** 0 → espEnd: frame ESP32. */
  espEnd: 0.4,
  /** espEnd → macEnd: frame MacBook (morph incluso). */
  macEnd: 0.75,
  /** macEnd → 1: ultimo frame fermo, il codice si digita. */
} as const;

/** Inizio di ogni step narrativo (stesso ordine di `whatIBuild.steps` nei messaggi). */
export const STEP_STARTS = [0, 0.14, 0.27, 0.4, 0.58, TIMELINE.macEnd];

/**
 * Area dello schermo del MacBook sull'ultimo frame, in frazioni
 * dell'immagine disegnata. Calibrare con `?debug=1`.
 */
export const SCREEN_RECT = {
  left: 0.277,
  top: 0.214,
  width: 0.447,
  height: 0.524,
} as const;

/** Altezza dello scroll: più alto = animazione più lenta. */
export const TRACK_HEIGHT_VH = 550;

export function frameIndexForProgress(progress: number): number {
  const espCount = FRAME_SEQUENCES[0].count;
  const macCount = FRAME_SEQUENCES[1].count;

  if (progress <= TIMELINE.espEnd) {
    return Math.round((progress / TIMELINE.espEnd) * (espCount - 1));
  }
  if (progress <= TIMELINE.macEnd) {
    const local = (progress - TIMELINE.espEnd) / (TIMELINE.macEnd - TIMELINE.espEnd);
    return espCount + Math.round(local * (macCount - 1));
  }
  return TOTAL_FRAMES - 1;
}

export function stepForProgress(progress: number): number {
  let step = 0;
  STEP_STARTS.forEach((start, index) => {
    if (progress >= start) step = index;
  });
  return step;
}
