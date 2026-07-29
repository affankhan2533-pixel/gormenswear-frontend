"use client";

import { Truck, Globe, ShieldCheck, Plus, Settings, DollarSign } from "lucide-react";

export default function ShippingOverviewHeader({
  activeZonesCount,
  freeShippingCount,
  globalCodFee,
  onAddRule,
}) {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-[#141414] border border-[#222222] rounded-[24px] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C8A45D] font-bold block mb-1">
            LOGISTICS & DISPATCH CONFIGURATION
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
            Shipping Rules & Zone Management
          </h1>
          <p className="text-xs text-[#8E8A85] mt-1">
            Define shipping rates per state, free shipping thresholds, Cash on Delivery (COD) fees, and priority order without writing code.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddRule}
          className="h-[40px] px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md font-bold shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Shipping Rule
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#141414] border border-[#222222] rounded-[18px] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Active Shipping Zones</span>
          <div className="font-editorial text-2xl font-bold text-[#F8F6F3]">{activeZonesCount} Zones</div>
          <span className="text-[10px] text-emerald-400 font-mono">100% Pan-India Coverage</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222222] rounded-[18px] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Free Shipping Threshold</span>
          <div className="font-editorial text-2xl font-bold text-emerald-400">₹2,999</div>
          <span className="text-[10px] text-[#8E8A85] font-mono">Orders above threshold ship free</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222222] rounded-[18px] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Fixed COD Surcharge</span>
          <div className="font-editorial text-2xl font-bold text-[#C8A45D]">₹{globalCodFee}</div>
          <span className="text-[10px] text-[#8E8A85] font-mono">Applied to COD payment orders</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222222] rounded-[18px] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Express Courier SLA</span>
          <div className="font-editorial text-2xl font-bold text-blue-400">1-2 Days</div>
          <span className="text-[10px] text-blue-400 font-mono">DHL Air Courier active</span>
        </div>
      </div>
    </div>
  );
}
