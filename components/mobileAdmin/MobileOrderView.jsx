"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Save,
  X,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function MobileOrderView({ orders, onUpdateOrder }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editStatus, setEditStatus] = useState("Processing");
  const [internalNoteText, setInternalNoteText] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false);

  const filteredOrders = orders.filter(
    (o) =>
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
      case "Processing":
        return "bg-blue-950/80 text-blue-400 border-blue-500/30";
      case "Pending":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Cancelled":
        return "bg-rose-950/80 text-rose-400 border-rose-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const handleOpenDetail = (ord) => {
    setSelectedOrder(ord);
    setEditStatus(ord.status);
    setInternalNoteText(ord.internalNotes || "");
  };

  const handleSaveOrderChanges = () => {
    if (!selectedOrder) return;
    onUpdateOrder({
      ...selectedOrder,
      status: editStatus,
      internalNotes: internalNoteText,
    });
    setSelectedOrder(null);
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
          placeholder="Search mobile order # or customer..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#151515] border border-[#2A2A2A] rounded-[14px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            onClick={() => handleOpenDetail(ord)}
            className="p-4 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[18px] space-y-2 cursor-pointer transition-colors shadow-md active:scale-98"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-sm font-bold text-[#C8A45D] block">
                  {ord.orderId}
                </span>
                <span className="text-xs font-semibold text-[#F8F6F3] block">
                  {ord.customerName}
                </span>
              </div>

              <div className="text-right">
                <span className="font-editorial text-base font-bold text-emerald-400 block">
                  ${ord.amount}
                </span>
                <span
                  className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(
                    ord.status
                  )}`}
                >
                  {ord.status}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between text-[11px] text-[#8E8A85]">
              <span>Time: <strong className="text-[#F8F6F3]">{ord.orderDate}</strong></span>
              <span className="text-[#C8A45D] font-bold flex items-center gap-1">
                Edit Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Drawer Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-[#151515] border border-[#2A2A2A] rounded-t-[28px] sm:rounded-[24px] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 text-[#F8F6F3]"
            >
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#C8A45D] font-bold block">
                    {selectedOrder.orderId}
                  </span>
                  <h3 className="font-editorial text-xl text-[#F8F6F3]">
                    {selectedOrder.customerName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 bg-[#090909] border border-[#2A2A2A] rounded-full text-[#8E8A85]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Update */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#8E8A85] uppercase">
                  Update Order Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-xs text-[#F8F6F3] outline-none cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Internal Notes */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#8E8A85] uppercase">
                  Add Internal Staff Notes
                </label>
                <textarea
                  rows="3"
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="Packaging preferences or tailoring adjustments..."
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] p-3 text-xs text-[#F8F6F3] outline-none resize-none"
                />
              </div>

              {/* Order Items */}
              <div className="space-y-2 pt-2 border-t border-[#2A2A2A]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C8A45D]">
                  Line Items ({selectedOrder.items?.length || 0})
                </span>
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="p-2.5 bg-[#090909] border border-[#2A2A2A] rounded-[10px] flex justify-between text-xs">
                    <span className="text-[#F8F6F3]">{it.name} (x{it.qty})</span>
                    <span className="font-bold text-emerald-400">${it.price}</span>
                  </div>
                ))}
              </div>

              {/* Print Receipt Placeholder Trigger */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="w-full py-2.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-[#C8A45D]" /> Print Receipt / Invoice
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-[#090909] text-[#8E8A85] rounded-[8px] text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOrderChanges}
                  className="px-5 py-2 bg-[#C8A45D] text-[#090909] rounded-[8px] text-xs font-bold uppercase flex items-center gap-1.5 font-bold"
                >
                  <Save className="w-4 h-4" /> Save Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Print Modal Placeholder */}
      <AnimatePresence>
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] max-w-sm w-full p-6 text-center space-y-4 text-[#F8F6F3]">
              <Printer className="w-12 h-12 text-[#C8A45D] mx-auto" />
              <h4 className="font-editorial text-xl">Print-Ready Packing Slip</h4>
              <p className="text-xs text-[#8E8A85]">
                Order receipt prepared for Bluetooth Thermal Printer or AirPrint wireless spooler.
              </p>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="w-full py-2 bg-[#C8A45D] text-[#090909] font-bold text-xs uppercase rounded-[8px]"
              >
                Close Print Spooler
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
