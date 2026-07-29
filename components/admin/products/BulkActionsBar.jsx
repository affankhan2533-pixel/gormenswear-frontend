"use client";

import { CheckSquare, Globe, Archive, Copy, Trash2, Tag } from "lucide-react";

export default function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkAction,
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="p-4 bg-[#2563EB]/15 border border-[#2563EB]/40 rounded-[18px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#3B82F6] font-bold shadow-lg">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-4 h-4 text-[#3B82F6]" />
        <span>{selectedCount} SKU(s) selected for bulk catalog action</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onBulkAction("publish")}
          className="px-3 py-1.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" /> Publish Selected
        </button>

        <button
          type="button"
          onClick={() => onBulkAction("archive")}
          className="px-3 py-1.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Archive className="w-3.5 h-3.5 text-amber-400" /> Archive Selected
        </button>

        <button
          type="button"
          onClick={() => onBulkAction("duplicate")}
          className="px-3 py-1.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Copy className="w-3.5 h-3.5 text-blue-400" /> Duplicate
        </button>

        <button
          type="button"
          onClick={onClearSelection}
          className="px-3 py-1.5 bg-[#0D0D0D] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] cursor-pointer"
        >
          Deselect
        </button>
      </div>
    </div>
  );
}
