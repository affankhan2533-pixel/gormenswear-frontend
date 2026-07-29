"use client";

import { motion } from "framer-motion";
import { MessageSquare, Clock, Heart, AlertTriangle, Users, Star, CheckCircle2, ShieldCheck } from "lucide-react";

export default function CXDashboardView({ metrics, onNavigateTab }) {
  const {
    activeConversationsCount,
    openSupportCasesCount,
    avgResponseTime,
    csatScore,
    pendingFollowupsCount,
    escalatedCasesCount,
    firstResponseTimeSLA,
  } = metrics;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#C8A45D]" /> OMNICHANNEL CUSTOMER EXPERIENCE
          </span>
          <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
            GOR Concierge & Support Operations
          </h2>
          <p className="text-xs text-[#8E8A85]">
            Unified post-purchase service, 360° customer timelines, bespoke tailoring requests, and SLA tracking.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#090909] p-3.5 rounded-[16px] border border-[#2A2A2A]">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-editorial text-lg">
            ★ {csatScore}
          </div>
          <div>
            <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">CSAT Satisfaction</span>
            <span className="font-editorial text-xl font-bold text-emerald-400">
              98.2% Positive
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigateTab("inbox")}
          className="p-4 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[18px] space-y-1 shadow-lg cursor-pointer transition-colors"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            Active Chats
          </span>
          <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
            {activeConversationsCount} Chats
          </span>
        </div>

        <div
          onClick={() => onNavigateTab("cases")}
          className="p-4 bg-[#151515] border border-[#2A2A2A] hover:border-blue-500/40 rounded-[18px] space-y-1 shadow-lg cursor-pointer transition-colors"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            Open Cases
          </span>
          <span className="font-editorial text-2xl font-bold text-blue-400 block">
            {openSupportCasesCount} Cases
          </span>
        </div>

        <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            Avg Response
          </span>
          <span className="font-editorial text-2xl font-bold text-emerald-400 block">
            {avgResponseTime}
          </span>
        </div>

        <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            CSAT Rating
          </span>
          <span className="font-editorial text-2xl font-bold text-[#C8A45D] block">
            {csatScore} / 5.0
          </span>
        </div>

        <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            Pending Follow-ups
          </span>
          <span className="font-editorial text-2xl font-bold text-purple-400 block">
            {pendingFollowupsCount} Follow-ups
          </span>
        </div>

        <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            Escalated Cases
          </span>
          <span className="font-editorial text-2xl font-bold text-rose-400 block">
            {escalatedCasesCount} Case
          </span>
        </div>
      </div>
    </div>
  );
}
