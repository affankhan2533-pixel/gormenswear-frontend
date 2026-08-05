"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw, Check, Filter } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function PlpSidebarFilters({
  categoriesList = [],
  availableSizes = ["XS", "S", "M", "L", "XL", "XXL"],
  availableColors = [],
  dynamicFabrics = [],
  minPrice = 0,
  maxPrice = 1000,
  
  // Selected Filter States
  selectedCategory = "all",
  onSelectCategory = () => {},
  selectedSize = "all",
  onSelectSize = () => {},
  selectedColor = "all",
  onSelectColor = () => {},
  priceLimit = 1000,
  onChangePriceLimit = () => {},
  selectedFit = "all",
  onSelectFit = () => {},
  selectedFabric = "all",
  onSelectFabric = () => {},
  inStockOnly = false,
  onToggleInStock = () => {},

  onResetFilters = () => {},
}) {
  // Accordion Section Toggle States (Refinement #6)
  const [openSections, setOpenSections] = useState({
    category: true,
    size: true,
    color: true,
    price: true,
    fit: true,
    fabric: true,
    stock: true,
  });

  const toggleAccordion = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-64 lg:w-72 shrink-0 space-y-4 font-sans select-none sticky top-28 self-start bg-[#0B0B0B] border border-[#2A2A2A] rounded-2xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#C9A86A]" />
          <h3 className="font-bold text-xs uppercase tracking-widest text-[#F7F5F2]">Filters</h3>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="text-[11px] font-bold uppercase tracking-wider text-[#B8B6B0] hover:text-[#C9A86A] transition-colors cursor-pointer flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Accordion List */}
      <div className="divide-y divide-[#2A2A2A]">

        {/* 1. CATEGORY ACCORDION */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleAccordion("category")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer"
          >
            <span>Category</span>
            <ChevronDown className={`w-4 h-4 text-[#C9A86A] transition-transform duration-200 ${openSections.category ? "rotate-180" : ""}`} />
          </button>
          {openSections.category && (
            <div className="mt-3 space-y-1.5 pl-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? "bg-[#C9A86A] text-[#0B0B0B] font-bold"
                      : "text-[#B8B6B0] hover:text-[#F7F5F2] hover:bg-[#15181D]"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. SIZE ACCORDION */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleAccordion("size")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer"
          >
            <span>Size</span>
            <ChevronDown className={`w-4 h-4 text-[#C9A86A] transition-transform duration-200 ${openSections.size ? "rotate-180" : ""}`} />
          </button>
          {openSections.size && (
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onSelectSize("all")}
                className={`py-1.5 rounded-lg text-xs font-bold uppercase border transition-all cursor-pointer ${
                  selectedSize === "all" ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A]" : "bg-[#111111] text-[#B8B6B0] border-[#2A2A2A]"
                }`}
              >
                All
              </button>
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSelectSize(sz)}
                  className={`py-1.5 rounded-lg text-xs font-bold uppercase border transition-all cursor-pointer ${
                    selectedSize === sz ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A]" : "bg-[#111111] text-[#B8B6B0] border-[#2A2A2A] hover:border-[#C9A86A]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. COLOR ACCORDION */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleAccordion("color")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer"
          >
            <span>Color</span>
            <ChevronDown className={`w-4 h-4 text-[#C9A86A] transition-transform duration-200 ${openSections.color ? "rotate-180" : ""}`} />
          </button>
          {openSections.color && (
            <div className="mt-3 flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => onSelectColor("all")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase border cursor-pointer ${
                  selectedColor === "all" ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A]" : "bg-[#111111] text-[#B8B6B0] border-[#2A2A2A]"
                }`}
              >
                All Colors
              </button>
              {availableColors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onSelectColor(c.name)}
                  title={c.name}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 rounded-full border transition-transform cursor-pointer ${
                    selectedColor.toLowerCase() === c.name.toLowerCase()
                      ? "border-[#C9A86A] scale-110 ring-2 ring-[#C9A86A]/50"
                      : "border-[#2A2A2A] hover:scale-105"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 4. DYNAMIC PRICE ACCORDION (Refinement #2) */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleAccordion("price")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer"
          >
            <span>Max Price</span>
            <ChevronDown className={`w-4 h-4 text-[#C9A86A] transition-transform duration-200 ${openSections.price ? "rotate-180" : ""}`} />
          </button>
          {openSections.price && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#B8B6B0]">{formatPrice(minPrice)}</span>
                <span className="text-[#C9A86A] font-bold">{formatPrice(priceLimit)}</span>
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step="10"
                value={priceLimit}
                onChange={(e) => onChangePriceLimit(Number(e.target.value))}
                className="w-full accent-[#C9A86A] bg-[#111111] cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* 5. FIT ACCORDION */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleAccordion("fit")}
            className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer"
          >
            <span>Fit Silhouette</span>
            <ChevronDown className={`w-4 h-4 text-[#C9A86A] transition-transform duration-200 ${openSections.fit ? "rotate-180" : ""}`} />
          </button>
          {openSections.fit && (
            <div className="mt-3 space-y-1">
              {["all", "slim", "regular", "relaxed"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => onSelectFit(f)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                    selectedFit === f ? "bg-[#C9A86A] text-[#0B0B0B] font-bold" : "text-[#B8B6B0] hover:text-[#F7F5F2] hover:bg-[#15181D]"
                  }`}
                >
                  <span>{f === "all" ? "All Fits" : `${f} Fit`}</span>
                  {selectedFit === f && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 6. DYNAMIC FABRIC ACCORDION (Refinement #1) */}
        {dynamicFabrics.length > 0 && (
          <div className="py-3">
            <button
              type="button"
              onClick={() => toggleAccordion("fabric")}
              className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer"
            >
              <span>Fabric Textile</span>
              <ChevronDown className={`w-4 h-4 text-[#C9A86A] transition-transform duration-200 ${openSections.fabric ? "rotate-180" : ""}`} />
            </button>
            {openSections.fabric && (
              <div className="mt-3 space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectFabric("all")}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                    selectedFabric === "all" ? "bg-[#C9A86A] text-[#0B0B0B] font-bold" : "text-[#B8B6B0] hover:text-[#F7F5F2] hover:bg-[#15181D]"
                  }`}
                >
                  <span>All Fabrics</span>
                  {selectedFabric === "all" && <Check className="w-3.5 h-3.5" />}
                </button>
                {dynamicFabrics.map((fab) => (
                  <button
                    key={fab}
                    type="button"
                    onClick={() => onSelectFabric(fab)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                      selectedFabric === fab ? "bg-[#C9A86A] text-[#0B0B0B] font-bold" : "text-[#B8B6B0] hover:text-[#F7F5F2] hover:bg-[#15181D]"
                    }`}
                  >
                    <span className="truncate">{fab}</span>
                    {selectedFabric === fab && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. AVAILABILITY STOCK ACCORDION */}
        <div className="py-3">
          <label className="flex items-center justify-between text-xs text-[#F7F5F2] font-bold uppercase tracking-wider cursor-pointer">
            <span>In Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStock(e.target.checked)}
              className="accent-[#C9A86A] w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

      </div>
    </aside>
  );
}
