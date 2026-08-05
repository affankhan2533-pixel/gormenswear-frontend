"use client";

import { X, RotateCcw } from "lucide-react";

export default function PlpFilterChips({
  activeChips = [],
  onResetFilters = () => {},
}) {
  if (!activeChips || activeChips.length === 0) return null;

  return (
    <div className="mb-6 flex items-center gap-2 flex-wrap bg-[#111111] border border-[#2A2A2A] rounded-xl p-3.5 select-none text-xs font-sans shadow-md">
      <span className="text-[10px] uppercase tracking-wider text-[#B8B6B0] font-bold">
        Active Filters ({activeChips.length}):
      </span>

      {activeChips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/15 border border-[#C9A86A]/40 text-[#C9A86A] font-medium"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.remove}
            aria-label={`Remove filter ${chip.label}`}
            className="hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onResetFilters}
        className="font-sans text-xs uppercase tracking-wider text-[#B8B6B0] hover:text-[#C9A86A] underline font-bold ml-2 cursor-pointer flex items-center gap-1"
      >
        <RotateCcw className="w-3 h-3" /> Clear All
      </button>
    </div>
  );
}
