"use client";

import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  UserCheck,
  Package,
  Layers,
  Edit,
  Archive,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  PieChart,
} from "lucide-react";

export default function WarehouseCard({ warehouse, onEdit, onArchive }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
      case "Maintenance":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Inactive":
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
      case "Archived":
        return "bg-rose-950/80 text-rose-400 border-rose-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl hover:border-[#C8A45D]/40 transition-all group flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded">
                {warehouse.code}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  warehouse.status
                )}`}
              >
                {warehouse.status}
              </span>
            </div>
            <h3 className="font-editorial text-2xl text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors">
              {warehouse.name}
            </h3>
            <p className="text-xs text-[#8E8A85] font-sans flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C8A45D]" />
              {warehouse.address.street}, {warehouse.address.city}, {warehouse.address.country} ({warehouse.address.zip})
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(warehouse)}
              aria-label={`Edit ${warehouse.name}`}
              className="p-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onArchive(warehouse.id)}
              aria-label={`Archive ${warehouse.name}`}
              className="p-2 bg-[#090909] hover:bg-rose-500 hover:text-[#090909] text-[#8E8A85] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Manager Info */}
        <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <UserCheck className="w-4 h-4 text-[#C8A45D]" />
            <div>
              <span className="text-[#8E8A85] block text-[10px] uppercase font-bold tracking-wider">
                Manager
              </span>
              <span className="text-[#F8F6F3] font-semibold">{warehouse.manager.name}</span>
            </div>
          </div>
          <a
            href={`mailto:${warehouse.manager.email}`}
            className="text-[11px] text-[#C8A45D] hover:underline"
          >
            {warehouse.manager.email}
          </a>
        </div>

        {/* Inventory Statistics */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#2A2A2A] text-center my-4">
          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Total Stock
            </span>
            <span className="font-editorial text-lg text-[#F8F6F3] font-semibold">
              {warehouse.stockCount.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Reserved
            </span>
            <span className="font-editorial text-lg text-amber-400 font-semibold">
              {warehouse.reservedCount.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Incoming
            </span>
            <span className="font-editorial text-lg text-blue-400 font-semibold">
              {warehouse.incomingCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Space Utilization Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#8E8A85] flex items-center gap-1">
              <PieChart className="w-3.5 h-3.5 text-[#C8A45D]" /> Capacity Used
            </span>
            <span className="text-[#F8F6F3] font-bold font-mono">
              {warehouse.spaceUtilization}% ({warehouse.capacitySqFt.toLocaleString()} sq ft)
            </span>
          </div>
          <div className="w-full bg-[#090909] h-2 rounded-full overflow-hidden border border-[#2A2A2A]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                warehouse.spaceUtilization > 80
                  ? "bg-rose-500"
                  : warehouse.spaceUtilization > 60
                  ? "bg-[#C8A45D]"
                  : "bg-emerald-400"
              }`}
              style={{ width: `${warehouse.spaceUtilization}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-[11px] text-[#8E8A85]">
        <span>Total Bins: {warehouse.totalBins}</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#C8A45D]" /> Last Audit: {warehouse.lastAudit}
        </span>
      </div>
    </motion.div>
  );
}
