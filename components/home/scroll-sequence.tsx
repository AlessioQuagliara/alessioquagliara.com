"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { faCubes } from "@fortawesome/free-solid-svg-icons";

import { CodeOverlay, type CodeOverlayHandle } from "@/components/home/code-overlay";
import {
  FRAME_ASPECT,
  MOBILE_BREAKPOINT,
  MOBILE_FRAME_ZOOM,
  SCREEN_RECT,
  TIMELINE,
  TOTAL_FRAMES,
  TRACK_HEIGHT_VH,
  frameIndexForProgress,
  frameUrl,
  stepForProgress,
} from "@/components/home/scroll-sequence-config";
import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";

gsap.registerPlugin(ScrollTrigger);

export type ScrollStep = {
  kicker: string;
  title: string;
  text: string;
  badge?: string;
};

type ScrollSequenceProps = {
  title: string;
  subtitle: string;
  steps: ScrollStep[];
  canvasLabel: string;
  /** Contenuto HTML dopo l'animazione (es. link ai servizi). */
  children?: ReactNode;
};

/** Frame caricati subito, prima del resto in background. */
const PRIORITY_FRAMES = 12;
/** Download in parallelo. */
const LOAD_CONCURRENCY = 6;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const STATIC_ESP_FRAME = frameUrl(0, false);
const STATIC_MAC_FRAME = frameUrl(TOTAL_FRAMES - 1, false);

/** Ordine di caricamento: primi frame, poi un campione su tutta la sequenza, poi il resto. */
function loadOrder(): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  const push = (index: number) => {
    if (index < TOTAL_FRAMES && !seen.has(index)) {
      seen.add(index);
      order.push(index);
    }
  };
  for (let index = 0; index < PRIORITY_FRAMES; index++) push(index);
  for (let index = 0; index < TOTAL_FRAMES; index += 8) push(index);
  push(TOTAL_FRAMES - 1);
  for (let index = 0; index < TOTAL_FRAMES; index++) push(index);
  return order;
}

