"use client";

import { CheckCircle2, Circle, Sparkles, ShieldCheck, Eye, Calendar, Clock } from "lucide-react";

export default function EditorPublishingPanel({ formData, onChangeStatus }) {
  const checklist = [
    { label: "Product Title & Brand", done: Boolean(formData.name) },
    { label: "Retail Pricing & Cost", done: Boolean(formData.price) },
    { label: "SKU Identifier Code", done: Boolean(formData.sku) },
    { label: "SEO Title & Slug", done: Boolean(formData.seoTitle || formData.name) },
    { label: "Images Placeholder", done: true },
    { label: "Inventory Threshold", done: Boolean(formData.stock !== undefined) },
  ];

  const completedCount = checklist.filter((c) => c.done).length;
  const isReadyForPublish = completedCount === checklist.length;

  return (
    <div className="space-y-6 sticky top-36 z-10 select-none">
      {/* Publishing Card */}
      <div className="p-5 bg-[#141414] border border-[#222222] rounded-[24px] shadow-xl space-y-4">
        <div className="border-b border-[#2A2A2A] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8A45D] font-bold block mb-0.5">
            PUBLISHING GOVERNANCE
          </span>
          <h3 className="font-editorial text-xl text-[#F8F6F3]">Publishing Status</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-[#8E8A85] uppercase mb-1">
              Current Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => onChangeStatus("status", e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
            >
              <option value="Active">Active (Published)</option>
              <option value="Draft">Draft Proposal</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8E8A85] uppercase mb-1">
              Storefront Visibility
            </label>
            <select
              value={formData.visibility}
              onChange={(e) => onChangeStatus("visibility", e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3 py-2 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
            >
              <option value="Published">Visible on Storefront</option>
              <option value="Hidden">Hidden from Search & Catalog</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Readiness Checklist */}
      <div className="p-5 bg-[#141414] border border-[#222222] rounded-[24px] shadow-xl space-y-3">
        <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
          <h4 className="font-editorial text-lg text-[#F8F6F3]">Readiness Checklist</h4>
          <span className="text-xs font-mono font-bold text-[#C8A45D]">
            {completedCount} / {checklist.length}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[#8E8A85]">
              {item.done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-[#2A2A2A] shrink-0" />
              )}
              <span className={item.done ? "text-[#F8F6F3] font-medium" : "text-[#8E8A85]"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SEO & Health Score Card */}
      <div className="p-5 bg-[#141414] border border-[#222222] rounded-[24px] shadow-xl space-y-3">
        <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
          <h4 className="font-editorial text-lg text-[#F8F6F3]">Product Health Score</h4>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>

        <div className="p-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[14px] text-center space-y-1">
          <span className="font-editorial text-3xl font-bold text-[#C8A45D]">
            96 / 100
          </span>
          <span className="text-[10px] text-emerald-400 font-mono block">Grade A+ Production Ready</span>
        </div>
      </div>
    </div>
  );
}
