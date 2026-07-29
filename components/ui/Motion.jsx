"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASING, staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Scroll Reveal Component
 * Fades in and translates up on scroll. Triggers once.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  distance = 24,
  duration = DURATION.slow,
  viewportMargin = "-40px",
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration,
        delay,
        ease: EASING.luxury,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Container Component
 * Sequential child reveal container.
 */
export function Stagger({
  children,
  className = "",
  staggerDelay = 0.08,
  initialDelay = 0,
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerContainer(staggerDelay, initialDelay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Item Component
 * Child element within a Stagger container.
 */
export function StaggerItem({ children, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * FadeIn Component
 * Simple opacity reveal wrapper.
 */
export function FadeIn({
  children,
  className = "",
  delay = 0,
  duration = DURATION.slow,
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration,
        delay,
        ease: EASING.luxury,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
