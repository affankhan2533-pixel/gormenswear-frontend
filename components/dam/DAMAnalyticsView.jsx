"use client";

import { motion } from "framer-motion";
import { HardDrive, BarChart3, Download, Layers } from "lucide-react";

export default function DAMAnalyticsView({ analyticsData }) {
  const { storageByType, topDownloaded } = analyticsData;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Storage Growth & Asset Usage Analytics
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Analyze storage consumption by media format, top downloaded brand assets, and copyright expiration timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Storage Breakdown */}
        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
          <div className="border-b border-[#2A2A2A] pb-3">
            <h3 className="font-editorial text-2xl text-[#F8F6F3]">
              Storage Consumption by Media Format
            </h3>
          </div>

          <div className="space-y-4">
            {storageByType.map((st, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#F8F6F3]">{st.type}</span>
                  <span className="font-mono text-[#C8A45D] font-bold">{st.usageGB} GB ({st.percentage})</span>
                </div>
                <div className="w-full h-2 bg-[#090909] rounded-full overflow-hidden border border-[#2A2A2A]">
                  <div
                    className="h-full bg-[#C8A45D] rounded-full"
                    style={{ width: st.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Downloaded Assets */}
        <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-4">
          <div className="border-b border-[#2A2A2A] pb-3">
            <h3 className="font-editorial text-2xl text-[#F8F6F3]">
              Most Downloaded Brand Assets
            </h3>
          </div>

          <div className="space-y-3">
            {topDownloaded.map((item, i) => (
              <div key={i} className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between">
                <span className="font-bold text-sm text-[#F8F6F3]">{item.name}</span>
                <span className="font-mono text-emerald-400 font-bold text-xs bg-[#151515] px-2.5 py-1 rounded-[6px] border border-[#2A2A2A]">
                  {item.downloads} downloads
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
