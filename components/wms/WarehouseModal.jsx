"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, MapPin, User, Mail, Phone, Layers, Save, AlertTriangle } from "lucide-react";

export default function WarehouseModal({ isOpen, onClose, onSave, warehouse = null }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "Active",
    type: "Primary Fulfillment",
    managerName: "",
    managerEmail: "",
    managerPhone: "",
    street: "",
    city: "",
    region: "",
    country: "",
    zip: "",
    capacitySqFt: 25000,
    totalBins: 800,
    spaceUtilization: 50,
  });

  const modalRef = useRef(null);

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name || "",
        code: warehouse.code || "",
        status: warehouse.status || "Active",
        type: warehouse.type || "Primary Fulfillment",
        managerName: warehouse.manager?.name || "",
        managerEmail: warehouse.manager?.email || "",
        managerPhone: warehouse.manager?.phone || "",
        street: warehouse.address?.street || "",
        city: warehouse.address?.city || "",
        region: warehouse.address?.region || "",
        country: warehouse.address?.country || "",
        zip: warehouse.address?.zip || "",
        capacitySqFt: warehouse.capacitySqFt || 25000,
        totalBins: warehouse.totalBins || 800,
        spaceUtilization: warehouse.spaceUtilization || 50,
      });
    } else {
      setFormData({
        name: "",
        code: `WH-${Math.floor(100 + Math.random() * 900)}`,
        status: "Active",
        type: "Primary Fulfillment",
        managerName: "",
        managerEmail: "",
        managerPhone: "",
        street: "",
        city: "",
        region: "",
        country: "Italy",
        zip: "",
        capacitySqFt: 30000,
        totalBins: 850,
        spaceUtilization: 45,
      });
    }
  }, [warehouse, isOpen]);

  // Trap focus and handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: warehouse ? warehouse.id : `wh-${Date.now()}`,
      name: formData.name,
      code: formData.code,
      status: formData.status,
      type: formData.type,
      manager: {
        name: formData.managerName,
        email: formData.managerEmail,
        phone: formData.managerPhone,
      },
      address: {
        street: formData.street,
        city: formData.city,
        region: formData.region,
        country: formData.country,
        zip: formData.zip,
      },
      capacitySqFt: Number(formData.capacitySqFt),
      totalBins: Number(formData.totalBins),
      spaceUtilization: Number(formData.spaceUtilization),
      stockCount: warehouse ? warehouse.stockCount : 0,
      reservedCount: warehouse ? warehouse.reservedCount : 0,
      incomingCount: warehouse ? warehouse.incomingCount : 0,
      lastAudit: warehouse ? warehouse.lastAudit : new Date().toISOString().split("T")[0],
    };
    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-[#0000] z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="warehouse-modal-title"
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 id="warehouse-modal-title" className="font-editorial text-2xl font-normal">
                  {warehouse ? "Edit Warehouse Profile" : "Create New Warehouse"}
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Configure logistics hub parameters, address, and manager assignments.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
                <Building2 className="w-4 h-4" /> General Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Warehouse Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Milan Central Logistics"
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Warehouse Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. MIL-ATL-01"
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm font-mono text-[#F8F6F3] focus:border-[#C8A45D] outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                    Logistics Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                  >
                    <option value="Primary Fulfillment">Primary Fulfillment</option>
                    <option value="Regional Hub & Storefront">Regional Hub & Storefront</option>
                    <option value="North America Hub">North America Hub</option>
                    <option value="APAC Regional Depot">APAC Regional Depot</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address & Location
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Street Address (e.g. Via Montenapoleone 18)"
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Region / State"
                    className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Country"
                    className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    placeholder="Postal Code"
                    className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Warehouse Manager */}
            <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
                <User className="w-4 h-4" /> Assigned Warehouse Manager
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  placeholder="Manager Full Name"
                  className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
                <input
                  type="email"
                  required
                  value={formData.managerEmail}
                  onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                  placeholder="Manager Email"
                  className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
                <input
                  type="tel"
                  value={formData.managerPhone}
                  onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                  placeholder="Phone Number"
                  className="bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                />
              </div>
            </div>

            {/* Capacities */}
            <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-2">
                <Layers className="w-4 h-4" /> Capacity & Metrics
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#8E8A85] mb-1">Capacity (Sq Ft)</label>
                  <input
                    type="number"
                    value={formData.capacitySqFt}
                    onChange={(e) => setFormData({ ...formData, capacitySqFt: e.target.value })}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8E8A85] mb-1">Total Storage Bins</label>
                  <input
                    type="number"
                    value={formData.totalBins}
                    onChange={(e) => setFormData({ ...formData, totalBins: e.target.value })}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8E8A85] mb-1">Utilization %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.spaceUtilization}
                    onChange={(e) => setFormData({ ...formData, spaceUtilization: e.target.value })}
                    className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
                  />
                </div>
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
                <Save className="w-4 h-4" /> Save Warehouse
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
