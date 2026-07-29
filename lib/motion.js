/**
 * GOR Menswear — Global Motion Tokens & Animation Utilities
 * Hardware-accelerated (transform & opacity only), prefers-reduced-motion compliant.
 */

import { useReducedMotion } from "framer-motion";

// ── 1. Motion Tokens ──
export const DURATION = {
  fast: 0.15,   // 150ms - Micro-interactions (hover, arrow slide)
  normal: 0.25, // 250ms - Tooltips, popovers, icon toggles
  medium: 0.35, // 350ms - Product cards, borders, quick drawer
  slow: 0.5,    // 500ms - Section scroll reveals, modal overlays
  hero: 0.8,    // 800ms - Hero title text, cinematic reveals
};

// ── 2. Global Luxury Easing ──
export const EASING = {
  luxury: [0.22, 1, 0.36, 1], // Smooth exponential deceleration (default)
  smooth: [0.16, 1, 0.3, 1],  // Clean linear deceleration
  exit: [0.4, 0, 1, 1],       // Responsive exit curve
};

// ── 3. Framer Motion Variants ──

/** Scroll Reveal: Fade + translateY */
export const fadeInUp = (delay = 0, distance = 24) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: {
    duration: DURATION.slow,
    delay,
    ease: EASING.luxury,
  },
});

/** Fade In Only */
export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: {
    duration: DURATION.slow,
    delay,
    ease: EASING.luxury,
  },
});

/** Stagger Container */
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/** Stagger Child Item */
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.slow,
      ease: EASING.luxury,
    },
  },
};

/** Micro Hover Interactions for Cards & Buttons */
export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: DURATION.medium,
      ease: EASING.luxury,
    },
  },
};

export const hoverArrowSlide = {
  rest: { x: 0 },
  hover: {
    x: 6,
    transition: {
      duration: DURATION.fast,
      ease: EASING.luxury,
    },
  },
};

/** Accessibility Helper Hook */
export function useMotionSettings() {
  const shouldReduceMotion = useReducedMotion();

  return {
    shouldReduceMotion,
    getTransition: (customTransition) =>
      shouldReduceMotion ? { duration: 0 } : customTransition,
  };
}
