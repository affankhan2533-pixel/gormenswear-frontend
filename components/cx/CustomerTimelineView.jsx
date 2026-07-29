"use client";

import { motion } from "framer-motion";
import { ShoppingBag, MessageSquare, Star, Heart, Clock, CheckCircle2, UserCheck } from "lucide-react";

export default function CustomerTimelineView({ timelineEvents }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Unified 360° Customer Interaction Timeline
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Single-view history aggregating orders, returns, support chats, wishlist updates, reviews, and loyalty tier milestones.
        </p>
      </div>

      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#C8A45D] font-bold uppercase">
              VIP PLATINUM ACCOUNT
            </span>
            <h3 className="font-editorial text-2xl text-[#F8F6F3]">
              Lord Julian Sterling (j.sterling@mayfair.co.uk)
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-[#090909] px-3 py-1.5 rounded-[10px] border border-[#2A2A2A]">
            Lifetime Value: $24,500.00
          </span>
        </div>

        {/* Timeline Events Feed */}
        <div className="relative border-l border-[#2A2A2A] ml-4 pl-6 space-y-6">
          {timelineEvents.map((evt) => (
            <div key={evt.id} className="relative group">
              {/* Event Marker */}
              <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-[#090909] border border-[#C8A45D] flex items-center justify-center text-[#C8A45D]">
                <Clock className="w-3 h-3" />
              </div>

              <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-1 hover:border-[#C8A45D]/40 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono font-bold text-[#C8A45D] uppercase">
                    {evt.type}
                  </span>
                  <span className="text-[10px] font-mono text-[#8E8A85]">{evt.date}</span>
                </div>
                <h4 className="font-editorial text-lg text-[#F8F6F3]">{evt.title}</h4>
                <p className="text-xs text-[#8E8A85]">{evt.details}</p>
                {evt.amount && (
                  <span className="text-xs font-mono font-bold text-emerald-400 block pt-1">
                    Amount: {evt.amount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
