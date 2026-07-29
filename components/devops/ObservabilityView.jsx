"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Activity, AlertTriangle, ShieldCheck, Search, CheckCircle2, Zap } from "lucide-react";

export default function ObservabilityView({ logs, telemetry }) {
  const [filterLevel, setFilterLevel] = useState("all");

  const filteredLogs = logs.filter(
    (l) => filterLevel === "all" || l.level === filterLevel
  );

  return (
    <div className="space-y-8">
      {/* Telemetry Core Web Vitals */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
        <div className="border-b border-[#2A2A2A] pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D] flex items-center gap-1.5 mb-1">
            <Zap className="w-4 h-4" /> CORE WEB VITALS & SENTRY TELEMETRY
          </span>
          <h2 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
            Real User Monitoring (RUM) & Tracing
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px]">
            <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">LCP (Largest Contentful Paint)</span>
            <span className="font-editorial text-xl font-bold text-emerald-400 block mt-1">
              {telemetry.webVitals.lcp}
            </span>
          </div>

          <div className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px]">
            <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">FID (First Input Delay)</span>
            <span className="font-editorial text-xl font-bold text-emerald-400 block mt-1">
              {telemetry.webVitals.fid}
            </span>
          </div>

          <div className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px]">
            <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">CLS (Cumulative Layout Shift)</span>
            <span className="font-editorial text-xl font-bold text-emerald-400 block mt-1">
              {telemetry.webVitals.cls}
            </span>
          </div>

          <div className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px]">
            <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">Sentry Active Errors</span>
            <span className="font-editorial text-xl font-bold text-[#C8A45D] block mt-1">
              {telemetry.sentryActiveErrors} Critical Errors
            </span>
          </div>
        </div>
      </div>

      {/* Structured JSON Log Stream */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#C8A45D]" />
            <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
              Structured Application Log Stream
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {["all", "INFO", "WARN", "ERROR"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1 rounded-[8px] text-[11px] font-bold uppercase transition-colors ${
                  filterLevel === lvl
                    ? "bg-[#C8A45D] text-[#090909]"
                    : "bg-[#090909] text-[#8E8A85] border border-[#2A2A2A]"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-1"
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      log.level === "INFO"
                        ? "bg-blue-950 text-blue-400 border border-blue-500/30"
                        : log.level === "WARN"
                        ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                        : "bg-rose-950 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-[#C8A45D] font-bold">{log.service}</span>
                  <span className="text-[#8E8A85]">Trace: {log.traceId}</span>
                </div>
                <span className="text-[#8E8A85]">{log.timestamp}</span>
              </div>
              <p className="text-[#F8F6F3] pt-1">{log.message}</p>
              <p className="text-[#8E8A85] text-[11px]">{log.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
