"use client";

import { Eye, Edit, Package, Tag, Sparkles } from "lucide-react";

export default function GridView({
  products,
  onOpenPreview,
  onOpenEdit,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((prod) => (
        <div
          key={prod.id}
          className="bg-[#141414] border border-[#222222] rounded-[20px] overflow-hidden p-4 space-y-3 hover:border-[#C8A45D]/40 transition-colors group shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-3">
            {/* Image Thumbnail Frame */}
            <div className="relative h-48 bg-[#0D0D0D] rounded-[14px] overflow-hidden flex items-center justify-center border border-[#2A2A2A]">
              {prod.imageUrl ? (
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Package className="w-12 h-12 text-[#C8A45D]" />
              )}

              <span
                className={`absolute top-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold backdrop-blur-md ${
                  prod.status === "Active"
                    ? "bg-emerald-950/90 text-emerald-400 border-emerald-500/30"
                    : prod.status === "Out of Stock"
                    ? "bg-rose-950/90 text-rose-400 border-rose-500/30"
                    : "bg-amber-950/90 text-amber-400 border-amber-500/30"
                }`}
              >
                {prod.status}
              </span>

              {prod.aiGenerated && (
                <span className="absolute bottom-2 right-2 text-[9px] font-mono px-2 py-0.5 bg-purple-950/90 text-purple-300 border border-purple-500/30 rounded-full font-bold flex items-center gap-1 backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-purple-400" /> AI Generated
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#8E8A85] block">{prod.sku} • {prod.category}</span>
              <h4 className="font-editorial text-lg text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors line-clamp-1">
                {prod.name}
              </h4>
            </div>

            <div className="flex justify-between items-center text-xs pt-1 border-t border-[#2A2A2A]">
              <span className="font-mono font-bold text-emerald-400">${prod.price.toFixed(2)}</span>
              <span className="font-mono text-[#8E8A85]">{prod.stock} Units</span>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => onOpenPreview(prod)}
              className="px-3 py-1 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#8E8A85] hover:text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Eye className="w-3 h-3" /> Preview
            </button>

            <button
              type="button"
              onClick={() => onOpenEdit(prod)}
              className="px-3 py-1 bg-[#0D0D0D] hover:bg-[#C8A45D] hover:text-[#090909] text-[#C8A45D] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer flex items-center gap-1 font-bold"
            >
              <Edit className="w-3 h-3" /> Quick Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
