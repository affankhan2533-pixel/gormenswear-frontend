"use client";

import { DollarSign, TrendingUp, Percent } from "lucide-react";

export default function PricingSection({ formData, onChange }) {
  const price = parseFloat(formData.price) || 0;
  const cost = parseFloat(formData.costPrice) || 0;
  const profit = price - cost;
  const marginPercentage = price > 0 ? ((profit / price) * 100).toFixed(1) : "0.0";

  return (
    <div id="section-pricing" className="p-6 bg-[#141414] border border-[#222222] rounded-[24px] space-y-6 shadow-xl">
      <div className="border-b border-[#2A2A2A] pb-3 flex justify-between items-center">
        <div>
          <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
            Pricing & Profit Margins
          </h3>
          <p className="text-xs text-[#8E8A85]">
            Set retail pricing, compare-at promotional rates, unit cost, and view live gross profit margin calculations.
          </p>
        </div>

        <div className="p-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[14px] text-right">
          <span className="text-[10px] font-bold uppercase text-[#8E8A85] block">Live Profit Margin</span>
          <span className="font-editorial text-xl font-bold text-emerald-400">
            ${profit.toFixed(2)} ({marginPercentage}%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Base Price */}
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Retail Price ($ USD) <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => onChange("price", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>

        {/* Compare Price */}
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Compare-at Price (MSRP)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.compareAtPrice || ""}
            onChange={(e) => onChange("compareAtPrice", e.target.value)}
            placeholder="e.g. 2800.00"
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>

        {/* Cost Price */}
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Cost per Item ($ USD)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.costPrice || ""}
            onChange={(e) => onChange("costPrice", e.target.value)}
            placeholder="e.g. 950.00"
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>
      </div>
    </div>
  );
}
