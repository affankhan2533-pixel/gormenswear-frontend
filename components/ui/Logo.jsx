"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Logo({ size = "md", className = "" }) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <Link href="/" className={`inline-flex flex-col items-center group select-none ${className}`}>
      <div className="flex items-center tracking-tight font-serif font-black leading-none">
        {/* G - Royal Navy */}
        <motion.span
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`text-[#284B7A] font-extrabold drop-shadow-[0_2px_10px_rgba(40,75,122,0.4)] ${
            isSm ? "text-2xl" : isLg ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"
          }`}
        >
          G
        </motion.span>
        {/* O - Metallic Gold */}
        <motion.span
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.04 }}
          className={`text-[#C9A96E] font-extrabold drop-shadow-[0_2px_12px_rgba(201,169,110,0.5)] ${
            isSm ? "text-2xl" : isLg ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"
          }`}
        >
          O
        </motion.span>
        {/* R - Terracotta Rust */}
        <motion.span
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.08 }}
          className={`text-[#C85A32] font-extrabold drop-shadow-[0_2px_10px_rgba(200,90,50,0.4)] ${
            isSm ? "text-2xl" : isLg ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"
          }`}
        >
          R
        </motion.span>
      </div>

      {/* — MENSWEAR — Subtitle */}
      <div className={`flex items-center gap-1.5 text-[#C9A96E] ${isSm ? "mt-0.5" : isLg ? "mt-2" : "mt-1"}`}>
        <span className="w-3 sm:w-4 h-[1px] bg-[#C9A96E]/60" />
        <span
          className={`font-sans tracking-[0.32em] uppercase font-semibold text-[#C9A96E] group-hover:text-white transition-colors ${
            isSm ? "text-[7.5px]" : isLg ? "text-[11px]" : "text-[9px]"
          }`}
        >
          MENSWEAR
        </span>
        <span className="w-3 sm:w-4 h-[1px] bg-[#C9A96E]/60" />
      </div>
    </Link>
  );
}

