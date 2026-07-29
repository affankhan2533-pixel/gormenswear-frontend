"use client";

import { Package, AlertTriangle, ShieldCheck, Barcode } from "lucide-react";

export default function InventorySection({ formData, onChange }) {
  const stock = parseInt(formData.stock, 10) || 0;
  const threshold = parseInt(formData.minStockThreshold, 10) || 5;

  const stockBadge =
    stock === 0
      ? { label: "Out of Stock", class: "bg-rose-950/80 text-rose-400 border-rose-500/30" }
      : stock <= threshold
      ? { label: "Low Stock Warning", class: "bg-amber-950/80 text-amber-400 border-amber-500/30" }
      : { label: "Healthy Stock", class: "bg-emerald-950/80 text-emerald-400 border-emerald-500/30" };

  return (
    <div id="section-inventory" className="p-6 bg-[#141414] border border-[#222222] rounded-[24px] space-y-6 shadow-xl">
      <div className="border-b border-[#2A2A2A] pb-3 flex justify-between items-center">
        <div>
          <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
            Inventory & WMS Tracking
          </h3>
          <p className="text-xs text-[#8E8A85]">
            Configure SKU identifiers, global EAN/UPC barcode numbers, stock quantities, and low stock alert thresholds.
          </p>
        </div>

        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${stockBadge.class}`}>
          {stockBadge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SKU */}
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            SKU Code <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => onChange("sku", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>

        {/* Barcode */}
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Barcode (UPC / EAN / GTIN)
          </label>
          <input
            type="text"
            value={formData.barcode}
            onChange={(e) => onChange("barcode", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => onChange("stock", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>

        {/* Reorder Threshold */}
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Reorder Alert Threshold
          </label>
          <input
            type="number"
            value={formData.minStockThreshold || 5}
            onChange={(e) => onChange("minStockThreshold", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>
      </div>
    </div>
  );
}
