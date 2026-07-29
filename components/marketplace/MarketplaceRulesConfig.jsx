"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sliders, Percent, ShieldCheck, CheckCircle2, Save } from "lucide-react";

export default function MarketplaceRulesConfig({ rules, onSaveRules }) {
  const [formData, setFormData] = useState({
    defaultCommissionPercent: rules.defaultCommissionPercent || 15,
    productApprovalRequired: Boolean(rules.productApprovalRequired),
    autoPublishApprovedVendors: Boolean(rules.autoPublishApprovedVendors),
    vendorProductLimit: rules.vendorProductLimit || 500,
    manualReviewPriceThreshold: rules.manualReviewPriceThreshold || 2000,
    payoutScheduleInterval: rules.payoutScheduleInterval || "Bi-Weekly",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveRules(formData);
  };

  return (
    <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl max-w-2xl space-y-6">
      <div className="border-b border-[#2A2A2A] pb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
          <Sliders className="w-4 h-4" /> GOVERNANCE & COMPLIANCE
        </span>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Global Marketplace Rules & Commission Settings
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
              Default Platform Commission (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.defaultCommissionPercent}
              onChange={(e) => setFormData({ ...formData, defaultCommissionPercent: Number(e.target.value) })}
              className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#C8A45D] focus:border-[#C8A45D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
              Max Product Limit Per Vendor
            </label>
            <input
              type="number"
              value={formData.vendorProductLimit}
              onChange={(e) => setFormData({ ...formData, vendorProductLimit: Number(e.target.value) })}
              className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
              Manual Review Price Threshold ($)
            </label>
            <input
              type="number"
              value={formData.manualReviewPriceThreshold}
              onChange={(e) => setFormData({ ...formData, manualReviewPriceThreshold: Number(e.target.value) })}
              className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-amber-400 focus:border-[#C8A45D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
              Payout Schedule Interval
            </label>
            <select
              value={formData.payoutScheduleInterval}
              onChange={(e) => setFormData({ ...formData, payoutScheduleInterval: e.target.value })}
              className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
            >
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-3 border-t border-[#2A2A2A]">
          <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#F8F6F3] block">
                Require Admin Approval for All Product Submissions
              </span>
              <span className="text-[11px] text-[#8E8A85]">
                New products remain in 'Pending Review' until approved.
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.productApprovalRequired}
              onChange={(e) => setFormData({ ...formData, productApprovalRequired: e.target.checked })}
              className="w-5 h-5 accent-[#C8A45D] cursor-pointer"
            />
          </div>

          <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#F8F6F3] block">
                Auto-Publish Approved Vendor Products
              </span>
              <span className="text-[11px] text-[#8E8A85]">
                Automatically publish listings from verified VIP vendors.
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.autoPublishApprovedVendors}
              onChange={(e) => setFormData({ ...formData, autoPublishApprovedVendors: e.target.checked })}
              className="w-5 h-5 accent-[#C8A45D] cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#2A2A2A]">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
          >
            <Save className="w-4 h-4" /> Save Marketplace Rules
          </button>
        </div>
      </form>
    </div>
  );
}
