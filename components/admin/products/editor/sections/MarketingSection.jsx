"use client";

import { Tag, Layers, Share2, Sparkles } from "lucide-react";

export default function MarketingSection({ formData, onChange }) {
  return (
    <div id="section-marketing" className="p-6 bg-[#141414] border border-[#222222] rounded-[24px] space-y-6 shadow-xl">
      <div className="border-b border-[#2A2A2A] pb-3">
        <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
          Marketing, Cross-Sell & Campaign Merchandising
        </h3>
        <p className="text-xs text-[#8E8A85]">
          Link seasonal campaign collections, upsell garment pairings, cross-sell accessories, and marketing tags.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Recommended Pairing / Cross-Sell SKUs
          </label>
          <input
            type="text"
            value={formData.crossSell || "Italian Merino Wool Pleated Trousers (GOR-TRS-MER-002)"}
            onChange={(e) => onChange("crossSell", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Bespoke Upgrade / Upsell SKUs
          </label>
          <input
            type="text"
            value={formData.upsell || "Bespoke Cashmere Double-Breasted Overcoat (GOR-OCT-CSH-004)"}
            onChange={(e) => onChange("upsell", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>
      </div>
    </div>
  );
}
