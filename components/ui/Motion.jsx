"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  DURATION,
  EASING,
  staggerContainer,
  staggerItem,
  scaleStaggerItem,
} from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL — Standard fade + translateY without heavy blur filters.
// ─────────────────────────────────────────────────────────────────────────────
export function Reveal({
  children,
  className = "",
  delay = 0,
  distance = 16,
  duration = DURATION.medium,
  viewportMargin = "-40px",
}) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ duration, delay, ease: EASING.luxury }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLUR REVEAL — Clean opacity + y reveal (blur removed for performance per requirement 2).
// Blur is preserved only on Hero, Page Transitions, and Fullscreen Overlays.
// ─────────────────────────────────────────────────────────────────────────────
export function BlurReveal({
  children,
  className = "",
  delay = 0,
  distance = 16,
  duration = DURATION.medium,
  viewportMargin = "-40px",
}) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ duration, delay, ease: EASING.luxury }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCALE REVEAL — Subtle opacity + scale reveal.
// ─────────────────────────────────────────────────────────────────────────────
export function ScaleReveal({
  children,
  className = "",
  delay = 0,
  duration = DURATION.medium,
  viewportMargin = "-40px",
}) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ duration, delay, ease: EASING.luxury }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FADE IN — Opacity reveal only.
// ─────────────────────────────────────────────────────────────────────────────
export function FadeIn({
  children,
  className = "",
  delay = 0,
  duration = DURATION.medium,
  viewportMargin = "-40px",
}) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ duration, delay, ease: EASING.luxury }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGGER — Container for grid/list reveal.
// ─────────────────────────────────────────────────────────────────────────────
export function Stagger({
  children,
  className = "",
  staggerDelay = 0.05,
  initialDelay = 0,
  viewportMargin = "-40px",
}) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      variants={staggerContainer(staggerDelay, initialDelay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: viewportMargin }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGGER ITEM — Child element inside Stagger container.
// ─────────────────────────────────────────────────────────────────────────────
export function StaggerItem({ children, className = "" }) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCALE STAGGER ITEM
// ─────────────────────────────────────────────────────────────────────────────
export function ScaleStaggerItem({ children, className = "" }) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div variants={scaleStaggerItem} className={className}>
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXT REVEAL — Word-by-word clip reveal (Hero only).
// ─────────────────────────────────────────────────────────────────────────────
export function TextReveal({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  staggerDelay = 0.05,
  duration = DURATION.hero,
}) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginRight: "0.28em" }}
        >
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration,
              delay: delay + i * staggerDelay,
              ease: EASING.luxury,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
