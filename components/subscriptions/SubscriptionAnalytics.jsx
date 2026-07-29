"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, RotateCcw, Users, Activity, ShieldCheck, HeartHandshake } from "lucide-react";

export default function SubscriptionAnalytics({ analyticsData }) {
  const {
    mrr,
    arr,
    renewalRate,
    churnRate,
    activeSubscribers,
    upcomingRenewals,
    averageLTV,
    retentionCohort,
  } = analyticsData;

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4" /> SUBSCRIPTION FINANCIAL INTELLIGENCE
            </span>
            <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
              Recurring Revenue & Churn Performance
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs bg-[#090909] px-4 py-2 rounded-xl border border-[#2A2A2A]">
            <span className="text-[#8E8A85]">Annualized Run Rate (ARR):</span>
            <span className="font-editorial text-xl font-bold text-emerald-400">
              {arr}
            </span>
          </div>
        </div>

        {/* Financial KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Monthly Recurring Revenue (MRR)
            </span>
            <div className="font-editorial text-3xl font-bold text-[#C8A45D]">
              {mrr}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Active recurring subscriptions.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Member Renewal Rate
            </span>
            <div className="font-editorial text-3xl font-bold text-emerald-400">
              {renewalRate}%
            </div>
            <p className="text-[11px] text-[#8E8A85]">Successful auto-renewals.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Subscriber Churn Rate
            </span>
            <div className="font-editorial text-3xl font-bold text-rose-400">
              {churnRate}%
            </div>
            <p className="text-[11px] text-[#8E8A85]">Monthly cancellation rate.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Average Subscriber LTV
            </span>
            <div className="font-editorial text-3xl font-bold text-blue-400">
              {averageLTV}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Customer Lifetime Value.</p>
          </div>
        </div>
      </div>

      {/* Cohort Retention Table */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
        <div className="border-b border-[#2A2A2A] pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
            <HeartHandshake className="w-4 h-4" /> SUBSCRIBER COHORT RETENTION
          </span>
          <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
            12-Month Retention Cohorts
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {retentionCohort?.map((coh, i) => (
            <div key={i} className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] text-center space-y-1">
              <span className="text-xs font-bold text-[#8E8A85] uppercase block">{coh.month}</span>
              <span className="font-editorial text-2xl font-bold text-emerald-400 block">{coh.retention}%</span>
              <span className="text-[10px] text-[#8E8A85]">Active subscribers retained</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
