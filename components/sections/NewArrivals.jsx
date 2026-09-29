"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productService } from "@/lib/productService";
import ProductCard from "@/components/ui/ProductCard";

export default function NewArrivals() {
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        setIsLoading(true);
        const prods = await productService.getStorefrontProducts();
        if (prods && Array.isArray(prods) && prods.length > 0) {
          const active = prods.filter((p) => p.status !== "Archived" && p.visibility !== "Hidden");
          setProductsList(active.length > 0 ? active : prods);
        }
      } catch (err) {
        console.error("Failed to load new arrivals", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNewArrivals();
  }, []);

  // Merchandising Logic: New Arrivals features the first 3 latest items with varied visual scale
  const displayedArrivals = productsList.slice(0, 3);
  const featuredProduct = displayedArrivals[0];
  const secondaryProducts = displayedArrivals.slice(1);

  return (
    <section
      id="new-arrivals"
      className="py-20 sm:py-28 lg:py-32 bg-[#F5F2EC] text-[#111111] relative selection:bg-[#D8D2C8] selection:text-[#111111] border-t border-[#D8D2C8]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 pb-4 border-b border-[#D8D2C8] gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#716D66] font-medium block mb-2">
              02 / LATEST RELEASE
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#111111] tracking-tight leading-tight">
              NEW ARRIVALS
            </h2>
          </div>

          <Link
            href="/new-arrivals"
            className="font-sans text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#716D66] transition-colors inline-flex items-center gap-2 font-medium"
          >
            <span>EXPLORE ALL PIECES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Fashion Lookbook + Editorial Commerce Composition */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 aspect-[3/4] bg-[#E9E5DD] animate-pulse" />
            <div className="md:col-span-5 space-y-6">
              <div className="aspect-[3/4] bg-[#E9E5DD] animate-pulse" />
            </div>
          </div>
        ) : displayedArrivals.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-sans text-xs uppercase tracking-widest text-[#716D66]">
              Catalog currently updating.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Featured Primary Piece (Varied Scale — Dominant Presentation) */}
            {featuredProduct && (
              <div className="md:col-span-7">
                <ProductCard product={featuredProduct} />
              </div>
            )}

            {/* Secondary Pieces Stacked in Flanking Lookbook Grid */}
            {secondaryProducts.length > 0 && (
              <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-8">
                {secondaryProducts.map((product) => (
                  <ProductCard
                    key={product.id || product._id || product.slug}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
