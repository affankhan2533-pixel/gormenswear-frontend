"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import FeaturedProductCard from "@/components/ui/FeaturedProductCard";
import { BlurReveal, Stagger, ScaleStaggerItem } from "@/components/ui/Motion";

import { productService } from "@/lib/productService";

const CURATED_BEST_SELLERS = [
  {
    id: "p2",
    name: "GOR Casablanca Mint Green Zip Polo",
    category: "Polos",
    price: 1999,
    badge: "MOST WANTED #1",
    description: "Mint green textured knit polo with bright green trim and branded GOR detailing.",
    images: ["/images/categories/t-shirts/image copy 21.png", "/images/categories/t-shirts/image copy 20.png"],
    colors: "Mint Green · Cream",
    isFeatured: true,
  },
  {
    id: "p3",
    name: "GOR Gucci Cream Monogram Jacquard Knit Polo",
    category: "Polos",
    price: 1350,
    badge: "BESTSELLER",
    description: "Cream jacquard knit polo with iconic GG monogram repeat print and contrast collar.",
    images: ["/images/categories/t-shirts/image copy 18.png", "/images/categories/t-shirts/image copy 17.png"],
    colors: "Cream / Gold · Blue Monogram",
  },
  {
    id: "p4",
    name: "GOR Khaki Tan Piped Placket Luxury Polo",
    category: "Polos",
    price: 1250,
    badge: "ICONIC",
    description: "Khaki tan short-sleeve polo with contrasting piped placket and tailored ribbed cuffs.",
    images: ["/images/categories/t-shirts/image copy 15.png", "/images/categories/t-shirts/image copy 14.png"],
    colors: "Khaki Tan · Solid White",
  },
  {
    id: "p5",
    name: "GOR Green Knit Short-Sleeve #18 Polo Jersey",
    category: "Jerseys",
    price: 1450,
    badge: "BESTSELLER",
    description: "Vibrant green short-sleeve knit polo jersey featuring bold #18 yellow chest graphic.",
    images: ["/images/categories/jerseys/image copy 8.png", "/images/categories/t-shirts/image copy 8.png"],
    colors: "Emerald Green · Dark Grey",
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
        const data = await productService.getStorefrontProducts();
        if (Array.isArray(data) && data.length >= 4) {
          const formatted = data.slice(0, 5).map((item, idx) => ({
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
