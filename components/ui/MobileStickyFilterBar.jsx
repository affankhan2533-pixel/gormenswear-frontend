"use client";

import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, Grid } from "lucide-react";

export default function MobileStickyFilterBar({
  selectedCategory = "all",
  onCategoryChange,
  onOpenSort,
  onOpenFilterModal,
  totalCount = 0,
}) {
  const categories = [
    { id: "all", name: "All Shop" },
    { id: "codset", name: "Co-Ord Sets" },
    { id: "outerwear", name: "Outerwear" },
    { id: "shirts", name: "Shirts" },
    { id: "trousers", name: "Trousers" },
    { id: "accessories", name: "Accessories" },
  ];

  return (
    <div className="md:hidden sticky top-[56px] z-[80] bg-[#080808]/94 backdrop-blur-xl border-b border-white/[0.08] py-2.5 px-4 shadow-xl">
      <div className="flex items-center justify-between gap-2">
        
        {/* Category Pill Horizontal Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 flex-1 pr-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange && onCategoryChange(cat.id)}
                className={`font-sans text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 min-h-[36px] flex items-center cursor-pointer ${
                  isActive
                    ? "bg-[#C9A96E] text-[#090909] font-semibold shadow-md"
                    : "bg-[#121212] text-[#8E8A85] border border-white/[0.08] hover:text-[#F4F1EA]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Filter & Sort Triggers (Min 48px Touch Targets) */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-white/[0.08]">
          <button
            type="button"
            onClick={onOpenSort}
            aria-label="Sort products"
            className="h-[38px] px-2.5 rounded-[8px] bg-[#121212] border border-white/[0.08] text-[#F4F1EA] hover:text-[#C9A96E] flex items-center gap-1.5 text-xs font-sans font-medium cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span className="text-[10px] uppercase tracking-wider">Sort</span>
          </button>

          <button
            type="button"
            onClick={onOpenFilterModal}
            aria-label="Filter options"
            className="h-[38px] px-2.5 rounded-[8px] bg-[#C9A96E]/15 border border-[#C9A96E]/40 text-[#C9A96E] flex items-center gap-1.5 text-xs font-sans font-semibold cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span className="text-[10px] uppercase tracking-wider">Filter</span>
          </button>
        </div>

      </div>
    </div>
  );
}
