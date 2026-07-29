"use client";

import { Globe, Search, Sparkles, ShieldCheck } from "lucide-react";

export default function SEOSection({ formData, onChange }) {
  const title = formData.seoTitle || formData.name || "";
  const metaDesc = formData.metaDescription || formData.shortDescription || "";
  const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div id="section-seo" className="p-6 bg-[#141414] border border-[#222222] rounded-[24px] space-y-6 shadow-xl">
      <div className="border-b border-[#2A2A2A] pb-3 flex justify-between items-center">
        <div>
          <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
            Search Engine Optimization (SEO) & Social Cards
          </h3>
          <p className="text-xs text-[#8E8A85]">
            Customize page title tags, meta descriptions, canonical URL slugs, and live Google search snippet previews.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-950/60 border border-purple-500/40 rounded-[10px] text-xs font-bold text-purple-300">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>SEO Grade A+ ({formData.seoScore || 94}/100)</span>
        </div>
      </div>

      {/* Live Google Preview Card */}
      <div className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[16px] space-y-1">
        <span className="text-[10px] font-mono font-bold uppercase text-[#C8A45D]">
          Google Search Result Snippet Preview
        </span>
        <div className="text-xs text-[#8E8A85] font-mono truncate">
          https://gormenswear.com/products/{slug}
        </div>
        <div className="font-editorial text-lg font-bold text-[#3B82F6] hover:underline cursor-pointer">
          {title} | GOR Menswear London
        </div>
        <p className="text-xs text-[#8E8A85] line-clamp-2">
          {metaDesc || "Shop the finest handcrafted Italian menswear, bespoke shearling jackets, raw silk shirts, and Savile Row tailoring."}
        </p>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Page Title Tag
          </label>
          <input
            type="text"
            value={formData.seoTitle || ""}
            onChange={(e) => onChange("seoTitle", e.target.value)}
            placeholder={formData.name}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Meta Description
          </label>
          <textarea
            rows={3}
            value={formData.metaDescription || ""}
            onChange={(e) => onChange("metaDescription", e.target.value)}
            placeholder="Meta description for search engines..."
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] p-3 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            URL Handle / Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => onChange("slug", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>
      </div>
    </div>
  );
}
