"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, RotateCcw, Calendar, CreditCard, CheckCircle2, PauseCircle, XCircle, Eye, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CustomerSubscriptionTable({
  subscriptions,
  onViewSubscriber,
  onToggleStatus,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch =
        sub.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.subscriberCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.planName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
      const matchesTier = tierFilter === "all" || sub.tier === tierFilter;

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [subscriptions, searchQuery, statusFilter, tierFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
      case "Paused":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Cancelled":
      case "Expired":
        return "bg-rose-950/80 text-rose-400 border-rose-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#8E8A85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Subscriber, Email, or Plan..."
            className="w-full pl-9 pr-4 py-2 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3] text-xs font-semibold rounded-[10px] px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3] text-xs font-semibold rounded-[10px] px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
      </div>

      {/* Subscription Master Table */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">Subscriber ID & Customer</th>
                <th className="py-4 px-4">Subscription Plan</th>
                <th className="py-4 px-4 text-center">Tier Level</th>
                <th className="py-4 px-4 text-[#C8A45D]">Renewal Date</th>
                <th className="py-4 px-4">Shipping Schedule</th>
                <th className="py-4 px-4 text-right">MRR Value</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[#8E8A85]">
                    No customer subscriptions match your search parameters.
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#F8F6F3] block text-sm">
                        {sub.customerName}
                      </span>
                      <span className="text-[10px] font-mono text-[#C8A45D] block">
                        {sub.subscriberCode} • {sub.customerEmail}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[#F8F6F3] font-medium">
                      {sub.planName}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#090909] text-[#F8F6F3] border border-[#2A2A2A] rounded">
                        {sub.tier}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-[#F8F6F3]">
                      {sub.renewalDate}
                    </td>

                    <td className="py-4 px-4 text-xs text-[#8E8A85]">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3 text-[#C8A45D]" /> {sub.shippingSchedule}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-editorial text-base font-bold text-emerald-400">
                      ${sub.mrrValue} / mo
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusBadge(
                          sub.status
                        )}`}
                      >
                        {sub.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onViewSubscriber(sub)}
                          className="p-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleStatus(sub)}
                          className="px-2 py-1 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] text-[10px] font-bold uppercase rounded-[6px] border border-[#2A2A2A] transition-colors cursor-pointer"
                        >
                          {sub.status === "Active" ? "Pause" : "Resume"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
