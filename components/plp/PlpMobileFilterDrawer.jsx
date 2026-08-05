"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function PlpMobileFilterDrawer({
  isOpen = false,
  onClose = () => {},
  categoriesList = [],
  availableSizes = [],
  availableColors = [],
  dynamicFabrics = [],
  minPrice = 0,
  maxPrice = 1000,

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
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[180] bg-black/85 backdrop-blur-md flex flex-col justify-end lg:hidden">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 cursor-pointer"
        />

        {/* Bottom sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative z-10 bg-[#111111] border-t border-[#2A2A2A] rounded-t-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto text-[#F7F5F2] font-sans shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2A]">
            <h3 className="font-serif text-2xl font-normal">Filter Garment Collection</h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#0B0B0B] border border-[#2A2A2A] text-[#B8B6B0] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left truncate transition-colors ${
                    selectedCategory === cat.id ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A] font-bold" : "bg-[#0B0B0B] text-[#B8B6B0] border-[#2A2A2A]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-2">Size</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onSelectSize("all")}
                className={`py-2 text-xs font-bold uppercase rounded-lg border ${selectedSize === "all" ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A]" : "bg-[#0B0B0B] text-[#B8B6B0] border-[#2A2A2A]"}`}
              >
                All
              </button>
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSelectSize(sz)}
                  className={`py-2 text-xs font-bold uppercase rounded-lg border ${selectedSize === sz ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A]" : "bg-[#0B0B0B] text-[#B8B6B0] border-[#2A2A2A]"}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between text-xs text-[#B8B6B0] mb-1 font-mono font-bold">
              <span>Min: {formatPrice(minPrice)}</span>
              <span className="text-[#C9A86A]">Max: {formatPrice(priceLimit)}</span>
            </div>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step="10"
              value={priceLimit}
              onChange={(e) => onChangePriceLimit(Number(e.target.value))}
              className="w-full accent-[#C9A86A] bg-[#0B0B0B]"
            />
          </div>

          {/* Stock Only */}
          <div className="pt-2">
            <label className="flex items-center justify-between text-xs text-[#F7F5F2] font-bold uppercase tracking-wider cursor-pointer">
              <span>In Stock Garments Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => onToggleInStock(e.target.checked)}
                className="accent-[#C9A86A] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#2A2A2A] flex gap-3">
            <button
              type="button"
              onClick={onResetFilters}
              className="w-1/3 py-3 bg-[#0B0B0B] border border-[#2A2A2A] text-[#B8B6B0] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-2/3 py-3 bg-[#C9A86A] text-[#0B0B0B] text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg"
            >
              Apply Filters
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
