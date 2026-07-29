"use client";

import Link from "next/link";
import { ArrowLeft, Save, Globe, Archive, Copy, CheckCircle2, Clock } from "lucide-react";

export default function EditorHeader({
  productName,
  status,
  isSaving,
  lastSavedText,
  isDirty,
  onSaveDraft,
  onPublish,
  onArchive,
}) {
  return (
    <div className="bg-[#141414] border-b border-[#222222] px-6 py-4 sticky top-16 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Left Title & Status */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 bg-[#0D0D0D] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors"
          title="Back to Products Catalog (Esc)"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
              {productName || "Untitled Product SKU"}
            </h1>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                status === "Active"
                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                  : status === "Out of Stock"
                  ? "bg-rose-950/80 text-rose-400 border-rose-500/30"
                  : "bg-amber-950/80 text-amber-400 border-amber-500/30"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-[#8E8A85] mt-0.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#C8A45D]" />
              {isSaving ? (
                <span className="text-amber-400 font-bold animate-pulse">Auto-Saving changes...</span>
              ) : isDirty ? (
                <span className="text-amber-400 font-bold">Unsaved Edits Detected</span>
              ) : (
                <span className="text-emerald-400 font-bold">Saved • {lastSavedText}</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onArchive}
          className="px-3.5 py-2 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#8E8A85] hover:text-rose-400 text-xs font-bold uppercase rounded-[10px] border border-[#2A2A2A] transition-colors cursor-pointer"
        >
          Archive SKU
        </button>

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="px-4 py-2 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#F8F6F3] text-xs font-bold uppercase tracking-wider rounded-[10px] border border-[#2A2A2A] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5 text-[#C8A45D]" /> Save Draft (Ctrl+S)
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={isSaving}
          className="px-5 py-2 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md font-bold"
        >
          <Globe className="w-4 h-4" /> Publish SKU (Ctrl+Shift+P)
        </button>
      </div>
    </div>
  );
}
