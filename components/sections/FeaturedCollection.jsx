"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const FEATURED_COLLECTIONS = [
  {
    id: "oversized-tees",
    title: "Oversized Tees",
    subtitle: "Heavyweight Streetwear",
    count: "18 Garments",
    href: "/shop/shirts",
    image: "/images/lookbook/image.png",
    className: "md:col-span-2 lg:col-span-2 h-[420px] sm:h-[480px]",
  },
  {
    id: "coord-sets",
    title: "Co-Ord Sets",
    subtitle: "Matching Everyday Fits",
    count: "12 Garments",
    href: "/shop/codset",
    image: "/images/categories/image.png",
    className: "md:col-span-1 lg:col-span-1 h-[230px] sm:h-[230px]",
  },
  {
    id: "baggy-jeans",
    title: "Baggy Jeans",
    subtitle: "Relaxed Denim Cuts",
    count: "14 Garments",
    href: "/shop/trousers",
    image: "/images/lookbook/image copy 2.png",
    className: "md:col-span-1 lg:col-span-1 h-[230px] sm:h-[230px]",
  },
  {
    id: "shirts",
    title: "Shirts",
    subtitle: "Raw Silk & Cotton",
    count: "22 Garments",
    href: "/shop/shirts",
    image: "/images/lookbook/image copy 3.png",
    className: "md:col-span-1 lg:col-span-1 h-[230px] sm:h-[230px]",
  },
  {
    id: "formal-wear",
    title: "Formal Wear",
    subtitle: "Structured Layers",
    count: "10 Garments",
    href: "/shop/outerwear",
    image: "/images/lookbook/image copy 5.png",
    className: "md:col-span-1 lg:col-span-1 h-[230px] sm:h-[230px]",
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    subtitle: "Latest Drop 2026",
    count: "16 Garments",
    href: "/new-arrivals",
    image: "/images/lookbook/image copy 7.png",
    className: "md:col-span-2 lg:col-span-2 h-[230px] sm:h-[230px]",
  },
];

export default function FeaturedCollection() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-[#15181D] text-[#F5F3EF] overflow-hidden border-t border-b border-[rgba(200,167,106,0.15)] relative bg-section-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C8A76A] font-semibold block mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A76A]" /> COLLECTIONS
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl font-normal text-[#F5F3EF] tracking-wide">
              Find Your Everyday Style
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light max-w-lg mt-2">
              Explore premium menswear collections designed for every occasion.
            </p>
          </div>

          <Link
            href="/shop"
            className="font-sans text-xs uppercase tracking-[0.2em] text-[#C8A76A] hover:text-[#F5F3EF] transition-colors flex items-center gap-2 font-semibold shrink-0"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Asymmetrical Editorial Magazine Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURED_COLLECTIONS.map((col, index) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={`relative rounded-[14px] overflow-hidden bg-[#1B1F25] border border-[rgba(200,167,106,0.15)] hover:border-[#C8A76A]/40 group shadow-xl hover:-translate-y-1 transition-all duration-300 ${col.className}`}
            >
              <Link href={col.href} className="block w-full h-full relative">
                {/* Image — next/image with fill for zero layout shift */}
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center filter brightness-[0.92] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/95 via-[#0F1115]/40 to-transparent opacity-85 group-hover:opacity-70 transition-opacity duration-300" />

                {/* Top Count Badge */}
                <div className="absolute top-4 left-4 z-10 bg-[#0F1115]/80 backdrop-blur-md border border-[rgba(200,167,106,0.2)] px-3 py-1 rounded-full">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-[#C8A76A] font-semibold">
                    {col.count}
                  </span>
                </div>

                {/* Bottom Card Content */}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col justify-end">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#B8B6B0] font-medium block mb-1">
                    {col.subtitle}
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#F5F3EF] group-hover:text-[#C8A76A] transition-colors leading-tight">
                    {col.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 font-sans text-xs uppercase tracking-wider text-[#C8A76A] font-semibold pt-2 border-t border-[rgba(200,167,106,0.15)]">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
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
