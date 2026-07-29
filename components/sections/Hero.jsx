"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Flame } from "lucide-react";

export default function Hero() {
  const [activeVideo, setActiveVideo] = useState(0);

  // Separate refs for Desktop & Mobile
  const deskVideoRef1 = useRef(null);
  const deskVideoRef2 = useRef(null);
  const mobVideoRef1 = useRef(null);
  const mobVideoRef2 = useRef(null);

  const handleVideo1Ended = () => {
    setActiveVideo(1);
    if (deskVideoRef2.current) {
      deskVideoRef2.current.currentTime = 0;
      deskVideoRef2.current.play().catch(() => {});
    }
    if (mobVideoRef2.current) {
      mobVideoRef2.current.currentTime = 0;
      mobVideoRef2.current.play().catch(() => {});
    }
  };

  const handleVideo2Ended = () => {
    setActiveVideo(0);
    if (deskVideoRef1.current) {
      deskVideoRef1.current.currentTime = 0;
      deskVideoRef1.current.play().catch(() => {});
    }
    if (mobVideoRef1.current) {
      mobVideoRef1.current.currentTime = 0;
      mobVideoRef1.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (activeVideo === 0) {
      deskVideoRef1.current?.play().catch(() => {});
      mobVideoRef1.current?.play().catch(() => {});
    } else {
      deskVideoRef2.current?.play().catch(() => {});
      mobVideoRef2.current?.play().catch(() => {});
    }
  }, [activeVideo]);

  return (
    <>
      {/* ── 1. Dedicated Mobile Hero (< 768px) ── */}
      <section className="block md:hidden relative w-full pt-20 pb-10 px-4 bg-[#090909] border-b border-[#2A2A2A] overflow-hidden">
        {/* Mobile Video Frame */}
        <div className="relative aspect-[3/4] w-full rounded-[14px] overflow-hidden bg-[#151515] border border-[#2A2A2A] shadow-2xl mb-6">
          <video
            ref={mobVideoRef1}
            autoPlay
            muted
            playsInline
            onEnded={handleVideo1Ended}
            poster="/images/lookbook/gor-lookbook-1.webp"
            className={`absolute inset-0 w-full h-full object-cover filter brightness-100 contrast-[1.04] scale-[1.12] transition-opacity duration-700 ${
              activeVideo === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{ objectPosition: "58% 22%" }}
          >
            <source src="/videos/hero-campaign-1.mp4" type="video/mp4" />
          </video>

          <video
            ref={mobVideoRef2}
            muted
            playsInline
            onEnded={handleVideo2Ended}
            poster="/images/lookbook/gor-lookbook-1.webp"
            className={`absolute inset-0 w-full h-full object-cover filter brightness-100 contrast-[1.04] scale-[1.12] transition-opacity duration-700 ${
              activeVideo === 1 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{ objectPosition: "58% 22%" }}
          >
            <source src="/videos/hero-campaign-2.mp4" type="video/mp4" />
          </video>

          {/* Cinematic full-frame bottom-to-top scrim for text legibility only */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/75 via-transparent to-transparent pointer-events-none z-20" />

          {/* Collection Pill Badge */}
          <div className="absolute top-4 left-4 bg-[#090909]/80 backdrop-blur-md border border-[#2A2A2A] px-3.5 py-1.5 rounded-full flex items-center gap-2 z-20">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-semibold">
              GOR MENSWEAR 2026
            </span>
          </div>

          <div className="absolute bottom-5 left-4 right-4 text-left pointer-events-none z-20">
            <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3] leading-[1.1] mb-1 drop-shadow-lg">
              Modern <span className="italic text-[#C8A45D]">Street Luxury</span>
            </h2>
            <p className="font-sans text-xs text-[#8E8A85] font-light">
              Premium essentials designed for everyday confidence.
            </p>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <Link href="/shop" className="w-full">
            <button
              type="button"
              className="w-full h-[48px] rounded-[12px] bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── 2. Desktop & Tablet Hero (>= 768px) ── */}
      <section className="hidden md:flex relative w-full h-screen min-h-[720px] items-center justify-center overflow-hidden bg-[#090909]">
        {/* Video Canvas Container */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={deskVideoRef1}
            autoPlay
            muted
            playsInline
            onEnded={handleVideo1Ended}
            poster="/images/lookbook/gor-lookbook-1.webp"
            className={`absolute inset-0 w-full h-full object-cover filter brightness-100 contrast-[1.04] scale-[1.12] transition-opacity duration-700 ${
              activeVideo === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{ objectPosition: "58% 22%" }}
          >
            <source src="/videos/hero-campaign-1.mp4" type="video/mp4" />
          </video>

          <video
            ref={deskVideoRef2}
            muted
            playsInline
            onEnded={handleVideo2Ended}
            poster="/images/lookbook/gor-lookbook-1.webp"
            className={`absolute inset-0 w-full h-full object-cover filter brightness-100 contrast-[1.04] scale-[1.12] transition-opacity duration-700 ${
              activeVideo === 1 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{ objectPosition: "58% 22%" }}
          >
            <source src="/videos/hero-campaign-2.mp4" type="video/mp4" />
          </video>

          {/* Cinematic full-frame radial edge vignette — darkens all four corners equally, no localised rectangles */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(9,9,9,0.55) 80%, rgba(9,9,9,0.82) 100%)",
            }}
          />
          {/* Cinematic top-to-bottom scrim — preserves legibility without blocking the frame */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                "linear-gradient(to bottom, rgba(9,9,9,0.38) 0%, transparent 30%, transparent 60%, rgba(9,9,9,0.62) 100%)",
            }}
          />
        </div>

        {/* Clean Luxury Editorial Typography Center */}
        <div className="relative z-30 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center h-full pt-12">
          
          {/* Brand Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-4"
          >
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#C8A45D] font-semibold drop-shadow-md">
              GOR MENSWEAR
            </span>
          </motion.div>

          {/* Large Balanced Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="font-editorial text-5xl sm:text-7xl lg:text-[84px] font-normal leading-[1.04] tracking-tight text-[#F8F6F3] drop-shadow-xl"
          >
            Modern <span className="italic text-[#C8A45D] font-light">Street Luxury</span>
          </motion.h1>

          {/* Short 1-Line Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-5 font-sans text-xs sm:text-sm text-[#F8F6F3]/90 font-light tracking-[0.2em] uppercase max-w-lg drop-shadow"
          >
            Premium essentials designed for everyday confidence.
          </motion.p>

          {/* Streamlined Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-9 flex flex-row items-center justify-center gap-4"
          >
            <Link href="/shop" className="btn-primary">
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link href="/new-arrivals" className="btn-secondary">
              <Flame className="w-3.5 h-3.5 text-[#C8A76A]" />
              <span>New Arrivals</span>
            </Link>
          </motion.div>
        </div>

        {/* Luxury Editorial Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#B8B6B0]/70 font-semibold">
            Scroll to Discover
          </span>
          <div className="w-[1.5px] h-6 bg-gradient-to-b from-[#C8A76A] to-transparent animate-pulse" />
        </motion.div>
      </section>
    </>
  );
}
