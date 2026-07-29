"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Users, Package, ShoppingBag, Target } from "lucide-react";

export default function BusinessInsightsView({ insights }) {
  const {
    revenueTrend,
    salesForecast,
    topProductPerformance,
    customerGrowth,
    inventoryHealthScore,
    marketingROI,
  } = insights;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Predictive Business Insights & Sales Analytics
        </h2>
        <p className="text-xs text-[#8E8A85]">
          AI-generated predictive forecasts, luxury demand modeling, and inventory velocity analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#8E8A85]">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">PREDICTIVE</span>
          </div>
          <span className="text-xs font-bold uppercase text-[#8E8A85] block">Revenue Trend Forecast</span>
          <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
            {revenueTrend}
          </span>
          <p className="text-xs text-[#8E8A85]">Based on autumn luxury pre-order velocity.</p>
        </div>

        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#8E8A85]">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">PROJECTION</span>
          </div>
          <span className="text-xs font-bold uppercase text-[#8E8A85] block">Q3 Revenue Target</span>
          <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
            {salesForecast}
          </span>
          <p className="text-xs text-[#8E8A85]">Monte Carlo simulation target probability.</p>
        </div>

        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#8E8A85]">
            <Package className="w-5 h-5 text-[#C8A45D]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45D]">TOP SKU</span>
          </div>
          <span className="text-xs font-bold uppercase text-[#8E8A85] block">Product Velocity</span>
          <span className="font-editorial text-xl font-bold text-[#F8F6F3] block">
            {topProductPerformance}
          </span>
          <p className="text-xs text-[#8E8A85]">Leading category in repeat orders.</p>
        </div>

        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#8E8A85]">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">CRM GROWTH</span>
          </div>
          <span className="text-xs font-bold uppercase text-[#8E8A85] block">VIP Acquisition</span>
          <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
            {customerGrowth}
          </span>
          <p className="text-xs text-[#8E8A85]">High-net-worth customer growth rate.</p>
        </div>

        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#8E8A85]">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">HEALTH</span>
          </div>
          <span className="text-xs font-bold uppercase text-[#8E8A85] block">Inventory Health Score</span>
          <span className="font-editorial text-2xl font-bold text-emerald-400 block">
            {inventoryHealthScore} / 100
          </span>
          <p className="text-xs text-[#8E8A85]">Balanced turnover across 5 warehouses.</p>
        </div>

        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#8E8A85]">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">MARKETING</span>
          </div>
          <span className="text-xs font-bold uppercase text-[#8E8A85] block">Marketing Efficiency</span>
          <span className="font-editorial text-2xl font-bold text-amber-400 block">
            {marketingROI}
          </span>
          <p className="text-xs text-[#8E8A85]">Return on ad spend across luxury channels.</p>
        </div>
      </div>
    </div>
  );
}
