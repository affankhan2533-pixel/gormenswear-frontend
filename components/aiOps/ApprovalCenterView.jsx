"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, ShieldCheck, Eye, ArrowRight, Play } from "lucide-react";

export default function ApprovalCenterView({
  pendingActions,
  onApproveAction,
  onRejectAction,
}) {
  const [selectedAction, setSelectedAction] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Human-in-the-Loop Approval & Governance Center
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Review pending AI proposed operations, inspect payloads, authorize executions, or decline proposals.
        </p>
      </div>

      <div className="space-y-4">
        {pendingActions.map((act) => (
          <div
            key={act.id}
            className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[22px] shadow-xl space-y-4 hover:border-[#C8A45D]/40 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-[#C8A45D] font-bold">
                    {act.id}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#8E8A85] border border-[#2A2A2A] rounded uppercase">
                    {act.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {act.confidenceScore}% Confidence
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      act.riskLevel === "High"
                        ? "bg-rose-950/80 text-rose-400 border-rose-500/30"
                        : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {act.riskLevel} Risk
                  </span>
                </div>

                <h3 className="font-editorial text-2xl text-[#F8F6F3]">
                  {act.actionName}
                </h3>
                <p className="text-xs text-[#8E8A85] mt-1">{act.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedAction(act)}
                  className="px-3.5 py-2 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] text-xs font-bold rounded-[10px] border border-[#2A2A2A] transition-colors cursor-pointer"
                >
                  Inspect Payload
                </button>

                <button
                  type="button"
                  onClick={() => onRejectAction(act.id)}
                  className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-400 text-xs font-bold uppercase rounded-[10px] border border-rose-500/30 transition-colors cursor-pointer"
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() => onApproveAction(act.id)}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md font-bold"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Execute
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payload Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-md w-full p-6 space-y-4 text-[#F8F6F3]">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <h3 className="font-editorial text-xl">{selectedAction.actionName}</h3>
              <button type="button" onClick={() => setSelectedAction(null)} className="text-[#8E8A85]">✕</button>
            </div>
            <pre className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[12px] text-xs font-mono text-emerald-400 overflow-x-auto">
              {selectedAction.payload}
            </pre>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAction(null)}
                className="px-4 py-2 bg-[#090909] text-[#8E8A85] text-xs font-bold uppercase rounded-[8px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
