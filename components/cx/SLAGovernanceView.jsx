"use client";

import { motion } from "framer-motion";
import { Clock, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SLAGovernanceView({ slaData }) {
  const {
    vipResponseTarget,
    standardResponseTarget,
    vipResolutionTarget,
    standardResolutionTarget,
    businessHours,
    escalationRule,
  } = slaData;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Service Level Agreement (SLA) Governance Rules
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Target response times, resolution windows, VIP concierge escalations, and business hour coverage.
        </p>
      </div>

      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              VIP First Response Target
            </span>
            <div className="font-editorial text-2xl font-bold text-emerald-400">
              {vipResponseTarget}
            </div>
            <p className="text-[11px] text-[#8E8A85]">VIP Platinum concierge SLA.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Standard First Response Target
            </span>
            <div className="font-editorial text-2xl font-bold text-blue-400">
              {standardResponseTarget}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Standard retail customer SLA.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              VIP Resolution Target
            </span>
            <div className="font-editorial text-2xl font-bold text-[#C8A45D]">
              {vipResolutionTarget}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Complete resolution window.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Standard Resolution Target
            </span>
            <div className="font-editorial text-2xl font-bold text-[#F8F6F3]">
              {standardResolutionTarget}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Standard resolution window.</p>
          </div>
        </div>

        <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#8E8A85] font-bold uppercase text-[10px]">Concierge Business Hours</span>
            <span className="font-mono text-[#F8F6F3] font-bold">{businessHours}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#2A2A2A]">
            <span className="text-[#8E8A85] font-bold uppercase text-[10px]">Escalation Rule</span>
            <span className="text-[#C8A45D] font-medium">{escalationRule}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
