"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Package,
  ShoppingBag,
  DollarSign,
  Star,
  Plus,
  RefreshCw,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Edit2,
  Save,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function VendorPortalView({
  vendor,
  products = [],
  orders = [],
  onBackToDirectory,
  onUpdateInventory,
}) {
  const [activePortalTab, setActivePortalTab] = useState("products"); // products, orders, sales, profile
  const [editingStockId, setEditingStockId] = useState(null);
  const [tempStockValue, setTempStockValue] = useState(0);

  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);
  const vendorOrders = orders.filter((o) => o.vendorId === vendor.id);
  const totalVendorRevenue = vendorOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalNetPayouts = vendorOrders.reduce((sum, o) => sum + o.netVendorPayout, 0);

  const handleStockSave = (productId) => {
    onUpdateInventory(productId, Number(tempStockValue));
    setEditingStockId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToDirectory}
            className="p-2 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded">
                VENDOR SELF-SERVICE PORTAL
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                {vendor.verificationStatus}
              </span>
            </div>
            <h2 className="font-editorial text-3xl text-[#F8F6F3]">
              {vendor.companyName} Workspace
            </h2>
            <p className="text-xs text-[#8E8A85]">
              Contact: {vendor.contactPerson} ({vendor.email}) • Commission Rate: {vendor.commissionRate}%
            </p>
          </div>
        </div>

        {/* Quick Portal Tabs */}
        <div className="flex items-center gap-2 bg-[#090909] p-1.5 rounded-[14px] border border-[#2A2A2A]">
          {[
            { id: "products", label: `Catalog (${vendorProducts.length})` },
            { id: "orders", label: `Orders (${vendorOrders.length})` },
            { id: "sales", label: "Sales & Payouts" },
            { id: "profile", label: "Store Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePortalTab(tab.id)}
              className={`px-3.5 py-2 rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activePortalTab === tab.id
                  ? "bg-[#C8A45D] text-[#090909]"
                  : "text-[#8E8A85] hover:text-[#F8F6F3]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── PORTAL TAB 1: CATALOG & INVENTORY ── */}
      {activePortalTab === "products" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl text-[#F8F6F3]">
              Vendor Managed Products & Inventory
            </h3>
            <span className="text-xs text-[#8E8A85]">
              Real-time inventory sync & approval state
            </span>
          </div>

          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
                <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
                  <tr>
                    <th className="py-4 px-4">SKU / Product Name</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4 text-center">Retail Price</th>
                    <th className="py-4 px-4 text-center">Stock Level</th>
                    <th className="py-4 px-4 text-center">Approval Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {vendorProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-[#8E8A85]">
                        No catalog items listed under this vendor profile.
                      </td>
                    </tr>
                  ) : (
                    vendorProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                        <td className="py-4 px-4">
                          <span className="font-semibold text-[#F8F6F3] text-sm block">
                            {p.productName}
                          </span>
                          <span className="text-[10px] font-mono text-[#C8A45D]">{p.sku}</span>
                        </td>

                        <td className="py-4 px-4 text-[#F8F6F3]">{p.category}</td>

                        <td className="py-4 px-4 text-center font-editorial text-base font-bold text-[#F8F6F3]">
                          ${p.price}
                        </td>

                        <td className="py-4 px-4 text-center">
                          {editingStockId === p.id ? (
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                value={tempStockValue}
                                onChange={(e) => setTempStockValue(e.target.value)}
                                className="w-16 bg-[#090909] border border-[#C8A45D] text-center text-xs font-bold text-[#F8F6F3] rounded px-1 py-1"
                              />
                              <button
                                type="button"
                                onClick={() => handleStockSave(p.id)}
                                className="p-1 bg-[#C8A45D] text-[#090909] rounded"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono text-sm font-bold text-emerald-400">
                              {p.stockLevel} units
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                              p.approvalStatus === "Approved"
                                ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                                : p.approvalStatus === "Pending Review"
                                ? "bg-amber-950/80 text-amber-400 border-amber-500/30"
                                : "bg-rose-950/80 text-rose-400 border-rose-500/30"
                            }`}
                          >
                            {p.approvalStatus}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStockId(p.id);
                              setTempStockValue(p.stockLevel);
                            }}
                            className="px-2.5 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── PORTAL TAB 2: VENDOR ORDERS ── */}
      {activePortalTab === "orders" && (
        <div className="space-y-4">
          <h3 className="font-editorial text-2xl text-[#F8F6F3]">
            Vendor Orders & Fulfillment Tracking
          </h3>

          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
                <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
                  <tr>
                    <th className="py-4 px-4">Order ID & Date</th>
                    <th className="py-4 px-4">Customer</th>
                    <th className="py-4 px-4 text-center">Gross Order Amount</th>
                    <th className="py-4 px-4 text-center">Platform Fee ({vendor.commissionRate}%)</th>
                    <th className="py-4 px-4 text-center">Net Vendor Payout</th>
                    <th className="py-4 px-4 text-center">Fulfillment Status</th>
                    <th className="py-4 px-4 text-center">Shipment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {vendorOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-[#8E8A85]">
                        No orders recorded for this vendor yet.
                      </td>
                    </tr>
                  ) : (
                    vendorOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                        <td className="py-4 px-4">
                          <span className="font-mono text-[#C8A45D] font-bold text-sm block">
                            {o.orderId}
                          </span>
                          <span className="text-[10px] text-[#8E8A85]">{o.orderDate}</span>
                        </td>

                        <td className="py-4 px-4 font-semibold text-[#F8F6F3]">
                          {o.customerName}
                        </td>

                        <td className="py-4 px-4 text-center font-editorial text-base font-bold text-[#F8F6F3]">
                          ${o.totalAmount}
                        </td>

                        <td className="py-4 px-4 text-center font-mono text-rose-400">
                          -${o.commissionAmount}
                        </td>

                        <td className="py-4 px-4 text-center font-editorial text-base font-bold text-emerald-400">
                          ${o.netVendorPayout}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-[#090909] text-[#F8F6F3] border border-[#2A2A2A] rounded-full">
                            {o.fulfillmentStatus}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-blue-950/80 text-blue-400 border border-blue-500/30 rounded-full">
                            {o.shipmentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── PORTAL TAB 3: SALES & PAYOUTS ── */}
      {activePortalTab === "sales" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
                Gross Vendor Sales
              </span>
              <div className="font-editorial text-3xl font-bold text-[#F8F6F3]">
                ${totalVendorRevenue.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
                Commission Rate
              </span>
              <div className="font-editorial text-3xl font-bold text-[#C8A45D]">
                {vendor.commissionRate}%
              </div>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
                Net Vendor Payouts
              </span>
              <div className="font-editorial text-3xl font-bold text-emerald-400">
                ${totalNetPayouts.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PORTAL TAB 4: STORE PROFILE ── */}
      {activePortalTab === "profile" && (
        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] space-y-4">
          <h3 className="font-editorial text-2xl text-[#F8F6F3]">
            Vendor Store Profile & Settings
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
              <span className="text-[#8E8A85] block font-bold uppercase">Store Description</span>
              <p className="text-[#F8F6F3] mt-1">{vendor.storeProfile?.description}</p>
            </div>
            <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
              <span className="text-[#8E8A85] block font-bold uppercase">Return & Refund Policy</span>
              <p className="text-[#F8F6F3] mt-1">{vendor.storeProfile?.returnPolicy}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
