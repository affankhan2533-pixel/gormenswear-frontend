"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Flame } from "lucide-react";

export default function PromotionalBanner() {
  const bannerRef = useRef(null);

  // Parallax scroll effect for full-bleed promotional banner
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.05, 1.15]);

  return (
    <section 
      ref={bannerRef}
      className="relative py-28 sm:py-36 lg:py-44 overflow-hidden bg-[#050505] text-[#F7F4EF] border-t border-b border-white/[0.08]"
    >
      {/* 1. Parallax Editorial Background Image Container */}
      <motion.div 
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none"
      >
        <img
          src="/images/lookbook/gor-lookbook-4.webp"
          alt="GOR Limited Release Seasonal Edit"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1] saturate-[0.85]"
        />
        {/* Editorial Gradients & Noise Layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-[#050505]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
      </motion.div>

      {/* 2. Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-2xl">
          
          {/* Eyebrow Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#C9A96E]/10 border border-[#C9A96E]/30 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md"
          >
            <Flame className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C9A96E] font-medium">
              LIMITED RELEASE · SEASONAL EDIT
            </span>
          </motion.div>

          {/* Staggered Animated Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F4F1EA] tracking-tight leading-[1.04] mb-6"
          >
            Noir & Silk <br />
            <span className="italic text-[#C9A96E]">Monochrome Edit</span>
          </motion.h2>

          {/* Description Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-sans text-xs sm:text-sm text-[#B4B0A9] font-light leading-relaxed tracking-wide max-w-lg mb-10"
          >
            An exclusive 12-piece capsule engineered with raw Mulberry silk, 
            heavyweight Italian twill, and matte-black hardware. Available in strictly 
            limited quantities worldwide.
          </motion.p>

          {/* Call To Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5"
          >
            {/* Primary Gold CTA */}
            <Link
              href="/new-arrivals"
              className="px-8 py-4 bg-[#C9A96E] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Explore The Drop</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            {/* Secondary Underline Link */}
            <Link
              href="/shop/shirts"
              className="inline-flex items-center justify-center gap-3 font-sans text-xs uppercase tracking-[0.25em] text-[#F4F1EA] hover:text-[#C9A96E] py-4 group relative transition-colors duration-300"
            >
              <span>View Silk Shirts</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300 text-[#C9A96E]" />
              <span className="absolute bottom-2 left-0 w-full h-[1px] bg-white/20 group-hover:bg-[#C9A96E] transition-colors duration-300" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
