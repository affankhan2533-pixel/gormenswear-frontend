"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function BrandStory() {
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
      className="py-16 sm:py-24 bg-[#1B1F25] text-[#F7F5F2] overflow-hidden relative selection:bg-[#C9A86A] selection:text-[#0E1013]"
    >
      {/* Background Depth Accents */}
      <div 
        className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full pointer-events-none z-0 opacity-20 blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(201, 168, 106, 0.04) 0%, transparent 70%)" }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-14 items-center flex-col-reverse md:flex-row">
          
          {/* LEFT COLUMN (45% width on Desktop) */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-center text-left py-2 lg:py-6 order-2 md:order-1">
            
            {/* Small Brand Label */}
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-sans text-xs uppercase tracking-[0.35em] text-[#C8A76A] font-semibold block mb-3 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8A76A]" />
              <span>ABOUT GOR</span>
            </motion.span>

            {/* Large Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F5F3EF] tracking-wide leading-tight mb-6"
            >
              Designed for <br />
              <span className="italic text-[#C8A76A]">Everyday Confidence.</span>
            </motion.h2>

            {/* Brand Story Body Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light leading-relaxed tracking-wide mb-8 max-w-lg"
            >
              GOR Menswear creates modern fashion for people who value comfort, confidence and timeless style. Every collection is thoughtfully selected to help you look your best, whether you&apos;re dressing for work, weekends or special occasions.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <Link
                href="/shop"
                className="btn-outline inline-flex items-center gap-3 font-sans text-xs uppercase tracking-[0.25em]"
              >
                <span>Discover Our Collections</span>
                <ArrowRight className="w-4 h-4 text-[#C8A76A]" />
              </Link>
            </motion.div>

          </div>

          {/* RIGHT COLUMN (55% width on Desktop: Next.js Image Optimization) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-7 lg:col-span-7 relative rounded-[14px] overflow-hidden bg-[#1B1F25] border border-[rgba(200,167,106,0.15)] shadow-2xl group order-1 md:order-2"
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/5] lg:aspect-[16/10] overflow-hidden">
              <Image
                src="/images/categories/image.png"
                alt="GOR Menswear Editorial Campaign"
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                loading="lazy"
                className="object-cover object-top filter brightness-[0.94] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/80 via-transparent to-transparent opacity-70" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
