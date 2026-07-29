"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Award, Building2, PieChart } from "lucide-react";

export default function MarketplaceAnalytics({ analyticsData }) {
  const {
    totalMarketplaceRevenue,
    totalCommissionRevenue,
    totalMarketplaceOrdersCount,
    topVendors,
    vendorPerformanceScore,
  } = analyticsData;

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4" /> MARKETPLACE FINANCIAL INTELLIGENCE
            </span>
            <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
              Marketplace Revenue & Commission Analytics
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs bg-[#090909] px-4 py-2 rounded-xl border border-[#2A2A2A]">
            <span className="text-[#8E8A85]">Platform Commission Retained:</span>
            <span className="font-editorial text-xl font-bold text-[#C8A45D]">
              {totalCommissionRevenue}
            </span>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Gross Marketplace Volume
            </span>
            <div className="font-editorial text-3xl font-bold text-emerald-400">
              {totalMarketplaceRevenue}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Total vendor GMV processed.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Marketplace Orders Count
            </span>
            <div className="font-editorial text-3xl font-bold text-[#F8F6F3]">
              {totalMarketplaceOrdersCount} Orders
            </div>
            <p className="text-[11px] text-[#8E8A85]">Multi-vendor orders.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Platform Commission Revenue
            </span>
            <div className="font-editorial text-3xl font-bold text-[#C8A45D]">
              {totalCommissionRevenue}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Platform retained fees.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Vendor Fulfillment Score
            </span>
            <div className="font-editorial text-3xl font-bold text-blue-400">
              {vendorPerformanceScore}%
            </div>
            <p className="text-[11px] text-[#8E8A85]">On-time shipping index.</p>
          </div>
        </div>
      </div>

      {/* Top Vendors Leaderboard */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
        <div className="border-b border-[#2A2A2A] pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
            <Award className="w-4 h-4" /> VENDOR LEADERBOARD
          </span>
          <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
            Top Marketplace Vendors by Revenue Share
          </h3>
        </div>

        <div className="space-y-3">
          {topVendors.map((v, idx) => (
            <div key={idx} className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#151515] border border-[#2A2A2A] text-xs font-mono text-[#C8A45D] flex items-center justify-center font-bold">
                  #{idx + 1}
                </span>
                <div>
                  <span className="font-editorial text-lg text-[#F8F6F3] font-normal block">
                    {v.name}
                  </span>
                  <span className="text-[11px] text-[#8E8A85]">
                    Platform Commission: <strong className="text-[#C8A45D]">{v.commission}</strong>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-editorial text-xl font-bold text-emerald-400 block">
                  {v.revenue}
                </span>
                <span className="text-[11px] font-mono text-[#8E8A85]">
                  {v.share}% GMV Share
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
