"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";

const CURATED_TRENDING = [
  {
    id: "p1",
    name: "GOR Raw Denim Distressed Neon Shirt",
    category: "Shirts & Silks",
    price: 420,
    badge: "TRENDING #1",
    description: "Distressed denim shirt featuring neon green contrast line.",
    images: [
      "/images/lookbook/image copy 2.png",
      "/images/lookbook/image copy 2.png",
    ],
    colors: "Raw Denim · Neon Green",
  },
  {
    id: "p2",
    name: "GOR Tribal Embroidered Heavyweight Tee",
    category: "Shirts & Silks",
    price: 380,
    badge: "HOT ITEM",
    description: "Heavyweight black cotton tee with high-density tribal embroidery.",
    images: [
      "/images/lookbook/image copy 3.png",
      "/images/lookbook/image copy 3.png",
    ],
    colors: "Onyx Black · Silver",
  },
  {
    id: "p3",
    name: "GOR Vintage Wash 11 Knit Vest",
    category: "Outerwear",
    price: 450,
    badge: "LIMITED",
    description: "Distressed vintage wash charcoal sleeveless knit vest with #11 patch.",
    images: [
      "/images/lookbook/image copy 5.png",
      "/images/lookbook/image copy 5.png",
    ],
    colors: "Vintage Charcoal",
  },
  {
    id: "p4",
    name: "GOR Conviction 23 Green Mesh Jersey",
    category: "Shirts & Silks",
    price: 390,
    badge: "POPULAR",
    description: "Emerald green breathable mesh jersey with Conviction #23 print.",
    images: [
      "/images/lookbook/image copy 4.png",
      "/images/lookbook/image copy 4.png",
    ],
    colors: "Emerald Green · Gold",
  },
  {
    id: "p5",
    name: "GOR Becoming 10 Vintage Wash Tee",
    category: "Shirts & Silks",
    price: 360,
    badge: "BESTSELLER",
    description: "Acid wash slate blue tee with Becoming #10 chest print.",
    images: [
      "/images/lookbook/image copy 7.png",
      "/images/lookbook/image copy 7.png",
    ],
    colors: "Acid Slate Blue",
  },
  {
    id: "p6",
    name: "GOR Off-White Pinstripe Zip Jersey",
    category: "Jerseys",
    price: 380,
    badge: "EXCLUSIVE",
    description: "Bold blue pinstripe Off-White jersey with zip collar and logo embroidery.",
    images: [
      "/images/lookbook/image.png",
      "/images/lookbook/image.png",
    ],
    colors: "Royal Blue · Gold",
  },
  {
    id: "p7",
    name: "GOR LA Stars Heavyweight Jersey",
    category: "Jerseys",
    price: 385,
    badge: "NEW DROP",
    description: "Olive green LA Stars knit jersey with all-over star pattern and collegiate lettering.",
    images: [
      "/images/lookbook/image copy.png",
      "/images/lookbook/image copy.png",
    ],
    colors: "Olive Green · Cream",
  },
  {
    id: "p8",
    name: "GOR Spider Knit Sleeveless Vest",
    category: "Outerwear",
    price: 395,
    badge: "NEW SEASON",
    description: "Mustard yellow spider motif open-knit sleeveless vest in premium cotton.",
    images: [
      "/images/lookbook/image copy 6.png",
      "/images/lookbook/image copy 6.png",
    ],
    colors: "Mustard Yellow",
  },
];

export default function TrendingSlider() {
  const [products, setProducts] = useState(CURATED_TRENDING);
  const sliderRef = useRef(null);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/products?sort=popular`);
        const data = await res.json();
        if (data.success && data.data.length >= 4) {
          const formatted = data.data.map((item) => ({
            ...item,
            images: item.images && item.images.length > 0 ? item.images : [item.image || "/images/lookbook/gor-lookbook-1.webp"],
          }));
          setProducts(formatted);
        }
      } catch (err) {
        setProducts(CURATED_TRENDING);
      }
    }
    fetchTrending();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section id="trending-now" className="py-16 sm:py-24 bg-[#171B21] text-[#F7F5F2] overflow-hidden relative selection:bg-[#C9A86A] selection:text-[#0E1013]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. Premium Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C9A96E] font-medium">
                TRENDING NOW
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#F4F1EA] tracking-tight leading-[1.05]">
              Curated Favorites
            </h2>
            <p className="mt-3 font-sans text-xs sm:text-sm text-[#8E8A85] font-light tracking-wide uppercase">
              Swipe or scroll to explore high-demand garments of the season
            </p>
          </div>

          {/* Right Aligned Header Actions & Controls */}
          <div className="flex items-center gap-4 self-start md:self-auto">
            {/* Desktop Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <button
                type="button"
                onClick={scrollLeft}
                aria-label="Scroll Left"
                className="w-10 h-10 rounded-full border border-white/[0.1] bg-[#121212] flex items-center justify-center text-[#F4F1EA] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                aria-label="Scroll Right"
                className="w-10 h-10 rounded-full border border-white/[0.1] bg-[#121212] flex items-center justify-center text-[#F4F1EA] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 font-sans text-xs uppercase tracking-[0.25em] text-[#C9A96E] hover:text-white font-medium transition-colors group relative py-1"
            >
              <span>View Collection</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C9A96E]/40 group-hover:bg-[#C9A96E] transition-colors" />
            </Link>
          </div>
        </motion.div>

        {/* ── 2. Horizontal Draggable Product Slider Container ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <div
            ref={sliderRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div
                key={product.id || product._id}
                className="snap-start shrink-0 w-[82vw] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 3. Bottom Collection Link ── */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 font-sans text-xs uppercase tracking-[0.25em] text-[#C9A96E] hover:text-[#D8B97E] border-b border-[#C9A96E]/50 hover:border-[#C9A96E] pb-1.5 transition-all duration-300 font-medium group"
          >
            <span>Explore All Trending Garments</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>

      </div>
    </section>
  );
}
