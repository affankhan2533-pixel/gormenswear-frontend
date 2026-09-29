"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function PlpSidebarFilters({
  categoriesList = [],
  subcategoriesList = [],
  availableSizes = ["XS", "S", "M", "L", "XL", "XXL"],
  availableColors = [],
  minPrice = 0,
  maxPrice = 1000,

  // Selected Filter States
  selectedCategory = "all",
  onSelectCategory = () => {},
  selectedSubcategory = "all",
  onSelectSubcategory = () => {},
  selectedSize = "all",
  onSelectSize = () => {},
  selectedColor = "all",
  onSelectColor = () => {},
  priceLimit = 1000,
  onChangePriceLimit = () => {},
  selectedFit = "all",
  onSelectFit = () => {},
  inStockOnly = false,
  onToggleInStock = () => {},

  onResetFilters = () => {},
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    subcategory: true,
    size: true,
    color: true,
    price: true,
    fit: true,
    availability: true,
  });

  const toggleAccordion = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-64 lg:w-72 shrink-0 font-sans select-none sticky top-28 self-start bg-[#EFECE6]/50 border border-[#D8D2C8] p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D8D2C8]">
        <h3 className="font-sans text-[11px] uppercase tracking-[0.25em] font-semibold text-[#111111]">
          FILTERS
        </h3>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-[10px] uppercase tracking-[0.15em] font-medium text-[#716D66] hover:text-[#111111] transition-colors cursor-pointer flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3 stroke-[1.5]" />
          <span>RESET</span>
        </button>
      </div>

      {/* Filter Accordions */}
      <div className="divide-y divide-[#D8D2C8]">
        {/* 1. CATEGORY */}
        <div className="py-3.5">
          <button
            type="button"
            onClick={() => toggleAccordion("category")}
            className="w-full flex items-center justify-between text-xs uppercase tracking-[0.15em] font-medium text-[#111111] cursor-pointer"
          >
            <span>CATEGORY</span>
            <ChevronDown
              className={`w-3.5 h-3.5 stroke-[1.5] text-[#716D66] transition-transform duration-200 ${
                openSections.category ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.category && (
            <div className="mt-2.5 space-y-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.id || cat.slug)}
                  className={`w-full text-left py-1 px-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === (cat.id || cat.slug)
                      ? "font-semibold text-[#111111]"
                      : "text-[#716D66] hover:text-[#111111]"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {selectedCategory === (cat.id || cat.slug) && (
                    <span className="w-1.5 h-1.5 bg-[#111111] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. SUBCATEGORY (When Available) */}
        {subcategoriesList.length > 0 && (
          <div className="py-3.5">
            <button
              type="button"
              onClick={() => toggleAccordion("subcategory")}
              className="w-full flex items-center justify-between text-xs uppercase tracking-[0.15em] font-medium text-[#111111] cursor-pointer"
            >
              <span>SUBCATEGORY</span>
              <ChevronDown
                className={`w-3.5 h-3.5 stroke-[1.5] text-[#716D66] transition-transform duration-200 ${
                  openSections.subcategory ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections.subcategory && (
              <div className="mt-2.5 space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectSubcategory("all")}
                  className={`w-full text-left py-1 px-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedSubcategory === "all"
                      ? "font-semibold text-[#111111]"
                      : "text-[#716D66] hover:text-[#111111]"
                  }`}
                >
                  <span>All Subcategories</span>
                  {selectedSubcategory === "all" && (
                    <span className="w-1.5 h-1.5 bg-[#111111] rounded-full" />
                  )}
                </button>
                {subcategoriesList.map((sub) => (
                  <button
                    key={sub.slug || sub.id}
                    type="button"
                    onClick={() => onSelectSubcategory(sub.slug || sub.id)}
                    className={`w-full text-left py-1 px-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedSubcategory === (sub.slug || sub.id)
                        ? "font-semibold text-[#111111]"
                        : "text-[#716D66] hover:text-[#111111]"
                    }`}
                  >
                    <span>{sub.name}</span>
                    {selectedSubcategory === (sub.slug || sub.id) && (
                      <span className="w-1.5 h-1.5 bg-[#111111] rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. SIZE */}
        <div className="py-3.5">
          <button
            type="button"
            onClick={() => toggleAccordion("size")}
            className="w-full flex items-center justify-between text-xs uppercase tracking-[0.15em] font-medium text-[#111111] cursor-pointer"
          >
            <span>SIZE</span>
            <ChevronDown
              className={`w-3.5 h-3.5 stroke-[1.5] text-[#716D66] transition-transform duration-200 ${
                openSections.size ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.size && (
            <div className="mt-2.5 grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => onSelectSize("all")}
                className={`py-1.5 text-[11px] font-sans uppercase border transition-colors cursor-pointer text-center ${
                  selectedSize === "all"
                    ? "bg-[#151515] text-[#F5F2EC] border-[#151515]"
                    : "bg-transparent text-[#716D66] border-[#D8D2C8] hover:border-[#111111] hover:text-[#111111]"
                }`}
              >
                All
              </button>
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSelectSize(sz)}
                  className={`py-1.5 text-[11px] font-sans uppercase border transition-colors cursor-pointer text-center ${
                    selectedSize === sz
                      ? "bg-[#151515] text-[#F5F2EC] border-[#151515]"
                      : "bg-transparent text-[#716D66] border-[#D8D2C8] hover:border-[#111111] hover:text-[#111111]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. COLOR */}
        <div className="py-3.5">
          <button
            type="button"
            onClick={() => toggleAccordion("color")}
            className="w-full flex items-center justify-between text-xs uppercase tracking-[0.15em] font-medium text-[#111111] cursor-pointer"
          >
            <span>COLOR</span>
            <ChevronDown
              className={`w-3.5 h-3.5 stroke-[1.5] text-[#716D66] transition-transform duration-200 ${
                openSections.color ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.color && (
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onSelectColor("all")}
                className={`px-2 py-1 text-[11px] border transition-colors cursor-pointer ${
                  selectedColor === "all"
                    ? "bg-[#151515] text-[#F5F2EC] border-[#151515]"
                    : "border-[#D8D2C8] text-[#716D66] hover:border-[#111111] hover:text-[#111111]"
                }`}
              >
                All
              </button>
              {availableColors.map((col) => {
                const name = typeof col === "string" ? col : col.name;
                const hex = typeof col === "string" ? "#151515" : col.hex;
                const isSelected = selectedColor.toLowerCase() === name.toLowerCase();

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onSelectColor(name)}
                    title={name}
                    aria-label={`Filter by ${name}`}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-[#111111] ring-2 ring-[#111111]/30 scale-110"
                        : "border-[#D8D2C8] hover:scale-105"
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 m-auto w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. PRICE */}
        <div className="py-3.5">
          <button
            type="button"
            onClick={() => toggleAccordion("price")}
            className="w-full flex items-center justify-between text-xs uppercase tracking-[0.15em] font-medium text-[#111111] cursor-pointer"
          >
            <span>PRICE</span>
            <ChevronDown
              className={`w-3.5 h-3.5 stroke-[1.5] text-[#716D66] transition-transform duration-200 ${
                openSections.price ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.price && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#716D66] font-mono">
                <span>{formatPrice(minPrice)}</span>
                <span className="font-semibold text-[#111111]">{formatPrice(priceLimit)}</span>
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice || 1000}
                value={priceLimit}
                onChange={(e) => onChangePriceLimit(Number(e.target.value))}
                className="w-full accent-[#151515] cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* 6. FIT */}
        <div className="py-3.5">
          <button
            type="button"
            onClick={() => toggleAccordion("fit")}
            className="w-full flex items-center justify-between text-xs uppercase tracking-[0.15em] font-medium text-[#111111] cursor-pointer"
          >
            <span>FIT</span>
            <ChevronDown
              className={`w-3.5 h-3.5 stroke-[1.5] text-[#716D66] transition-transform duration-200 ${
                openSections.fit ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.fit && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {["all", "Oversized", "Relaxed", "Tailored", "Regular"].map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => onSelectFit(fit)}
                  className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                    selectedFit === fit
                      ? "bg-[#151515] text-[#F5F2EC] border-[#151515]"
                      : "border-[#D8D2C8] text-[#716D66] hover:border-[#111111] hover:text-[#111111]"
                  }`}
                >
                  {fit === "all" ? "All Fits" : fit}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 7. AVAILABILITY */}
        <div className="py-3.5">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs uppercase tracking-[0.15em] font-medium text-[#111111]">
              IN STOCK ONLY
            </span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStock(e.target.checked)}
              className="w-4 h-4 accent-[#151515] cursor-pointer"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
