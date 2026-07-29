"use client";

import { Sparkles } from "lucide-react";

export default function AdminEmptyState({
  title = "No Resources Found",
  description = "Get started by creating a new resource or adjusting your filter criteria.",
  icon: Icon = Sparkles,
  actionLabel = "Create Resource",
  onAction = null,
  aiSuggestion = "AI Suggestion: Import initial CSV catalog or sync ERP connectors.",
}) {
  return (
    <div className="p-12 bg-[#141414] border border-[#222222] rounded-[24px] text-center space-y-4 max-w-lg mx-auto my-8 shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D] mx-auto">
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="font-editorial text-2xl text-[#F8F6F3]">{title}</h3>
        <p className="text-xs text-[#8E8A85]">{description}</p>
      </div>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors cursor-pointer shadow-md font-bold"
        >
          {actionLabel}
        </button>
      )}

      {aiSuggestion && (
        <div className="p-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] text-[11px] text-[#8E8A85] flex items-center gap-2 justify-center font-mono">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>{aiSuggestion}</span>
        </div>
      )}
    </div>
  );
}
