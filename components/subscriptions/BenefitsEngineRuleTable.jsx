"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Percent, Truck, Lock, Crown, CheckCircle2, Sliders } from "lucide-react";

export default function BenefitsEngineRuleTable({ benefitsRules, onToggleBenefitStatus }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#C8A45D]" />
          <div>
            <h3 className="font-editorial text-xl text-[#F8F6F3]">
              Configurable Membership Benefits Engine
            </h3>
            <p className="text-xs text-[#8E8A85]">
              Active rule set governing checkout discounts, shipping waivers, and private drop access.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">Benefit Rule Name</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4 text-center">Target Tier</th>
                <th className="py-4 px-4 text-center">Value</th>
                <th className="py-4 px-4">Rule Description</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {benefitsRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                  <td className="py-4 px-4 font-semibold text-[#F8F6F3]">
                    {rule.name}
                  </td>

                  <td className="py-4 px-4 text-[#C8A45D]">
                    {rule.type}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#090909] text-[#F8F6F3] border border-[#2A2A2A] rounded">
                      {rule.targetTier}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-emerald-400">
                    {rule.value}
                  </td>

                  <td className="py-4 px-4 text-[#8E8A85] max-w-xs truncate">
                    {rule.description}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        rule.status === "Active"
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {rule.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onToggleBenefitStatus(rule.id)}
                      className="px-3 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                    >
                      {rule.status === "Active" ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
