"use client";

import { useState } from "react";
import { CheckSquare, Square, Filter, ChevronDown, Download, Trash2 } from "lucide-react";

export default function AdminTable({
  columns = [],
  data = [],
  onRowClick = null,
  bulkActions = [],
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((d) => d.id));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-[#2563EB]/15 border border-[#2563EB]/40 rounded-[14px] flex items-center justify-between text-xs text-[#3B82F6] font-bold">
          <span>{selectedIds.length} item(s) selected</span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1 bg-[#141414] hover:bg-[#222222] text-[#F8F6F3] rounded-[8px] border border-[#2A2A2A] text-[11px] cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Table Frame */}
      <div className="bg-[#141414] border border-[#222222] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#0D0D0D] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#222222] sticky top-0 z-10">
              <tr>
                <th className="py-4 px-4 w-10 text-center">
                  <button type="button" onClick={toggleSelectAll} className="cursor-pointer">
                    {selectedIds.length === data.length && data.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#3B82F6]" />
                    ) : (
                      <Square className="w-4 h-4 text-[#8E8A85]" />
                    )}
                  </button>
                </th>
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-4 px-4 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {data.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#1A1A1A]/80 transition-colors font-sans ${
                      isSelected ? "bg-[#2563EB]/10" : ""
                    }`}
                  >
                    <td className="py-4 px-4 text-center">
                      <button type="button" onClick={() => toggleSelectRow(row.id)} className="cursor-pointer">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#3B82F6]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#8E8A85]" />
                        )}
                      </button>
                    </td>

                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        onClick={() => onRowClick && onRowClick(row)}
                        className={`py-4 px-4 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""} ${onRowClick ? "cursor-pointer" : ""}`}
                      >
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
