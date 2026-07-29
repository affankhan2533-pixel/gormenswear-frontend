"use client";

import { CheckCircle2, Clock, AlertOctagon, RefreshCw, Truck, Package, ShoppingBag, Check } from "lucide-react";

const STAGES = [
  { key: "New", label: "Pending", icon: Clock },
  { key: "Confirmed", label: "Confirmed", icon: Check },
  { key: "Processing", label: "Processing", icon: RefreshCw },
  { key: "Packed", label: "Packed", icon: Package },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: CheckCircle2 },
];

function getStageIndex(status) {
  if (status === "Pending" || status === "New") return 0;
  if (status === "Confirmed") return 1;
  if (status === "Processing") return 2;
  if (status === "Packed") return 3;
  if (status === "Shipped") return 4;
  if (status === "Delivered" || status === "Paid" || status === "Fulfilled") return 5;
  return -1;
}

export default function OrderTimeline({ status, timeline = [] }) {
  const currentIdx = getStageIndex(status);
  const isCancelled = status === "Cancelled";

  if (isCancelled) {
    return (
      <div className="p-4 rounded-[12px] bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-xs">
        <AlertOctagon className="w-5 h-5 shrink-0 text-rose-400" />
        <div>
          <p className="font-bold text-sm text-rose-400">Order Cancelled</p>
          <p className="text-[11px] opacity-80 mt-0.5">
            This transaction was cancelled. Inventory stock has been restored.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Horizontal Stepper */}
      <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto py-2">
        {/* Background track line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#222222] -translate-y-1/2 z-0" />

        {/* Progress track line */}
        <div
          className="absolute top-1/2 left-4 h-0.5 bg-[#C8A45D] -translate-y-1/2 z-0 transition-all duration-500"
          style={{
            width: currentIdx >= 0 ? `${(currentIdx / (STAGES.length - 1)) * 100}%` : "0%",
          }}
        />

        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isPassed = currentIdx >= idx;
          const isCurrent = currentIdx === idx;

          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-colors border ${
                  isCurrent
                    ? "bg-[#C8A45D] text-[#090909] font-bold border-[#C8A45D] ring-4 ring-[#C8A45D]/20"
                    : isPassed
                    ? "bg-[#1A1A1A] text-[#C8A45D] border-[#C8A45D]/50"
                    : "bg-[#111] text-[#444] border-[#222]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-medium mt-1.5 whitespace-nowrap ${
                  isCurrent
                    ? "text-[#C8A45D] font-bold"
                    : isPassed
                    ? "text-[#E8E4DF]"
                    : "text-[#555]"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* History Log */}
      {timeline.length > 0 && (
        <div className="border-t border-[#1E1E1E] pt-3 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#666]">
            Timeline History
          </p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {timeline.slice().reverse().map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs p-2 rounded-[6px] bg-[#161616] border border-[#222]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-[#C8A45D] shrink-0">{t.status}</span>
                  <span className="text-[#888] truncate">{t.note}</span>
                </div>
                <span className="text-[10px] text-[#555] shrink-0 font-mono">
                  {t.date ? new Date(t.date).toLocaleString("en-IN") : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
