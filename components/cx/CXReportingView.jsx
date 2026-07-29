"use client";

import { motion } from "framer-motion";
import { Users, BarChart3, Star, Clock, CheckCircle2 } from "lucide-react";

export default function CXReportingView({ reportingData }) {
  const { agentLeaderboard, channelVolume } = reportingData;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Support Reporting & Concierge Agent Performance Analytics
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Track agent CSAT ratings, First Response Time (FRT), case volume distribution, and resolution velocity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agent Leaderboard */}
        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
          <div className="border-b border-[#2A2A2A] pb-3">
            <h3 className="font-editorial text-2xl text-[#F8F6F3]">
              Concierge Agent Performance Leaderboard
            </h3>
          </div>

          <div className="space-y-3">
            {agentLeaderboard.map((ag, i) => (
              <div key={i} className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#F8F6F3] block">{ag.name}</span>
                  <span className="text-[11px] text-[#8E8A85]">
                    Resolved: <strong className="text-[#F8F6F3]">{ag.casesResolved} cases</strong> • Avg: <strong className="text-emerald-400 font-mono">{ag.avgTime}</strong>
                  </span>
                </div>
                <span className="font-editorial text-lg font-bold text-[#C8A45D]">
                  ★ {ag.csat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Volume Distribution */}
        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
          <div className="border-b border-[#2A2A2A] pb-3">
            <h3 className="font-editorial text-2xl text-[#F8F6F3]">
              Channel Interaction Volume Distribution
            </h3>
          </div>

          <div className="space-y-4">
            {channelVolume.map((ch, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#F8F6F3]">{ch.channel}</span>
                  <span className="font-mono text-[#C8A45D] font-bold">{ch.percentage} ({ch.volume} chats)</span>
                </div>
                <div className="w-full h-2 bg-[#090909] rounded-full overflow-hidden border border-[#2A2A2A]">
                  <div
                    className="h-full bg-[#C8A45D] rounded-full"
                    style={{ width: ch.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
