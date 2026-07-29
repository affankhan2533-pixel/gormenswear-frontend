"use client";

import { AlertTriangle, RefreshCw, EyeOff, ShieldCheck } from "lucide-react";

export default function OutOfStockManagerBar({
  outOfStockCount,
  onHideOutOfStock,
  onMoveToBottom,
}) {
  if (outOfStockCount === 0) return null;

  return (
    <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-[18px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-rose-300 shadow-lg">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
        <div>
          <strong className="text-[#F8F6F3]">{outOfStockCount} SKU(s) currently Out of Stock.</strong>{" "}
          <span className="text-rose-300/80">
            Products remain preserved in catalog for SEO index retention.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onHideOutOfStock}
          className="px-3 py-1.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] text-xs font-bold cursor-pointer flex items-center gap-1.5"
        >
          <EyeOff className="w-3.5 h-3.5 text-rose-400" /> Filter Out of Stock
        </button>

        <button
          type="button"
          onClick={onMoveToBottom}
          className="px-3 py-1.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] text-xs font-bold cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C8A45D]" /> Move Out of Stock to Bottom
        </button>
      </div>
    </div>
  );
}
