"use client";

import { Eye, Edit, Package } from "lucide-react";

export default function KanbanView({
  products,
  onOpenPreview,
  onOpenEdit,
}) {
  const statuses = ["Active", "Draft", "Out of Stock", "Archived"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statuses.map((status) => {
        const colProducts = products.filter((p) => p.status === status);
        return (
          <div key={status} className="bg-[#141414] border border-[#222222] rounded-[22px] p-4 space-y-4 shadow-xl">
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    status === "Active"
                      ? "bg-emerald-500"
                      : status === "Out of Stock"
                      ? "bg-rose-500"
                      : status === "Draft"
                      ? "bg-amber-500"
                      : "bg-zinc-500"
                  }`}
                />
                <h3 className="font-editorial text-lg font-bold text-[#F8F6F3]">{status}</h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#8E8A85] bg-[#0D0D0D] px-2.5 py-0.5 rounded-[6px] border border-[#2A2A2A]">
                {colProducts.length}
              </span>
            </div>

            {/* Product Cards List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-none">
              {colProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[16px] space-y-2 hover:border-[#C8A45D]/40 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-[8px] bg-[#141414] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-4 h-4 text-[#C8A45D]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-editorial text-sm text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors line-clamp-1">
                        {prod.name}
                      </h4>
                      <span className="text-[10px] font-mono text-[#8E8A85] block">{prod.sku}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2A2A2A]">
                    <span className="font-mono font-bold text-emerald-400">${prod.price.toFixed(2)}</span>
                    <span className="font-mono text-[#8E8A85]">{prod.stock} Units</span>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => onOpenPreview(prod)}
                      className="p-1 bg-[#141414] text-[#8E8A85] hover:text-[#F8F6F3] rounded border border-[#2A2A2A]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenEdit(prod)}
                      className="p-1 bg-[#141414] text-[#C8A45D] hover:bg-[#C8A45D] hover:text-[#090909] rounded border border-[#2A2A2A]"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
