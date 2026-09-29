"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const FEATURED_ITEM = {
  id: "gor-tee-essential-oversized",
  name: "GOR Essential Oversized Tee",
  slug: "gor-essential-oversized-tee",
  category: "T-Shirts",
  price: 1499,
  compareAtPrice: 1999,
  description:
    "A relaxed silhouette cut with dropped shoulders and a structured neck line designed for versatile everyday layering.",
  colors: [
    { name: "Black", hex: "#151515", image: "/images/products/t-shirts/oversized/gor-essential-oversized-tee/black-01.webp" },
    { name: "White", hex: "#F5F2EC", image: "/images/products/t-shirts/oversized/gor-essential-oversized-tee/white-01.webp" },
    { name: "Green", hex: "#263E2E", image: "/images/products/t-shirts/oversized/gor-essential-oversized-tee/green-01.webp" },
    { name: "Navy", hex: "#18233C", image: "/images/products/t-shirts/oversized/gor-essential-oversized-tee/navy-01.webp" },
  ],
};

export default function FeaturedCollection() {
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const activeColor = FEATURED_ITEM.colors[activeColorIndex];

  return (
    <section
      id="featured-product"
      className="py-20 sm:py-28 lg:py-36 bg-[#EFECE6] text-[#111111] relative selection:bg-[#D8D2C8] selection:text-[#111111] border-t border-[#D8D2C8]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12 sm:mb-16 pb-4 border-b border-[#D8D2C8]">
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#716D66] font-medium">
            03 / THE GOR EDIT
          </span>
          <span className="font-mono text-xs text-[#716D66]">
            [ FEATURED PIECE ]
          </span>
        </div>

        {/* Magazine Editorial Spread Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* LEFT: Large Architectural Product Canvas (7 Cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] w-full rounded-[2px] overflow-hidden bg-[#E9E5DD] border border-[#D8D2C8] shadow-[0_8px_30px_rgba(17,17,17,0.06)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeColor.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeColor.image}
                    alt={`${FEATURED_ITEM.name} in ${activeColor.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center filter contrast-[1.02]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/60 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Minimal Bottom Tag */}
              <div className="absolute bottom-5 left-5 z-10 font-mono text-[11px] text-[#F5F2EC] uppercase tracking-wider">
                <span className="text-[#D8D2C8] mr-2">SHADE:</span>
                <span>{activeColor.name}</span>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex gap-2.5 mt-4">
              {FEATURED_ITEM.colors.map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setActiveColorIndex(idx)}
                  className={`relative w-16 h-20 rounded-[2px] overflow-hidden border transition-all cursor-pointer ${
                    activeColorIndex === idx
                      ? "border-[#111111] ring-1 ring-[#111111]"
                      : "border-[#D8D2C8] opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View ${c.name}`}
                >
                  <Image src={c.image} alt={c.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Fashion Editorial Product Information (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left py-2">
            <div className="space-y-6">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#716D66] font-medium block mb-2">
                  {FEATURED_ITEM.category}
                </span>
                <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#111111] tracking-tight leading-[1.08] mb-3">
                  {FEATURED_ITEM.name}
                </h2>
                <div className="flex items-baseline gap-3">
                  <span className="font-sans text-2xl font-semibold text-[#111111] tabular-nums">
                    {formatPrice(FEATURED_ITEM.price)}
                  </span>
                  <span className="font-sans text-sm text-[#716D66] line-through tabular-nums">
                    {formatPrice(FEATURED_ITEM.compareAtPrice)}
                  </span>
                </div>
              </div>

              {/* Short Approved Product Description */}
              <p className="font-sans text-xs sm:text-sm text-[#716D66] font-normal leading-relaxed">
                {FEATURED_ITEM.description}
              </p>

              {/* Color Options */}
              <div className="pt-2">
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#716D66] block mb-2.5">
                  COLOR OPTIONS
                </span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {FEATURED_ITEM.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setActiveColorIndex(idx)}
                      className={`h-8 px-3.5 rounded-[2px] text-xs font-sans flex items-center gap-2 transition-all cursor-pointer border ${
                        activeColorIndex === idx
                          ? "bg-[#151515] text-[#F5F2EC] border-[#151515]"
                          : "bg-transparent text-[#111111] border-[#D8D2C8] hover:border-[#111111]"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Architectural SHOP PRODUCT CTA */}
              <div className="pt-4 border-t border-[#D8D2C8]">
                <Link href={`/product/${FEATURED_ITEM.slug}`} className="inline-block w-full sm:w-auto">
                  <button
                    type="button"
                    className="w-full sm:w-auto h-[50px] px-10 bg-[#151515] hover:bg-[#2A2A2A] text-[#F5F2EC] font-sans text-xs uppercase tracking-[0.22em] font-medium transition-colors flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>SHOP PRODUCT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
