"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function PlpMobileFilterDrawer({
  isOpen = false,
  onClose = () => {},
  categoriesList = [],
  subcategoriesList = [],
  availableSizes = ["XS", "S", "M", "L", "XL", "XXL"],
  availableColors = [],
  minPrice = 0,
  maxPrice = 1000,

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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex flex-col justify-end lg:hidden select-none">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#111111]/40 backdrop-blur-sm cursor-pointer"
        />

        {/* Bottom Sheet Panel */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="relative z-10 bg-[#F5F2EC] border-t border-[#D8D2C8] p-6 space-y-6 max-h-[85vh] overflow-y-auto text-[#111111] font-sans shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-[#D8D2C8]">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#716D66] block">
                CATALOGUE FILTERS
              </span>
              <h3 className="font-editorial text-2xl font-normal text-[#111111]">
                Filter Collection
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#111111] hover:text-[#716D66] cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#716D66] font-medium mb-2.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.id || cat.slug)}
                  className={`py-2 px-3 text-xs border text-left truncate transition-colors cursor-pointer ${
                    selectedCategory === (cat.id || cat.slug)
                      ? "bg-[#151515] text-[#F5F2EC] border-[#151515] font-medium"
                      : "bg-[#EFECE6] text-[#716D66] border-[#D8D2C8]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory (When Available) */}
          {subcategoriesList.length > 0 && (
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#716D66] font-medium mb-2.5">
                Subcategory
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectSubcategory("all")}
                  className={`py-1.5 px-3 text-xs border transition-colors cursor-pointer ${
                    selectedSubcategory === "all"
                      ? "bg-[#151515] text-[#F5F2EC] border-[#151515]"
                      : "border-[#D8D2C8] text-[#716D66]"
                  }`}
                >
                  All
                </button>
                {subcategoriesList.map((sub) => (
                  <button
                    key={sub.slug || sub.id}
                    type="button"
                    onClick={() => onSelectSubcategory(sub.slug || sub.id)}
                    className={`py-1.5 px-3 text-xs border transition-colors cursor-pointer ${
                      selectedSubcategory === (sub.slug || sub.id)
                        ? "bg-[#151515] text-[#F5F2EC] border-[#151515]"
                        : "border-[#D8D2C8] text-[#716D66]"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#716D66] font-medium mb-2.5">
              Size
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => onSelectSize("all")}
                className={`py-2 text-xs font-sans uppercase border transition-colors cursor-pointer text-center ${
                  selectedSize === "all"
                    ? "bg-[#151515] text-[#F5F2EC] border-[#151515]"
                    : "border-[#D8D2C8] text-[#716D66]"
                }`}
              >
                All
              </button>
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSelectSize(sz)}
                  className={`py-2 text-xs font-sans uppercase border transition-colors cursor-pointer text-center ${
                    selectedSize === sz
                      ? "bg-[#151515] text-[#F5F2EC] border-[#151515]"
                      : "border-[#D8D2C8] text-[#716D66]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#716D66] font-medium mb-2.5">
              Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onSelectColor("all")}
                className={`px-3 py-1.5 text-xs border transition-colors cursor-pointer ${
                  selectedColor === "all"
                    ? "bg-[#151515] text-[#F5F2EC] border-[#151515]"
                    : "border-[#D8D2C8] text-[#716D66]"
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
                    className={`w-7 h-7 rounded-full border transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-[#111111] ring-2 ring-[#111111]/30 scale-110"
                        : "border-[#D8D2C8]"
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Price */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#716D66] mb-2 font-mono">
              <span className="uppercase font-sans tracking-[0.15em] text-[11px]">Price Limit</span>
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

          {/* In Stock */}
          <div className="pt-2 border-t border-[#D8D2C8]">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs uppercase tracking-[0.15em] font-medium text-[#111111]">
                In Stock Only
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => onToggleInStock(e.target.checked)}
                className="w-4 h-4 accent-[#151515] cursor-pointer"
              />
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#D8D2C8] flex items-center gap-3">
            <button
              type="button"
              onClick={onResetFilters}
              className="w-1/3 py-3 border border-[#D8D2C8] text-[#716D66] hover:text-[#111111] font-sans text-xs uppercase tracking-[0.15em] font-medium cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-xs uppercase tracking-[0.15em] font-medium cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
