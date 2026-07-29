"use client";

import { motion } from "framer-motion";
import { Wifi, WifiOff, RefreshCw, CloudCheck, ShieldCheck } from "lucide-react";

export default function MobileOfflineSyncBar({
  offlineState,
  onToggleOnlineMode,
  onSyncPendingChanges,
}) {
  const { isOnline, pendingChangesCount, lastSyncTimestamp } = offlineState;

  return (
    <div className="p-3 bg-[#151515] border border-[#2A2A2A] rounded-[16px] flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleOnlineMode}
          className="flex items-center gap-1.5 cursor-pointer"
          title="Toggle Simulated Network Connection State"
        >
          {isOnline ? (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full">
              <Wifi className="w-3 h-3 text-emerald-400" /> ONLINE
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-950/80 text-amber-400 border border-amber-500/30 rounded-full">
              <WifiOff className="w-3 h-3 text-amber-400" /> OFFLINE CACHED
            </span>
          )}
        </button>

        <span className="text-[11px] text-[#8E8A85] hidden sm:inline">
          Sync: {lastSyncTimestamp}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {pendingChangesCount > 0 && (
          <span className="text-[10px] font-bold text-amber-400 bg-[#090909] px-2 py-0.5 border border-[#2A2A2A] rounded font-mono">
            {pendingChangesCount} Pending Sync
          </span>
        )}

        <button
          type="button"
          onClick={onSyncPendingChanges}
          className="px-2.5 py-1 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Sync Now
        </button>
      </div>
    </div>
  );
}