export function ScrollSequence({ title, subtitle, steps, canvasLabel, children }: ScrollSequenceProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
  const mode = reducedMotion ? "static" : "scroll";

  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const codeRef = useRef<CodeOverlayHandle | null>(null);

  // L'altezza della sezione cambia tra le due modalità: i trigger delle altre sezioni vanno ricalcolati.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [mode]);

  useEffect(() => {
    if (mode !== "scroll") return;

    const root = rootRef.current;
    const track = trackRef.current;
    const media = mediaRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!root || !track || !media || !canvas || !context) return;

    const debug = new URLSearchParams(window.location.search).get("debug") === "1";
    const codeElement = codeRef.current?.element ?? null;
    if (debug) codeElement?.setAttribute("data-debug", "true");

    let disposed = false;
    let mobile = window.innerWidth < MOBILE_BREAKPOINT;
    let frames: (HTMLImageElement | null)[] = [];
    let loadGeneration = 0;
    let loadStarted = false;

    let dpr = 1;
    let drawRect = { x: 0, y: 0, width: 0, height: 0 };
    let targetIndex = 0;
    let drawnIndex = -1;
    let activeStep = -1;
    let codeVisible: boolean | null = null;

    // --- Disegno -----------------------------------------------------------

    const nearestLoaded = (index: number): number => {
      for (let distance = 0; distance < TOTAL_FRAMES; distance++) {
        if (frames[index - distance]) return index - distance;
        if (frames[index + distance]) return index + distance;
      }
      return -1;
    };

    const draw = () => {
      const index = nearestLoaded(targetIndex);
      const image = frames[index];
      if (index === drawnIndex || !image) return;
      drawnIndex = index;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      context.drawImage(image, drawRect.x, drawRect.y, drawRect.width, drawRect.height);
    };

    const resize = () => {
      const { width, height } = media.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      // "contain": tutto il frame visibile, con letterbox se serve (zoom su mobile).
      const zoom = window.innerWidth < MOBILE_BREAKPOINT ? MOBILE_FRAME_ZOOM : 1;
      const drawWidth = Math.min(width, height * FRAME_ASPECT) * zoom;
      const drawHeight = drawWidth / FRAME_ASPECT;
      drawRect = {
        x: (width - drawWidth) / 2,
        y: (height - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight,
      };

      if (codeElement) {
        codeElement.style.left = `${drawRect.x + SCREEN_RECT.left * drawRect.width}px`;
        codeElement.style.top = `${drawRect.y + SCREEN_RECT.top * drawRect.height}px`;
        codeElement.style.width = `${SCREEN_RECT.width * drawRect.width}px`;
        codeElement.style.height = `${SCREEN_RECT.height * drawRect.height}px`;
      }

      const nextMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (loadStarted && nextMobile !== mobile) {
        mobile = nextMobile;
        load();
      }

      drawnIndex = -1;
      draw();
    };

    // --- Caricamento frame -------------------------------------------------

    const load = () => {
      const generation = ++loadGeneration;
      const queue = loadOrder();
      const nextFrames: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
      let loaded = 0;
      frames = nextFrames;
      drawnIndex = -1;
      barRef.current?.parentElement?.setAttribute("data-done", "false");

      const loadNext = async (): Promise<void> => {
        const index = queue.shift();
        if (index === undefined || disposed || generation !== loadGeneration) return;

        const image = new Image();
        image.decoding = "async";
        image.src = frameUrl(index, mobile);
        try {
          await image.decode();
          if (disposed || generation !== loadGeneration) return;
          nextFrames[index] = image;
        } catch {
          // Frame mancante: si userà il più vicino disponibile.
        }

        loaded++;
        if (barRef.current) barRef.current.style.transform = `scaleX(${loaded / TOTAL_FRAMES})`;
        if (loaded === TOTAL_FRAMES) {
          barRef.current?.parentElement?.setAttribute("data-done", "true");
        }
        draw();
        return loadNext();
      };

      for (let worker = 0; worker < LOAD_CONCURRENCY; worker++) void loadNext();
    };

    // Lazy: i frame partono solo quando la sezione si avvicina al viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !loadStarted) {
          loadStarted = true;
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "100% 0px" }
    );
    observer.observe(root);

    // --- Scroll ------------------------------------------------------------

    const update = (progress: number) => {
      const index = frameIndexForProgress(progress);
      if (index !== targetIndex) {
        targetIndex = index;
        draw();
      }

      const step = stepForProgress(progress);
      if (step !== activeStep) {
        activeStep = step;
        stepRefs.current.forEach((node, index) => {
          node?.setAttribute("data-active", String(index === step));
        });
      }

      const showCode = progress >= TIMELINE.macEnd;
      if (showCode !== codeVisible) {
        codeVisible = showCode;
        codeElement?.setAttribute("data-visible", String(showCode));
      }
      codeRef.current?.setProgress(
        Math.min(1, Math.max(0, (progress - TIMELINE.macEnd) / (1 - TIMELINE.macEnd)))
      );
    };

    const lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const state = { progress: 0 };
    const tween = gsap.to(state, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
      onUpdate: () => update(state.progress),
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(media);
    resize();
    update(0);

    return () => {
      disposed = true;
      observer.disconnect();
      resizeObserver.disconnect();
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      codeElement?.removeAttribute("data-debug");
      frames = [];
    };
  }, [mode]);

  return (
    <section
      ref={rootRef}
      aria-labelledby="what-i-build-title"
      data-mode={mode}
      className="scrolly rounded-4xl border border-[#bfd5ff]/45 bg-[#f5f9ff] text-[#12347d] shadow-[0_45px_100px_-70px_rgba(2,12,32,1)]"
    >
      {/* Senza JS: niente scroll lungo, tutti gli step visibili e un'immagine statica. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            "<style>.scrolly__track{height:auto!important}.scrolly__stage{position:relative!important;height:auto!important;display:grid!important;gap:2rem}.scrolly__copy{width:auto!important}.scrolly__steps{display:grid;gap:2rem}.scrolly__step{position:static!important;opacity:1!important;transform:none!important}.scrolly__media{position:relative!important;inset:auto!important}.scrolly__canvas,.scrolly__progress,.scrolly .code-overlay{display:none!important}.scrolly__fallback{display:block!important}</style>",
        }}
      />
      <div
        ref={trackRef}
        className="scrolly__track"
        style={{ height: mode === "scroll" ? `${TRACK_HEIGHT_VH}vh` : undefined }}
      >
        <div className="scrolly__stage">
          <div className="scrolly__copy">
            <h2
              id="what-i-build-title"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#4a6daf]"
            >
              <AnimatedFaIcon icon={faCubes} animation="shimmer" className="text-[#3f66ad]" />
              <span>{title}</span>
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#163670]">{subtitle}</p>

            <ol className="scrolly__steps mt-8">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  className="scrolly__step"
                  data-active={String(mode === "static" || index === 0)}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2e5bb6]">
                    {step.kicker}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#102e66] sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#35548c] sm:text-base">{step.text}</p>
                  {step.badge ? (
                    <p className="mt-4 inline-flex items-start gap-2 rounded-2xl border border-[#9fc0ff] bg-[#eaf2ff] px-3 py-2 text-xs font-medium leading-5 text-[#1d4596]">
                      <span className="relative mt-1.5 flex h-2 w-2 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2e5bb6] opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2e5bb6]" />
                      </span>
                      <span>{step.badge}</span>
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>

          {mode === "scroll" ? (
            <div ref={mediaRef} className="scrolly__media">
              <canvas ref={canvasRef} className="scrolly__canvas" role="img" aria-label={canvasLabel} />
              <CodeOverlay ref={codeRef} />
              <div className="scrolly__progress" data-done="false" aria-hidden="true">
                <span ref={barRef} />
              </div>
              {/* Fallback senza JS: dentro <noscript>, così con JS l'immagine non viene scaricata. */}
              <noscript
                dangerouslySetInnerHTML={{
                  __html: `<img src="${STATIC_MAC_FRAME}" alt="${canvasLabel.replace(/"/g, "&quot;")}" width="1600" height="900" class="scrolly__fallback">`,
                }}
              />
            </div>
          ) : (
            <div className="scrolly__static">
              {/* eslint-disable-next-line @next/next/no-img-element -- frame statico, già WebP ottimizzato */}
              <img src={STATIC_ESP_FRAME} alt="" width={1600} height={900} loading="lazy" />
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element -- frame statico, già WebP ottimizzato */}
                <img src={STATIC_MAC_FRAME} alt={canvasLabel} width={1600} height={900} loading="lazy" />
                <CodeOverlay
                  initialProgress={1}
                  className="code-overlay--static"
                  style={{
                    left: `${SCREEN_RECT.left * 100}%`,
                    top: `${SCREEN_RECT.top * 100}%`,
                    width: `${SCREEN_RECT.width * 100}%`,
                    height: `${SCREEN_RECT.height * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {children ? <div className="px-8 pb-10 sm:px-10 sm:pb-12 lg:px-12 lg:pb-14">{children}</div> : null}
    </section>
  );
}
