"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { pageVariants } from "@/lib/motion";

/**
 * PageTransition — Cinematic blur + scale + opacity page transition.
 * Enter: opacity + y + blur fade in over 480ms.
 * Exit: opacity + scale + blur fade out over 220ms.
 * No white flash — body background stays dark.
 * Respects prefers-reduced-motion.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.15 } },
        exit:    { opacity: 0, transition: { duration: 0.1 } },
      }
    : pageVariants;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="flex-1 flex flex-col"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
