"use client";

import { X } from "lucide-react";

export default function PlpFilterChips({ activeChips = [], onResetFilters = () => {} }) {
  if (!activeChips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#716D66] mr-1">
        ACTIVE FILTERS:
      </span>
      {activeChips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EFECE6] border border-[#D8D2C8] text-[#111111] font-sans text-xs"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.remove}
            aria-label={`Remove filter ${chip.label}`}
            className="text-[#716D66] hover:text-[#111111] cursor-pointer"
          >
            <X className="w-3 h-3 stroke-[1.5]" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onResetFilters}
        className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#716D66] hover:text-[#111111] ml-2 underline underline-offset-4 cursor-pointer"
      >
        CLEAR ALL
      </button>
    </div>
  );
}
