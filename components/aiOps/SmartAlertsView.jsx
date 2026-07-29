"use client";

import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SmartAlertsView({ alerts, onDismissAlert }) {
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-950/80 text-rose-400 border-rose-500/30";
      case "Warning":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Info":
        return "bg-blue-950/80 text-blue-400 border-blue-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Smart Anomaly Detection & Operational Alerts
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Real-time AI monitoring detecting sudden sales drops, stock risks, unusual VIP behavior, and gateway latencies.
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className="p-5 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl flex items-start justify-between gap-4 hover:border-[#C8A45D]/40 transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getSeverityBadge(
                    alt.severity
                  )}`}
                >
                  {alt.severity}
                </span>
                <span className="text-[10px] font-mono text-[#C8A45D] font-bold uppercase">
                  {alt.category}
                </span>
                <span className="text-[10px] text-[#8E8A85] font-mono">{alt.detectedAt}</span>
              </div>
              <h3 className="font-editorial text-xl text-[#F8F6F3]">{alt.title}</h3>
              <p className="text-xs text-[#8E8A85]">{alt.message}</p>
            </div>

            <button
              type="button"
              onClick={() => onDismissAlert(alt.id)}
              className="px-3 py-1.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#8E8A85] text-xs font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
