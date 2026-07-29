"use client";

import { motion } from "framer-motion";
import { Sparkles, Activity, AlertTriangle, ShieldCheck, CheckCircle2, ArrowUpRight, Zap, Bot } from "lucide-react";

export default function AIOpsDashboardView({
  metrics,
  alerts,
  recommendations,
  pendingApprovals,
  onNavigateTab,
}) {
  const {
    platformHealthScore,
    activeAlertsCount,
    criticalIssuesCount,
    pendingApprovalsCount,
    automationStatus,
    recommendationAccuracy,
  } = metrics;

  return (
    <div className="space-y-8">
      {/* Top Welcome Card */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C8A45D]" /> AUTONOMOUS AI CO-PILOT ACTIVE
          </span>
          <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
            GOR Autonomous Operations Center
          </h2>
          <p className="text-xs text-[#8E8A85]">
            Continuous monitoring, anomaly detection, predictive forecasting, and human-in-the-loop task governance.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#090909] p-3.5 rounded-[16px] border border-[#2A2A2A]">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">AI Agent Health</span>
            <span className="font-editorial text-xl font-bold text-emerald-400">
              {platformHealthScore}% Optimal
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            Health Score
          </span>
          <span className="font-editorial text-2xl font-bold text-emerald-400 block">
            {platformHealthScore}%
          </span>
        </div>

        <div
          onClick={() => onNavigateTab("alerts")}
          className="p-4 bg-[#151515] border border-[#2A2A2A] hover:border-amber-500/40 rounded-[18px] space-y-1 shadow-lg cursor-pointer transition-colors"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            Active Alerts
          </span>
          <span className="font-editorial text-2xl font-bold text-amber-400 block">
            {activeAlertsCount} Alerts
          </span>
        </div>

        <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            Critical Issues
          </span>
          <span className="font-editorial text-2xl font-bold text-rose-400 block">
            {criticalIssuesCount} Issue
          </span>
        </div>

        <div
          onClick={() => onNavigateTab("approvals")}
          className="p-4 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[18px] space-y-1 shadow-lg cursor-pointer transition-colors"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            Pending Approvals
          </span>
          <span className="font-editorial text-2xl font-bold text-[#C8A45D] block">
            {pendingApprovalsCount} Actions
          </span>
        </div>

        <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            Automation Status
          </span>
          <span className="font-editorial text-xl font-bold text-emerald-400 block">
            {automationStatus}
          </span>
        </div>

        <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
            Model Accuracy
          </span>
          <span className="font-editorial text-2xl font-bold text-blue-400 block">
            {recommendationAccuracy}%
          </span>
        </div>
      </div>

      {/* Pending Human Approval Banner */}
      {pendingApprovalsCount > 0 && (
        <div className="p-5 bg-amber-950/40 border border-amber-500/40 rounded-[20px] shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-[#F8F6F3]">
                Human-in-the-Loop Approval Required ({pendingApprovalsCount} Actions)
              </h4>
              <p className="text-xs text-amber-200/80">
                High-confidence AI recommendations are waiting for administrator authorization before execution.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("approvals")}
            className="px-4 py-2 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase rounded-[10px] shrink-0 hover:bg-[#D4B77D] transition-colors cursor-pointer"
          >
            Review Approvals
          </button>
        </div>
      )}

      {/* Top AI Recommendations */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <h3 className="font-editorial text-2xl text-[#F8F6F3]">
            High-Priority AI Recommendations
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab("recommendations")}
            className="text-xs text-[#C8A45D] font-bold hover:underline"
          >
            View All Recommendations
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 2).map((rec) => (
            <div
              key={rec.id}
              className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-2"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-[#C8A45D] font-bold uppercase">
                  {rec.category}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-[#151515] px-2 py-0.5 rounded border border-[#2A2A2A]">
                  {rec.confidenceScore}% Confidence
                </span>
              </div>
              <h4 className="font-editorial text-lg text-[#F8F6F3]">{rec.title}</h4>
              <p className="text-xs text-[#8E8A85]">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
