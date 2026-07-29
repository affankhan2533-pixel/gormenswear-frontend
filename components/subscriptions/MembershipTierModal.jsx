"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Save, Crown, ShieldCheck, Truck, Lock } from "lucide-react";

export default function MembershipTierModal({ isOpen, onClose, onSave, tier = null }) {
  const [formData, setFormData] = useState({
    name: "Gold",
    code: "TIER-GOLD",
    colorHex: "#C8A45D",
    minSpendThreshold: 5000,
    discountPercent: 20,
    freeShipping: true,
    earlyAccessHours: 24,
    exclusiveCollectionsAccess: true,
    prioritySupport: true,
  });

  useEffect(() => {
    if (tier) {
      setFormData({
        name: tier.name || "Gold",
        code: tier.code || "TIER-GOLD",
        colorHex: tier.colorHex || "#C8A45D",
        minSpendThreshold: tier.minSpendThreshold || 5000,
        discountPercent: tier.discountPercent || 20,
        freeShipping: Boolean(tier.freeShipping),
        earlyAccessHours: tier.earlyAccessHours || 24,
        exclusiveCollectionsAccess: Boolean(tier.exclusiveCollectionsAccess),
        prioritySupport: Boolean(tier.prioritySupport),
      });
    }
  }, [tier, isOpen]);

  if (!isOpen || !tier) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...tier,
      name: formData.name,
      minSpendThreshold: Number(formData.minSpendThreshold),
      discountPercent: Number(formData.discountPercent),
      freeShipping: formData.freeShipping,
      earlyAccessHours: Number(formData.earlyAccessHours),
      exclusiveCollectionsAccess: formData.exclusiveCollectionsAccess,
      prioritySupport: formData.prioritySupport,
    };

    onSave(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tier-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 id="tier-modal-title" className="font-editorial text-2xl font-normal">
                  Configure {tier.name} Membership Tier
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Set threshold parameters, discount rates, early access hours, and shipping perks.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Min Spend Threshold ($)
                </label>
                <input
                  type="number"
                  required
                  value={formData.minSpendThreshold}
                  onChange={(e) => setFormData({ ...formData, minSpendThreshold: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Member Discount %
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="50"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-emerald-400 focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Early Drop Access Window (Hours)
              </label>
              <input
                type="number"
                min="0"
                max="72"
                value={formData.earlyAccessHours}
                onChange={(e) => setFormData({ ...formData, earlyAccessHours: e.target.value })}
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#C8A45D] focus:border-[#C8A45D] outline-none"
              />
            </div>

            {/* Benefit Toggles */}
            <div className="space-y-3 pt-3 border-t border-[#2A2A2A]">
              <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8F6F3] block">
                    Free Worldwide Express Shipping
                  </span>
                  <span className="text-[11px] text-[#8E8A85]">
                    Waives all shipping fees on orders placed by members in this tier.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.freeShipping}
                  onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })}
                  className="w-5 h-5 accent-[#C8A45D] cursor-pointer"
                />
              </div>

              <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8F6F3] block">
                    Exclusive Collection Access
                  </span>
                  <span className="text-[11px] text-[#8E8A85]">
                    Unlocks private member-only product drops and limited atelier pieces.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.exclusiveCollectionsAccess}
                  onChange={(e) => setFormData({ ...formData, exclusiveCollectionsAccess: e.target.checked })}
                  className="w-5 h-5 accent-[#C8A45D] cursor-pointer"
                />
              </div>

              <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8F6F3] block">
                    Priority Concierge Support
                  </span>
                  <span className="text-[11px] text-[#8E8A85]">
                    Provides 24/7 dedicated stylist consultation and direct WhatsApp chat line.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.prioritySupport}
                  onChange={(e) => setFormData({ ...formData, prioritySupport: e.target.checked })}
                  className="w-5 h-5 accent-[#C8A45D] cursor-pointer"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
              >
                <Save className="w-4 h-4" /> Save Tier Config
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
