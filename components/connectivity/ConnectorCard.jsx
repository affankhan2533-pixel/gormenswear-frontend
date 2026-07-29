"use client";

import { motion } from "framer-motion";
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Settings2,
  RefreshCw,
  Zap,
  Globe,
  Clock,
} from "lucide-react";

export default function ConnectorCard({ connector, onConfigure, onTestConnection }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Connected":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
      case "Degraded":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Disconnected":
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
                {connector.code}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  connector.status
                )}`}
              >
                {connector.status}
              </span>
              <span className="text-[10px] font-mono text-[#8E8A85] px-2 py-0.5 bg-[#090909] border border-[#2A2A2A] rounded">
                {connector.environment || connector.category}
              </span>
            </div>
            <h3 className="font-editorial text-2xl text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors">
              {connector.name}
            </h3>
            {connector.description && (
              <p className="text-xs text-[#8E8A85] mt-1 line-clamp-2">{connector.description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onConfigure(connector)}
            aria-label={`Configure ${connector.name}`}
            className="p-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer shrink-0"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {/* Diagnostic Metrics Bar */}
        <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] my-4 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[#8E8A85] text-[10px] uppercase font-bold tracking-wider block">
              Health SLA Score
            </span>
            <span className="font-editorial text-lg text-emerald-400 font-bold">
              {connector.healthScore ? `${connector.healthScore}%` : "100.0%"}
            </span>
          </div>

          <div>
            <span className="text-[#8E8A85] text-[10px] uppercase font-bold tracking-wider block">
              Last Sync Timestamp
            </span>
            <span className="text-[#F8F6F3] font-mono text-xs block mt-0.5">
              {connector.lastSync || connector.lastFinancialSync || connector.lastUsed || "Real-time"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-[11px] text-[#8E8A85]">
        <span>Category: <strong className="text-[#F8F6F3]">{connector.category}</strong></span>
        <button
          type="button"
          onClick={() => onTestConnection(connector)}
          className="text-[#C8A45D] font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          Test Diagnostics <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
