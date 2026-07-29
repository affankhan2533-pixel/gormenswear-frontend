"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Key, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function SecurityDashboardView({ securityData }) {
  const { rateLimiting, securityHeaders, vaultSecretManager, fileUploadSecurity } = securityData;

  return (
    <div className="space-y-8">
      {/* High Level Security Status */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4" /> GOVERNANCE, COMPLIANCE & THREAT DEFENSE
            </span>
            <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
              Security Operations Center (SOC)
            </h2>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Zero Active Security Threats
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Rate Limiting Defense
            </span>
            <div className="font-editorial text-xl font-bold text-emerald-400">
              {rateLimiting.policy}
            </div>
            <p className="text-[11px] text-[#8E8A85]">{rateLimiting.status}</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Secrets Management
            </span>
            <div className="font-editorial text-xl font-bold text-[#F8F6F3]">
              HashiCorp Vault
            </div>
            <p className="text-[11px] text-[#8E8A85]">{vaultSecretManager}</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              File Upload Sandbox
            </span>
            <div className="font-editorial text-xl font-bold text-emerald-400">
              Malware Scanner Active
            </div>
            <p className="text-[11px] text-[#8E8A85]">{fileUploadSecurity}</p>
          </div>
        </div>
      </div>

      {/* HTTP Security Headers Inspection */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
        <div className="border-b border-[#2A2A2A] pb-3">
          <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
            HTTP Security Headers & CSP Enforcement
          </h3>
        </div>

        <div className="space-y-3">
          {securityHeaders.map((sh, idx) => (
            <div key={idx} className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between font-mono text-xs">
              <div>
                <span className="font-bold text-[#C8A45D] block">{sh.header}</span>
                <span className="text-[#8E8A85] text-[11px]">{sh.value}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full shrink-0">
                {sh.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
