"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Database, HardDrive, Cpu, Server, CheckCircle2, AlertTriangle } from "lucide-react";

export default function DevOpsHealthView({ healthData }) {
  const { overallStatus, uptimeSLA, globalResponseTime, services } = healthData;

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
              <Activity className="w-4 h-4" /> ENTERPRISE SYSTEM TELEMETRY
            </span>
            <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
              Application Infrastructure & Database Health
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8E8A85]">Global Platform Status:</span>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> {overallStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Overall SLA Availability Uptime
            </span>
            <div className="font-editorial text-3xl font-bold text-emerald-400">
              {uptimeSLA}
            </div>
            <p className="text-[11px] text-[#8E8A85]">PostgreSQL & Node Cluster Uptime.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Global API Gateway Latency
            </span>
            <div className="font-editorial text-3xl font-bold text-blue-400">
              {globalResponseTime}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Server-side response time.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Health Check Status
            </span>
            <div className="font-editorial text-3xl font-bold text-[#C8A45D]">
              100% Healthy
            </div>
            <p className="text-[11px] text-[#8E8A85]">0 active degraded services.</p>
          </div>
        </div>
      </div>

      {/* Infrastructure Node Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl space-y-4 hover:border-[#C8A45D]/40 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#C8A45D] font-bold uppercase block mb-1">
                  {svc.category} Node
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">
                  {svc.name}
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full">
                {svc.status}
              </span>
            </div>

            <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">Latency</span>
                <span className="font-mono text-emerald-400 font-bold">{svc.latency}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">Utilization</span>
                <span className="font-mono text-[#F8F6F3] font-bold">
                  {svc.cpuUsage || svc.connections || svc.hitRatio || svc.bandwidth}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">Uptime</span>
                <span className="font-mono text-[#C8A45D] font-bold">{svc.uptime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
