"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    index: "01",
    name: "T-SHIRTS",
    slug: "t-shirts",
    image: "/images/categories/t-shirts/image copy 21.png",
  },
  {
    index: "02",
    name: "SHIRTS",
    slug: "shirts",
    image: "/images/categories/shirts/image.png",
  },
  {
    index: "03",
    name: "POLOS",
    slug: "polos",
    image: "/images/categories/t-shirts/image copy 18.png",
  },
  {
    index: "04",
    name: "PANTS",
    slug: "pants",
    image: "/images/categories/t-shirts/image copy 15.png",
  },
  {
    index: "05",
    name: "TROUSERS",
    slug: "trousers",
    image: "/images/categories/t-shirts/image copy 8.png",
  },
  {
    index: "06",
    name: "JACKETS",
    slug: "jackets",
    image: "/images/categories/t-shirts/image copy 19.png",
  },
  {
    index: "07",
    name: "JERSEYS",
    slug: "jerseys",
    image: "/images/categories/jerseys/image copy 8.png",
  },
];

export default function Categories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = CATEGORIES[activeIndex];

  return (
    <section
      id="categories"
      className="py-12 sm:py-24 lg:py-32 bg-[#F5F2EC] text-[#111111] relative selection:bg-[#D8D2C8] selection:text-[#111111] border-t border-[#D8D2C8]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-16 pb-4 border-b border-[#D8D2C8]">
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#716D66] font-medium">
            01 / DIRECTORY
          </span>
          <span className="font-mono text-xs text-[#716D66]">
            [ 07 SILHOUETTES ]
          </span>
        </div>

        {/* ── Desktop & Tablet: Editorial Interactive Split Directory ── */}
        <div className="hidden md:grid md:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Large Typographic Navigation List (7 Cols) */}
          <div className="md:col-span-7 divide-y divide-[#D8D2C8]">
            {CATEGORIES.map((cat, idx) => {
              const isActive = activeIndex === idx;

              return (
                <div
                  key={cat.slug}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className="group py-3.5 sm:py-4 transition-colors"
                >
                  <Link
                    href={`/category/${cat.slug}`}
                    className="flex items-baseline justify-between w-full"
                  >
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="font-mono text-xs text-[#716D66] group-hover:text-[#111111] transition-colors">
                        {cat.index}
                      </span>
                      <h3
                        className={`font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight transition-colors duration-200 ${
                          isActive ? "text-[#111111]" : "text-[#716D66] group-hover:text-[#111111]"
                        }`}
                      >
                        {cat.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <ArrowRight
                        className={`w-4 h-4 transition-all duration-200 ${
                          isActive
                            ? "opacity-100 translate-x-0 text-[#111111]"
                            : "opacity-0 -translate-x-2 text-[#716D66] group-hover:opacity-100 group-hover:translate-x-0"
                        }`}
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right Column: Large Category Imagery Preview Frame (5 Cols) */}
          <div className="md:col-span-5 relative">
            <Link
              href={`/category/${activeCategory.slug}`}
              className="block relative aspect-[3/4] w-full rounded-[2px] overflow-hidden bg-[#E9E5DD] border border-[#D8D2C8] group cursor-pointer shadow-[0_8px_30px_rgba(17,17,17,0.06)]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.slug}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeCategory.image}
                    alt={activeCategory.name}
                    fill
                    sizes="(max-width: 1024px) 45vw, 35vw"
                    className="object-cover object-top filter contrast-[1.02] group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/75 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Bottom Frame Details */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#D8D2C8] block mb-1">
                    SELECTED SILHOUETTE
                  </span>
                  <h4 className="font-editorial text-2xl text-[#F5F2EC]">
                    {activeCategory.name}
                  </h4>
                </div>

                <div className="w-9 h-9 rounded-[2px] bg-[#151515]/90 border border-white/20 flex items-center justify-center text-[#F5F2EC] group-hover:bg-[#111111] transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* ── Mobile: Editorial Full-Width Row Directory (Min 44px Touch Target) ── */}
        <div className="md:hidden divide-y divide-[#D8D2C8] border-b border-[#D8D2C8]">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="min-h-[48px] py-3.5 flex items-center justify-between group active:bg-[#EFECE6] transition-colors px-1"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-[#716D66] font-medium">{cat.index}</span>
                <h3 className="font-editorial text-xl min-[360px]:text-2xl font-normal text-[#111111]">
                  {cat.name}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[#716D66] group-hover:text-[#111111]">
                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
