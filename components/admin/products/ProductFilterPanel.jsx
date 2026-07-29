"use client";

import { Search, Filter, X, Sparkles } from "lucide-react";

export default function ProductFilterPanel({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
}) {
  return (
    <div className="p-4 bg-[#141414] border border-[#222222] rounded-[20px] shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8E8A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search SKU, barcode, title, or tags (Ctrl+K)..."
            className="w-full pl-10 pr-4 py-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status */}
          <select
            value={filters.status || "all"}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="bg-[#0D0D0D] border border-[#2A2A2A] text-[#F8F6F3] text-xs px-3 py-2 rounded-[10px] focus:border-[#C8A45D] outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Category */}
          <select
            value={filters.category || "all"}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="bg-[#0D0D0D] border border-[#2A2A2A] text-[#F8F6F3] text-xs px-3 py-2 rounded-[10px] focus:border-[#C8A45D] outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Outerwear">Outerwear</option>
            <option value="Trousers">Trousers</option>
            <option value="Shirts">Shirts</option>
            <option value="Accessories">Accessories</option>
          </select>

          {/* Stock Status */}
          <select
            value={filters.stockStatus || "all"}
            onChange={(e) => onFilterChange("stockStatus", e.target.value)}
            className="bg-[#0D0D0D] border border-[#2A2A2A] text-[#F8F6F3] text-xs px-3 py-2 rounded-[10px] focus:border-[#C8A45D] outline-none cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="inStock">In Stock (&gt;0)</option>
            <option value="lowStock">Low Stock (≤Threshold)</option>
            <option value="outOfStock">Out of Stock (0)</option>
          </select>

          {/* AI Generated Toggle */}
          <button
            type="button"
            onClick={() => onFilterChange("aiGenerated", !filters.aiGenerated)}
            className={`px-3 py-2 rounded-[10px] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border ${
              filters.aiGenerated
                ? "bg-purple-950/80 text-purple-300 border-purple-500/50"
                : "bg-[#0D0D0D] text-[#8E8A85] border-[#2A2A2A]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Generated</span>
          </button>

          {/* Clear Filters */}
          <button
            type="button"
            onClick={onClearFilters}
            className="px-3 py-2 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#8E8A85] hover:text-[#F8F6F3] text-xs font-bold rounded-[10px] border border-[#2A2A2A] transition-colors cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}
