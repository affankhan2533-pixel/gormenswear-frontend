"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Package, ShoppingBag, Users, Layers, Tag, Zap } from "lucide-react";

export default function MobileQuickActionsGrid({ isOpen, onClose, onExecuteAction }) {
  if (!isOpen) return null;

  const actions = [
    { id: "add-prod", label: "Add Product", desc: "Create new catalog SKU", icon: Plus, color: "text-[#C8A45D]" },
    { id: "update-inv", label: "Update Inventory", desc: "Adjust stock levels", icon: Package, color: "text-emerald-400" },
    { id: "view-orders", label: "View Orders", desc: "Manage & fulfill orders", icon: ShoppingBag, color: "text-blue-400" },
    { id: "manage-cust", label: "Manage Customers", desc: "VIP accounts & notes", icon: Users, color: "text-purple-400" },
    { id: "pub-coll", label: "Publish Collection", desc: "Launch new lookbook drop", icon: Layers, color: "text-pink-400" },
    { id: "create-promo", label: "Create Promotion", desc: "Issue member discount", icon: Tag, color: "text-amber-400" },
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-actions-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-t-[28px] sm:rounded-[24px] max-w-md w-full p-6 shadow-2xl space-y-5 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <Zap className="w-4 h-4" />
              </div>
              <h3 id="quick-actions-title" className="font-editorial text-xl text-[#F8F6F3]">
                Quick Administrative Actions
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-[#090909] border border-[#2A2A2A] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            {actions.map((act) => {
              const IconComp = act.icon;
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => {
                    onExecuteAction(act.id);
                    onClose();
                  }}
                  className="p-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[16px] text-left space-y-1.5 transition-all active:scale-95 cursor-pointer group"
                >
                  <IconComp className={`w-6 h-6 ${act.color}`} />
                  <span className="text-xs font-bold text-[#F8F6F3] block group-hover:text-[#C8A45D] transition-colors">
                    {act.label}
                  </span>
                  <span className="text-[10px] text-[#8E8A85] block">{act.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-[#090909] border border-[#2A2A2A] rounded-[12px] text-xs font-bold uppercase tracking-wider text-[#8E8A85]"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
