"use client";

import { motion } from "framer-motion";
import { Award, Crown, CheckCircle2, ShieldCheck, Edit2, Zap, Truck, Lock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function MembershipTierCard({ tier, onEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl hover:border-[#C8A45D]/40 transition-all group flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: tier.colorHex }}
              />
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded">
                {tier.code}
              </span>
            </div>
            <h3 className="font-editorial text-2xl text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors flex items-center gap-2">
              {tier.name} Tier
              {tier.name === "Platinum" && <Crown className="w-5 h-5 text-[#C8A45D]" />}
            </h3>
            <p className="text-xs text-[#8E8A85] mt-1">
              Minimum Annual Spend: <strong className="text-[#F8F6F3]">${tier.minSpendThreshold.toLocaleString()}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => onEdit(tier)}
            aria-label={`Edit ${tier.name} Tier`}
            className="p-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Benefits Overview */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#2A2A2A] my-4">
          <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] text-center">
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Member Discount
            </span>
            <span className="font-editorial text-2xl text-emerald-400 font-bold">
              {tier.discountPercent}% OFF
            </span>
          </div>

          <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] text-center">
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Early Drop Access
            </span>
            <span className="font-editorial text-2xl text-[#C8A45D] font-bold">
              {tier.earlyAccessHours > 0 ? `${tier.earlyAccessHours} Hours` : "Public"}
            </span>
          </div>
        </div>

        {/* Perks Checklist */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#8E8A85]">
            <Truck className={`w-3.5 h-3.5 ${tier.freeShipping ? "text-emerald-400" : "text-[#8E8A85]"}`} />
            <span className={tier.freeShipping ? "text-[#F8F6F3] font-medium" : "text-[#8E8A85] line-through"}>
              Free Worldwide Express Shipping
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#8E8A85]">
            <Lock className={`w-3.5 h-3.5 ${tier.exclusiveCollectionsAccess ? "text-[#C8A45D]" : "text-[#8E8A85]"}`} />
            <span className={tier.exclusiveCollectionsAccess ? "text-[#F8F6F3] font-medium" : "text-[#8E8A85] line-through"}>
              Exclusive Member-Only Collections Access
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#8E8A85]">
            <Crown className={`w-3.5 h-3.5 ${tier.prioritySupport ? "text-[#C8A45D]" : "text-[#8E8A85]"}`} />
            <span className={tier.prioritySupport ? "text-[#F8F6F3] font-medium" : "text-[#8E8A85] line-through"}>
              24/7 Private Concierge Stylist Support
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-[11px] text-[#8E8A85]">
        <span>Active Members: <strong className="text-[#F8F6F3]">{tier.activeMembersCount}</strong></span>
      </div>
    </motion.div>
  );
}
