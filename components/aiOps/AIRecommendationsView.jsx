"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function AIRecommendationsView({ recommendations, onPromoteToApproval }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          AI Operational Recommendations Engine
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Autonomous recommendations for restocking, price tuning, retention campaigns, and multi-warehouse rebalancing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[22px] shadow-xl space-y-4 flex flex-col justify-between hover:border-[#C8A45D]/40 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded uppercase">
                  {rec.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400">
                  {rec.confidenceScore}% Confidence
                </span>
              </div>

              <h3 className="font-editorial text-2xl text-[#F8F6F3]">
                {rec.title}
              </h3>
              <p className="text-xs text-[#8E8A85]">{rec.description}</p>

              <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] text-xs flex justify-between items-center text-[#8E8A85]">
                <span>Estimated Impact: <strong className="text-emerald-400 font-bold">{rec.estimatedImpact}</strong></span>
                <span className="text-[10px] font-mono font-bold text-amber-400">{rec.riskLevel} Risk</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2A2A2A] flex justify-end">
              <button
                type="button"
                onClick={() => onPromoteToApproval(rec)}
                className="px-4 py-2 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md font-bold"
              >
                Submit to Approval Center <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
