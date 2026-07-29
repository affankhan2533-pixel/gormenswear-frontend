"use client";

import { Eye, Edit, Package } from "lucide-react";

export default function ListView({
  products,
  onOpenPreview,
  onOpenEdit,
}) {
  return (
    <div className="bg-[#141414] border border-[#222222] rounded-[20px] divide-y divide-[#222222] overflow-hidden shadow-xl">
      {products.map((prod) => (
        <div
          key={prod.id}
          className="p-3.5 hover:bg-[#1A1A1A]/80 transition-colors flex items-center justify-between gap-4 text-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
              {prod.imageUrl ? (
                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-4 h-4 text-[#C8A45D]" />
              )}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-[#F8F6F3] truncate block">{prod.name}</span>
              <span className="text-[10px] font-mono text-[#8E8A85]">SKU: {prod.sku} • {prod.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <span className="font-mono font-bold text-emerald-400">${prod.price.toFixed(2)}</span>
            <span className="font-mono text-[#8E8A85] w-20 text-center">{prod.stock} Units</span>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                prod.status === "Active"
                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-950/80 text-amber-400 border-amber-500/30"
              }`}
            >
              {prod.status}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenPreview(prod)}
                className="p-1 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#8E8A85] rounded border border-[#2A2A2A]"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onOpenEdit(prod)}
                className="p-1 bg-[#0D0D0D] hover:bg-[#C8A45D] hover:text-[#090909] text-[#C8A45D] rounded border border-[#2A2A2A]"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
