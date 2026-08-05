"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { BlurReveal, Stagger, StaggerItem } from "@/components/ui/Motion";

const CATEGORIES = [
  {
    id: "shirts",
    title: "Shirts",
    eyebrow: "SIGNATURE SELECTION",
    description: "Refined grandad collars, Italian linen, and effortless tailored silhouettes.",
    image: "/images/lookbook/image copy 3.png",
    link: "/shop/shirts",
    featured: true,
    gridClass: "lg:col-span-2 lg:row-span-2",
  },
  {
    id: "polos",
    title: "Polos",
    eyebrow: "MODERN ESSENTIALS",
    description: "High-density knit polos with sleek ribbed collars.",
    image: "/images/lookbook/image copy 4.png",
    link: "/shop/polos",
    featured: false,
    gridClass: "lg:col-span-1 lg:row-span-1",
  },
  {
    id: "t-shirts",
    title: "T-Shirts",
    eyebrow: "EVERYDAY LUXURY",
    description: "Heavyweight organic cotton tees cut for modern confidence.",
    image: "/images/categories/gor-model-streetwear.webp",
    link: "/shop/t-shirts",
    featured: false,
    gridClass: "lg:col-span-1 lg:row-span-1",
  },
  {
    id: "trousers",
    title: "Trousers",
    eyebrow: "REFINED FITS",
    description: "Single & double pleated trousers with fluid drape.",
    image: "/images/lookbook/image copy 5.png",
    link: "/shop/trousers",
    featured: false,
    gridClass: "lg:col-span-1 lg:row-span-1",
  },
  {
    id: "outerwear",
    title: "Outerwear",
    eyebrow: "ATELIER COLLECTION",
    description: "Architectural jackets and transitional luxury layers.",
    image: "/images/lookbook/image copy 6.png",
    link: "/shop/outerwear",
    featured: false,
    gridClass: "lg:col-span-1 lg:row-span-1",
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    eyebrow: "LATEST DROP",
    description: "Discover our newest seasonal releases and limited pieces.",
    image: "/images/lookbook/image copy 7.png",
    link: "/new-arrivals",
    featured: false,
    gridClass: "lg:col-span-1 lg:row-span-1",
  },
];

export default function Categories() {
  return (
    <section 
      id="categories" 
      className="py-16 sm:py-24 lg:py-28 bg-[#14171C] text-[#F7F5F2] overflow-hidden relative selection:bg-[#C9A86A] selection:text-[#0E1013]"
    >
      {/* Background Depth & Soft Radial Gold Ambient Lighting */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none z-0 opacity-20 blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(201, 168, 106, 0.05) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <BlurReveal className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C9A86A] font-semibold">
              CURATED COLLECTIONS
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F7F5F2] tracking-tight leading-[1.05] mb-4">
            SHOP BY CATEGORY
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light tracking-[0.18em] leading-relaxed uppercase max-w-xl mx-auto">
            Discover collections designed for every occasion.
          </p>
        </BlurReveal>

        {/* ── Editorial Asymmetrical Grid ── */}
        <Stagger staggerDelay={0.06} className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {CATEGORIES.map((cat) => (
            <StaggerItem key={cat.id} blur className={`group relative overflow-hidden bg-[#111111] border border-[#C9A86A]/15 hover:border-[#C9A86A]/40 rounded-[16px] transition-[border-color] duration-500 cursor-pointer shadow-md ${cat.gridClass} ${
              cat.featured ? "col-span-2" : "col-span-1"
            }`}>
              <Link href={cat.link} className="block w-full h-full">
                <div className={`relative w-full h-full ${cat.featured ? "min-h-[360px] sm:min-h-[480px] lg:min-h-[640px]" : "aspect-[4/5]"} overflow-hidden bg-[#111111]`}>
                  
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 50vw"
                    className="object-cover object-center filter brightness-[0.95] contrast-[1.04] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/92 via-[#0B0B0B]/35 to-transparent opacity-90 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none" />

                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                    <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-semibold bg-[#0B0B0B]/75 backdrop-blur-md px-3 py-1 rounded-full border border-[#C9A86A]/20 shadow-sm">
                      {cat.eyebrow}
                    </span>
                  </div>

                  <div className="absolute inset-0 p-5 sm:p-7 lg:p-9 flex flex-col justify-end z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className={`font-editorial font-normal text-[#F7F5F2] tracking-tight group-hover:text-[#C9A86A] transition-colors duration-300 ${
                      cat.featured ? "text-3xl sm:text-5xl lg:text-6xl mb-2" : "text-2xl sm:text-3xl lg:text-4xl mb-1.5"
                    }`}>
                      {cat.title}
                    </h3>

                    <p className={`font-sans text-xs text-[#B8B6B0] font-light leading-relaxed mb-4 hidden sm:block max-w-md ${
                      cat.featured ? "opacity-100" : "opacity-85"
                    }`}>
                      {cat.description}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#C9A86A] font-semibold inline-flex items-center gap-1.5">
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
                      </span>
                    </div>
                    <div className="mt-2.5 w-0 group-hover:w-full h-[1.5px] bg-[#C9A86A] transition-all duration-500 ease-out" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
