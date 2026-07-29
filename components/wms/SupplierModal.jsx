"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Factory, Star, Phone, Mail, MapPin, Clock, Save, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function SupplierModal({ isOpen, onClose, onSave, supplier = null }) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    leadTimeDays: 14,
    preferred: false,
    rating: 4.8,
    onTimeDeliveryRate: 98.0,
    qualityScore: 99.0,
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        code: supplier.code || "",
        name: supplier.name || "",
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        leadTimeDays: supplier.leadTimeDays || 14,
        preferred: Boolean(supplier.preferred),
        rating: supplier.rating || 4.8,
        onTimeDeliveryRate: supplier.onTimeDeliveryRate || 98.0,
        qualityScore: supplier.qualityScore || 99.0,
      });
    } else {
      setFormData({
        code: `SUP-${Math.floor(100 + Math.random() * 900)}`,
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        leadTimeDays: 14,
        preferred: false,
        rating: 4.8,
        onTimeDeliveryRate: 98.0,
        qualityScore: 99.0,
      });
    }
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: supplier ? supplier.id : `sup-${Date.now()}`,
      code: formData.code,
      name: formData.name,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      leadTimeDays: Number(formData.leadTimeDays),
      preferred: formData.preferred,
      rating: Number(formData.rating),
      onTimeDeliveryRate: Number(formData.onTimeDeliveryRate),
      qualityScore: Number(formData.qualityScore),
      totalPOs: supplier ? supplier.totalPOs : 0,
      totalSpend: supplier ? supplier.totalSpend : 0,
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
        aria-labelledby="supplier-modal-title"
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
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <h2 id="supplier-modal-title" className="font-editorial text-2xl font-normal">
                  {supplier ? "Edit Supplier Profile" : "Add New Supplier"}
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Manage mill contact info, lead times, and preferred partner ratings.
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
                  Supplier / Mill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Biella Woolens & Cashmere SpA"
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

            {/* Contact Person & Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Matteo Rossi"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="m.rossi@biella.it"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
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
                  placeholder="+39 015 849 2000"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                HQ Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Via Torino 45, Biella, Italy"
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
              />
            </div>

            {/* Performance Parameters */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#2A2A2A]">
              <div>
                <label className="block text-[11px] text-[#8E8A85] mb-1">Lead Time (Days)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.leadTimeDays}
                  onChange={(e) => setFormData({ ...formData, leadTimeDays: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#8E8A85] mb-1">Rating Score (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#8E8A85] mb-1">On-Time %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.onTimeDeliveryRate}
                  onChange={(e) => setFormData({ ...formData, onTimeDeliveryRate: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Preferred Supplier Toggle */}
            <div className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C8A45D]" />
                <div>
                  <span className="text-xs font-bold text-[#F8F6F3] block">
                    Preferred Atelier Partner
                  </span>
                  <span className="text-[11px] text-[#8E8A85]">
                    Prioritizes PO allocation and highlighted in supplier directory.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.preferred}
                onChange={(e) => setFormData({ ...formData, preferred: e.target.checked })}
                className="w-5 h-5 accent-[#C8A45D] cursor-pointer"
              />
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
                className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" /> Save Supplier
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
