"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCheck, Save, Mail, Phone, MapPin, Award } from "lucide-react";

export default function SalesRepModal({ isOpen, onClose, onSave, rep = null }) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    email: "",
    phone: "",
    region: "North America & APAC",
    commissionRate: 5.5,
  });

  useEffect(() => {
    if (rep) {
      setFormData({
        code: rep.code || "",
        name: rep.name || "",
        email: rep.email || "",
        phone: rep.phone || "",
        region: rep.region || "North America & APAC",
        commissionRate: rep.commissionRate || 5.5,
      });
    } else {
      setFormData({
        code: `REP-${Math.floor(100 + Math.random() * 900)}`,
        name: "",
        email: "",
        phone: "",
        region: "North America & APAC",
        commissionRate: 5.5,
      });
    }
  }, [rep, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: rep ? rep.id : `rep-${Date.now()}`,
      code: formData.code,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      region: formData.region,
      commissionRate: Number(formData.commissionRate),
      portfolioCompanyCount: rep ? rep.portfolioCompanyCount : 0,
      managedRevenue: rep ? rep.managedRevenue : 0,
      earnedCommission: rep ? rep.earnedCommission : 0,
      activityTimeline: rep ? rep.activityTimeline : [
        { date: new Date().toISOString().split("T")[0], action: "Sales Representative onboarded to region" },
      ],
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
        aria-labelledby="sales-rep-modal-title"
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
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 id="sales-rep-modal-title" className="font-editorial text-2xl font-normal">
                  {rep ? "Edit Sales Representative" : "Register Sales Representative"}
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Assign territory region and configure commission rates.
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
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dominic Thorne"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Rep Code *
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="d.thorne@gormenswear.com"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 212 555 0199"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Territory / Region
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="North America & APAC">North America & APAC</option>
                  <option value="UK & European Union">UK & European Union</option>
                  <option value="Middle East & GCC">Middle East & GCC</option>
                  <option value="Global Accounts">Global Accounts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#C8A45D] focus:border-[#C8A45D] outline-none"
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
                <Save className="w-4 h-4" /> Save Representative
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
