"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * SmoothScroll — Lenis smooth scroll wrapper.
 * - 60fps GPU-composited scrolling
 * - Respects prefers-reduced-motion
 * - Preserves browser history, anchor links, and accessibility
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    let Lenis;
    let lenis;

    async function init() {
      try {
        const mod = await import("lenis");
        Lenis = mod.default || mod.Lenis;

        lenis = new Lenis({
          duration: 0.9,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
          infinite: false,
          autoRaf: false,
        });

        lenisRef.current = lenis;

        if (typeof window !== "undefined" && window.gsap) {
          window.gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
          });
          window.gsap.ticker.lagSmoothing(0);
        } else {
          function raf(time) {
            lenis.raf(time);
            rafRef.current = requestAnimationFrame(raf);
          }
          rafRef.current = requestAnimationFrame(raf);
        }

        const handleHashChange = () => {
          const hash = window.location.hash;
          if (hash) {
            const target = document.querySelector(hash);
            if (target) {
              setTimeout(() => lenis?.scrollTo(target, { offset: -80 }), 100);
            }
          }
        };
        window.addEventListener("hashchange", handleHashChange);

        return () => {
          window.removeEventListener("hashchange", handleHashChange);
        };
      } catch (err) {
        console.warn("[SmoothScroll] Lenis init failed, falling back to native scroll:", err);
      }
    }

    const cleanup = init();

    return () => {
      cleanup.then((cb) => cb?.());
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [shouldReduceMotion]);

  return <>{children}</>;
}
