"use client";

import { Clock, CheckCircle2, FileText, UserCheck } from "lucide-react";

export default function HistorySection({ updatedAt }) {
  const historyEvents = [
    { time: updatedAt || "2026-07-28 10:15", title: "Product Specification Saved", user: "Marcus Sterling (Brand Director)", detail: "Updated retail price and low stock alert threshold." },
    { time: "2026-07-20 14:00", title: "Published to Storefront", user: "Sarah Jenkins", detail: "Status set to Active and visibility set to Published." },
    { time: "2026-07-15 09:30", title: "Draft Created", user: "Marco Bellini", detail: "Initial SKU proposal registered from Hasselblad photo shoot." },
  ];

  return (
    <div id="section-history" className="p-6 bg-[#141414] border border-[#222222] rounded-[24px] space-y-6 shadow-xl">
      <div className="border-b border-[#2A2A2A] pb-3">
        <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
          Audit Trail & Revision History
        </h3>
        <p className="text-xs text-[#8E8A85]">
          Chronological record of editor updates, status changes, publication events, and staff authorizations.
        </p>
      </div>

      <div className="relative border-l border-[#2A2A2A] ml-3 pl-5 space-y-4">
        {historyEvents.map((evt, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[27px] top-0 w-4 h-4 rounded-full bg-[#0D0D0D] border border-[#C8A45D]" />
            <div className="p-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-[#8E8A85]">
                <span className="text-[#C8A45D] font-bold">{evt.user}</span>
                <span>{evt.time}</span>
              </div>
              <h4 className="font-bold text-xs text-[#F8F6F3]">{evt.title}</h4>
              <p className="text-xs text-[#8E8A85]">{evt.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
