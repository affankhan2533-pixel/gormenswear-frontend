"use client";

import { useState } from "react";
import { Sparkles, FileText, Tag, CheckCircle2 } from "lucide-react";

export default function GeneralSection({ formData, onChange }) {
  return (
    <div id="section-general" className="p-6 bg-[#141414] border border-[#222222] rounded-[24px] space-y-6 shadow-xl">
      <div className="border-b border-[#2A2A2A] pb-3">
        <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
          General Information
        </h3>
        <p className="text-xs text-[#8E8A85]">
          Configure core catalog metadata, product title, descriptions, brand identity, and taxonomy tags.
        </p>
      </div>

      {/* Title & Character Counter */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold text-[#8E8A85] uppercase">
            Product Title <span className="text-rose-400">*</span>
          </label>
          <span className="font-mono text-[#8E8A85] text-[10px]">
            {formData.name.length} / 120 chars
          </span>
        </div>
        <input
          type="text"
          value={formData.name}
          maxLength={120}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g. Biella Shearling Trimmed Suede Jacket"
          className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] px-4 py-3 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-medium"
        />
      </div>

      {/* Short Description */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold text-[#8E8A85] uppercase">
            Short Description / Subtitle
          </label>
          <span className="font-mono text-[#8E8A85] text-[10px]">
            {formData.shortDescription?.length || 0} / 250 chars
          </span>
        </div>
        <input
          type="text"
          value={formData.shortDescription || ""}
          maxLength={250}
          onChange={(e) => onChange("shortDescription", e.target.value)}
          placeholder="Brief summary for catalog cards and storefront search snippets..."
          className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] px-4 py-3 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
        />
      </div>

      {/* Full Description */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
          Full Garment Story & Craftsmanship Details
        </label>
        <textarea
          rows={5}
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Elaborate on Savile Row tailoring, Italian suede origins, horn button finishes, and care details..."
          className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] p-4 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Brand, Collection, Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Brand Identity
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => onChange("brand", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Collection
          </label>
          <input
            type="text"
            value={formData.collection}
            onChange={(e) => onChange("collection", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Taxonomy Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => onChange("category", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
          >
            <option value="Outerwear">Outerwear</option>
            <option value="Trousers">Trousers</option>
            <option value="Shirts">Shirts</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>
    </div>
  );
}
