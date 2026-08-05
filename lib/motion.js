/**
 * GOR Menswear — Optimized Motion System
 * 60 FPS Target. Hardware-accelerated (transform & opacity only).
 * Clean, subtle, performance-first luxury animations.
 */

// ── 1. Duration Tokens (ms) ──
export const DURATION = {
  instant: 0,
  fast:    0.15,   // 150ms — micro-interactions
  normal:  0.22,   // 220ms — tooltips, toggles
  medium:  0.32,   // 320ms — dropdowns, cards
  slow:    0.45,   // 450ms — section heading reveals
  hero:    0.65,   // 650ms — hero text reveal
};

// ── 2. Easing Curves ──
export const EASING = {
  luxury:  [0.22, 1, 0.36, 1],   // Deceleration curve
  exit:    [0.4, 0, 1, 1],
};

// ── 3. Stagger Presets ──
export const staggerContainer = (staggerChildren = 0.05, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren, delayChildren },
  },
});

// ── 4. Stagger Child Items (Opacity & Y only for maximum FPS) ──
export const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.medium, ease: EASING.luxury },
  },
};

export const staggerItemBlur = staggerItem;

export const scaleStaggerItem = {
  hidden: { opacity: 0, scale: 0.98, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DURATION.medium, ease: EASING.luxury },
  },
};

// ── 5. Page Transition Variants — Pure opacity (prevents breaking position: fixed containing block) ──
export const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: EASING.luxury },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: EASING.exit },
  },
};

// ── 6. Micro-Interaction Hover Variants ──
export const hoverScale = {
  rest:  { scale: 1 },
  hover: { scale: 1.02, transition: { duration: DURATION.fast, ease: EASING.luxury } },
};

export const hoverLift = {
  rest:  { y: 0 },
  hover: { y: -3, transition: { duration: DURATION.fast, ease: EASING.luxury } },
};
