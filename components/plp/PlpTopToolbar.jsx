"use client";

import { ChevronDown, SlidersHorizontal, Grid3X3, LayoutGrid } from "lucide-react";

export default function PlpTopToolbar({
  productCount = 0,
  currentCategoryTitle = "Collection",
  sortOption = "featured",
  onSortChange = () => {},
  gridCols = 4,
  onToggleGridCols = () => {},
  onOpenMobileFilters = () => {},
  activeFilterCount = 0,
}) {
  return (
    <div className="border-b border-[#D8D2C8] pb-4 mb-8 select-none text-[#111111]">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Product Count */}
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#716D66]">
            {productCount} {productCount === 1 ? "PIECE" : "PIECES"}
          </span>
        </div>

        {/* Right Side: Mobile Filter Trigger, Minimal Sort Select & Grid Density */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Drawer Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden h-9 px-3.5 border border-[#D8D2C8] bg-transparent text-[#111111] font-sans text-xs uppercase tracking-[0.15em] font-medium flex items-center gap-2 hover:border-[#111111] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>FILTER {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
          </button>

          {/* Minimal Sort Select */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort products"
              className="bg-transparent border border-[#D8D2C8] hover:border-[#111111] text-[#111111] font-sans text-xs uppercase tracking-[0.15em] pl-3 pr-8 py-2 appearance-none cursor-pointer transition-colors focus:outline-none"
            >
              <option value="featured">SORT: FEATURED</option>
              <option value="newest">SORT: NEWEST</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 stroke-[1.5] text-[#716D66] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Desktop Grid Density Toggle */}
          <div className="hidden lg:flex items-center border border-[#D8D2C8] divide-x divide-[#D8D2C8]">
            <button
              type="button"
              onClick={() => onToggleGridCols(3)}
              aria-label="3 Column Grid"
              className={`p-2 transition-colors cursor-pointer ${
                gridCols === 3
                  ? "bg-[#151515] text-[#F5F2EC]"
                  : "text-[#716D66] hover:text-[#111111]"
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={() => onToggleGridCols(4)}
              aria-label="4 Column Grid"
              className={`p-2 transition-colors cursor-pointer ${
                gridCols === 4
                  ? "bg-[#151515] text-[#F5F2EC]"
                  : "text-[#716D66] hover:text-[#111111]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
