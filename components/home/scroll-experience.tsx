"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import { CodeOverlay, type CodeOverlayHandle } from "@/components/home/code-overlay";
import {
  CHAPTERS,
  CODE_FRAME,
  CODE_LAST_FRAME,
  CODE_TYPING,
  MOBILE_BREAKPOINT,
  SCREEN_BOUNDS,
  TOTAL_FRAMES,
  TRACK_HEIGHT_VH,
  chapterForProgress,
  drawRectFor,
  frameIndexForProgress,
  frameUrl,
  type ChapterId,
  type DrawRect,
} from "@/components/home/scroll-experience-config";
import { buttonClass } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

type ExperienceLink = { label: string; href: string };

export type ScrollExperienceContent = {
  canvasLabel: string;
  skipLabel: string;
  hero: {
    badge: string;
    title: string;
    description: string;
    primary: ExperienceLink;
    secondary: ExperienceLink;
  };
  hardware: {
    kicker: string;
    title: string;
    text: string;
    metrics: { value: string; label: string }[];
  };
  saas: {
    kicker: string;
    title: string;
    text: string;
    projectsLabel: string;
    projects: ExperienceLink[];
  };
  code: {
    kicker: string;
    title: string;
    text: string;
    servicesLabel: string;
    /** Link alla sezione contatti delle landing servizi. */
    services: ExperienceLink[];
  };
};

type ScrollExperienceProps = {
  content: ScrollExperienceContent;
  /** Ancora della sezione dopo l'animazione (link "salta"). */
  skipTo: string;
};

/** Frame caricati subito (hero), prima del resto in background. */
const PRIORITY_FRAMES = 15;
/** Download in parallelo. */
const LOAD_CONCURRENCY = 6;
/** Colore dello stage: sfuma il bordo alto del frame su mobile. */
const STAGE_COLOR = "6, 17, 42";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Ordine di caricamento: hero, frame del codice, un campione ogni 10, poi il resto. */
function loadOrder(): number[] {
  const order = new Set<number>();
  for (let index = 0; index < PRIORITY_FRAMES; index++) order.add(index);
  order.add(CODE_FRAME);
  for (let index = 0; index < TOTAL_FRAMES; index += 10) order.add(index);
  for (let index = 0; index < TOTAL_FRAMES; index++) order.add(index);
  return [...order];
}

function screenStyle() {
  return {
    left: `${SCREEN_BOUNDS.left * 100}%`,
    top: `${SCREEN_BOUNDS.top * 100}%`,
    width: `${SCREEN_BOUNDS.width * 100}%`,
    height: `${SCREEN_BOUNDS.height * 100}%`,
  };
}

/** Frame statico per il layout a card: `site-sm` sotto il breakpoint. */
function Poster({ frame, alt, children }: { frame: number; alt: string; children?: ReactNode }) {
  return (
    <figure className="experience__poster">
      <picture>
        <source media={`(max-width: ${MOBILE_BREAKPOINT - 1}px)`} srcSet={frameUrl(frame, true)} />
        <img src={frameUrl(frame, false)} alt={alt} width={1600} height={900} loading="lazy" />
      </picture>
      {children}
    </figure>
  );
}

/** Stesso frame, ma dentro <noscript>: con JS attivo non viene scaricato. */
function NoScriptPoster({ frame }: { frame: number }) {
  return (
    <noscript
      dangerouslySetInnerHTML={{
        __html: `<figure class="experience__poster"><img src="${frameUrl(frame, false)}" alt="" width="1600" height="900" loading="lazy"></figure>`,
      }}
    />
  );
}

