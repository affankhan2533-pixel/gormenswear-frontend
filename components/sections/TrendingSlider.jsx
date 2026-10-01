"use client";

import { useState, useEffect, useRef } from "react";
import { productService } from "@/lib/productService";
import ProductCard from "@/components/ui/ProductCard";

export default function TrendingSlider() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const railRef = useRef(null);

  useEffect(() => {
    async function fetchTrending() {
      try {
        setIsLoading(true);
        const prods = await productService.getStorefrontProducts();
        if (prods && Array.isArray(prods) && prods.length > 0) {
          const active = prods.filter((p) => p.status !== "Archived" && p.visibility !== "Hidden");
          setProducts(active.length > 0 ? active : prods);
        }
      } catch (err) {
        console.error("Failed to load trending products", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrending();
  }, []);

  // Merchandising Logic: Only display distinct products not already featured in New Arrivals (items from index 3 onwards)
  const distinctTrending = products.slice(3);

  // If there are no distinct products, do not duplicate just to fill space
  if (!isLoading && distinctTrending.length === 0) return null;

  return (
    <section
      id="trending"
      className="py-12 sm:py-24 bg-[#F5F2EC] text-[#111111] relative selection:bg-[#D8D2C8] selection:text-[#111111] border-t border-[#D8D2C8]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header with Quiet Swiping Cue */}
        <div className="flex items-end justify-between mb-8 sm:mb-14 pb-4 border-b border-[#D8D2C8]">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#716D66] font-medium block mb-2">
              05 / CURATION
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#111111] tracking-tight leading-tight">
              TRENDING NOW
            </h2>
          </div>

          <span className="font-mono text-xs text-[#716D66] hidden sm:inline-block">
            [ HORIZONTAL DRAG → ]
          </span>
        </div>

        {/* Horizontal Editorial Product Rail */}
        <div
          ref={railRef}
          className="flex gap-5 sm:gap-8 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-5 px-5 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {distinctTrending.map((product) => (
            <div
              key={product.id || product._id || product.slug}
              className="w-[82vw] min-[375px]:w-[78vw] sm:w-[320px] lg:w-[calc(33.333%-22px)] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
