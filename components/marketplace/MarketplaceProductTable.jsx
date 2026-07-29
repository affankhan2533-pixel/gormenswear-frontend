"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Package, CheckCircle2, Clock, XCircle, Filter, Eye, Layers } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function MarketplaceProductTable({ products, onModerateProduct }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || p.approvalStatus === statusFilter;
      const matchesType = typeFilter === "all" || p.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [products, searchQuery, statusFilter, typeFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
      case "Pending Review":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Rejected":
        return "bg-rose-950/80 text-rose-400 border-rose-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#8E8A85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, Product, or Vendor..."
            className="w-full pl-9 pr-4 py-2 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3] text-xs font-semibold rounded-[10px] px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Approval Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3] text-xs font-semibold rounded-[10px] px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Product Types</option>
            <option value="Vendor-owned">Vendor-owned</option>
            <option value="Shared">Shared</option>
            <option value="Marketplace">Marketplace</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">SKU / Product Title</th>
                <th className="py-4 px-4">Marketplace Vendor</th>
                <th className="py-4 px-4 text-center">Product Type</th>
                <th className="py-4 px-4 text-center">Retail MSRP</th>
                <th className="py-4 px-4 text-center">Commission %</th>
                <th className="py-4 px-4 text-center">Stock</th>
                <th className="py-4 px-4 text-center">Approval Status</th>
                <th className="py-4 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[#8E8A85]">
                    No marketplace products match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#F8F6F3] text-sm block">
                        {p.productName}
                      </span>
                      <span className="text-[10px] font-mono text-[#C8A45D]">{p.sku}</span>
                    </td>

                    <td className="py-4 px-4 font-medium text-[#F8F6F3]">
                      {p.vendorName}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#090909] text-[#F8F6F3] border border-[#2A2A2A] rounded">
                        {p.type}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center font-editorial text-base font-bold text-[#F8F6F3]">
                      ${p.price}
                    </td>

                    <td className="py-4 px-4 text-center font-mono text-xs text-[#C8A45D]">
                      {p.commissionPercent}%
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-bold text-emerald-400">
                      {p.stockLevel}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusBadge(
                          p.approvalStatus
                        )}`}
                      >
                        {p.approvalStatus}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onModerateProduct(p)}
                        className="px-3 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                      >
                        Moderate
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
  );
}
