"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileCheck, Save, Building2, Calendar, CreditCard, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function B2BPurchaseOrderModal({
  isOpen,
  onClose,
  onSave,
  po = null,
  companies,
  prefilledQuote = null,
}) {
  const [companyId, setCompanyId] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState(45000);
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("In Production");
  const [approvalSignoff, setApprovalSignoff] = useState("Finance Director");

  useEffect(() => {
    if (po) {
      setCompanyId(po.companyId || (companies[0] ? companies[0].id : ""));
      setPoNumber(po.poNumber || "");
      setTotalAmount(po.totalAmount || 45000);
      setPaymentTerms(po.paymentTerms || "Net 30");
      setDueDate(po.dueDate || "");
      setStatus(po.status || "In Production");
      setApprovalSignoff(po.approvalSignoff?.name || "Finance Director");
    } else if (prefilledQuote) {
      setCompanyId(prefilledQuote.companyId);
      setPoNumber(`B2B-PO-2026-${Math.floor(100 + Math.random() * 900)}`);
      setTotalAmount(prefilledQuote.finalAmount);
      
      const comp = companies.find((c) => c.id === prefilledQuote.companyId);
      setPaymentTerms(comp ? comp.paymentTerms : "Net 30");
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      setDueDate(futureDate.toISOString().split("T")[0]);
      
      setStatus("In Production");
      setApprovalSignoff(prefilledQuote.contactName);
    } else {
      const comp = companies[0];
      setCompanyId(comp ? comp.id : "");
      setPoNumber(`B2B-PO-2026-${Math.floor(100 + Math.random() * 900)}`);
      setTotalAmount(52000);
      setPaymentTerms(comp ? comp.paymentTerms : "Net 30");
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      setDueDate(futureDate.toISOString().split("T")[0]);
      
      setStatus("In Production");
      setApprovalSignoff("Authorized Buyer");
    }
  }, [po, prefilledQuote, companies, isOpen]);

  if (!isOpen) return null;

  const selCompany = companies.find((c) => c.id === companyId) || companies[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: po ? po.id : `b2b-po-${Date.now()}`,
      poNumber: poNumber || `B2B-PO-${Date.now()}`,
      companyId,
      companyName: selCompany ? selCompany.name : "Company Account",
      totalAmount: Number(totalAmount),
      paymentTerms,
      dueDate,
      orderDate: po ? po.orderDate : new Date().toISOString().split("T")[0],
      status,
      approvalSignoff: { name: approvalSignoff, date: new Date().toISOString().split("T")[0] },
      items: po ? po.items : prefilledQuote ? prefilledQuote.lineItems : [],
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
        aria-labelledby="b2b-po-modal-title"
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
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-emerald-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 id="b2b-po-modal-title" className="font-editorial text-2xl font-normal">
                  {po ? `Edit B2B Purchase Order (${po.poNumber})` : "Issue B2B Purchase Order"}
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Issue official corporate purchase orders with Net payment terms.
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
            {/* Company & PO Number */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Company Account *
                </label>
                <select
                  value={companyId}
                  onChange={(e) => {
                    setCompanyId(e.target.value);
                    const c = companies.find((x) => x.id === e.target.value);
                    if (c) setPaymentTerms(c.paymentTerms);
                  }}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  PO Number *
                </label>
                <input
                  type="text"
                  required
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-mono text-[#F8F6F3] focus:border-[#C8A45D] outline-none uppercase"
                />
              </div>
            </div>

            {/* Terms & Due Date */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  PO Order Value ($)
                </label>
                <input
                  type="number"
                  required
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm font-bold text-[#C8A45D] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Prepaid">Prepaid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Status & Approval Signoff */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Production Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="In Production">In Production</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Authorized Signoff By
                </label>
                <input
                  type="text"
                  required
                  value={approvalSignoff}
                  onChange={(e) => setApprovalSignoff(e.target.value)}
                  placeholder="e.g. Victoria Sterling (CEO)"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
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
                <Save className="w-4 h-4" /> Save Purchase Order
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
