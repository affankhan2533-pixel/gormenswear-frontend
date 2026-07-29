"use client";

import { motion } from "framer-motion";
import { HardDrive, ShieldCheck, CheckCircle2, RefreshCw, Clock, AlertTriangle } from "lucide-react";

export default function DisasterRecoveryView({ disasterRecovery, onTriggerBackup }) {
  const { rpo, rto, lastBackupTimestamp, retentionPolicy, backupStatus, checklist } = disasterRecovery;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
            Backup & Disaster Recovery (DR) Operations
          </h2>
          <p className="text-xs text-[#8E8A85]">
            Automated PostgreSQL Point-in-Time Recovery (PITR), AWS S3 cross-region replication, and RPO/RTO metrics.
          </p>
        </div>
        <button
          type="button"
          onClick={onTriggerBackup}
          className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
        >
          <RefreshCw className="w-4 h-4" /> Trigger On-Demand Snapshot
        </button>
      </div>

      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Recovery Point Objective (RPO)
            </span>
            <div className="font-editorial text-2xl font-bold text-emerald-400">
              {rpo}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Maximum allowable data loss window.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Recovery Time Objective (RTO)
            </span>
            <div className="font-editorial text-2xl font-bold text-blue-400">
              {rto}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Target system restore time SLA.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Last Backup Timestamp
            </span>
            <div className="font-mono text-sm font-bold text-[#C8A45D]">
              {lastBackupTimestamp}
            </div>
            <p className="text-[11px] text-[#8E8A85]">{retentionPolicy}</p>
          </div>
        </div>
      </div>

      {/* DR Readiness Checklist */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
        <div className="border-b border-[#2A2A2A] pb-3">
          <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
            Disaster Recovery Readiness Checklist
          </h3>
        </div>

        <div className="space-y-3">
          {checklist.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between">
              <span className="font-bold text-sm text-[#F8F6F3]">{item.step}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Healthy
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
