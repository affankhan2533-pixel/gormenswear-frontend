"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function LifestyleBanner() {
  return (
    <section 
      id="editorial-story"
      className="py-16 sm:py-24 bg-[#0E1013] text-[#F7F5F2] overflow-hidden relative selection:bg-[#C9A86A] selection:text-[#0E1013]"
    >
      {/* Soft Ambient Gold Lighting */}
      <div 
        className="absolute top-1/2 left-0 w-[550px] h-[550px] rounded-full pointer-events-none z-0 opacity-20 blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(201, 168, 106, 0.04) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE (DESKTOP 45% / MOBILE TEXT BELOW): Editorial Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:col-span-5 flex flex-col justify-center text-center lg:text-left"
          >
            {/* Minimal Editorial Label (No Glass Effect) */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
              <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C9A86A] font-semibold">
                EDITORIAL
              </span>
            </div>

            {/* Main Editorial Heading */}
            <h2 className="font-editorial text-4xl sm:text-6xl lg:text-6xl font-normal text-[#F7F5F2] tracking-tight leading-[1.06] mb-5">
              DESIGNED <br />
              FOR THE <br />
              <span className="italic text-[#C9A86A]">MODERN MAN</span>
            </h2>

            {/* Body Paragraph (Constrained under 520px) */}
            <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light leading-relaxed tracking-wide mb-8 max-w-[520px] mx-auto lg:mx-0">
              Every piece is created to deliver effortless confidence, timeless style and everyday comfort.
            </p>

            {/* Premium Feature Points with Thin Gold Dividers */}
            <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-9 text-[#B8B6B0]/90 text-[11px] uppercase tracking-[0.16em] font-sans font-medium flex-wrap">
              <span className="flex items-center gap-1.5 text-[#F7F5F2]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A86A]" />
                Premium Fabrics
              </span>
              <span className="text-[#C9A86A]/40 font-light">|</span>
              <span className="flex items-center gap-1.5 text-[#F7F5F2]">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
                Modern Fits
              </span>
              <span className="text-[#C9A86A]/40 font-light">|</span>
              <span className="flex items-center gap-1.5 text-[#F7F5F2]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86A]" />
                Everyday Comfort
              </span>
            </div>

            {/* Luxury 12px Rounded CTA Button */}
            <div className="flex justify-center lg:justify-start">
              <Link href="/shop" className="inline-block w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto h-[52px] px-8 rounded-[12px] bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:bg-[#D4B57C] hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_20px_rgba(201,168,106,0.25)] hover:shadow-[0_8px_30px_rgba(201,168,106,0.4)] flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

          </motion.div>

          {/* RIGHT SIDE (DESKTOP 55% / MOBILE VIDEO FIRST): Dedicated Second Campaign Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:col-span-7 relative"
          >
            {/* Natural Video Frame with 24px Radius & Subtle Border Tint */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/10] rounded-[24px] overflow-hidden bg-[#111111] border border-[#C9A86A]/10 shadow-lg group">
              
              {/* Second Cinematic Video with Slow Zoom Animation */}
              <motion.video
                autoPlay
                muted
                loop
                playsInline
                poster="/images/lookbook/gor-lookbook-1.webp"
                animate={{ scale: [1, 1.03] }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="w-full h-full object-cover filter brightness-[1.05] contrast-[1.04]"
                style={{ objectPosition: "center 8%" }}
              >
                <source src="/videos/make-more-angle.mp4" type="video/mp4" />
                <source src="/videos/hero-campaign-2.mp4" type="video/mp4" />
              </motion.video>

              {/* Soft Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/60 via-transparent to-transparent pointer-events-none z-10" />

              {/* Subtle Refined Tag */}
              <div className="absolute bottom-5 right-5 z-20 px-3.5 py-1.5 rounded-full bg-[#0B0B0B]/70 backdrop-blur-md border border-[#C9A86A]/25 text-[#C9A86A] text-[9px] font-sans font-semibold uppercase tracking-[0.25em] shadow-md">
                <span>CAMPAIGN 2026</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
