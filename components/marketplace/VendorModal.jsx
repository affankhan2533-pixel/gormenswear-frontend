"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, MapPin, Percent, Save, ShieldCheck, Mail, Phone } from "lucide-react";

export default function VendorModal({ isOpen, onClose, onSave, vendor = null }) {
  const [formData, setFormData] = useState({
    companyName: "",
    code: "",
    contactPerson: "",
    email: "",
    phone: "",
    taxId: "",
    commissionRate: 15,
    verificationStatus: "Approved",
    description: "",
    country: "Italy",
    city: "Milan",
    returnPolicy: "30-day standard return policy",
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        companyName: vendor.companyName || "",
        code: vendor.code || "",
        contactPerson: vendor.contactPerson || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        taxId: vendor.taxId || "",
        commissionRate: vendor.commissionRate || 15,
        verificationStatus: vendor.verificationStatus || "Approved",
        description: vendor.storeProfile?.description || "",
        country: vendor.storeProfile?.country || "Italy",
        city: vendor.storeProfile?.city || "Milan",
        returnPolicy: vendor.storeProfile?.returnPolicy || "30-day standard return policy",
      });
    } else {
      setFormData({
        companyName: "",
        code: `VND-${Math.floor(100 + Math.random() * 900)}`,
        contactPerson: "",
        email: "",
        phone: "",
        taxId: "",
        commissionRate: 15,
        verificationStatus: "Approved",
        description: "",
        country: "Italy",
        city: "Florence",
        returnPolicy: "30-day standard return policy",
      });
    }
  }, [vendor, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: vendor ? vendor.id : `vnd-${Date.now()}`,
      code: formData.code,
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      taxId: formData.taxId,
      verificationStatus: formData.verificationStatus,
      commissionRate: Number(formData.commissionRate),
      totalSales: vendor ? vendor.totalSales : 0,
      activeProductsCount: vendor ? vendor.activeProductsCount : 0,
      rating: vendor ? vendor.rating : 5.0,
      storeProfile: {
        description: formData.description,
        country: formData.country,
        city: formData.city,
        returnPolicy: formData.returnPolicy,
        joinedDate: vendor ? vendor.storeProfile?.joinedDate : new Date().toISOString().split("T")[0],
      },
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
        aria-labelledby="vendor-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 id="vendor-modal-title" className="font-editorial text-2xl font-normal">
                  {vendor ? "Edit Vendor Profile" : "Register Marketplace Vendor"}
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Configure company profile, tax details, commission rates, and verification status.
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Company & Contact Representative
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Vendor Legal Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Biella Leatherworks Italy"
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Vendor Code *
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Matteo Rossini"
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
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
                    placeholder="m.rossini@biella.it"
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
                    placeholder="+39 015 882 100"
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Tax & Governance */}
            <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Tax Information & Commission Rules
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Tax / VAT Identification *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    placeholder="VAT-IT-98120491"
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-mono text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Marketplace Commission (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#C8A45D] focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Verification Status
                  </label>
                  <select
                    value={formData.verificationStatus}
                    onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value })}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Profile & Location */}
            <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Store Location & Bio
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief vendor store profile description..."
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] p-3 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#2A2A2A]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
              >
                <Save className="w-4 h-4" /> Save Vendor Profile
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
