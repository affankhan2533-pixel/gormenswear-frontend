"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Clock, Zap, AlertTriangle } from "lucide-react";

export default function SystemHealthView({ healthData }) {
  const { apiResponseTime, errorRate, integrationUptime, serviceAvailability } = healthData;

  return (
    <div className="space-y-8">
      {/* High-level KPIs */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
              <Activity className="w-4 h-4" /> SYSTEM PERFORMANCE & SLA TELEMETRY
            </span>
            <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
              API Response Latency & Infrastructure Health
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs bg-[#090909] px-4 py-2 rounded-xl border border-[#2A2A2A]">
            <span className="text-[#8E8A85]">Platform SLA Uptime:</span>
            <span className="font-editorial text-xl font-bold text-emerald-400">
              {integrationUptime}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Average API Response Latency
            </span>
            <div className="font-editorial text-3xl font-bold text-emerald-400">
              {apiResponseTime}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Global API gateway latency.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              System Error Rate Index
            </span>
            <div className="font-editorial text-3xl font-bold text-[#F8F6F3]">
              {errorRate}
            </div>
            <p className="text-[11px] text-[#8E8A85]">HTTP 5xx error frequency.</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Integration SLA Commitment
            </span>
            <div className="font-editorial text-3xl font-bold text-[#C8A45D]">
              {integrationUptime}
            </div>
            <p className="text-[11px] text-[#8E8A85]">Enterprise uptime SLA.</p>
          </div>
        </div>
      </div>

      {/* Service Availability Matrix Table */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
        <div className="border-b border-[#2A2A2A] pb-3">
          <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
            Integration Gateway Service Availability Matrix
          </h3>
        </div>

        <div className="space-y-3">
          {serviceAvailability.map((svc, i) => (
            <div key={i} className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#F8F6F3] block">
                  {svc.service}
                </span>
                <span className="text-[11px] text-[#8E8A85]">
                  Latency: <strong className="text-emerald-400 font-mono">{svc.responseTime}</strong>
                </span>
              </div>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  svc.status === "Operational"
                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                }`}
              >
                {svc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
