"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { buttonClass } from "@/components/ui/button";
import { withLang, type Locale } from "@/lib/i18n";

type HomeHeroContent = {
  badge: string;
  title: string;
  description: string;
  ctaProjects: string;
  ctaContact: string;
};

type StackItem = {
  label: string;
  logoPath: string;
};

type HeroSceneProps = {
  locale: Locale;
  content: HomeHeroContent;
};

gsap.registerPlugin(ScrollTrigger);

export function HeroScene({ locale, content }: HeroSceneProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const floatingContainerRef = useRef<HTMLDivElement | null>(null);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);

  const stackItems = useMemo<StackItem[]>(
    () => [
      { label: "Docker", logoPath: "/assets/img/docker.svg" },
      { label: "C", logoPath: "/assets/img/c.svg" },
      { label: "Python", logoPath: "/assets/img/python.svg" },
      { label: "n8n", logoPath: "/assets/img/N8n.svg" },
      { label: "Arduino", logoPath: "/assets/img/arduino.svg" },
      { label: "Traefik", logoPath: "/assets/img/traefikproxy.svg" },
    ],
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    const floatingContainer = floatingContainerRef.current;

    if (!root || !floatingContainer) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // Animazione iniziale degli elementi testuali e immagine
      const introTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      introTimeline
        .from(".hero-badge", { scale: 0.5, opacity: 0, duration: 0.7 })
        .from(".hero-title-word", {
          y: 70,
          opacity: 0,
          rotateX: -45,
          duration: 0.6,
          stagger: 0.08,
        }, "-=0.4")
        .from(".hero-description", { y: 40, opacity: 0, duration: 0.7 }, "-=0.3")
        .from(".hero-portrait-shell", { y: 60, opacity: 0, rotate: -8, duration: 1 }, "-=0.4");

      // Effetto parallax allo scroll
      gsap.to(".hero-portrait-shell", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 1.2 },
      });
      gsap.to(".hero-copy", {
        yPercent: -12,
        opacity: 0.92,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 1 },
      });

      // Animazione icone fluttuanti – movimento casuale continuo senza salti
      const icons = iconsRef.current.filter((icon): icon is HTMLDivElement => icon !== null);
      icons.forEach((icon) => {
        // Calcola dimensioni contenitore
        const containerRect = floatingContainer.getBoundingClientRect();
        const iconWidth = icon.offsetWidth;
        const iconHeight = icon.offsetHeight;

        // Imposta posizione iniziale casuale all'interno del contenitore
        const startX = gsap.utils.random(0, containerRect.width - iconWidth);
        const startY = gsap.utils.random(0, containerRect.height - iconHeight);
        gsap.set(icon, { x: startX, y: startY, opacity: 0.3, scale: gsap.utils.random(0.6, 1.2) });

        // Crea un movimento continuo: si sposta verso un punto casuale, poi verso un altro, senza reset
        const moveRandomly = () => {
          const targetX = gsap.utils.random(0, containerRect.width - iconWidth);
          const targetY = gsap.utils.random(0, containerRect.height - iconHeight);
          const duration = gsap.utils.random(5, 12);
          const rotate = gsap.utils.random(-15, 15);
          const scale = gsap.utils.random(0.7, 1.3);

          gsap.to(icon, {
            x: targetX,
            y: targetY,
            rotate: rotate,
            scale: scale,
            duration: duration,
            ease: "sine.inOut",
            onComplete: moveRandomly,
          });
        };

        // Avvia il movimento dopo un piccolo ritardo
        setTimeout(() => moveRandomly(), gsap.utils.random(0, 2000));
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // Divide il titolo in parole per animazione
  const titleWords = content.title.split(" ").map((word, idx) => (
    <span key={idx} className="hero-title-word mr-[0.22em] inline-block">
      {word}
    </span>
  ));

  return (
    <section
      ref={rootRef}
      className="hero-stage relative mx-auto flex w-full min-h-[calc(100vh-9rem)] max-w-6xl items-center px-6 py-4 sm:min-h-[calc(100vh-10rem)] sm:py-6 lg:min-h-[calc(100vh-8.5rem)]"
    >
      {/* Contenitore icone fluttuanti */}
      <div
        ref={floatingContainerRef}
        className="hero-floating-field absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {stackItems.map((item, idx) => (
          <div
            key={item.label}
            ref={(el) => {
              if (el) iconsRef.current[idx] = el;
            }}
            className="hero-bg-logo absolute"
            style={{ width: 78, height: 78 }}
          >
            <Image
              src={item.logoPath}
              alt={item.label}
              width={78}
              height={78}
              className="hero-bg-logo-image w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-10">
        <div className="hero-copy relative z-10 max-w-3xl">
          <p className="hero-badge mb-5 inline-flex rounded-full border border-[#cce0ff]/20 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#d5e4ff] shadow-[0_18px_45px_-30px_rgba(2,12,32,0.95)] backdrop-blur-md">
            {content.badge}
          </p>

          <h1 className="hero-title max-w-[22ch] text-4xl font-black leading-[1.04] tracking-[-0.035em] text-white break-words sm:max-w-[19ch] sm:text-5xl lg:max-w-[18ch] lg:text-6xl">
            {titleWords}
          </h1>

          <p className="hero-description mt-8 max-w-xl text-lg leading-8 text-[#e6f0ff] sm:text-xl">
            {content.description}
          </p>

          <div className="hero-copy-actions relative z-20 mt-10 flex flex-wrap gap-4">
            <Link
              href={withLang("/projects", locale)}
              className={buttonClass({
                variant: "primary",
                size: "lg",
                className: "hero-cta-primary !opacity-100",
              })}
            >
              {content.ctaProjects}
            </Link>

            <Link
              href={withLang("/contact", locale)}
              className={buttonClass({
                variant: "secondary",
                size: "lg",
                className: "hero-cta-secondary !opacity-100",
              })}
            >
              {content.ctaContact}
            </Link>
          </div>
        </div>

        <div className="hero-visual relative isolate z-10 min-h-[27.5rem] sm:min-h-[32.5rem] lg:min-h-[40rem]">
          <div className="hero-ambient-glow hero-ambient-glow-one" />
          <div className="hero-ambient-glow hero-ambient-glow-two" />

          <div className="hero-portrait-shell absolute inset-x-[3%] bottom-0 top-10 rounded-4xl border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] shadow-[0_55px_110px_-55px_rgba(2,12,32,0.95)] backdrop-blur-md sm:inset-x-[8%] lg:inset-x-[2%]">
            <div className="hero-portrait-inner absolute inset-2.5 overflow-hidden rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_50%_15%,rgba(87,152,255,0.5),transparent_44%),linear-gradient(180deg,rgba(7,20,51,0.2),rgba(7,20,51,0.82))]">
              <div className="hero-portrait-rim absolute inset-x-[18%] top-[9%] h-18 rounded-full bg-[#84beff]/30 blur-3xl" />
              <div className="hero-portrait-grid absolute inset-0 opacity-60" />
              <Image
                src="/profile_image_no_bg.png"
                alt="Alessio Quagliara"
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="hero-portrait-image object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}