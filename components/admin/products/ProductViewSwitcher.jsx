"use client";

import { Table, LayoutGrid, List, Kanban } from "lucide-react";

export default function ProductViewSwitcher({ currentView, onViewChange }) {
  const views = [
    { id: "table", label: "Table View", icon: Table },
    { id: "grid", label: "Grid View", icon: LayoutGrid },
    { id: "list", label: "Compact List", icon: List },
    { id: "kanban", label: "Kanban Board", icon: Kanban },
  ];

  return (
    <div className="flex items-center gap-1 bg-[#0D0D0D] p-1 rounded-[12px] border border-[#2A2A2A]">
      {views.map((v) => {
        const Icon = v.icon;
        const isActive = currentView === v.id;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onViewChange(v.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? "bg-[#C8A45D] text-[#090909] shadow-md"
                : "text-[#8E8A85] hover:text-[#F8F6F3] hover:bg-[#1A1A1A]"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        );
      })}
    </div>
  );
}
