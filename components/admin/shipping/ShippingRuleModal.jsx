"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Truck, AlertTriangle } from "lucide-react";

export default function ShippingRuleModal({
  isOpen,
  onClose,
  onSaveRule,
  ruleObj = null,
}) {
  const [formData, setFormData] = useState({
    state: "",
    method: "Standard Delivery",
    charge: 120,
    freeAbove: 2999,
    codFee: 50,
    priority: 1,
    status: "Active",
    estimatedDays: "2-4 Business Days",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (ruleObj) {
      setFormData({
        state: ruleObj.state || "",
        method: ruleObj.method || "Standard Delivery",
        charge: ruleObj.charge ?? 120,
        freeAbove: ruleObj.freeAbove ?? 2999,
        codFee: ruleObj.codFee ?? 50,
        priority: ruleObj.priority || 1,
        status: ruleObj.status || "Active",
        estimatedDays: ruleObj.estimatedDays || "2-4 Business Days",
      });
      setError("");
    } else {
      setFormData({
        state: "",
        method: "Standard Delivery",
        charge: 120,
        freeAbove: 2999,
        codFee: 50,
        priority: 1,
        status: "Active",
        estimatedDays: "2-4 Business Days",
      });
      setError("");
    }
  }, [ruleObj, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.state.trim()) {
      setError("Please enter a valid State or Shipping Zone name.");
      return;
    }

    try {
      await onSaveRule(formData, ruleObj?.id);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save shipping rule.");
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shipping-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#121212] border border-[#2A2A2A] rounded-[24px] max-w-lg w-full p-6 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#C8A45D]" />
              <h2 id="shipping-modal-title" className="font-editorial text-2xl font-normal">
                {ruleObj ? "Edit Shipping Rule" : "Add New Shipping Rule"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-[#090909] border border-[#2A2A2A] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-[12px] text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* State / Zone Name */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                State / Shipping Zone Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Maharashtra, Delhi NCR, Rest of India"
                required
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
              />
            </div>

            {/* Shipping Method & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Shipping Method
                </label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="Standard Delivery">Standard Delivery</option>
                  <option value="Express Air Courier">Express Air Courier</option>
                  <option value="Store Pickup">Store Pickup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Rule Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Charge & Free Above Threshold */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Shipping Charge (₹ / $)
                </label>
                <input
                  type="number"
                  value={formData.charge}
                  onChange={(e) => setFormData({ ...formData, charge: e.target.value })}
                  placeholder="0 for Free Shipping"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Free Shipping Above (₹)
                </label>
                <input
                  type="number"
                  value={formData.freeAbove}
                  onChange={(e) => setFormData({ ...formData, freeAbove: e.target.value })}
                  placeholder="2999"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
                />
              </div>
            </div>

            {/* COD Fee & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  COD Surcharge Fee (₹)
                </label>
                <input
                  type="number"
                  value={formData.codFee}
                  onChange={(e) => setFormData({ ...formData, codFee: e.target.value })}
                  placeholder="50"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Priority Order (1-10)
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#090909] text-[#8E8A85] rounded-[10px] text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#C8A45D] text-[#090909] rounded-[10px] text-xs font-bold uppercase flex items-center gap-1.5 font-bold"
              >
                <Save className="w-4 h-4" /> Save Shipping Rule
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
