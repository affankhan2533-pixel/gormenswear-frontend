"use client";

import { motion } from "framer-motion";
import { ToggleLeft, ToggleRight, Sliders, Users, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function FeatureFlagsView({ featureFlags, onToggleFlag, onChangeRollout }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
            Feature Flags & Gradual % Rollout Governance
          </h2>
          <p className="text-xs text-[#8E8A85]">
            Safely toggle new modules, perform canary deployments, and control percentage-based traffic allocation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featureFlags.map((flag) => (
          <div
            key={flag.id}
            className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl space-y-4 hover:border-[#C8A45D]/40 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#C8A45D] font-bold block mb-1">
                  {flag.key}
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">
                  {flag.name}
                </h3>
                <p className="text-xs text-[#8E8A85] mt-1">{flag.description}</p>
              </div>

              <button
                type="button"
                onClick={() => onToggleFlag(flag.id)}
                className="shrink-0 cursor-pointer"
              >
                {flag.enabled ? (
                  <ToggleRight className="w-8 h-8 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-[#8E8A85]" />
                )}
              </button>
            </div>

            {/* Rollout Slider */}
            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8E8A85] font-bold uppercase text-[10px]">
                  Gradual Traffic Allocation
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {flag.rolloutPercentage}% Traffic
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={flag.rolloutPercentage}
                onChange={(e) => onChangeRollout(flag.id, Number(e.target.value))}
                className="w-full accent-[#C8A45D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8E8A85]">
                <span>Targeting: <strong className="text-[#F8F6F3]">{flag.targetedSegment}</strong></span>
                <span>Canary Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
