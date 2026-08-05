"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = [
  { char: "G", color: "#284B7A", shadow: "rgba(40,75,122,0.55)" },
  { char: "O", color: "#C9A96E", shadow: "rgba(201,169,110,0.7)" },
  { char: "R", color: "#C85A32", shadow: "rgba(200,90,50,0.55)" },
];

export default function Preloader({ onComplete }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hold for 800ms — enough for the G-O-R stagger to play
    const timer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] bg-[#080808] flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          {/* Ambient radial gold glow behind logo */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              style={{
                width: 420,
                height: 420,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(200,167,106,0.09) 0%, rgba(200,167,106,0.02) 55%, transparent 72%)",
              }}
            />
          </div>

          {/* Logo letter trio */}
          <div className="flex items-end tracking-tight font-serif font-black text-7xl sm:text-8xl leading-none relative z-10">
            {LETTERS.map(({ char, color, shadow }, i) => (
              <motion.span
                key={char}
                initial={{ opacity: 0, y: 22, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.65,
                  delay: 0.12 * i,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  color,
                  filter: `drop-shadow(0 4px 22px ${shadow})`,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-2.5 mt-4 relative z-10"
          >
            <span className="w-8 h-[1px] bg-[#C9A96E]/50" />
            <span className="font-sans tracking-[0.38em] text-[10px] sm:text-[11px] uppercase font-semibold text-[#C9A96E]/80">
              Menswear
            </span>
            <span className="w-8 h-[1px] bg-[#C9A96E]/50" />
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-10 w-32 h-[2px] bg-white/[0.07] rounded-full overflow-hidden relative z-10"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              className="h-full rounded-full bg-gradient-to-r from-[#A8884D] via-[#C8A76A] to-[#D4B57C]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

