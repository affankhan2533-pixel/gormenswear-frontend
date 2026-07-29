"use client";

import { motion } from "framer-motion";
import { Sliders, ShieldCheck, CheckCircle2, Lock, ToggleLeft, ToggleRight } from "lucide-react";

export default function AIGovernanceConfigView({
  config,
  onChangeThreshold,
  onToggleApprovalRule,
  onToggleFeature,
}) {
  const {
    confidenceThresholdPercent,
    requireHumanApprovalHighRisk,
    autoExecuteLowRiskTasks,
    featureToggles,
  } = config;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          AI Governance & Decision Observability Configuration
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Control confidence thresholds, human approval policies, and autonomous decision boundaries.
        </p>
      </div>

      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        {/* Confidence Threshold Slider */}
        <div className="p-5 bg-[#090909] border border-[#2A2A2A] rounded-[18px] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F8F6F3] uppercase tracking-wider">
              Minimum AI Confidence Threshold
            </span>
            <span className="font-mono text-base font-bold text-[#C8A45D]">
              {confidenceThresholdPercent}% Confidence Required
            </span>
          </div>
          <input
            type="range"
            min="70"
            max="99"
            step="1"
            value={confidenceThresholdPercent}
            onChange={(e) => onChangeThreshold(Number(e.target.value))}
            className="w-full accent-[#C8A45D] cursor-pointer"
          />
          <p className="text-[11px] text-[#8E8A85]">
            Actions with confidence below {confidenceThresholdPercent}% will be automatically routed to the Human-in-the-Loop Approval Center.
          </p>
        </div>

        {/* Human Approval Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-[#F8F6F3] block">
                Require Approval for High-Risk Actions
              </span>
              <span className="text-[11px] text-[#8E8A85]">
                Mandates human sign-off for PO issuance and pricing adjustments.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onToggleApprovalRule("requireHumanApprovalHighRisk")}
              className="cursor-pointer"
            >
              {requireHumanApprovalHighRisk ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-[#8E8A85]" />
              )}
            </button>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-[#F8F6F3] block">
                Auto-Execute Low-Risk Tasks
              </span>
              <span className="text-[11px] text-[#8E8A85]">
                Allows AI to automatically trigger low-risk notifications & tags.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onToggleApprovalRule("autoExecuteLowRiskTasks")}
              className="cursor-pointer"
            >
              {autoExecuteLowRiskTasks ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-[#8E8A85]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
