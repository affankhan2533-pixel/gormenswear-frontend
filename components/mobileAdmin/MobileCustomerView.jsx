"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Mail, Phone, Tag, Clock, ChevronRight, X, UserCheck } from "lucide-react";

export default function MobileCustomerView({ customers, onSaveCustomerNote }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newNote, setNewNote] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDetail = (cust) => {
    setSelectedCustomer(cust);
    setNewNote(cust.notes || "");
  };

  const handleSaveNotes = () => {
    if (!selectedCustomer) return;
    onSaveCustomerNote(selectedCustomer.id, newNote);
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8E8A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customer name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#151515] border border-[#2A2A2A] rounded-[14px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
        />
      </div>

      {/* Customer Cards */}
      <div className="space-y-3">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            onClick={() => handleOpenDetail(cust)}
            className="p-4 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[18px] space-y-2 cursor-pointer transition-colors shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-lg text-[#F8F6F3]">
                  {cust.name}
                </h3>
                <span className="text-xs text-[#8E8A85] block">{cust.email}</span>
              </div>
              <span className="font-editorial text-base font-bold text-emerald-400">
                {cust.lifetimeSpend}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#2A2A2A]">
              {cust.tags?.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Customer Detail Drawer Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-[#151515] border border-[#2A2A2A] rounded-t-[28px] sm:rounded-[24px] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 text-[#F8F6F3]"
            >
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <div>
                  <h3 className="font-editorial text-2xl text-[#F8F6F3]">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-[#8E8A85]">
                    {selectedCustomer.email} • {selectedCustomer.phone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 bg-[#090909] border border-[#2A2A2A] rounded-full text-[#8E8A85]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
                  <span className="text-[#8E8A85] block font-bold uppercase">Lifetime Spend</span>
                  <span className="font-editorial text-xl font-bold text-emerald-400">
                    {selectedCustomer.lifetimeSpend}
                  </span>
                </div>
                <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
                  <span className="text-[#8E8A85] block font-bold uppercase">Orders Count</span>
                  <span className="font-editorial text-xl font-bold text-[#F8F6F3]">
                    {selectedCustomer.totalOrders} Orders
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  VIP Concierge Notes
                </label>
                <textarea
                  rows="3"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] p-3 text-xs text-[#F8F6F3] outline-none resize-none"
                />
              </div>

              {/* Order History Timeline */}
              <div className="space-y-2 pt-2 border-t border-[#2A2A2A]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C8A45D]">
                  Order History Timeline
                </span>
                {selectedCustomer.orderHistory?.map((oh, idx) => (
                  <div key={idx} className="p-2.5 bg-[#090909] border border-[#2A2A2A] rounded-[10px] flex justify-between text-xs font-mono">
                    <span className="text-[#C8A45D]">{oh.id} ({oh.date})</span>
                    <span className="font-bold text-emerald-400">${oh.total}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 bg-[#090909] text-[#8E8A85] rounded-[8px] text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-5 py-2 bg-[#C8A45D] text-[#090909] rounded-[8px] text-xs font-bold uppercase font-bold"
                >
                  Save Notes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
