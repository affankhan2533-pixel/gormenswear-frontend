"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Package, ShoppingBag, Users, Layers, Save } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

export default function QuickCreateModal() {
  const { isQuickCreateOpen, setIsQuickCreateOpen } = useAdmin();
  const [resourceType, setResourceType] = useState("Product");
  const [title, setTitle] = useState("");

  if (!isQuickCreateOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsQuickCreateOpen(false);
    setTitle("");
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-create-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#121212] border border-[#2A2A2A] rounded-[24px] max-w-md w-full p-6 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#C8A45D]" />
              <h2 id="quick-create-title" className="font-editorial text-2xl font-normal">
                Global Quick Create
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsQuickCreateOpen(false)}
              className="p-1.5 bg-[#090909] border border-[#2A2A2A] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Resource Type Switcher */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Resource Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Product", "Order", "Customer", "Collection"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setResourceType(t)}
                    className={`py-2 px-3 rounded-[10px] text-xs font-bold uppercase border transition-colors ${
                      resourceType === t
                        ? "bg-[#C8A45D] text-[#090909] border-[#C8A45D]"
                        : "bg-[#090909] text-[#8E8A85] border-[#2A2A2A]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Title / Name Field */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                {resourceType} Name / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Enter new ${resourceType.toLowerCase()} title...`}
                required
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
              <button
                type="button"
                onClick={() => setIsQuickCreateOpen(false)}
                className="px-4 py-2 bg-[#090909] text-[#8E8A85] rounded-[10px] text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#C8A45D] text-[#090909] rounded-[10px] text-xs font-bold uppercase flex items-center gap-1.5 font-bold"
              >
                <Save className="w-4 h-4" /> Create {resourceType}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
