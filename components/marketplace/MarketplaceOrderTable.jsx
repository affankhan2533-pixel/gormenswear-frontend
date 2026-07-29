"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function MarketplaceOrderTable({ orders, onUpdateFulfillment }) {
  return (
    <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
          <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
            <tr>
              <th className="py-4 px-4">Order ID & Date</th>
              <th className="py-4 px-4">Marketplace Vendor</th>
              <th className="py-4 px-4">Customer Name</th>
              <th className="py-4 px-4 text-center">Gross Order Amount</th>
              <th className="py-4 px-4 text-center">Platform Fee</th>
              <th className="py-4 px-4 text-center">Net Vendor Payout</th>
              <th className="py-4 px-4 text-center">Fulfillment Status</th>
              <th className="py-4 px-4 text-center">Shipment Status</th>
              <th className="py-4 px-4 text-center">Return Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                <td className="py-4 px-4">
                  <span className="font-mono text-[#C8A45D] font-bold text-sm block">
                    {o.orderId}
                  </span>
                  <span className="text-[10px] text-[#8E8A85]">{o.orderDate}</span>
                </td>

                <td className="py-4 px-4 font-semibold text-[#F8F6F3]">
                  {o.vendorName}
                </td>

                <td className="py-4 px-4 text-[#F8F6F3]">
                  {o.customerName}
                </td>

                <td className="py-4 px-4 text-center font-editorial text-base font-bold text-[#F8F6F3]">
                  ${o.totalAmount}
                </td>

                <td className="py-4 px-4 text-center font-mono text-xs text-rose-400">
                  -${o.commissionAmount}
                </td>

                <td className="py-4 px-4 text-center font-editorial text-base font-bold text-emerald-400">
                  ${o.netVendorPayout}
                </td>

                <td className="py-4 px-4 text-center">
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      o.fulfillmentStatus === "Fulfilled"
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {o.fulfillmentStatus}
                  </span>
                </td>

                <td className="py-4 px-4 text-center">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-blue-950/80 text-blue-400 border border-blue-500/30 rounded-full">
                    {o.shipmentStatus}
                  </span>
                </td>

                <td className="py-4 px-4 text-center">
                  {o.returnRequest ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-950/80 text-rose-400 border border-rose-500/30 rounded-full flex items-center justify-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Return Requested
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#8E8A85]">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
