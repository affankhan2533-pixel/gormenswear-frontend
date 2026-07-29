"use client";

import {
  FileText,
  DollarSign,
  Package,
  Truck,
  Globe,
  Share2,
  BarChart3,
  Clock,
} from "lucide-react";

export default function EditorNavSidebar({ activeSection, onSelectSection }) {
  const sections = [
    { id: "section-general", label: "General", icon: FileText },
    { id: "section-pricing", label: "Pricing & Margins", icon: DollarSign },
    { id: "section-inventory", label: "Inventory & SKU", icon: Package },
    { id: "section-shipping", label: "Shipping & Logistics", icon: Truck },
    { id: "section-seo", label: "SEO & Google Preview", icon: Globe },
    { id: "section-marketing", label: "Marketing & Pairings", icon: Share2 },
    { id: "section-analytics", label: "Analytics (Read Only)", icon: BarChart3 },
    { id: "section-history", label: "Audit History", icon: Clock },
  ];

  return (
    <div className="bg-[#141414] border border-[#222222] rounded-[24px] p-3 space-y-1 sticky top-36 z-10 shadow-xl select-none">
      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8E8A85] px-3 py-2 block border-b border-[#2A2A2A] mb-1">
        Editor Sections
      </span>

      {sections.map((sec) => {
        const Icon = sec.icon;
        const isActive = activeSection === sec.id;

        return (
          <button
            key={sec.id}
            type="button"
            onClick={() => onSelectSection(sec.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer text-left ${
              isActive
                ? "bg-[#C8A45D] text-[#090909] font-bold shadow-md"
                : "text-[#8E8A85] hover:bg-[#0D0D0D] hover:text-[#F8F6F3]"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#090909]" : "text-[#8E8A85]"}`} />
            <span className="truncate">{sec.label}</span>
          </button>
        );
      })}
    </div>
  );
}
