"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, ThumbsUp, Eye, FileText } from "lucide-react";

export default function KnowledgeBaseView({ articles }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
            Knowledge Base & Care Manuals
          </h2>
          <p className="text-xs text-[#8E8A85]">
            Searchable repository for FAQs, luxury garment care guides, alteration policies, and international shipping protocols.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#8E8A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs & care guides..."
            className="w-full pl-10 pr-4 py-2 bg-[#151515] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[22px] shadow-xl space-y-3 hover:border-[#C8A45D]/40 transition-colors"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded uppercase">
                {art.category}
              </span>
              <div className="flex items-center gap-3 text-xs text-[#8E8A85]">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {art.views}</span>
                <span className="flex items-center gap-1 text-emerald-400"><ThumbsUp className="w-3.5 h-3.5" /> {art.helpfulCount}</span>
              </div>
            </div>

            <h3 className="font-editorial text-2xl text-[#F8F6F3]">{art.title}</h3>
            <p className="text-xs text-[#8E8A85]">{art.summary}</p>
            <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] text-xs text-[#F8F6F3] font-mono">
              {art.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
