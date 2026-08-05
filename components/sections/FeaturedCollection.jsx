"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FEATURED_COLLECTIONS = [
  {
    id: "business-essentials",
    title: "Business Essentials",
    eyebrow: "SIGNATURE TAILORING",
    description: "Refined grandad collars, Italian linen shirts, and crisp pleated trousers for effortless authority.",
    image: "/images/lookbook/image copy 3.png",
    link: "/shop/shirts",
  },
  {
    id: "weekend-edit",
    title: "Weekend Edit",
    eyebrow: "OFF-DUTY LUXURY",
    description: "High-density knit polos and fluid relaxed silhouettes designed for effortless Saturdays.",
    image: "/images/lookbook/image copy 4.png",
    link: "/shop/polos",
  },
  {
    id: "statement-pieces",
    title: "Statement Pieces",
    eyebrow: "ATELIER SHOWCASE",
    description: "Bold co-ord sets and architectural outerwear crafted to deliver instant confidence.",
    image: "/images/lookbook/image copy 6.png",
    link: "/shop/outerwear",
  },
  {
    id: "everyday-classics",
    title: "Everyday Classics",
    eyebrow: "WARDROBE FOUNDATIONS",
    description: "Heavyweight organic cotton tees and timeless essential cuts built for daily style.",
    image: "/images/categories/gor-model-streetwear.webp",
    link: "/shop/t-shirts",
  },
];

export default function FeaturedCollection() {
  return (
    <section 
      id="featured-collections" 
      className="py-16 sm:py-24 bg-[#14171C] text-[#F7F5F2] overflow-hidden relative selection:bg-[#C9A86A] selection:text-[#0E1013]"
    >
      {/* Background Depth Accents */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full pointer-events-none z-0 opacity-20 blur-[160px]"
        style={{ background: "radial-gradient(circle, rgba(201, 168, 106, 0.04) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Centered Editorial Header (No Sparkles Icon) ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-24"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C9A86A] font-semibold">
              CURATED COLLECTIONS
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F7F5F2] tracking-tight leading-[1.05] mb-4">
            FEATURED COLLECTIONS
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light tracking-[0.18em] leading-relaxed uppercase max-w-lg mx-auto">
            Explore curated edits designed for every occasion.
          </p>
        </motion.div>

        {/* ── 2 × 2 Editorial Campaign Grid (Desktop: 2-Cols | Mobile: 1-Col Stacked) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {FEATURED_COLLECTIONS.map((col, idx) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.75,
                delay: idx * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden bg-[#111111] border border-[#C9A86A]/15 hover:border-[#C9A86A]/40 rounded-[24px] transition-all duration-500 cursor-pointer shadow-lg"
            >
              {/* Entire Campaign Card is Clickable */}
              <Link href={col.link} className="block w-full h-full relative">
                <div className="relative w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] overflow-hidden bg-[#111111]">
                  
                  {/* Campaign Image — Consistent Editorial Filter & Max 1.03 Zoom */}
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center filter brightness-[0.95] contrast-[1.04] group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Dark Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/95 via-[#0B0B0B]/35 to-transparent opacity-90 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none" />

                  {/* Top Eyebrow Badge */}
                  <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-10">
                    <span className="font-sans text-[9.5px] sm:text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-semibold bg-[#0B0B0B]/75 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#C9A86A]/20 shadow-sm">
                      {col.eyebrow}
                    </span>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="absolute inset-0 p-6 sm:p-9 lg:p-10 flex flex-col justify-end z-10 transition-transform duration-300 group-hover:-translate-y-1.5">
                    
                    <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F7F5F2] group-hover:text-[#C9A86A] transition-colors duration-300 leading-tight mb-2">
                      {col.title}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light leading-relaxed mb-5 max-w-md">
                      {col.description}
                    </p>

                    {/* Explore Link with +6px Arrow Slide */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#C9A86A] font-semibold inline-flex items-center gap-1.5">
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out text-[#C9A86A]" />
                      </span>
                    </div>

                    {/* Gold Underline Reveal Animation on Hover */}
                    <div className="mt-3 w-0 group-hover:w-full h-[1.5px] bg-[#C9A86A] transition-all duration-500 ease-out" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
