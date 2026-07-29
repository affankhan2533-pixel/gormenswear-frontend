"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, FileText, CheckCircle2, Clock, XCircle, ArrowRight, Edit, Percent } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function QuoteManagementTable({ quotes, onReviseQuote, onConvertToPO }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesSearch =
        q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.contactName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || q.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, searchQuery, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
      case "Converted":
        return "bg-blue-950/80 text-blue-400 border-blue-500/30";
      case "Under Review":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Requested":
        return "bg-purple-950/80 text-purple-400 border-purple-500/30";
      case "Expired":
      case "Rejected":
        return "bg-rose-950/80 text-rose-400 border-rose-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Status Controls */}
      <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#8E8A85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search RFQ Number, Company, or Contact..."
            className="w-full pl-9 pr-4 py-2 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3] text-xs font-semibold rounded-[10px] px-3 py-2 outline-none cursor-pointer"
        >
          <option value="all">All Quote Statuses</option>
          <option value="Requested">Requested</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Converted">Converted to PO</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Quote Table */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">RFQ Number & Date</th>
                <th className="py-4 px-4">Company Account</th>
                <th className="py-4 px-4">Buyer Contact</th>
                <th className="py-4 px-4">Sales Rep</th>
                <th className="py-4 px-4 text-center">Subtotal</th>
                <th className="py-4 px-4 text-center">Discount %</th>
                <th className="py-4 px-4 text-right">Quoted Final Total</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-[#8E8A85]">
                    No wholesale quote requests match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono text-[#C8A45D] font-bold text-sm block">
                        {q.quoteNumber}
                      </span>
                      <span className="text-[10px] text-[#8E8A85]">Req: {q.requestedDate}</span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-[#F8F6F3]">
                      {q.companyName}
                    </td>

                    <td className="py-4 px-4 text-[#F8F6F3]">
                      <span className="block font-medium">{q.contactName}</span>
                      <span className="text-[10px] text-[#8E8A85] block">{q.contactEmail}</span>
                    </td>

                    <td className="py-4 px-4 text-[#8E8A85]">{q.salesRepName}</td>

                    <td className="py-4 px-4 text-center font-mono text-xs text-[#8E8A85] line-through">
                      ${q.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="text-[11px] font-bold text-[#C8A45D] bg-[#090909] px-2 py-0.5 border border-[#2A2A2A] rounded">
                        -{q.discountPercent}%
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-editorial text-base font-bold text-emerald-400">
                      ${q.finalAmount.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusBadge(
                          q.status
                        )}`}
                      >
                        {q.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onReviseQuote(q)}
                          className="px-2.5 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                        >
                          Revise
                        </button>

                        {q.status !== "Converted" && (
                          <button
                            type="button"
                            onClick={() => onConvertToPO(q)}
                            className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#090909] text-[11px] font-bold rounded-[8px] transition-colors cursor-pointer flex items-center gap-1 font-bold"
                          >
                            Convert to PO <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
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
