"use client";

import { motion } from "framer-motion";
import { HardDrive, Image as ImageIcon, Sparkles, CheckCircle2, Clock, AlertTriangle, Layers, Upload } from "lucide-react";

export default function DAMDashboardView({ metrics, onNavigateTab }) {
  const {
    totalAssetsCount,
    storageUsedFormatted,
    recentlyUploadedCount,
    pendingApprovalsCount,
    expiringAssetsCount,
    aiTaggedAssetsCount,
  } = metrics;

  return (
    <div className="space-y-8">
      {/* Storage Gauge Banner */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-1.5 mb-1">
              <HardDrive className="w-4 h-4 text-[#C8A45D]" /> ENTERPRISE DIGITAL ASSET MANAGEMENT
            </span>
            <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
              Centralized Brand Media & Asset Storage
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-[#090909] p-3.5 rounded-[16px] border border-[#2A2A2A]">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-editorial text-lg">
              42.8 GB
            </div>
            <div>
              <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">Storage Quota</span>
              <span className="font-editorial text-xl font-bold text-[#F8F6F3]">
                {storageUsedFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div
            onClick={() => onNavigateTab("library")}
            className="p-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[18px] space-y-1 shadow-lg cursor-pointer transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
              Total Assets
            </span>
            <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
              {totalAssetsCount} Assets
            </span>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
              Uploaded Today
            </span>
            <span className="font-editorial text-2xl font-bold text-emerald-400 block">
              +{recentlyUploadedCount} Assets
            </span>
          </div>

          <div
            onClick={() => onNavigateTab("approvals")}
            className="p-4 bg-[#090909] border border-[#2A2A2A] hover:border-amber-500/40 rounded-[18px] space-y-1 shadow-lg cursor-pointer transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
              Pending Review
            </span>
            <span className="font-editorial text-2xl font-bold text-amber-400 block">
              {pendingApprovalsCount} Assets
            </span>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
              Expiring Licenses
            </span>
            <span className="font-editorial text-2xl font-bold text-rose-400 block">
              {expiringAssetsCount} Licenses
            </span>
          </div>

          <div
            onClick={() => onNavigateTab("ai")}
            className="p-4 bg-[#090909] border border-[#2A2A2A] hover:border-purple-500/40 rounded-[18px] space-y-1 shadow-lg cursor-pointer transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
              AI Tagged Media
            </span>
            <span className="font-editorial text-2xl font-bold text-purple-400 block">
              {aiTaggedAssetsCount} Tagged
            </span>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
              CDN WebP SLA
            </span>
            <span className="font-editorial text-2xl font-bold text-emerald-400 block">
              100% Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
