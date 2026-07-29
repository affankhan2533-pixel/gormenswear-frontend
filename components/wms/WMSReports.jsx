"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Building2,
  Factory,
  BarChart2,
  PieChart,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function WMSReports({ reportsData }) {
  const { valuation, turnover, stockAging, warehousePerformance } = reportsData;

  return (
    <div className="space-y-8">
      {/* ── 1. INVENTORY VALUATION DASHBOARD ── */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
              <DollarSign className="w-4 h-4" /> ASSET VALUATION ANALYSIS
            </span>
            <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
              Inventory Valuation & Accounting
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs bg-[#090909] px-4 py-2 rounded-xl border border-[#2A2A2A]">
            <span className="text-[#8E8A85]">Total Inventory Value:</span>
            <span className="font-editorial text-xl font-bold text-[#C8A45D]">
              {valuation.totalValue}
            </span>
          </div>
        </div>

        {/* Valuation Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              FIFO Method (First-In, First-Out)
            </span>
            <div className="font-editorial text-2xl font-bold text-[#F8F6F3]">
              {valuation.fifoValuation}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Reflects current replacement cost.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Weighted Average Cost
            </span>
            <div className="font-editorial text-2xl font-bold text-emerald-400">
              {valuation.weightedAvgValuation}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Standard GOR valuation benchmark.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              LIFO Method (Last-In, First-Out)
            </span>
            <div className="font-editorial text-2xl font-bold text-[#F8F6F3]">
              {valuation.lifoValuation}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Used for tax mitigation scenarios.</p>
          </div>
        </div>

        {/* Category Breakdown Progress Bars */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8A85]">
            Valuation Distribution by Category
          </h3>
          <div className="space-y-2.5">
            {valuation.categoryBreakdown.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#F8F6F3] font-semibold">{cat.category}</span>
                  <span className="text-[#C8A45D] font-mono font-bold">
                    {cat.value} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#090909] h-2 rounded-full overflow-hidden border border-[#2A2A2A]">
                  <div
                    className="bg-[#C8A45D] h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. INVENTORY TURNOVER & STOCK AGING GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turnover Card */}
        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
          <div className="border-b border-[#2A2A2A] pb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4" /> VELOCITY & TURNOVER
            </span>
            <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
              Inventory Turnover & DIO
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px]">
              <span className="text-[10px] text-[#8E8A85] font-bold uppercase tracking-wider block">
                Annual Turnover Ratio
              </span>
              <span className="font-editorial text-3xl font-bold text-emerald-400 block mt-1">
                {turnover.annualTurnoverRatio}x
              </span>
              <span className="text-[11px] text-[#8E8A85] block mt-1">
                Industry Benchmark: {turnover.industryBenchmarkRatio}x
              </span>
            </div>

            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px]">
              <span className="text-[10px] text-[#8E8A85] font-bold uppercase tracking-wider block">
                Days Inventory Outstanding (DIO)
              </span>
              <span className="font-editorial text-3xl font-bold text-[#F8F6F3] block mt-1">
                {turnover.daysInventoryOutstanding} Days
              </span>
              <span className="text-[11px] text-[#8E8A85] block mt-1">
                Top Category: {turnover.topTurningCategory}
              </span>
            </div>
          </div>
        </div>

        {/* Stock Aging Card */}
        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
          <div className="border-b border-[#2A2A2A] pb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
              <Clock className="w-4 h-4" /> AGING BREAKDOWN
            </span>
            <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
              Stock Aging Analysis
            </h3>
          </div>

          <div className="space-y-3">
            {stockAging.map((age, i) => (
              <div key={i} className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8F6F3] block">
                    {age.ageGroup}
                  </span>
                  <span className="text-[11px] text-[#8E8A85]">
                    {age.count.toLocaleString()} units ({age.percent}%)
                  </span>
                </div>
                <span className="font-editorial text-lg font-bold text-[#C8A45D]">
                  {age.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. WAREHOUSE PERFORMANCE BENCHMARKS ── */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="border-b border-[#2A2A2A] pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
            <Building2 className="w-4 h-4" /> OPERATIONAL AUDIT
          </span>
          <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
            Warehouse Fulfillment & Accuracy Benchmarks
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {warehousePerformance.map((wh, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[18px] space-y-3"
            >
              <h4 className="font-editorial text-lg text-[#F8F6F3] font-semibold">{wh.name}</h4>
              <div className="space-y-1.5 text-xs text-[#8E8A85]">
                <div className="flex justify-between">
                  <span>Fulfillment Speed:</span>
                  <strong className="text-[#F8F6F3]">{wh.fulfillmentSpeedHours} hrs</strong>
                </div>
                <div className="flex justify-between">
                  <span>Stock Accuracy:</span>
                  <strong className="text-emerald-400">{wh.stockAccuracy}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Space Utilized:</span>
                  <strong className="text-[#C8A45D]">{wh.spaceUtil}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
