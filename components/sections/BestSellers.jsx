"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import FeaturedProductCard from "@/components/ui/FeaturedProductCard";
import { BlurReveal, Stagger, ScaleStaggerItem } from "@/components/ui/Motion";

const CURATED_BEST_SELLERS = [
  {
    id: "p2",
    name: "Atelier Heavyweight Raw Silk Grandad Shirt",
    category: "Shirts & Silks",
    price: 420,
    badge: "MOST WANTED #1",
    description: "High-density mulberry raw silk cut with a relaxed drape and mother-of-pearl buttons.",
    images: ["/images/products/gor-codset-beige-prada.webp", "/images/lookbook/gor-lookbook-4.webp"],
    colors: "Raw Ivory · Ebony Black",
    isFeatured: true,
  },
  {
    id: "p3",
    name: "Italian Merino Wool Pleated Trousers",
    category: "Trousers",
    price: 580,
    badge: "BESTSELLER",
    description: "Single-pleated trousers with side adjusters and a gentle taper.",
    images: ["/images/products/gor-codset-burgundy-alo.webp", "/images/lookbook/gor-lookbook-3.webp"],
    colors: "Dark Olive · Charcoal Slate",
  },
  {
    id: "p4",
    name: "Biella Shearling Trimmed Suede Jacket",
    category: "Outerwear",
    price: 2100,
    originalPrice: 2450,
    badge: "ICONIC",
    description: "Supple lambskin suede lined with plush shearling wool.",
    images: ["/images/lookbook/gor-lookbook-6.webp", "/images/lookbook/gor-lookbook-5.webp"],
    colors: "Espresso Brown · Truffle",
  },
  {
    id: "p5",
    name: "Bespoke Silk Monogram Camp Shirt",
    category: "Shirts & Silks",
    price: 390,
    badge: "BESTSELLER",
    description: "Lightweight habotai silk shirt with subtle geometric weave.",
    images: ["/images/products/gor-codset-black-burberry.webp", "/images/lookbook/gor-lookbook-2.webp"],
    colors: "Champagne Gold · Obsidian",
  },
  {
    id: "p7",
    name: "Full-Grain Calfskin Atelier Belt",
    category: "Accessories",
    price: 280,
    badge: "ESSENTIAL",
    description: "Hand-burnished Italian calfskin belt with brass buckle.",
    images: ["/images/lookbook/gor-lookbook-1.webp", "/images/lookbook/gor-lookbook-7.webp"],
    colors: "Cognac · Obsidian",
  },
];

export default function BestSellers() {
  const [bestsellers, setBestsellers] = useState(CURATED_BEST_SELLERS);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/products?category=codset`);
        const data = await res.json();
        if (data.success && data.data.length >= 4) {
          const formatted = data.data.slice(0, 5).map((item, idx) => ({
            ...item,
            images: item.images?.length ? item.images : CURATED_BEST_SELLERS[idx % CURATED_BEST_SELLERS.length].images,
          }));
          setBestsellers(formatted);
        }
      } catch (err) {
        // Retain curated fallbacks on error
      }
    }
    fetchBestSellers();
  }, []);

  const featuredBestseller = bestsellers[0];
  const regularBestsellers = bestsellers.slice(1);

  return (
    <section id="best-sellers" className="py-24 sm:py-32 bg-[#090909] text-[#F7F4EF] border-t border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Editorial Divider */}
        <BlurReveal delay={0} className="flex items-center gap-4 mb-10">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-[#C9A96E]/10" />
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#C9A96E] font-medium flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-[#C9A96E]" />
            TRENDING NOW · BEST SELLERS
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C9A96E]/40 to-[#C9A96E]/10" />
        </BlurReveal>

        {/* Section Header */}
        <BlurReveal delay={0.05} className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-normal text-[#F4F1EA] tracking-tight leading-[1.05]">
              Best Sellers
            </h2>
            <p className="mt-3 font-sans text-xs sm:text-sm text-[#8E8A85] font-light tracking-wide uppercase">
              Our most coveted garments chosen by discerning clientele worldwide
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 font-sans text-xs uppercase tracking-[0.25em] text-[#C9A96E] hover:text-white font-medium transition-colors group self-start md:self-auto"
          >
            <span>Explore All Best Sellers</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </BlurReveal>

        {/* Product Grid — staggered reveal */}
        <Stagger staggerDelay={0.07} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          {featuredBestseller && (
            <ScaleStaggerItem className="col-span-2">
              <FeaturedProductCard product={featuredBestseller} />
            </ScaleStaggerItem>
          )}
          {regularBestsellers.map((product) => (
            <ScaleStaggerItem key={product.id || product._id} className="col-span-1">
              <ProductCard product={product} />
            </ScaleStaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
