"use client";

import { motion } from "framer-motion";
import { RotateCcw, Clock, CheckCircle2, FileText } from "lucide-react";

export default function VersionControlView({ versions, onRestoreVersion }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Asset Version Control & Revision History
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Track revision history (v1.0 RAW, v1.1 Color Corrected, v2.0 Production WebP), side-by-side comparison, and restore previous versions.
        </p>
      </div>

      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="border-b border-[#2A2A2A] pb-4">
          <span className="font-mono text-xs text-[#C8A45D] font-bold">
            Target Asset: Biella Shearling Trimmed Suede Jacket — Hero Studio Shot
          </span>
        </div>

        <div className="space-y-4">
          {versions.map((ver, i) => (
            <div
              key={i}
              className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-editorial text-xl font-bold text-[#F8F6F3]">
                    {ver.version}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      ver.status.includes("Active")
                        ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                        : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                    }`}
                  >
                    {ver.status}
                  </span>
                </div>
                <p className="text-xs text-[#8E8A85]">{ver.notes}</p>
                <span className="text-[10px] font-mono text-[#8E8A85]">
                  Modified by {ver.modifiedBy} on {ver.modifiedAt}
                </span>
              </div>

              {!ver.status.includes("Active") && (
                <button
                  type="button"
                  onClick={() => onRestoreVersion(ver.version)}
                  className="px-3.5 py-1.5 bg-[#151515] hover:bg-[#C8A45D] hover:text-[#090909] text-[#C8A45D] text-xs font-bold uppercase rounded-[8px] border border-[#2A2A2A] transition-colors flex items-center gap-1 cursor-pointer font-bold shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restore This Version
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
