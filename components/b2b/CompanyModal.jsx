"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, MapPin, CreditCard, ShieldCheck, Save, UserCheck, FileText } from "lucide-react";

export default function CompanyModal({
  isOpen,
  onClose,
  onSave,
  company = null,
  salesReps = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    taxId: "",
    industry: "High-End Department Store",
    tier: "VIP Tier 1",
    creditLimit: 100000,
    outstandingBalance: 0,
    creditStatus: "Approved",
    paymentTerms: "Net 30",
    assignedSalesRepId: "",
    assignedSalesRepName: "",
    street: "",
    city: "",
    region: "",
    country: "United States",
    zip: "",
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        code: company.code || "",
        taxId: company.taxId || "",
        industry: company.industry || "High-End Department Store",
        tier: company.tier || "VIP Tier 1",
        creditLimit: company.creditLimit || 100000,
        outstandingBalance: company.outstandingBalance || 0,
        creditStatus: company.creditStatus || "Approved",
        paymentTerms: company.paymentTerms || "Net 30",
        assignedSalesRepId: company.assignedSalesRepId || (salesReps[0] ? salesReps[0].id : ""),
        assignedSalesRepName: company.assignedSalesRepName || (salesReps[0] ? salesReps[0].name : ""),
        street: company.billingAddress?.street || "",
        city: company.billingAddress?.city || "",
        region: company.billingAddress?.region || "",
        country: company.billingAddress?.country || "",
        zip: company.billingAddress?.zip || "",
      });
    } else {
      setFormData({
        name: "",
        code: `CMP-${Math.floor(100 + Math.random() * 900)}`,
        taxId: "",
        industry: "High-End Department Store",
        tier: "VIP Tier 1",
        creditLimit: 150000,
        outstandingBalance: 0,
        creditStatus: "Approved",
        paymentTerms: "Net 30",
        assignedSalesRepId: salesReps[0] ? salesReps[0].id : "",
        assignedSalesRepName: salesReps[0] ? salesReps[0].name : "",
        street: "",
        city: "",
        region: "",
        country: "United States",
        zip: "",
      });
    }
  }, [company, salesReps, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const selRep = salesReps.find((r) => r.id === formData.assignedSalesRepId);

    const payload = {
      id: company ? company.id : `cmp-${Date.now()}`,
      code: formData.code,
      name: formData.name,
      taxId: formData.taxId,
      industry: formData.industry,
      tier: formData.tier,
      creditLimit: Number(formData.creditLimit),
      outstandingBalance: Number(formData.outstandingBalance),
      creditStatus: formData.creditStatus,
      paymentTerms: formData.paymentTerms,
      assignedSalesRepId: formData.assignedSalesRepId,
      assignedSalesRepName: selRep ? selRep.name : formData.assignedSalesRepName,
      billingAddress: {
        street: formData.street,
        city: formData.city,
        region: formData.region,
        country: formData.country,
        zip: formData.zip,
      },
      shippingAddresses: company ? company.shippingAddresses : [
        { id: `ship-${Date.now()}`, name: "Primary Warehouse", street: formData.street, city: formData.city, country: formData.country, zip: formData.zip },
      ],
      contacts: company ? company.contacts : [
        { id: `cnt-${Date.now()}`, name: "Primary Authorized Buyer", email: "buyer@company.com", phone: "+1 555 0100", role: "Company Owner" },
      ],
      createdAt: company ? company.createdAt : new Date().toISOString().split("T")[0],
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
        aria-labelledby="company-modal-title"
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
                <h2 id="company-modal-title" className="font-editorial text-2xl font-normal">
                  {company ? "Edit B2B Company Account" : "Register New B2B Account"}
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Configure company profile, credit line, payment terms, and assigned sales rep.
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
                <Building2 className="w-4 h-4" /> Company Profile & Tax Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Company Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Saks Fifth Avenue Luxury Group"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Tax / VAT ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    placeholder="e.g. VAT-US-8849102"
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-mono text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Wholesale Tier
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                  >
                    <option value="VIP Tier 1">VIP Tier 1 (50% Off MSRP)</option>
                    <option value="Gold Tier 2">Gold Tier 2 (40% Off MSRP)</option>
                    <option value="Standard Wholesale">Standard Wholesale (30% Off MSRP)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Credit & Terms */}
            <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Credit Line & Payment Terms
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Credit Limit ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                  >
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 60">Net 60 Days</option>
                    <option value="Prepaid">Prepaid / Upfront</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Credit Status
                  </label>
                  <select
                    value={formData.creditStatus}
                    onChange={(e) => setFormData({ ...formData, creditStatus: e.target.value })}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Extended">Extended</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sales Rep Assignment */}
            <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> Assigned Sales Representative
              </h3>
              <div>
                <select
                  value={formData.assignedSalesRepId}
                  onChange={(e) => setFormData({ ...formData, assignedSalesRepId: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  {salesReps.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Billing Address
              </h3>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="Street Address (e.g. 611 5th Ave)"
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="State/Region"
                  className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Country"
                  className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  placeholder="Zip / Postal"
                  className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
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
                <Save className="w-4 h-4" /> Save Account Profile
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
