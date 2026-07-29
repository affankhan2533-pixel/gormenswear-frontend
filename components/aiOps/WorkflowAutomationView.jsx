"use client";

import { motion } from "framer-motion";
import { Zap, ToggleLeft, ToggleRight, Play, RefreshCw, CheckCircle2 } from "lucide-react";

export default function WorkflowAutomationView({ automations, onToggleAutomation }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Automated Workflow Triggers & Execution Rules
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Configure automated triggers for low stock alerts, VIP order escalations, customer cart outreach, and vendor payout settlements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map((wf) => (
          <div
            key={wf.id || wf.idStr}
            className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[22px] shadow-xl space-y-4 hover:border-[#C8A45D]/40 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">
                  {wf.name}
                </h3>
                <span className="text-[10px] font-mono text-[#8E8A85]">
                  Executions: <strong className="text-emerald-400">{wf.executionCount} times</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => onToggleAutomation(wf.id || wf.idStr)}
                className="shrink-0 cursor-pointer"
              >
                {wf.enabled ? (
                  <ToggleRight className="w-8 h-8 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-[#8E8A85]" />
                )}
              </button>
            </div>

            <div className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">Trigger Condition</span>
                <span className="text-[#F8F6F3] font-medium">{wf.trigger}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8E8A85] font-bold uppercase block">Action Result</span>
                <span className="text-[#C8A45D] font-medium">{wf.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
