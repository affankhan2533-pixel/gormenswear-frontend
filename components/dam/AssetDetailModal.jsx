"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Download, Tag, FileText, Globe, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AssetDetailModal({
  isOpen,
  onClose,
  onSaveAsset,
  assetObj = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    copyright: "",
    photographer: "",
    usageRights: "",
    expirationDate: "",
    status: "Approved",
  });

  useEffect(() => {
    if (assetObj) {
      setFormData({
        name: assetObj.name || "",
        copyright: assetObj.copyright || "",
        photographer: assetObj.photographer || "",
        usageRights: assetObj.usageRights || "",
        expirationDate: assetObj.expirationDate || "",
        status: assetObj.status || "Approved",
      });
    }
  }, [assetObj, isOpen]);

  if (!isOpen || !assetObj) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveAsset({
      ...assetObj,
      name: formData.name,
      copyright: formData.copyright,
      photographer: formData.photographer,
      usageRights: formData.usageRights,
      expirationDate: formData.expirationDate,
      status: formData.status,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="asset-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div>
              <span className="font-mono text-xs text-[#C8A45D] font-bold block">
                {assetObj.folder} • {assetObj.fileType} ({assetObj.version})
              </span>
              <h2 id="asset-modal-title" className="font-editorial text-2xl font-normal">
                {assetObj.name}
              </h2>
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
            {/* Image Preview & Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#090909] p-3 rounded-[16px] border border-[#2A2A2A] flex items-center justify-center h-48">
                {assetObj.imageUrl ? (
                  <img src={assetObj.imageUrl} alt={assetObj.name} className="max-h-full object-contain rounded-[10px]" />
                ) : (
                  <FileText className="w-16 h-16 text-[#C8A45D]" />
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] space-y-1">
                  <span className="text-[10px] text-[#8E8A85] uppercase font-bold block">Technical Specs</span>
                  <p className="font-mono font-bold text-[#F8F6F3]">{assetObj.resolution}</p>
                  <p className="font-mono text-[#8E8A85]">Size: {assetObj.fileSize}</p>
                </div>

                <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] space-y-1">
                  <span className="text-[10px] text-[#8E8A85] uppercase font-bold block">Usage Metrics</span>
                  <p className="font-mono text-emerald-400 font-bold">Total Usage: {assetObj.usageCount} times</p>
                  <p className="text-[#8E8A85]">Products: {assetObj.usedInProducts?.join(", ") || "None"}</p>
                </div>
              </div>
            </div>

            {/* Copyright & Usage Rights Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Copyright Holder
                </label>
                <input
                  type="text"
                  value={formData.copyright}
                  onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Photographer Credit
                </label>
                <input
                  type="text"
                  value={formData.photographer}
                  onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Usage Rights Scope
                </label>
                <input
                  type="text"
                  value={formData.usageRights}
                  onChange={(e) => setFormData({ ...formData, usageRights: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  License Expiration Date
                </label>
                <input
                  type="text"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
                />
              </div>
            </div>

            {/* AI Tags Display */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                AI Generated Tags
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
                {assetObj.aiTags?.map((t, i) => (
                  <span key={i} className="text-xs font-mono text-[#C8A45D] px-2.5 py-0.5 bg-[#151515] border border-[#2A2A2A] rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
              <a
                href={assetObj.imageUrl || "#"}
                download
                className="px-4 py-2 bg-[#090909] hover:bg-[#2A2A2A] text-[#C8A45D] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 border border-[#2A2A2A]"
              >
                <Download className="w-4 h-4" /> Download WebP Variant
              </a>

              <div className="flex items-center gap-3">
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
                  <Save className="w-4 h-4" /> Save Metadata
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
