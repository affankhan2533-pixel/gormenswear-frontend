"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BellRing, Save, ShieldAlert, CheckCircle2, Sliders } from "lucide-react";

export default function AlertConfigModal({ isOpen, onClose, onSave, alertsConfig }) {
  const [formData, setFormData] = useState({
    lowStockThreshold: 15,
    overstockThreshold: 150,
    reorderPointDefault: 30,
    expiryWarningDays: 90,
    autoGeneratePO: false,
    emailNotifications: true,
  });

  useEffect(() => {
    if (alertsConfig) {
      setFormData({
        lowStockThreshold: alertsConfig.lowStockThreshold || 15,
        overstockThreshold: alertsConfig.overstockThreshold || 150,
        reorderPointDefault: alertsConfig.reorderPointDefault || 30,
        expiryWarningDays: alertsConfig.expiryWarningDays || 90,
        autoGeneratePO: Boolean(alertsConfig.autoGeneratePO),
        emailNotifications: Boolean(alertsConfig.emailNotifications),
      });
    }
  }, [alertsConfig, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...alertsConfig,
      lowStockThreshold: Number(formData.lowStockThreshold),
      overstockThreshold: Number(formData.overstockThreshold),
      reorderPointDefault: Number(formData.reorderPointDefault),
      expiryWarningDays: Number(formData.expiryWarningDays),
      autoGeneratePO: formData.autoGeneratePO,
      emailNotifications: formData.emailNotifications,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-config-title"
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
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-amber-400">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h2 id="alert-config-title" className="font-editorial text-2xl font-normal">
                  Configure Inventory Alerts
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Set global stock threshold parameters and notification triggers.
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
                  Low Stock Limit (Units)
                </label>
                <input
                  type="number"
                  required
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Overstock Ceiling (Units)
                </label>
                <input
                  type="number"
                  required
                  value={formData.overstockThreshold}
                  onChange={(e) => setFormData({ ...formData, overstockThreshold: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Default Reorder Point
                </label>
                <input
                  type="number"
                  required
                  value={formData.reorderPointDefault}
                  onChange={(e) => setFormData({ ...formData, reorderPointDefault: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Stock Aging Alert (Days)
                </label>
                <input
                  type="number"
                  required
                  value={formData.expiryWarningDays}
                  onChange={(e) => setFormData({ ...formData, expiryWarningDays: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Automation Toggles */}
            <div className="space-y-3 pt-3 border-t border-[#2A2A2A]">
              <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8F6F3] block">
                    Auto-Generate Draft PO on Low Stock
                  </span>
                  <span className="text-[11px] text-[#8E8A85]">
                    Creates a draft purchase order when available stock hits reorder point.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoGeneratePO}
                  onChange={(e) => setFormData({ ...formData, autoGeneratePO: e.target.checked })}
                  className="w-5 h-5 accent-[#C8A45D] cursor-pointer"
                />
              </div>

              <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8F6F3] block">
                    Instant Admin Email Dispatch
                  </span>
                  <span className="text-[11px] text-[#8E8A85]">
                    Sends real-time email digest to warehouse managers upon critical stockouts.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.emailNotifications}
                  onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
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
                <Save className="w-4 h-4" /> Save Alert Thresholds
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
