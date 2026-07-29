"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, ShoppingBag, Plus, Sparkles, HardDrive, Settings, Truck, ArrowRight } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

export default function CommandPalette() {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setIsQuickCreateOpen } = useAdmin();
  const [query, setQuery] = useState("");
  const router = useRouter();

  if (!isCommandPaletteOpen) return null;

  const actions = [
    { label: "Create Product SKU", icon: Plus, action: () => { setIsCommandPaletteOpen(false); setIsQuickCreateOpen(true); } },
    { label: "View Executive Dashboard", icon: Package, href: "/admin" },
    { label: "Open Products Catalog Workspace", icon: Package, href: "/admin/products" },
    { label: "Open Shipping Rules Settings", icon: Truck, href: "/admin/settings/shipping" },
    { label: "Open Orders & Fulfillment", icon: ShoppingBag, href: "/orders" },
    { label: "Open AI Operations & Co-Pilot", icon: Sparkles, href: "/admin/ai-ops" },
    { label: "Open Digital Asset Management (DAM)", icon: HardDrive, href: "/admin/dam" },
    { label: "Open Concierge CX Platform", icon: Settings, href: "/admin/cx" },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    setIsCommandPaletteOpen(false);
    if (item.action) item.action();
    else if (item.href) router.push(item.href);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-title"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-[#121212] border border-[#2A2A2A] rounded-[24px] max-w-xl w-full p-4 shadow-2xl space-y-4 text-[#F8F6F3]"
        >
          {/* Input Header */}
          <div className="relative border-b border-[#2A2A2A] pb-3 flex items-center gap-3">
            <Search className="w-5 h-5 text-[#C8A45D]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search (e.g. Create, Orders, DAM)..."
              autoFocus
              className="w-full bg-transparent text-sm text-[#F8F6F3] outline-none placeholder:text-[#8E8A85]"
            />
            <kbd className="text-[10px] font-mono text-[#8E8A85] bg-[#090909] px-2 py-0.5 border border-[#2A2A2A] rounded font-bold">
              ESC to close
            </kbd>
          </div>

          {/* Results List */}
          <div className="space-y-1 max-h-80 overflow-y-auto scrollbar-none">
            {filtered.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full p-3 rounded-[12px] bg-[#090909] hover:bg-[#2563EB]/20 border border-[#2A2A2A] hover:border-[#2563EB]/50 transition-colors flex items-center justify-between text-xs text-[#F8F6F3] cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#151515] flex items-center justify-center text-[#C8A45D] group-hover:text-[#3B82F6]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8E8A85] group-hover:text-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
