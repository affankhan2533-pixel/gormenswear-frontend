"use client";

import { motion } from "framer-motion";
import { Sparkles, Copy, AlertTriangle, CheckCircle2, Tag, Eye } from "lucide-react";

export default function AIMediaFeaturesView({ onRunAITagging }) {
  return (
    <div className="space-y-8">
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" /> AI COMPUTER VISION & MEDIA AUTO-TAGGING
            </span>
            <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
              Intelligent Media Classification & Duplicate Audit
            </h2>
          </div>

          <button
            type="button"
            onClick={onRunAITagging}
            className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
          >
            <Sparkles className="w-4 h-4" /> Run AI Auto-Tagging Scan
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              AI Auto-Tagged Media
            </span>
            <div className="font-editorial text-3xl font-bold text-emerald-400">
              1,410 / 1,480
            </div>
            <p className="text-[11px] text-[#8E8A85]">95.2% automated taxonomy coverage.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Duplicate Image Audit
            </span>
            <div className="font-editorial text-3xl font-bold text-[#F8F6F3]">
              0 Duplicates
            </div>
            <p className="text-[11px] text-[#8E8A85]">Perceptual hash match clean.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Missing Metadata Audit
            </span>
            <div className="font-editorial text-3xl font-bold text-[#C8A45D]">
              4 Assets
            </div>
            <p className="text-[11px] text-[#8E8A85]">Missing photographer credits.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
