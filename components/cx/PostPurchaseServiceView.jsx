"use client";

import { motion } from "framer-motion";
import { Scissors, RefreshCw, ShieldCheck, Clock, CheckCircle2, UserCheck } from "lucide-react";

export default function PostPurchaseServiceView({ services }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Post-Purchase Services (Alterations, Repairs & Exchanges)
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Manage master tailor sleeve adjustments, size exchanges, button repairs, and warranty servicing.
        </p>
      </div>

      <div className="space-y-4">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[22px] shadow-xl space-y-4 hover:border-[#C8A45D]/40 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#C8A45D]">
                    {svc.reqNumber}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#090909] text-[#F8F6F3] border border-[#2A2A2A] rounded uppercase">
                    {svc.type}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      svc.status === "Completed"
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                        : "bg-blue-950/80 text-blue-400 border-blue-500/30"
                    }`}
                  >
                    {svc.status}
                  </span>
                </div>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">
                  {svc.productName}
                </h3>
                <p className="text-xs text-[#8E8A85]">
                  Customer: <strong className="text-[#F8F6F3]">{svc.customerName}</strong> • {svc.details}
                </p>
              </div>

              <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[14px] text-xs text-right space-y-1">
                <span className="text-[#8E8A85] text-[10px] uppercase font-bold block">Assigned Specialist</span>
                <span className="font-semibold text-[#F8F6F3] block">{svc.assignedStaff}</span>
                <span className="font-mono text-emerald-400 font-bold block">ETA: {svc.etaDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
