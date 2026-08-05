"use client";

import { Search, ChevronDown, SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";

export default function PlpTopToolbar({
  productCount = 0,
  currentCategoryTitle = "All Collections",
  searchQuery = "",
  onSearchChange = () => {},
  sortOption = "featured",
  onSortChange = () => {},
  gridCols = 4,
  onToggleGridCols = () => {},
  onOpenMobileFilters = () => {},
  activeFilterCount = 0,
}) {
  return (
    <div className="bg-[#0B0B0B]/95 border border-[#2A2A2A] rounded-2xl p-4 mb-6 backdrop-blur-xl shadow-xl select-none text-[#F7F5F2]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Left Side: Product Count & Current Category Label */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A86A] font-bold">
            {currentCategoryTitle}
          </span>
          <span className="text-xs text-[#B8B6B0] font-mono">
            ({productCount} {productCount === 1 ? "Garment" : "Garments"})
          </span>
        </div>

        {/* Middle: Search this Collection Field (Refinement #7) */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#B8B6B0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search in this collection..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#111111] border border-[#2A2A2A] focus:border-[#C9A86A] pl-9 pr-8 py-2 rounded-xl text-xs font-sans text-[#F7F5F2] placeholder-[#B8B6B0]/50 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8B6B0] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Side: Sort Selector & Desktop Grid Density Toggle (Refinement #4) */}
        <div className="flex items-center gap-3 justify-between lg:justify-end">
          
          {/* Mobile Filter Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden h-10 px-4 bg-[#111111] border border-[#2A2A2A] text-[#F7F5F2] font-sans text-xs uppercase tracking-wider font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C9A86A]" />
            <span>Filter ({activeFilterCount})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#F7F5F2] font-sans text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl appearance-none pr-9 cursor-pointer transition-colors"
            >
              <option value="featured">Sort: Featured</option>
              <option value="newest">Sort: Newest</option>
              <option value="bestselling">Sort: Best Selling</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#C9A86A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Desktop Grid Density Toggle (3-col vs 4-col Refinement #4) */}
          <div className="hidden lg:flex items-center bg-[#111111] border border-[#2A2A2A] rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => onToggleGridCols(3)}
              aria-label="3-column grid"
              title="3-Column Spacious View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                gridCols === 3 ? "bg-[#C9A86A] text-[#0B0B0B]" : "text-[#B8B6B0] hover:text-[#F7F5F2]"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onToggleGridCols(4)}
              aria-label="4-column grid"
              title="4-Column Density View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                gridCols === 4 ? "bg-[#C9A86A] text-[#0B0B0B]" : "text-[#B8B6B0] hover:text-[#F7F5F2]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
