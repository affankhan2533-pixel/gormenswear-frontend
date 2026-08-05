"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Sparkles } from "lucide-react";

export default function PlpHero({
  title = "Ready To Wear",
  subtitle = "Designed for everyday confidence and timeless style.",
  categoryKey = "all",
  productCount = 0,
  heroImage = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop",
}) {
  return (
    <section className="relative w-full h-[35vh] min-h-[280px] lg:h-[55vh] lg:min-h-[460px] lg:max-h-[560px] bg-[#111111] border-b border-[#2A2A2A] overflow-hidden flex items-end select-none">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt={title}
          fill
          priority
          unoptimized
          className="object-cover object-center filter brightness-[0.75] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-black/40 z-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-8 sm:pb-12">
        
        {/* SEO Breadcrumbs (Refinement: Home / Collections / Category) */}
        <nav aria-label="Breadcrumb" className="font-sans text-[11px] text-[#B8B6B0] uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
          <Link href="/" className="hover:text-[#C9A86A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C9A86A] transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-[#C9A86A] font-bold">{title}</span>
        </nav>

        <div className="max-w-3xl space-y-2">
          {/* Eyebrow badge */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.25em] bg-[#C9A86A]/20 text-[#C9A86A] border border-[#C9A86A]/40 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles className="w-3 h-3" /> GOR ATELIER 2026
            </span>
            {productCount > 0 && (
              <span className="text-xs text-[#B8B6B0] font-mono font-semibold">
                {productCount} GARMENTS
              </span>
            )}
          </div>

          {/* Category Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#F7F5F2] tracking-tight leading-[1.06]">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light max-w-xl leading-relaxed">
            {subtitle}
          </p>
        </div>

      </div>
    </section>
  );
}
