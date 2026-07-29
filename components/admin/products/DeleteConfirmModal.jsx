"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";

export default function DeleteConfirmModal({ isOpen, product, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Scale Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-[24px] p-8 shadow-2xl"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-[16px] bg-rose-950/60 border border-rose-500/30 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7 text-rose-400" />
            </div>

            {/* Title */}
            <h2 className="font-editorial text-2xl text-[#F8F6F3] text-center mb-2">
              Delete Product?
            </h2>

            <p className="text-sm text-[#8E8A85] text-center mb-2 leading-relaxed">
              You are about to permanently delete:
            </p>
            <p className="text-sm font-semibold text-[#F8F6F3] text-center mb-1">
              {product.name}
            </p>
            <p className="text-[11px] font-mono text-[#C8A45D] text-center mb-6">
              SKU: {product.sku}
            </p>

            <p className="text-xs text-rose-400/80 text-center mb-8 leading-relaxed">
              This action cannot be undone. The product will be removed from the
              catalog and the storefront immediately.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[12px] text-sm font-bold border border-[#2A2A2A] transition-colors cursor-pointer"
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onConfirm}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-[12px] text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
                Delete Permanently
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
