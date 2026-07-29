"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Camera, Edit2, Save, X, Plus, Minus, ToggleLeft, ToggleRight, Barcode } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function MobileProductView({
  products,
  onUpdateProduct,
  onOpenHardwareModal,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);

  const filteredProducts = products.filter(
    (p) =>
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEdit = (prod) => {
    setSelectedProduct(prod);
    setEditPrice(prod.price);
    setEditStock(prod.stockLevel);
  };

  const handleToggleEnable = (prod) => {
    onUpdateProduct({
      ...prod,
      enabled: !prod.enabled,
    });
  };

  const handleSaveProduct = () => {
    if (!selectedProduct) return;
    onUpdateProduct({
      ...selectedProduct,
      price: Number(editPrice),
      stockLevel: Number(editStock),
    });
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Search & Camera Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8E8A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU or product title..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#151515] border border-[#2A2A2A] rounded-[14px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => onOpenHardwareModal("camera")}
          aria-label="Open Camera Scan"
          className="p-2.5 bg-[#151515] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] border border-[#2A2A2A] rounded-[14px] transition-colors cursor-pointer shrink-0"
          title="Camera Upload / Barcode Scan"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-3 shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] text-[#C8A45D] font-bold block">
                  {prod.sku}
                </span>
                <h3 className="font-editorial text-lg text-[#F8F6F3]">
                  {prod.productName}
                </h3>
              </div>

              {/* Enable/Disable Toggle */}
              <button
                type="button"
                onClick={() => handleToggleEnable(prod)}
                className="shrink-0 flex items-center gap-1 text-xs font-bold"
              >
                {prod.enabled ? (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                    <ToggleRight className="w-6 h-6 text-emerald-400" /> Active
                  </span>
                ) : (
                  <span className="text-[#8E8A85] flex items-center gap-1 text-[11px] font-bold">
                    <ToggleLeft className="w-6 h-6 text-[#8E8A85]" /> Disabled
                  </span>
                )}
              </button>
            </div>

            {/* Price & Stock Stepper Controls */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#2A2A2A] text-xs">
              <div className="p-2.5 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between">
                <span className="text-[#8E8A85]">Price:</span>
                <span className="font-editorial text-base font-bold text-[#F8F6F3]">
                  ${prod.price}
                </span>
              </div>

              <div className="p-2.5 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between">
                <span className="text-[#8E8A85]">Stock:</span>
                <span className="font-mono text-sm font-bold text-emerald-400">
                  {prod.stockLevel} units
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleOpenEdit(prod)}
                className="px-3 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-xs font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Price & Stock
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Price & Stock Modal Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-[#151515] border border-[#2A2A2A] rounded-t-[28px] sm:rounded-[24px] max-w-sm w-full p-6 shadow-2xl space-y-5 text-[#F8F6F3]"
            >
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <h3 className="font-editorial text-xl">Quick Adjust SKU</h3>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 bg-[#090909] border border-[#2A2A2A] rounded-full text-[#8E8A85]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Retail Price ($)
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2 text-sm font-bold text-[#C8A45D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Stock Level (Units)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditStock(Math.max(0, Number(editStock) - 1))}
                      className="w-10 h-10 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-lg font-bold flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      className="flex-1 bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2 text-center text-sm font-bold text-emerald-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setEditStock(Number(editStock) + 1)}
                      className="w-10 h-10 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-lg font-bold flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 bg-[#090909] text-[#8E8A85] rounded-[8px] text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="px-5 py-2 bg-[#C8A45D] text-[#090909] rounded-[8px] text-xs font-bold uppercase flex items-center gap-1.5 font-bold"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
