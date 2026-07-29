"use client";

import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Edit,
  ExternalLink,
  ShieldCheck,
  Star,
  Package,
  DollarSign,
  Percent,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function VendorCard({ vendor, onEdit, onLaunchPortal }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
      case "Pending Review":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Suspended":
        return "bg-rose-950/80 text-rose-400 border-rose-500/30";
      case "Archived":
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
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
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded">
                {vendor.code}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  vendor.verificationStatus
                )}`}
              >
                {vendor.verificationStatus}
              </span>
            </div>
            <h3 className="font-editorial text-2xl text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors">
              {vendor.companyName}
            </h3>
            <p className="text-xs text-[#8E8A85] font-sans flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C8A45D]" />
              {vendor.storeProfile?.city}, {vendor.storeProfile?.country} • Tax: {vendor.taxId}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onLaunchPortal(vendor)}
              aria-label={`Open Vendor Portal for ${vendor.companyName}`}
              className="p-2 bg-[#090909] hover:bg-blue-600 hover:text-white text-blue-400 rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Launch Vendor Self-Service Portal"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onEdit(vendor)}
              aria-label={`Edit ${vendor.companyName}`}
              className="p-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] my-4 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[#8E8A85] text-[10px] uppercase font-bold tracking-wider block">
              Contact Representative
            </span>
            <span className="text-[#F8F6F3] font-semibold">{vendor.contactPerson}</span>
            <span className="text-[11px] text-[#8E8A85] block truncate">{vendor.email}</span>
          </div>

          <div>
            <span className="text-[#8E8A85] text-[10px] uppercase font-bold tracking-wider block">
              Marketplace Commission
            </span>
            <span className="text-[#C8A45D] font-bold text-sm block">
              {vendor.commissionRate}% Commission Rate
            </span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {vendor.rating} / 5.0 Score
            </span>
          </div>
        </div>

        {/* Sales & Products Metrics */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#2A2A2A]">
          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Gross Marketplace Sales
            </span>
            <span className="font-editorial text-xl text-emerald-400 font-bold">
              ${vendor.totalSales.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Listed Products
            </span>
            <span className="font-editorial text-xl text-[#F8F6F3] font-bold">
              {vendor.activeProductsCount} Items
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-[11px] text-[#8E8A85]">
        <span>Joined: <strong className="text-[#F8F6F3]">{vendor.storeProfile?.joinedDate}</strong></span>
        <button
          type="button"
          onClick={() => onLaunchPortal(vendor)}
          className="text-[#C8A45D] font-bold hover:underline flex items-center gap-1"
        >
          Open Vendor Portal <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
