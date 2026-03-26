"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  itemSelector?: string;
  parallaxSelector?: string;
  motionPreset?: "base" | "dynamic";
};

gsap.registerPlugin(ScrollTrigger);

export function SectionReveal({
  children,
  className = "",
  itemSelector = "[data-reveal-item]",
  parallaxSelector = "[data-parallax]",
  motionPreset = "base",
}: SectionRevealProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    const rootConfig =
      motionPreset === "dynamic"
        ? { y: 54, duration: 1.15, start: "top 88%" }
        : { y: 36, duration: 0.9, start: "top 82%" };
    const itemConfig =
      motionPreset === "dynamic"
        ? { y: 34, duration: 0.92, stagger: 0.14, start: "top 84%" }
        : { y: 28, duration: 0.75, stagger: 0.1, start: "top 78%" };
    const parallaxConfig =
      motionPreset === "dynamic"
        ? { even: -14, odd: -24, scrub: 1.35 }
        : { even: -8, odd: -14, scrub: 1.1 };

    const ctx = gsap.context(() => {
      gsap.from(root, {
        y: rootConfig.y,
        opacity: 0,
        duration: rootConfig.duration,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: rootConfig.start,
          once: true,
        },
      });

      const items = root.querySelectorAll(itemSelector);

      if (items.length > 0) {
        gsap.from(items, {
          y: itemConfig.y,
          opacity: 0,
          duration: itemConfig.duration,
          stagger: itemConfig.stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: itemConfig.start,
            once: true,
          },
        });
      }

      const parallaxItems = root.querySelectorAll(parallaxSelector);

      if (parallaxItems.length > 0) {
        gsap.utils.toArray<HTMLElement>(parallaxItems).forEach((item, index) => {
          gsap.to(item, {
            yPercent: index % 2 === 0 ? parallaxConfig.even : parallaxConfig.odd,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: parallaxConfig.scrub,
            },
          });
        });
      }
    }, root);

    return () => {
      ctx.revert();
    };
  }, [itemSelector, motionPreset, parallaxSelector]);

  return (
    <section ref={rootRef} className={className}>
      {children}
    </section>
  );
}