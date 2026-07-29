"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, Clock, Package, Save } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ProductApprovalModal({ isOpen, onClose, onSave, product = null }) {
  const [approvalStatus, setApprovalStatus] = useState("Approved");
  const [commissionPercent, setCommissionPercent] = useState(15);
  const [productType, setProductType] = useState("Vendor-owned");
  const [moderationNotes, setModerationNotes] = useState("");

  useEffect(() => {
    if (product) {
      setApprovalStatus(product.approvalStatus || "Approved");
      setCommissionPercent(product.commissionPercent || 15);
      setProductType(product.type || "Vendor-owned");
      setModerationNotes("");
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...product,
      approvalStatus,
      commissionPercent: Number(commissionPercent),
      type: productType,
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
        aria-labelledby="approval-modal-title"
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
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 id="approval-modal-title" className="font-editorial text-2xl font-normal">
                  Product Approval Moderation
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Moderate vendor submission: {product.productName}
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
            {/* Product Summary */}
            <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8E8A85]">SKU:</span>
                <span className="font-mono text-[#C8A45D]">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8A85]">Vendor:</span>
                <span className="text-[#F8F6F3] font-semibold">{product.vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8A85]">Retail Price:</span>
                <span className="text-emerald-400 font-bold">${product.price}</span>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Approval Status Decision *
              </label>
              <select
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
              >
                <option value="Approved">Approved (Publish to Marketplace)</option>
                <option value="Pending Review">Pending Review (Hold for Revision)</option>
                <option value="Rejected">Rejected (Reject Listing)</option>
              </select>
            </div>

            {/* Product Type & Commission */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Product Type Assignment
                </label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="Vendor-owned">Vendor-owned</option>
                  <option value="Shared">Shared Product</option>
                  <option value="Marketplace">Marketplace Product</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Custom Commission %
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#C8A45D] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Moderation Notes */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Moderation Notes / Feedback
              </label>
              <textarea
                rows="2"
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder="Image quality resolution or tax compliance notes..."
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] p-3 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none resize-none"
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
                className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
              >
                <Save className="w-4 h-4" /> Save Decision
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
