"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2, XCircle, Flag, Heart } from "lucide-react";

export default function CustomerFeedbackView({ feedback, onModerateFeedback }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Customer Feedback & Product Review Moderation
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Govern product reviews, store appointment feedback, star ratings, and CSAT survey responses.
        </p>
      </div>

      <div className="space-y-4">
        {feedback.map((fb) => (
          <div
            key={fb.id}
            className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[22px] shadow-xl space-y-3 hover:border-[#C8A45D]/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center text-[#C8A45D] text-xs">
                    {"★".repeat(fb.rating)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#8E8A85] border border-[#2A2A2A] rounded uppercase">
                    {fb.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      fb.status === "Published"
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {fb.status}
                  </span>
                </div>
                <h3 className="font-editorial text-xl text-[#F8F6F3]">
                  {fb.productName}
                </h3>
              </div>
              <span className="text-xs text-[#8E8A85] font-mono">{fb.date}</span>
            </div>

            <p className="text-xs text-[#F8F6F3] italic">"{fb.comment}"</p>

            <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between">
              <span className="text-xs text-[#8E8A85]">
                By <strong className="text-[#F8F6F3]">{fb.customerName}</strong>
              </span>

              {fb.status !== "Published" && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onModerateFeedback(fb.id, "Published")}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-[#090909] text-xs font-bold uppercase rounded-[8px] cursor-pointer"
                  >
                    Approve & Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => onModerateFeedback(fb.id, "Rejected")}
                    className="px-3 py-1 bg-[#090909] hover:bg-rose-950 text-rose-400 border border-[#2A2A2A] text-xs font-bold uppercase rounded-[8px] cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
