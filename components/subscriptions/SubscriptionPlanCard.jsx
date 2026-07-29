"use client";

import { motion } from "framer-motion";
import {
  RotateCcw,
  Users,
  DollarSign,
  Edit2,
  PauseCircle,
  PlayCircle,
  Archive,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function SubscriptionPlanCard({ plan, onEdit, onToggleStatus, onArchive }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
      case "Paused":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
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
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded">
                {plan.code}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  plan.status
                )}`}
              >
                {plan.status}
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-400 bg-[#090909] px-2 py-0.5 border border-[#2A2A2A] rounded">
                {plan.interval}
              </span>
            </div>
            <h3 className="font-editorial text-2xl text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors">
              {plan.name}
            </h3>
            <p className="text-xs text-[#8E8A85] mt-1 line-clamp-2">{plan.description}</p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onToggleStatus(plan)}
              aria-label={plan.status === "Active" ? "Pause Plan" : "Resume Plan"}
              className="p-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
            >
              {plan.status === "Active" ? <PauseCircle className="w-4 h-4 text-amber-400" /> : <PlayCircle className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => onEdit(plan)}
              aria-label={`Edit ${plan.name}`}
              className="p-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pricing & Subscriber Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center py-3 border-y border-[#2A2A2A] my-4">
          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Plan Price
            </span>
            <span className="font-editorial text-xl text-[#C8A45D] font-bold">
              ${plan.price} / {plan.interval.toLowerCase()}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Subscribers
            </span>
            <span className="font-editorial text-xl text-[#F8F6F3] font-bold">
              {plan.activeSubscribersCount} Active
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#8E8A85] uppercase tracking-wider font-bold block">
              Plan MRR
            </span>
            <span className="font-editorial text-xl text-emerald-400 font-bold">
              ${(plan.mrrValue / 1000).toFixed(1)}k
            </span>
          </div>
        </div>

        {/* Plan Features Checklist */}
        <div className="space-y-1.5">
          {plan.features?.map((ft, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-[#8E8A85]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A45D] shrink-0" />
              <span className="text-[#F8F6F3] font-medium">{ft}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-[11px] text-[#8E8A85]">
        <span>Member Savings: <strong className="text-emerald-400">{plan.discountPercent}% Off</strong></span>
        <span>Interval: <strong className="text-[#F8F6F3]">{plan.interval}</strong></span>
      </div>
    </motion.div>
  );
}
