"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  PieChart,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function B2BReports({ reportsData }) {
  const { revenueGrowth, quoteConversion, agingPayments } = reportsData;

  return (
    <div className="space-y-8">
      {/* ── 1. WHOLESALE REVENUE & AOV DASHBOARD ── */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
              <DollarSign className="w-4 h-4" /> B2B COMMERCE INTELLIGENCE
            </span>
            <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
              Wholesale Revenue & Growth Performance
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs bg-[#090909] px-4 py-2 rounded-xl border border-[#2A2A2A]">
            <span className="text-[#8E8A85]">Total Wholesale Revenue:</span>
            <span className="font-editorial text-xl font-bold text-[#C8A45D]">
              {revenueGrowth.totalWholesaleRevenue}
            </span>
          </div>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Quarterly B2B Growth Rate
            </span>
            <div className="font-editorial text-3xl font-bold text-emerald-400">
              {revenueGrowth.quarterlyGrowthRate}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Compared to previous quarter.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Active Corporate Accounts
            </span>
            <div className="font-editorial text-3xl font-bold text-[#F8F6F3]">
              {revenueGrowth.activeBuyersCount} Accounts
            </div>
            <p className="text-[11px] text-[#8E8A85]">Active contract buyers.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              B2B Average Order Value (AOV)
            </span>
            <div className="font-editorial text-3xl font-bold text-[#C8A45D]">
              {revenueGrowth.averageB2BAOV}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Per wholesale contract order.</p>
          </div>
        </div>
      </div>

      {/* ── 2. QUOTE CONVERSION & AGING PAYMENTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quote Conversion Card */}
        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
          <div className="border-b border-[#2A2A2A] pb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
              <FileCheck className="w-4 h-4" /> RFQ CONVERSION METRICS
            </span>
            <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
              Quote Conversion & Turnaround Time
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px]">
              <span className="text-[10px] text-[#8E8A85] font-bold uppercase tracking-wider block">
                Quote Conversion Rate
              </span>
              <span className="font-editorial text-3xl font-bold text-emerald-400 block mt-1">
                {quoteConversion.conversionRate}%
              </span>
              <span className="text-[11px] text-[#8E8A85] block mt-1">
                {quoteConversion.approvedRFQCount} of {quoteConversion.totalRFQCount} RFQs Converted
              </span>
            </div>

            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px]">
              <span className="text-[10px] text-[#8E8A85] font-bold uppercase tracking-wider block">
                Average Turnaround Time
              </span>
              <span className="font-editorial text-3xl font-bold text-[#F8F6F3] block mt-1">
                {quoteConversion.avgNegotiationDays} Days
              </span>
              <span className="text-[11px] text-[#8E8A85] block mt-1">
                From request to signoff.
              </span>
            </div>
          </div>
        </div>

        {/* Outstanding Payments Aging Card */}
        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
          <div className="border-b border-[#2A2A2A] pb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
              <Clock className="w-4 h-4" /> AGING BALANCE ANALYSIS
            </span>
            <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
              Outstanding Accounts Receivable (AR)
            </h3>
          </div>

          <div className="space-y-3">
            {agingPayments.map((age, i) => (
              <div key={i} className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8F6F3] block">
                    {age.range}
                  </span>
                  <span className="text-[11px] text-[#8E8A85]">
                    {age.count} Invoices Outstanding
                  </span>
                </div>
                <span className="font-editorial text-lg font-bold text-[#C8A45D]">
                  {age.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
