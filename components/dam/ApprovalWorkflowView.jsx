"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, ShieldCheck, UserCheck } from "lucide-react";

export default function ApprovalWorkflowView({ approvalQueue, onApproveAsset, onRejectAsset }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Brand Asset Approval Workflow Queue
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Review photographer submissions, verify copyright licenses, inspect resolution standards, and approve assets for production.
        </p>
      </div>

      <div className="space-y-4">
        {approvalQueue.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[22px] shadow-xl space-y-4 hover:border-[#C8A45D]/40 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#C8A45D]">
                    {item.id}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-amber-950/80 text-amber-400 border border-amber-500/30 rounded-full">
                    {item.status}
                  </span>
                </div>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">
                  {item.assetName}
                </h3>
                <p className="text-xs text-[#8E8A85]">
                  Submitted by <strong className="text-[#F8F6F3]">{item.submittedBy}</strong> on {item.submittedAt} (Reviewer: {item.reviewer})
                </p>
                {item.comment && (
                  <p className="text-xs text-[#C8A45D] font-mono pt-1">Notes: "{item.comment}"</p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => onRejectAsset(item.id)}
                  className="px-4 py-2 bg-[#090909] hover:bg-rose-950 text-rose-400 text-xs font-bold uppercase rounded-[10px] border border-[#2A2A2A] transition-colors cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => onApproveAsset(item.id)}
                  className="px-5 py-2 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md font-bold"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve for Production
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
