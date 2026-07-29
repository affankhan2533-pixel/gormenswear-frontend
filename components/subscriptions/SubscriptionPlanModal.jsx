"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Save, Plus, Trash2, Layers, DollarSign, Percent } from "lucide-react";

export default function SubscriptionPlanModal({ isOpen, onClose, onSave, plan = null }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    interval: "Monthly",
    price: 250,
    discountPercent: 20,
    status: "Active",
    description: "",
    features: [],
  });

  const [newFeatureText, setNewFeatureText] = useState("");

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        code: plan.code || "",
        interval: plan.interval || "Monthly",
        price: plan.price || 250,
        discountPercent: plan.discountPercent || 20,
        status: plan.status || "Active",
        description: plan.description || "",
        features: plan.features ? [...plan.features] : [],
      });
    } else {
      setFormData({
        name: "",
        code: `PLN-${Math.floor(100 + Math.random() * 900)}`,
        interval: "Monthly",
        price: 350,
        discountPercent: 20,
        status: "Active",
        description: "",
        features: ["1x Curated Italian item monthly", "Free Express Shipping"],
      });
    }
  }, [plan, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!newFeatureText.trim()) return;
    setFormData({
      ...formData,
      features: [...formData.features, newFeatureText.trim()],
    });
    setNewFeatureText("");
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: plan ? plan.id : `plan-${Date.now()}`,
      code: formData.code,
      name: formData.name,
      interval: formData.interval,
      price: Number(formData.price),
      currency: "USD",
      discountPercent: Number(formData.discountPercent),
      status: formData.status,
      activeSubscribersCount: plan ? plan.activeSubscribersCount : 0,
      mrrValue: plan ? plan.mrrValue : Number(formData.price),
      description: formData.description,
      features: formData.features,
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
        aria-labelledby="plan-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h2 id="plan-modal-title" className="font-editorial text-2xl font-normal">
                  {plan ? "Edit Subscription Plan" : "Create Subscription Plan"}
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Configure recurring billing intervals, pricing, member savings, and features.
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
            {/* Name & Code */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Atelier Monthly Silk & Shirting Box"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-mono text-[#F8F6F3] focus:border-[#C8A45D] outline-none uppercase"
                />
              </div>
            </div>

            {/* Interval & Pricing */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Interval *
                </label>
                <select
                  value={formData.interval}
                  onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#C8A45D] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Discount %
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-emerald-400 focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Plan Description
              </label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Curated monthly delivery details..."
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] p-3 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none resize-none"
              />
            </div>

            {/* Features List Config */}
            <div className="space-y-3 pt-3 border-t border-[#2A2A2A]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C8A45D]">
                Plan Included Features & Perks
              </label>

              <div className="space-y-2">
                {formData.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-[#090909] border border-[#2A2A2A] rounded-[8px] flex items-center justify-between text-xs"
                  >
                    <span className="text-[#F8F6F3] font-medium">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-[#8E8A85] hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  placeholder="e.g. Free Express Worldwide Shipping"
                  className="flex-1 bg-[#090909] border border-[#2A2A2A] rounded-[8px] px-3 py-2 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-xs font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                >
                  + Add
                </button>
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
                <Save className="w-4 h-4" /> Save Subscription Plan
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
