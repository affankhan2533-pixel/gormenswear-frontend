"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "outerwear",
    title: "Outerwear & Tailoring",
    eyebrow: "Atelier Outerwear",
    description: "Hand-finished cashmere coats and architectural wool jackets.",
    image: "/images/lookbook/image copy 2.png",
    link: "/shop/outerwear",
    gridCols: "lg:col-span-7",
    aspectRatio: "aspect-[4/3] lg:aspect-[16/11]",
  },
  {
    id: "shirts",
    title: "Italian Silks & Linen",
    eyebrow: "Artisanal Weave",
    description: "Relaxed grandad collars and hand-printed silk camp shirts.",
    image: "/images/lookbook/image copy 3.png",
    link: "/shop/shirts",
    gridCols: "lg:col-span-5",
    aspectRatio: "aspect-[3/4]",
  },
  {
    id: "codset",
    title: "Signature Co-Ord Capsules",
    eyebrow: "GOR Atelier",
    description: "Heavyweight matching sets built with contemporary urban silhouettes.",
    image: "/images/categories/image.png",
    link: "/shop/codset",
    gridCols: "lg:col-span-12",
    aspectRatio: "aspect-[16/9] lg:aspect-[21/9]",
  },
  {
    id: "trousers",
    title: "Pleated Trousers",
    eyebrow: "Precision Cut",
    description: "Italian wool trousers engineered with sharp single and double pleats.",
    image: "/images/lookbook/image copy 5.png",
    link: "/shop/trousers",
    gridCols: "lg:col-span-5",
    aspectRatio: "aspect-[3/4]",
  },
  {
    id: "accessories",
    title: "Bespoke Accessories",
    eyebrow: "Crafted Details",
    description: "Full-grain calfskin belts, silk scarves, and leather travel goods.",
    image: "/images/lookbook/image copy 6.png",
    link: "/shop/accessories",
    gridCols: "lg:col-span-7",
    aspectRatio: "aspect-[4/3] lg:aspect-[16/11]",
  },
];

export default function Categories() {
  return (
    <section id="categories" className="py-24 sm:py-36 bg-[#0F1115] text-[#F5F3EF] overflow-hidden border-b border-[rgba(200,167,106,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-24"
        >
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C8A76A] font-semibold block mb-3">
            CURATED COLLECTIONS
          </span>
          <h2 className="font-editorial text-4xl sm:text-6xl font-normal text-[#F5F3EF] tracking-tight leading-[1.05]">
            Discover The Selections
          </h2>
          <p className="mt-4 font-sans text-xs sm:text-sm text-[#B8B6B0] font-light tracking-widest leading-relaxed uppercase max-w-xl mx-auto">
            Crafted for every occasion with timeless tailoring and modern elegance
          </p>
        </motion.div>

        {/* ── Asymmetrical Editorial Magazine Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: (idx % 3) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden bg-[#1B1F25] border border-[rgba(200,167,106,0.15)] hover:border-[#C8A76A]/40 rounded-[14px] transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl ${cat.gridCols}`}
            >
              <Link href={cat.link} className="block w-full h-full">
                <div className={`relative w-full ${cat.aspectRatio} overflow-hidden bg-[#1B1F25]`}>
                  {/* Category Image — next/image with fill, zero layout shift */}
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    className="object-cover object-center editorial-image group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/95 via-[#0F1115]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Highlight Ribbon for Co-Ord Capsules */}
                  {cat.id === "codset" && (
                    <div className="absolute top-4 left-4 bg-[#C8A76A] text-[#0F1115] font-sans text-[9px] uppercase tracking-[0.25em] font-bold px-3.5 py-1.5 rounded-full shadow-md z-10">
                      ★ Featured Atelier Line
                    </div>
                  )}

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 sm:p-8 lg:p-10 flex flex-col justify-end z-10">
                    <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C8A76A] font-semibold mb-2 block">
                      {cat.eyebrow}
                    </span>

                    <h3 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-[#F5F3EF] group-hover:text-[#C8A76A] transition-colors duration-300">
                      {cat.title}
                    </h3>

                    <p className="mt-2 font-sans text-xs text-[#B8B6B0] font-light leading-relaxed max-w-md">
                      {cat.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between pt-2">
                      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C8A76A] font-semibold flex items-center gap-2 transition-colors">
                        Explore Collection
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                      </span>
                    </div>

                    <div className="mt-3 w-0 group-hover:w-full h-[1.5px] bg-[#C8A76A] transition-all duration-500 ease-out" />
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

