"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ onComplete }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session check so preloader triggers smoothly on site enter/refresh
    const timer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 bg-[#090909] flex flex-col items-center justify-center pointer-events-none select-none"
        >
          {/* Animated 3-Color Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center tracking-tight font-serif font-black text-5xl sm:text-7xl leading-none">
              <span className="text-[#284B7A] font-extrabold drop-shadow-[0_4px_20px_rgba(40,75,122,0.5)]">
                G
              </span>
              <span className="text-[#C9A96E] font-extrabold drop-shadow-[0_4px_24px_rgba(201,169,110,0.6)]">
                O
              </span>
              <span className="text-[#C85A32] font-extrabold drop-shadow-[0_4px_20px_rgba(200,90,50,0.5)]">
                R
              </span>
            </div>

            <div className="flex items-center gap-2 text-[#C9A96E] mt-3">
              <span className="w-6 h-[1px] bg-[#C9A96E]/60" />
              <span className="font-sans tracking-[0.35em] text-[11px] sm:text-xs uppercase font-semibold text-[#C9A96E]">
                MENSWEAR
              </span>
              <span className="w-6 h-[1px] bg-[#C9A96E]/60" />
            </div>
          </motion.div>

          {/* Minimal Progress Bar Accent */}
          <div className="w-36 h-[2px] bg-white/[0.08] rounded-full overflow-hidden mt-8">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="h-full bg-[#C9A96E]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
