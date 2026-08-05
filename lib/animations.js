/**
 * Centralized Framer Motion Animation Variants for GOR Menswear
 */

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};

export const slideRight = {
  initial: { opacity: 0, x: "100%" },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: "100%" },
  transition: { type: "spring", stiffness: 300, damping: 30 },
};

export const staggerContainer = (staggerChildren = 0.08) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
    },
  },
});

export const scaleUp = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.25 },
};
