"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ onComplete }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hold briefly for clean editorial transition
    const timer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 650);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] bg-[#F5F2EC] flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          {/* Confident Architectural Brand Mark */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <span className="font-editorial text-5xl sm:text-6xl tracking-tight text-[#111111] font-normal">
              GOR
            </span>
            <span className="font-sans tracking-[0.35em] text-[10px] uppercase font-medium text-[#716D66] mt-2">
              Modern Menswear
            </span>
          </motion.div>

          {/* Minimal hairline loading rule */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mt-8 w-24 h-[1px] bg-[#D8D2C8] overflow-hidden"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="h-full bg-[#111111]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