export function ScrollExperience({ content, skipTo }: ScrollExperienceProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
  const mode = reducedMotion ? "static" : "scroll";

  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const chapterRefs = useRef<Partial<Record<ChapterId, HTMLElement | null>>>({});
  const codeRef = useRef<CodeOverlayHandle | null>(null);

  // L'altezza cambia tra le due modalità: i trigger vanno ricalcolati.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [mode]);

  useEffect(() => {
    if (mode !== "scroll") return;

    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!track || !stage || !canvas || !context) return;

    const debug = new URLSearchParams(window.location.search).get("debug") === "1";
    const codeElement = codeRef.current?.element ?? null;
    if (debug) codeElement?.setAttribute("data-debug", "true");

    let disposed = false;
    let mobile = window.innerWidth < MOBILE_BREAKPOINT;
    let frames: (HTMLImageElement | null)[] = [];
    let loadGeneration = 0;

    let dpr = 1;
    let size = { width: 0, height: 0 };
    let targetIndex = 0;
    let drawnIndex = -1;
    let activeChapter: ChapterId | null | undefined;
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

      // Il rettangolo dipende dal frame target (punto di fuoco), non da quello di ripiego.
      const rect: DrawRect = drawRectFor(targetIndex, size.width, size.height);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, size.width, size.height);
      context.drawImage(image, rect.x, rect.y, rect.width, rect.height);

      // Fascia mobile: il bordo alto del frame sfuma nello sfondo, sotto al testo.
      if (rect.y > 0) {
        const fade = context.createLinearGradient(0, rect.y, 0, rect.y + rect.height * 0.3);
        fade.addColorStop(0, `rgba(${STAGE_COLOR}, 1)`);
        fade.addColorStop(1, `rgba(${STAGE_COLOR}, 0)`);
        context.fillStyle = fade;
        context.fillRect(0, rect.y, size.width, rect.height * 0.3);
      }
    };

    const placeCode = () => {
      if (!codeElement) return;
      const rect = drawRectFor(CODE_FRAME, size.width, size.height);
      codeElement.style.left = `${rect.x + SCREEN_BOUNDS.left * rect.width}px`;
      codeElement.style.top = `${rect.y + SCREEN_BOUNDS.top * rect.height}px`;
      codeElement.style.width = `${SCREEN_BOUNDS.width * rect.width}px`;
      codeElement.style.height = `${SCREEN_BOUNDS.height * rect.height}px`;
    };

    const resize = () => {
      const { width, height } = stage.getBoundingClientRect();
      size = { width, height };
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      placeCode();

      const nextMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (nextMobile !== mobile) {
        mobile = nextMobile;
        load();
      }

      drawnIndex = -1;
      draw();
    };

    // --- Caricamento frame (cache in memoria) ------------------------------

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
        if (index < PRIORITY_FRAMES) image.fetchPriority = "high";
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
        if (loaded === TOTAL_FRAMES) barRef.current?.parentElement?.setAttribute("data-done", "true");
        draw();
        return loadNext();
      };

      for (let worker = 0; worker < LOAD_CONCURRENCY; worker++) void loadNext();
    };

    // --- Scroll ------------------------------------------------------------

    const update = (progress: number) => {
      const index = frameIndexForProgress(progress);
      if (index !== targetIndex) {
        targetIndex = index;
        draw();
      }

      const chapter = chapterForProgress(progress);
      if (chapter !== activeChapter) {
        activeChapter = chapter;
        stage.setAttribute("data-chapter", chapter ?? "none");
        CHAPTERS.forEach(({ id }) => {
          chapterRefs.current[id]?.setAttribute("data-active", String(id === chapter));
        });
      }

      const showCode = progress >= CODE_TYPING.start && index <= CODE_LAST_FRAME;
      if (showCode !== codeVisible) {
        codeVisible = showCode;
        codeElement?.setAttribute("data-visible", String(showCode));
      }
      codeRef.current?.setProgress(
        Math.min(1, Math.max(0, (progress - CODE_TYPING.start) / (CODE_TYPING.end - CODE_TYPING.start)))
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

    // Tastiera: se il focus entra in un capitolo nascosto, si scorre fino a lì.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as Node;
      const chapter = CHAPTERS.find(({ id }) => chapterRefs.current[id]?.contains(target));
      const trigger = tween.scrollTrigger;
      if (!chapter || !trigger || chapter.id === activeChapter) return;
      const point = Math.min(chapter.end, chapter.start + 0.02);
      lenis.scrollTo(trigger.start + point * (trigger.end - trigger.start), { immediate: true });
    };
    track.addEventListener("focusin", onFocusIn);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();
    load();
    update(0);

    return () => {
      disposed = true;
      track.removeEventListener("focusin", onFocusIn);
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

  const { hero, hardware, saas, code } = content;
  const isStatic = mode === "static";

  const chapterProps = (id: ChapterId) => ({
    ref: (node: HTMLElement | null) => {
      chapterRefs.current[id] = node;
    },
    className: `experience__chapter experience__chapter--${id}`,
    "data-active": String(isStatic || id === "hero"),
  });

  const poster = (id: ChapterId, children?: ReactNode) => {
    const frame = CHAPTERS.find((chapter) => chapter.id === id)?.poster ?? 0;
    return isStatic ? (
      <Poster frame={frame} alt={id === "code" ? content.canvasLabel : ""}>
        {children}
      </Poster>
    ) : (
      <NoScriptPoster frame={frame} />
    );
  };

  return (
    <section className="experience" data-mode={mode}>
      {/* Senza JS: niente scroll lungo, card verticali con i frame statici. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            "<style>.experience__track{height:auto!important}.experience__stage{position:relative!important;height:auto!important}.experience__canvas,.experience__progress,.experience .code-overlay{display:none!important}.experience__chapters{position:relative!important;display:grid;gap:2rem;padding:6rem 1.25rem 3rem}.experience__chapter{position:relative!important;inset:auto!important;transform:none!important;opacity:1!important;pointer-events:auto!important;max-width:64rem!important;margin:0 auto}</style>",
        }}
      />

      <a href={skipTo} className="experience__skip">
        {content.skipLabel}
      </a>

      <div
        ref={trackRef}
        className="experience__track"
        style={{ height: isStatic ? undefined : `${TRACK_HEIGHT_VH}vh` }}
      >
        <div ref={stageRef} className="experience__stage" data-chapter={isStatic ? undefined : "hero"}>
          {isStatic ? null : (
            <>
              <canvas
                ref={canvasRef}
                className="experience__canvas"
                role="img"
                aria-label={content.canvasLabel}
              />
              <CodeOverlay ref={codeRef} />
              <div className="experience__progress" data-done="false" aria-hidden="true">
                <span ref={barRef} />
              </div>
            </>
          )}

          <div className="experience__chapters">
            <article {...chapterProps("hero")}>
              <div className="experience__text">
                <p className="inline-flex rounded-full border border-[#cce0ff]/20 bg-white/8 px-4 py-2 text-[0.65rem] uppercase tracking-[0.24em] text-[#d5e4ff] backdrop-blur-md sm:text-xs">
                  {hero.badge}
                </p>
                <h1 className="mt-5 max-w-[18ch] text-3xl font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                  {hero.title}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-[#e6f0ff] sm:mt-6 sm:text-lg sm:leading-8">
                  {hero.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                  <Link href={hero.primary.href} className={buttonClass({ variant: "primary", size: "lg" })}>
                    {hero.primary.label}
                  </Link>
                  <Link href={hero.secondary.href} className={buttonClass({ variant: "secondary", size: "lg" })}>
                    {hero.secondary.label}
                  </Link>
                </div>
              </div>
              {poster("hero")}
            </article>

            <article {...chapterProps("hardware")}>
              <div className="experience__text experience__card">
                <p className="experience__kicker">{hardware.kicker}</p>
                <h2 className="experience__title">{hardware.title}</h2>
                <p className="experience__body">{hardware.text}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3">
                  {hardware.metrics.map((metric) => (
                    <div key={metric.value} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <dt className="text-base font-bold leading-snug text-white sm:text-lg">{metric.value}</dt>
                      <dd className="mt-1 text-xs leading-5 text-[#c9ddff]">{metric.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {poster("hardware")}
            </article>

            <article {...chapterProps("saas")}>
              <div className="experience__text experience__card">
                <p className="experience__kicker">{saas.kicker}</p>
                <h2 className="experience__title">{saas.title}</h2>
                <p className="experience__body">{saas.text}</p>
                <nav aria-label={saas.projectsLabel} className="mt-5">
                  <p className="experience__label">{saas.projectsLabel}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {saas.projects.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="experience__project">
                          <span className="experience__project-dot" aria-hidden="true" />
                          {link.label}
                          <span aria-hidden="true">↗</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              {poster("saas")}
            </article>

            <article {...chapterProps("code")}>
              <div className="experience__text experience__card">
                <p className="experience__kicker">{code.kicker}</p>
                <h2 className="experience__title">{code.title}</h2>
                <p className="experience__body">{code.text}</p>

                <nav aria-label={code.servicesLabel} className="mt-5">
                  <p className="experience__label">{code.servicesLabel}</p>
                  <ul className="mt-2 grid gap-2">
                    {code.services.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="experience__link">
                          {link.label} <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              {poster(
                "code",
                <CodeOverlay initialProgress={1} className="code-overlay--static" style={screenStyle()} />
              )}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
