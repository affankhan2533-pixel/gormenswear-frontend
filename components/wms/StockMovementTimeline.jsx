"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  Search,
  Download,
  Calendar,
  User,
  Tag,
  FileText,
} from "lucide-react";

export default function StockMovementTimeline({ movements, onExportCSV }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredMovements = useMemo(() => {
    return movements.filter((mov) => {
      const matchesSearch =
        mov.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mov.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mov.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mov.performedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || mov.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [movements, searchQuery, typeFilter]);

  const getMovementIcon = (type) => {
    switch (type) {
      case "Stock In":
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case "Stock Out":
        return <ArrowUpRight className="w-4 h-4 text-rose-400" />;
      case "Stock Transfer":
        return <ArrowRightLeft className="w-4 h-4 text-blue-400" />;
      case "Manual Adjustment":
        return <RefreshCw className="w-4 h-4 text-amber-400" />;
      case "Return Stock":
        return <RotateCcw className="w-4 h-4 text-purple-400" />;
      case "Damage Report":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Tag className="w-4 h-4 text-[#C8A45D]" />;
    }
  };

  const getMovementBadge = (type) => {
    switch (type) {
      case "Stock In":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
      case "Stock Out":
        return "bg-rose-950/80 text-rose-400 border-rose-500/30";
      case "Stock Transfer":
        return "bg-blue-950/80 text-blue-400 border-blue-500/30";
      case "Manual Adjustment":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Return Stock":
        return "bg-purple-950/80 text-purple-400 border-purple-500/30";
      case "Damage Report":
        return "bg-red-950/80 text-red-400 border-red-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#8E8A85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Movement Log by SKU, Reference, or User..."
            className="w-full pl-9 pr-4 py-2 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        {/* Filters & Export */}
        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3] text-xs font-semibold rounded-[10px] px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Movement Types</option>
            <option value="Stock In">Stock In</option>
            <option value="Stock Out">Stock Out</option>
            <option value="Stock Transfer">Stock Transfer</option>
            <option value="Manual Adjustment">Manual Adjustment</option>
            <option value="Return Stock">Return Stock</option>
            <option value="Damage Report">Damage Report</option>
          </select>

          <button
            type="button"
            onClick={onExportCSV}
            className="h-[36px] px-3.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-xs font-bold uppercase tracking-wider rounded-[8px] border border-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Log
          </button>
        </div>
      </div>

      {/* Movement Log Table */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Movement Type</th>
                <th className="py-4 px-4">SKU / Product</th>
                <th className="py-4 px-4 text-center">Qty</th>
                <th className="py-4 px-4">From → To</th>
                <th className="py-4 px-4">Ref No.</th>
                <th className="py-4 px-4">Performed By</th>
                <th className="py-4 px-4">Reason & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[#8E8A85]">
                    No stock movement audit records found.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                    <td className="py-4 px-4 whitespace-nowrap text-[#F8F6F3]">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="w-3 h-3 text-[#C8A45D]" /> {mov.date}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getMovementBadge(
                          mov.type
                        )}`}
                      >
                        {getMovementIcon(mov.type)} {mov.type}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#F8F6F3] block text-sm">
                        {mov.productName}
                      </span>
                      <span className="text-[10px] font-mono text-[#C8A45D]">{mov.sku}</span>
                    </td>

                    <td className="py-4 px-4 text-center font-editorial text-base font-bold">
                      <span
                        className={
                          mov.quantity > 0
                            ? "text-emerald-400"
                            : mov.quantity < 0
                            ? "text-rose-400"
                            : "text-[#F8F6F3]"
                        }
                      >
                        {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[11px]">
                      <span className="text-[#8E8A85] block truncate max-w-[150px]">
                        {mov.fromWarehouse}
                      </span>
                      <span className="text-[#C8A45D] font-bold block truncate max-w-[150px]">
                        → {mov.toWarehouse}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-mono text-xs text-[#F8F6F3]">
                      {mov.referenceNo}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-[#F8F6F3]">
                      <span className="flex items-center gap-1 text-xs">
                        <User className="w-3 h-3 text-[#8E8A85]" /> {mov.performedBy}
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <span className="font-semibold text-[#F8F6F3] block text-xs">
                        {mov.reason}
                      </span>
                      {mov.notes && (
                        <span className="text-[11px] text-[#8E8A85] block truncate">
                          {mov.notes}
                        </span>
                      )}
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
