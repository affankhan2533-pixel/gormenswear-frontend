"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Image from "next/image";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full h-[calc(100vh-64px)] min-h-[460px] max-h-[660px] sm:h-[100svh] sm:min-h-[640px] sm:max-h-[1120px] bg-[#151515] text-[#F5F2EC] overflow-hidden flex flex-col justify-end pb-8 sm:pb-16 lg:pb-24 px-5 sm:px-12 lg:px-16 selection:bg-[#D8D2C8] selection:text-[#111111]">
      {/* ── Background Fashion Campaign Media — Current GOR Visual Asset ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/categories/gor-model-streetwear.webp"
          alt="GOR Menswear Current Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover filter contrast-[1.05] brightness-[0.85]"
          style={{ objectPosition: "center 20%" }}
        />

        {/* Natural Cinematic Exposure — Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/95 via-[#151515]/35 to-[#151515]/45 pointer-events-none z-10" />
      </div>

      {/* ── Architectural Editorial Campaign Framing ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-12">
        <div className="max-w-2xl">
          {/* Brand Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-2 sm:mb-4"
          >
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#D8D2C8] font-medium">
              GOR
            </span>
          </motion.div>

          {/* Large Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-editorial text-3xl min-[360px]:text-4xl min-[410px]:text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-normal leading-[1.02] tracking-tight text-[#F5F2EC] mb-3 sm:mb-5"
          >
            <span>MODERN MENSWEAR.</span>
            <span className="block font-light italic text-[#EAE6DE]">DEFINED BY FORM.</span>
          </motion.h1>

          {/* Supporting Line */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="font-sans text-xs sm:text-sm text-[#D8D2C8] font-normal leading-relaxed max-w-lg"
          >
            Refined silhouettes, considered materials, everyday movement.
          </motion.p>
        </div>

        {/* Minimal Architectural CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto"
        >
          <Link href="/shop" className="w-full sm:w-auto">
            <button
              type="button"
              className="h-[46px] sm:h-[50px] px-6 sm:px-8 bg-[#F5F2EC] hover:bg-[#FFFFFF] text-[#111111] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <span>SHOP THE COLLECTION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>

          <Link href="/new-arrivals" className="w-full sm:w-auto">
            <button
              type="button"
              className="h-[46px] sm:h-[50px] px-6 sm:px-8 bg-transparent hover:bg-[#F5F2EC]/10 border border-[#F5F2EC]/40 text-[#F5F2EC] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center cursor-pointer w-full sm:w-auto"
            >
              <span>EXPLORE NEW ARRIVALS</span>
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Subtle Frame Marker */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden sm:block">
        <span className="text-[9px] uppercase tracking-[0.35em] text-[#D8D2C8]/60 font-sans font-medium">
          [ SCROLL TO EXPLORE ]
        </span>
      </div>
    </section>
  );
}
