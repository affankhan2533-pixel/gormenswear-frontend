"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Percent, Save, CheckCircle2, Calendar, Building2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function QuoteModal({ isOpen, onClose, onSave, quote = null, companies }) {
  const [companyId, setCompanyId] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [expirationDate, setExpirationDate] = useState("");
  const [status, setStatus] = useState("Approved");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (quote) {
      setCompanyId(quote.companyId || (companies[0] ? companies[0].id : ""));
      setContactName(quote.contactName || "");
      setContactEmail(quote.contactEmail || "");
      setDiscountPercent(quote.discountPercent || 10);
      setExpirationDate(quote.expirationDate || "");
      setStatus(quote.status || "Approved");
      setNotes(quote.notes || "");
    } else {
      const selComp = companies[0];
      setCompanyId(selComp ? selComp.id : "");
      setContactName(selComp?.contacts?.[0]?.name || "Authorized Buyer");
      setContactEmail(selComp?.contacts?.[0]?.email || "buyer@company.com");
      setDiscountPercent(10);
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      setExpirationDate(futureDate.toISOString().split("T")[0]);
      
      setStatus("Approved");
      setNotes("");
    }
  }, [quote, companies, isOpen]);

  if (!isOpen) return null;

  const selectedCompany = companies.find((c) => c.id === companyId) || companies[0];
  const sampleSubtotal = quote ? quote.totalAmount : 50000;
  const calculatedFinal = Math.round(sampleSubtotal * (1 - discountPercent / 100));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: quote ? quote.id : `qt-${Date.now()}`,
      quoteNumber: quote ? quote.quoteNumber : `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      companyId,
      companyName: selectedCompany ? selectedCompany.name : "Target Company",
      contactName,
      contactEmail,
      salesRepName: selectedCompany ? selectedCompany.assignedSalesRepName : "Assigned Rep",
      requestedDate: quote ? quote.requestedDate : new Date().toISOString().split("T")[0],
      expirationDate,
      status,
      discountPercent: Number(discountPercent),
      totalAmount: sampleSubtotal,
      finalAmount: calculatedFinal,
      notes,
      lineItems: quote ? quote.lineItems : [
        { sku: "GOR-SH-SILK-IVR-L", productName: "Atelier Raw Silk Grandad Shirt", quantity: 100, listPrice: 420, quotedPrice: 210 },
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
        aria-labelledby="quote-modal-title"
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
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 id="quote-modal-title" className="font-editorial text-2xl font-normal">
                  {quote ? `Revise RFQ Quote (${quote.quoteNumber})` : "Create Wholesale Quote"}
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Revise custom discounts, set validity expiration, and approve buyer RFQs.
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
            {/* Target Company */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Target Company Account *
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.tier})
                  </option>
                ))}
              </select>
            </div>

            {/* Buyer Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Buyer Name
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Buyer Email
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Discount & Expiration */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Additional Discount %
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm font-bold text-[#C8A45D] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  required
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Quote Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="Approved">Approved</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Requested">Requested</option>
                  <option value="Converted">Converted to PO</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Custom Terms & Notes
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Custom freight arrangement or exclusive packaging note..."
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] p-3 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none resize-none"
              />
            </div>

            {/* Final Calculation */}
            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-[#8E8A85] font-bold block">
                  Wholesale Quoted Total
                </span>
                <span className="text-xs text-[#8E8A85]">
                  Original: ${sampleSubtotal.toLocaleString()} (-{discountPercent}%)
                </span>
              </div>
              <span className="font-editorial text-2xl font-bold text-emerald-400">
                ${calculatedFinal.toLocaleString()}
              </span>
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
                <Save className="w-4 h-4" /> Save Quote Revision
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
