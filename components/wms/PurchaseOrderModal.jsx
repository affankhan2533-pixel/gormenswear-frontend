"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileSpreadsheet, Plus, Trash2, Save, Calendar, Building2, UserCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function PurchaseOrderModal({
  isOpen,
  onClose,
  onSave,
  po = null,
  suppliers,
  warehouses,
  inventory,
  prefilledItem = null,
}) {
  const [supplierId, setSupplierId] = useState("");
  const [destinationWarehouseId, setDestinationWarehouseId] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Issued");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (po) {
      setSupplierId(po.supplierId || (suppliers[0] ? suppliers[0].id : ""));
      setDestinationWarehouseId(po.destinationWarehouseId || (warehouses[0] ? warehouses[0].id : ""));
      setExpectedDate(po.expectedDate || "");
      setNotes(po.notes || "");
      setStatus(po.status || "Issued");
      setItems(po.items ? [...po.items] : []);
    } else {
      setSupplierId(suppliers[0] ? suppliers[0].id : "");
      setDestinationWarehouseId(warehouses[0] ? warehouses[0].id : "");
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);
      setExpectedDate(futureDate.toISOString().split("T")[0]);
      
      setNotes("");
      setStatus("Issued");

      if (prefilledItem) {
        setItems([
          {
            sku: prefilledItem.sku,
            name: prefilledItem.productName,
            orderQty: prefilledItem.reorderPoint || 50,
            receivedQty: 0,
            unitCost: prefilledItem.unitCost || 100,
          },
        ]);
      } else if (inventory && inventory.length > 0) {
        setItems([
          {
            sku: inventory[0].sku,
            name: inventory[0].productName,
            orderQty: 50,
            receivedQty: 0,
            unitCost: inventory[0].unitCost,
          },
        ]);
      } else {
        setItems([]);
      }
    }
  }, [po, suppliers, warehouses, inventory, prefilledItem, isOpen]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const selectedSKU = inventory[0] ? inventory[0].sku : "GOR-SKU-001";
    const selectedObj = inventory.find((i) => i.sku === selectedSKU);
    setItems([
      ...items,
      {
        sku: selectedSKU,
        name: selectedObj ? selectedObj.productName : "Custom Item",
        orderQty: 20,
        receivedQty: 0,
        unitCost: selectedObj ? selectedObj.unitCost : 100,
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    if (field === "sku") {
      const matched = inventory.find((i) => i.sku === value);
      updated[index].sku = value;
      if (matched) {
        updated[index].name = matched.productName;
        updated[index].unitCost = matched.unitCost;
      }
    } else {
      updated[index][field] = field === "orderQty" || field === "unitCost" ? Number(value) : value;
    }
    setItems(updated);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.orderQty * item.unitCost, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selSup = suppliers.find((s) => s.id === supplierId);
    const selWh = warehouses.find((w) => w.id === destinationWarehouseId);

    const payload = {
      id: po ? po.id : `po-${Date.now()}`,
      poNumber: po ? po.poNumber : `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierId,
      supplierName: selSup ? selSup.name : "Assigned Supplier",
      destinationWarehouseId,
      destinationWarehouseName: selWh ? selWh.name : "Destination Hub",
      expectedDate,
      status,
      totalAmount: calculateTotal(),
      createdAt: po ? po.createdAt : new Date().toISOString().split("T")[0],
      notes,
      items,
      receivingLogs: po ? po.receivingLogs : [],
    };

    onSave(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="po-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h2 id="po-modal-title" className="font-editorial text-2xl font-normal">
                  {po ? `Edit Purchase Order (${po.poNumber})` : "Create Purchase Order"}
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Issue restocking orders to certified mill suppliers and track fulfillment.
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
            {/* Header Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Supplier *
                </label>
                <select
                  required
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Destination Warehouse *
                </label>
                <select
                  required
                  value={destinationWarehouseId}
                  onChange={(e) => setDestinationWarehouseId(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Expected Delivery Date *
                </label>
                <input
                  type="date"
                  required
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Status & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  PO Order Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="Draft">Draft</option>
                  <option value="Issued">Issued</option>
                  <option value="Receiving">Receiving</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Order Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special weave instructions or batch requirements..."
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3 pt-4 border-t border-[#2A2A2A]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D]">
                  Purchase Order Line Items ({items.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-xs font-bold rounded-[8px] border border-[#2A2A2A] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add SKU Line
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] text-[#8E8A85] uppercase mb-0.5">
                        Select SKU
                      </label>
                      <select
                        value={item.sku}
                        onChange={(e) => handleItemChange(idx, "sku", e.target.value)}
                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-[8px] px-2.5 py-1.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                      >
                        {inventory.map((inv) => (
                          <option key={inv.id} value={inv.sku}>
                            {inv.sku} - {inv.productName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-[#8E8A85] uppercase mb-0.5">
                        Order Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.orderQty}
                        onChange={(e) => handleItemChange(idx, "orderQty", e.target.value)}
                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-[8px] px-2.5 py-1.5 text-xs font-bold text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-[#8E8A85] uppercase mb-0.5">
                        Unit Cost ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.unitCost}
                        onChange={(e) => handleItemChange(idx, "unitCost", e.target.value)}
                        className="w-full bg-[#151515] border border-[#2A2A2A] rounded-[8px] px-2.5 py-1.5 text-xs font-bold text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-1 text-right pt-4 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        aria-label="Remove item"
                        className="p-2 text-[#8E8A85] hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between mt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E8A85]">
                  Estimated Purchase Total
                </span>
                <span className="font-editorial text-2xl font-bold text-[#C8A45D]">
                  ${calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#2A2A2A]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" /> Save Purchase Order
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
