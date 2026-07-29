"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileSpreadsheet, FileText } from "lucide-react";

export default function SubscriptionExportModal({
  isOpen,
  onClose,
  onExportCSV,
  onExportExcel,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h2 id="export-modal-title" className="font-editorial text-2xl font-normal">
                  Export Subscription Data
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Download subscriber records, renewal dates, and MRR metrics.
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

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                onExportCSV();
                onClose();
              }}
              className="w-full p-4 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] border border-[#2A2A2A] rounded-[16px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#C8A45D] group-hover:text-[#090909]" />
                <div className="text-left">
                  <span className="block text-sm">Download CSV Data Sheet</span>
                  <span className="text-[11px] text-[#8E8A85] group-hover:text-[#090909]/80 font-normal">
                    Standard comma-separated subscriber export.
                  </span>
                </div>
              </div>
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                onExportExcel();
                onClose();
              }}
              className="w-full p-4 bg-[#090909] hover:bg-emerald-400 hover:text-[#090909] text-emerald-400 border border-[#2A2A2A] rounded-[16px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400 group-hover:text-[#090909]" />
                <div className="text-left">
                  <span className="block text-sm">Download Excel Workbook (.XLSX)</span>
                  <span className="text-[11px] text-[#8E8A85] group-hover:text-[#090909]/80 font-normal">
                    Formatted Microsoft Excel XML spreadsheet.
                  </span>
                </div>
              </div>
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#090909] hover:bg-[#2A2A2A] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[8px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
