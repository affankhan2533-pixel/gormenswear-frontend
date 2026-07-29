"use client";

import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  UserCheck,
  CreditCard,
  Edit,
  UserPlus,
  FileText,
  Clock,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CompanyCard({ company, onEdit, onManageUsers }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
      case "Pending Review":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Suspended":
        return "bg-rose-950/80 text-rose-400 border-rose-500/30";
      case "Extended":
        return "bg-blue-950/80 text-blue-400 border-blue-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const utilizationPercent = Math.min(
    100,
    Math.round((company.outstandingBalance / (company.creditLimit || 1)) * 100)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl hover:border-[#C8A45D]/40 transition-all group flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded">
                {company.code}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  company.creditStatus
                )}`}
              >
                {company.creditStatus}
              </span>
              <span className="text-[10px] font-mono text-[#8E8A85] px-2 py-0.5 bg-[#090909] border border-[#2A2A2A] rounded">
                {company.paymentTerms}
              </span>
            </div>
            <h3 className="font-editorial text-2xl text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors">
              {company.name}
            </h3>
            <p className="text-xs text-[#8E8A85] font-sans flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C8A45D]" />
              {company.billingAddress.city}, {company.billingAddress.country} • Tax ID: {company.taxId}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onManageUsers(company)}
              aria-label={`Manage users for ${company.name}`}
              className="p-2 bg-[#090909] hover:bg-blue-600 hover:text-white text-blue-400 rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <UserPlus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(company)}
              aria-label={`Edit ${company.name}`}
              className="p-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Assigned Sales Rep & Primary Contact */}
        <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] my-4 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[#8E8A85] text-[10px] uppercase font-bold tracking-wider block">
              Assigned Account Rep
            </span>
            <span className="text-[#F8F6F3] font-semibold">{company.assignedSalesRepName}</span>
          </div>
          <div>
            <span className="text-[#8E8A85] text-[10px] uppercase font-bold tracking-wider block">
              Authorized Buyer
            </span>
            <span className="text-[#F8F6F3] font-semibold truncate block">
              {company.contacts[0]?.name || "N/A"}
            </span>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#2A2A2A]">
          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Credit Limit
            </span>
            <span className="font-editorial text-xl text-[#F8F6F3] font-bold">
              ${company.creditLimit.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Outstanding Balance
            </span>
            <span
              className={`font-editorial text-xl font-bold ${
                company.outstandingBalance > company.creditLimit
                  ? "text-rose-400"
                  : "text-amber-400"
              }`}
            >
              ${company.outstandingBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Credit Utilization Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#8E8A85]">Credit Utilization</span>
            <span className="text-[#F8F6F3] font-bold font-mono">{utilizationPercent}%</span>
          </div>
          <div className="w-full bg-[#090909] h-2 rounded-full overflow-hidden border border-[#2A2A2A]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                utilizationPercent > 80 ? "bg-rose-500" : "bg-[#C8A45D]"
              }`}
              style={{ width: `${utilizationPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-[11px] text-[#8E8A85]">
        <span>Tier: <strong className="text-[#F8F6F3]">{company.tier}</strong></span>
        <span>Contacts: <strong className="text-[#C8A45D]">{company.contacts?.length || 0} Users</strong></span>
      </div>
    </motion.div>
  );
}
