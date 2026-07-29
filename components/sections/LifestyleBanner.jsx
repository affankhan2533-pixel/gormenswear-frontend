"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LifestyleBanner() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <section
      ref={containerRef}
      className="py-20 sm:py-32 lg:py-36 bg-[#15181D] text-[#F5F3EF] overflow-hidden border-t border-b border-[rgba(200,167,106,0.15)] relative bg-section-secondary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-14 items-center">
          
          {/* Left Side: Cinematic Campaign Image (~60% width on Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-7 lg:col-span-7 relative rounded-[14px] overflow-hidden bg-[#1B1F25] border border-[rgba(200,167,106,0.15)] shadow-2xl group"
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/5] lg:aspect-[16/10] overflow-hidden">
              <motion.img
                style={{ y: imageY, scale: imageScale }}
                src="/images/lookbook/image copy 2.png"
                alt="GOR Menswear Campaign Editorial"
                className="w-full h-full object-cover object-center filter brightness-[0.94] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/80 via-transparent to-transparent opacity-70" />
              
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-[#0F1115]/90 backdrop-blur-md border border-[rgba(200,167,106,0.2)] px-3.5 py-1.5 rounded-full flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A76A]" />
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A76A] font-semibold">
                  CAMPAIGN 2026
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Editorial Content (~40% width on Desktop) */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-center text-left py-2 lg:py-6">
            
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-sans text-xs uppercase tracking-[0.35em] text-[#C8A76A] font-semibold block mb-3"
            >
              GOR MENSWEAR
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F5F3EF] tracking-wide leading-tight mb-6"
            >
              MODERN STREET <br />
              <span className="italic text-[#C8A76A]">LUXURY</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light leading-relaxed tracking-wide mb-8 max-w-lg"
            >
              Premium essentials designed for everyday confidence. Discover oversized tees, shirts, co-ord sets and modern menswear crafted for today&apos;s generation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 font-sans text-xs sm:text-sm uppercase tracking-[0.25em] text-[#C8A45D] font-semibold group relative py-2"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300 text-[#C8A45D]" />
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C8A45D]/40 scale-x-100 group-hover:scale-x-[1.1] group-hover:bg-[#C8A45D] transition-all duration-300 origin-left" />
              </Link>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
