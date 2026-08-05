"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { EASING, DURATION } from "@/lib/motion";

// ── Word-by-word reveal for the headline
function HeroWordReveal({ lines, className, delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <h1 className={className}>
        {lines.map((line, li) => (
          <span key={li} className="block">{line.text}{line.italic && <em className="italic font-light text-[#C9A86A] not-italic">{line.italic}</em>}</span>
        ))}
      </h1>
    );
  }

  return (
    <h1 className={className} aria-label={lines.map(l => (l.text || "") + (l.italic || "")).join(" ")}>
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden">
          {line.text && line.text.split(" ").map((word, wi) => (
            <span key={wi} className="inline-block overflow-hidden mr-[0.22em]">
              <motion.span
                className="inline-block"
                initial={{ y: "105%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: DURATION.hero,
                  delay: delay + (li * 3 + wi) * 0.06,
                  ease: EASING.luxury,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
          {line.italic && (
            <span className="inline-block overflow-hidden">
              <motion.span
                className="inline-block italic font-light text-[#C9A86A]"
                initial={{ y: "105%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: DURATION.hero,
                  delay: delay + (li * 3) * 0.06 + 0.1,
                  ease: EASING.luxury,
                }}
              >
                {line.italic}
              </motion.span>
            </span>
          )}
        </span>
      ))}
    </h1>
  );
}

const HERO_LINES = [
  { text: "ELEVATE" },
  { italic: "EVERY" },
  { text: "OCCASION" },
];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const fadeProps = (delay) =>
    shouldReduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 14, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: DURATION.slow, delay, ease: EASING.luxury },
        };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
         1. MOBILE & TABLET HERO (< 1024px)
         ══════════════════════════════════════════════════════════════ */}
      <section className="lg:hidden relative w-full h-screen min-h-screen bg-[#0B0B0B] text-[#F7F5F2] overflow-hidden flex flex-col justify-between pt-[75px] pb-6 px-5 selection:bg-[#C9A86A] selection:text-[#0B0B0B]">

        {/* Mobile Background Video — cinematic fade in */}
        <div className="absolute inset-x-0 top-[65px] bottom-0 h-[calc(100vh-65px)] z-0 overflow-hidden">
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/lookbook/gor-lookbook-1.webp"
            initial={{ opacity: 0, filter: "blur(12px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 1.4, ease: EASING.smooth }}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[1.08] contrast-[1.04] scale-100"
            style={{ objectPosition: "50% 0%" }}
          >
            <source src="/videos/hero-campaign-1.mp4" type="video/mp4" />
          </motion.video>

          <div className="absolute inset-0 bg-[#0B0B0B]/30 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/95 via-transparent to-[#0B0B0B]/50 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none z-10" />
        </div>

        {/* Content */}
        <div className="relative z-20 w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center my-auto text-center pt-2">

          {/* Mobile Headline — word reveal */}
          <div className="font-editorial text-4xl sm:text-5xl font-normal leading-[1.06] tracking-tight text-[#F7F5F2] mb-3 [text-shadow:0_4px_28px_rgba(0,0,0,0.9)]">
            <HeroWordReveal lines={HERO_LINES} delay={0.1} className="font-editorial text-4xl sm:text-5xl font-normal leading-[1.06] tracking-tight text-[#F7F5F2]" />
          </div>

          {/* Subtitle */}
          <motion.div {...fadeProps(0.45)} className="max-w-[340px] space-y-1 mb-6 [text-shadow:0_2px_14px_rgba(0,0,0,0.95)]">
            <p className="font-sans text-xs sm:text-sm text-[#F7F5F2] font-light leading-relaxed">
              Discover premium menswear designed for modern confidence and everyday comfort.
            </p>
            <p className="font-sans text-[11px] text-[#D8D6D0] font-light italic">
              Explore our latest collection of premium shirts, polos, trousers and essentials.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div {...fadeProps(0.6)} className="flex flex-col gap-2.5 w-full max-w-[320px]">
            <Link href="/shop" className="w-full">
              <button
                type="button"
                className="w-full h-[48px] rounded-[12px] bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-[0.2em] font-bold active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/new-arrivals" className="w-full">
              <button
                type="button"
                className="w-full h-[48px] rounded-[12px] bg-[#0B0B0B]/75 backdrop-blur-md border border-[#C9A86A]/40 text-[#F7F5F2] font-sans text-xs uppercase tracking-[0.2em] font-semibold active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View New Arrivals</span>
              </button>
            </Link>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div {...fadeProps(0.75)} className="mt-5 flex items-center justify-center gap-2 text-[#F7F5F2] text-[10px] uppercase tracking-[0.14em] font-sans font-medium flex-wrap [text-shadow:0_2px_8px_rgba(0,0,0,0.95)]">
            <span className="flex items-center gap-1 text-[#F7F5F2]">
              <ShieldCheck className="w-3 h-3 text-[#C9A86A]" />
              Premium Fabrics
            </span>
            <span className="text-[#C9A86A]">•</span>
            <span>Modern Fit</span>
            <span className="text-[#C9A86A]">•</span>
            <span>Easy Returns</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 1, duration: 0.8 }}
          className="relative z-20 w-full flex flex-col items-center justify-center pt-2 pb-2 pointer-events-none select-none"
        >
          <span className="text-[9px] uppercase tracking-[0.35em] text-[#F7F5F2]/90 font-sans font-medium mb-1.5 [text-shadow:0_2px_6px_rgba(0,0,0,0.95)]">
            SCROLL
          </span>
          <div className="w-[1.5px] h-7 bg-white/30 rounded-full overflow-hidden relative">
            <motion.div
              className="w-full h-3 bg-gradient-to-b from-[#C9A86A] to-transparent rounded-full absolute top-0"
              animate={shouldReduceMotion ? {} : { y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
         2. DESKTOP HERO (>= 1024px) — Full-Bleed Editorial Layout
         ══════════════════════════════════════════════════════════════ */}
      <section
        className="hidden lg:flex relative w-full h-[calc(100vh-65px)] min-h-[calc(100vh-65px)] bg-[#0B0B0B] text-[#F7F5F2] overflow-hidden justify-between items-center selection:bg-[#C9A86A] selection:text-[#0B0B0B]"
        style={{ marginTop: "65px" }}
      >
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none z-0" />
        <div
          className="absolute top-1/3 -left-20 w-96 h-96 rounded-full pointer-events-none z-0 opacity-20 blur-[130px]"
          style={{ background: "radial-gradient(circle, #C9A86A 0%, transparent 70%)" }}
        />

        {/* LEFT: Editorial Content */}
        <div className="relative z-20 w-[45%] pl-10 lg:pl-16 xl:pl-20 pr-6 flex flex-col items-start text-left justify-center h-full py-6">

          {/* Desktop Headline — word reveal */}
          <HeroWordReveal
            lines={HERO_LINES}
            delay={0.15}
            className="font-editorial text-[68px] xl:text-[76px] font-normal leading-[1.04] tracking-tight text-[#F7F5F2] mb-5 drop-shadow-md"
          />

          {/* Subtitle */}
          <motion.div {...fadeProps(0.5)} className="max-w-[500px] space-y-2 mb-8">
            <p className="font-sans text-base text-[#F7F5F2]/90 font-light leading-relaxed">
              Discover premium menswear designed for modern confidence, timeless elegance, and everyday comfort.
            </p>
            <p className="font-sans text-sm text-[#B8B6B0] font-light italic">
              Explore our latest collection of premium shirts, polos, trousers and everyday essentials.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div {...fadeProps(0.65)} className="flex flex-row items-center justify-start gap-4 w-auto">
            <Link href="/shop" className="w-auto">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: EASING.luxury }}
                className="h-[52px] px-8 rounded-[12px] bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-[0.2em] font-bold transition-colors duration-300 hover:bg-[#D4B57C] shadow-[0_4px_20px_rgba(201,168,106,0.25)] hover:shadow-[0_8px_30px_rgba(201,168,106,0.4)] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <Link href="/new-arrivals" className="w-auto">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: EASING.luxury }}
                className="h-[52px] px-8 rounded-[12px] bg-[#111111]/80 backdrop-blur-md border border-[#C9A86A]/30 text-[#F7F5F2] font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:border-[#C9A86A] hover:text-[#C9A86A] shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>View New Arrivals</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div {...fadeProps(0.8)} className="mt-8 flex items-center justify-start gap-4 text-[#B8B6B0]/80 text-[11px] uppercase tracking-[0.16em] font-sans font-medium flex-wrap">
            <span className="flex items-center gap-1.5 text-[#F7F5F2]/90">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A86A]" />
              Premium Fabrics
            </span>
            <span className="text-[#C9A86A]/50">•</span>
            <span>Modern Fit</span>
            <span className="text-[#C9A86A]/50">•</span>
            <span>Fast Shipping & Easy Returns</span>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 1.1, duration: 0.8 }}
            className="mt-10 flex items-center gap-3 select-none"
          >
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#B8B6B0]/60 font-sans font-medium">
              SCROLL
            </span>
            <div className="w-8 h-[1.5px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full w-3 bg-gradient-to-r from-[#C9A86A] to-transparent rounded-full absolute left-0"
                animate={shouldReduceMotion ? {} : { x: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Full-Height Video */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] h-full z-10 overflow-hidden">
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/lookbook/gor-lookbook-1.webp"
            initial={{ opacity: 0, filter: "blur(16px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 1.6, ease: EASING.smooth }}
            className="w-full h-full object-cover filter brightness-[1.06] contrast-[1.04]"
            style={{ objectPosition: "center top" }}
          >
            <source src="/videos/hero-campaign-1.mp4" type="video/mp4" />
          </motion.video>

          {/* Subtle scale breathe — very gentle, 12s cycle */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full" />
          </div>

          <div className="absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/50 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0B0B0B]/60 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0B0B0B] to-transparent pointer-events-none z-20" />

          <div className="absolute bottom-8 right-12 z-20 px-3.5 py-1.5 rounded-full bg-[#0B0B0B]/70 backdrop-blur-md border border-[#C9A86A]/30 text-[#C9A86A] text-[9px] uppercase tracking-[0.25em] font-sans font-semibold shadow-lg">
            <span>SIGNATURE COLLECTION</span>
          </div>
        </div>
      </section>
    </>
  );
}
