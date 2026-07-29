"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, Layers, Save, ArrowRightLeft, AlertTriangle } from "lucide-react";

export default function StockAdjustmentModal({
  isOpen,
  onClose,
  onSave,
  item,
  warehouses,
}) {
  const [adjustmentType, setAdjustmentType] = useState("Manual Adjustment");
  const [quantity, setQuantity] = useState(1);
  const [targetWarehouseId, setTargetWarehouseId] = useState("");
  const [reason, setReason] = useState("Physical Audit Discrepancy");
  const [notes, setNotes] = useState("");
  const [referenceNo, setReferenceNo] = useState("");

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setAdjustmentType("Manual Adjustment");
      setReason("Physical Audit Discrepancy");
      setNotes("");
      setReferenceNo(`ADJ-${Math.floor(1000 + Math.random() * 9000)}`);
      if (warehouses && warehouses.length > 0) {
        const otherWh = warehouses.find((w) => w.id !== item.warehouseId);
        setTargetWarehouseId(otherWh ? otherWh.id : warehouses[0].id);
      }
    }
  }, [item, warehouses, isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetWh = warehouses.find((w) => w.id === targetWarehouseId);

    const movementPayload = {
      id: `mov-${Date.now()}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      sku: item.sku,
      productName: item.productName,
      type: adjustmentType,
      quantity: Number(quantity),
      fromWarehouse: item.warehouseName,
      toWarehouse:
        adjustmentType === "Stock Transfer"
          ? targetWh
            ? targetWh.name
            : "External Location"
          : adjustmentType === "Damage Report"
          ? "Quarantine Bin"
          : "System Stock",
      performedBy: "Current Administrator",
      referenceNo: referenceNo || `REF-${Date.now()}`,
      reason: reason,
      notes: notes,
    };

    onSave({ itemId: item.id, movementPayload, adjustmentType, quantity: Number(quantity), targetWarehouseId });
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-adjustment-title"
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
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h2 id="stock-adjustment-title" className="font-editorial text-2xl font-normal">
                  Adjust Inventory Level
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Log stock movement, transfer between hubs, or report damages.
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

          {/* Item Context */}
          <div className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px]">
            <span className="text-[10px] text-[#C8A45D] uppercase tracking-wider font-mono font-bold block">
              {item.sku}
            </span>
            <span className="font-semibold text-sm block text-[#F8F6F3]">{item.productName}</span>
            <span className="text-xs text-[#8E8A85] block mt-0.5">
              Current Location: <strong className="text-[#F8F6F3]">{item.warehouseName}</strong> ({item.locationBin})
            </span>
            <div className="flex items-center gap-4 text-xs mt-2 pt-2 border-t border-[#2A2A2A]">
              <span>Current Stock: <strong className="text-[#F8F6F3]">{item.currentStock}</strong></span>
              <span>Available: <strong className="text-emerald-400">{item.availableStock}</strong></span>
              <span>Damaged: <strong className="text-rose-400">{item.damagedStock}</strong></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Movement Type */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Adjustment Type *
              </label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
              >
                <option value="Manual Adjustment">Manual Adjustment (+ / -)</option>
                <option value="Stock In">Stock In (+ Increase)</option>
                <option value="Stock Out">Stock Out (- Decrease)</option>
                <option value="Stock Transfer">Stock Transfer (Between Warehouses)</option>
                <option value="Return Stock">Return Stock (+ Restock)</option>
                <option value="Damage Report">Damage Report (Move to Damaged Bin)</option>
              </select>
            </div>

            {/* Target Warehouse (If Transfer) */}
            {adjustmentType === "Stock Transfer" && (
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Destination Warehouse *
                </label>
                <select
                  value={targetWarehouseId}
                  onChange={(e) => setTargetWarehouseId(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  {warehouses
                    .filter((w) => w.id !== item.warehouseId)
                    .map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.name} ({wh.code})
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Quantity Units *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-bold text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Reference No.
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g. ADJ-901"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-mono text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Reason Code
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
              >
                <option value="Physical Audit Discrepancy">Physical Audit Discrepancy</option>
                <option value="Purchase Order Fulfillment">Purchase Order Fulfillment</option>
                <option value="Customer Return Restock">Customer Return Restock</option>
                <option value="Transit Damage">Transit Damage</option>
                <option value="Atelier Showcase Display">Atelier Showcase Display</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Movement Notes
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log additional audit details..."
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] p-3 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none resize-none"
              />
            </div>

            {/* Submit */}
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
                className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" /> Confirm Movement
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
