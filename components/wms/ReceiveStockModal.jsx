"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PackageCheck, CheckCircle2, Save, Layers } from "lucide-react";

export default function ReceiveStockModal({ isOpen, onClose, onReceive, po }) {
  const [receiveQtyMap, setReceiveQtyMap] = useState({});
  const [batchNo, setBatchNo] = useState(`B-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`);
  const [receiverName, setReceiverName] = useState("Warehouse Inspector");

  if (!isOpen || !po) return null;

  const handleQtyChange = (sku, val) => {
    setReceiveQtyMap((prev) => ({
      ...prev,
      [sku]: Math.max(0, Number(val)),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onReceive({
      poId: po.id,
      receiveQtyMap,
      batchNo,
      receiverName,
      date: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="receive-stock-title"
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
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 id="receive-stock-title" className="font-editorial text-2xl font-normal">
                  Receive Inventory ({po.poNumber})
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Log received shipment batch into <strong className="text-[#F8F6F3]">{po.destinationWarehouseName}</strong>.
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Batch & Receiver */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Quality Audit Batch No.
                </label>
                <input
                  type="text"
                  required
                  value={batchNo}
                  onChange={(e) => setBatchNo(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2 text-sm font-mono text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Received By
                </label>
                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Line Items to Receive */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C8A45D]">
                Receive Line Items
              </label>

              {po.items.map((item) => {
                const remaining = item.orderQty - item.receivedQty;
                return (
                  <div
                    key={item.sku}
                    className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="font-semibold text-sm block text-[#F8F6F3]">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#C8A45D] block">
                        {item.sku}
                      </span>
                      <span className="text-xs text-[#8E8A85] block mt-0.5">
                        Ordered: {item.orderQty} | Previously Received: {item.receivedQty} | Remaining:{" "}
                        <strong className="text-amber-400">{remaining}</strong>
                      </span>
                    </div>

                    <div className="w-28 text-right shrink-0">
                      <label className="block text-[10px] text-[#8E8A85] uppercase mb-1">
                        Receive Qty
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={remaining > 0 ? remaining : 999}
                        placeholder={String(remaining)}
                        value={receiveQtyMap[item.sku] ?? remaining}
                        onChange={(e) => handleQtyChange(item.sku, e.target.value)}
                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-[8px] px-3 py-1.5 text-center text-sm font-bold text-[#F8F6F3] focus:border-emerald-400 outline-none"
                      />
                    </div>
                  </div>
                );
              })}
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
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Inventory Receipt
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
