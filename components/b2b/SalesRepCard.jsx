"use client";

import { motion } from "framer-motion";
import { UserCheck, Building2, DollarSign, Edit2, Clock, Award, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function SalesRepCard({ rep, onEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl hover:border-[#C8A45D]/40 transition-all group flex flex-col justify-between space-y-4"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded">
              {rep.code}
            </span>
            <h3 className="font-editorial text-2xl text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors mt-1">
              {rep.name}
            </h3>
            <p className="text-xs text-[#8E8A85]">{rep.region} Region</p>
          </div>

          <button
            type="button"
            onClick={() => onEdit(rep)}
            className="p-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Managed Revenue & Commission */}
        <div className="grid grid-cols-3 gap-2 text-center py-3 border-y border-[#2A2A2A]">
          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Portfolio
            </span>
            <span className="font-editorial text-lg text-[#F8F6F3] font-semibold">
              {rep.portfolioCompanyCount} Accounts
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Managed Sales
            </span>
            <span className="font-editorial text-lg text-emerald-400 font-semibold">
              ${(rep.managedRevenue / 1000).toFixed(0)}k
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Commission ({rep.commissionRate}%)
            </span>
            <span className="font-editorial text-lg text-[#C8A45D] font-semibold">
              ${(rep.earnedCommission / 1000).toFixed(1)}k
            </span>
          </div>
        </div>

        {/* Activity Timeline Feed */}
        <div className="mt-4 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-[#8E8A85] font-bold block flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#C8A45D]" /> Recent Account Activity
          </span>
          {rep.activityTimeline?.map((act, i) => (
            <div key={i} className="p-2 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-[11px] text-[#8E8A85]">
              <span className="font-mono text-[10px] text-[#C8A45D] block">{act.date}</span>
              <span className="text-[#F8F6F3]">{act.action}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
