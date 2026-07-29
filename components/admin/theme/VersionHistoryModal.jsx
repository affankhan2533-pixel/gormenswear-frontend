"use client";

import { useState } from "react";
import {
  History, Search, Plus, RotateCcw, Eye, Sparkles, X, Check,
  Calendar, User, Tag, Clock, FileText, ArrowRight, ShieldCheck, Trash2
} from "lucide-react";

export default function VersionHistoryModal({
  isOpen,
  onClose,
  versionHistory = [],
  currentSections = [],
  currentTokens = {},
  onSaveManualVersion,
  onRestoreVersion,
  onDeleteVersion,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Manual Version Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [versionName, setVersionName] = useState("");
  const [versionNotes, setVersionNotes] = useState("");

  // Version Comparison State
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareV1, setCompareV1] = useState(null);
  const [compareV2, setCompareV2] = useState(null);

  if (!isOpen) return null;

  const handleCreateVersion = (e) => {
    e.preventDefault();
    if (!versionName.trim()) return;
    onSaveManualVersion(versionName.trim(), versionNotes.trim());
    setVersionName("");
    setVersionNotes("");
    setShowCreateModal(false);
  };

  const openCompare = (v1, v2) => {
    setCompareV1(v1);
    setCompareV2(v2 || { name: "Current Live Draft", sections: currentSections, themeTokens: currentTokens });
    setShowCompareModal(true);
  };

  const filteredVersions = versionHistory.filter((v) => {
    const matchesSearch =
      (v.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.notes || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.createdBy || "").toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== "All" && v.status !== statusFilter) return false;
    return true;
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111] border border-[#1E1E1E] rounded-[20px] max-w-4xl w-full h-[680px] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        {/* Modal Header */}
        <div className="p-4 bg-[#141414] border-b border-[#1E1E1E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#C8A45D]" />
            <div>
              <h2 className="text-sm font-bold text-[#F0EDE8]">Version History & Comparison Engine</h2>
              <p className="text-[11px] text-[#777]">Save named versions, compare layout diffs, and safely restore historical snapshots</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] text-xs font-bold rounded-[8px] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Version Snapshot</span>
            </button>
            <button type="button" onClick={onClose} className="p-1 text-[#666] hover:text-[#FFF]">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="p-3.5 bg-[#121212] border-b border-[#1A1A1A] grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search versions by name, notes, author..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
            >
              <option value="All">All Version Statuses</option>
              <option value="Published">Published Live</option>
              <option value="Draft Snapshot">Draft Snapshots</option>
              <option value="Restored">Restored Versions</option>
            </select>
          </div>
        </div>

        {/* Versions Timeline List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
          {filteredVersions.length === 0 ? (
            <div className="py-16 text-center text-[#666] space-y-2">
              <History className="w-8 h-8 mx-auto text-[#444]" />
              <p className="text-xs">No theme versions found matching selected criteria.</p>
            </div>
          ) : (
            filteredVersions.map((v) => (
              <div
                key={v.versionId}
                className="bg-[#151515] border border-[#222] hover:border-[#333] rounded-[14px] p-4 space-y-2 transition-all shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#E8E4DF]">{v.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${
                      v.status === "Published" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                      v.status === "Restored" ? "bg-sky-500/15 text-sky-400 border-sky-500/30" :
                      "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    }`}>
                      {v.status || "Snapshot"}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[#C8A45D]">{v.versionId}</span>
                </div>

                {v.notes && <p className="text-xs text-[#888]">{v.notes}</p>}

                <div className="pt-2 border-t border-[#202020] flex items-center justify-between text-xs text-[#666]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {v.createdBy || "Super Admin"}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(v.publishedAt).toLocaleString()}</span>
                    <span>{(v.sections || []).length} Sections</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openCompare(v)}
                      className="px-2.5 py-1 bg-[#1F1F1F] hover:bg-[#282828] border border-[#2C2C2C] text-[#C8A45D] rounded text-[11px] font-bold cursor-pointer"
                    >
                      Compare Diffs
                    </button>
                    <button
                      type="button"
                      onClick={() => onRestoreVersion(v.versionId)}
                      className="px-3 py-1 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] rounded text-[11px] font-bold cursor-pointer"
                    >
                      Restore Version
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manual Version Creation Sub-Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateVersion} className="bg-[#111] border border-[#1E1E1E] rounded-[16px] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-sm font-bold text-[#E8E4DF]">Create Manual Theme Version Snapshot</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-[#666] hover:text-[#FFF]">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#888] block mb-1">Version Name *</label>
                <input
                  type="text"
                  required
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder="e.g. Summer Campaign v1.2"
                  className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#888] block mb-1">Notes / Changelog Summary</label>
                <textarea
                  rows={3}
                  value={versionNotes}
                  onChange={(e) => setVersionNotes(e.target.value)}
                  placeholder="Updated hero banner, mobile padding, and accent gold tokens..."
                  className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowCreateModal(false)} className="w-1/2 py-2 bg-[#1C1C1C] text-xs text-[#888] rounded-[8px]">Cancel</button>
              <button type="submit" className="w-1/2 py-2 bg-[#C8A45D] text-[#0D0D0D] font-bold text-xs rounded-[8px]">Save Version</button>
            </div>
          </form>
        </div>
      )}

      {/* Side-by-Side Version Diff Comparison Modal */}
      {showCompareModal && compareV1 && compareV2 && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[20px] max-w-4xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
              <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                Side-by-Side Version Comparison Engine
              </h3>
              <button type="button" onClick={() => setShowCompareModal(false)} className="text-[#666] hover:text-[#FFF]">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#161616] border border-[#222] rounded-[12px] space-y-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Version A: {compareV1.name}</span>
                <p className="text-[11px] text-[#888]">Sections: {(compareV1.sections || []).length} items</p>
                <div className="space-y-1 font-mono text-[11px] text-[#AAA] p-2 bg-[#0E0E0E] rounded">
                  {(compareV1.sections || []).map((s) => (
                    <div key={s.id}>• {s.name} ({s.type})</div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#161616] border border-[#222] rounded-[12px] space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Version B: {compareV2.name}</span>
                <p className="text-[11px] text-[#888]">Sections: {(compareV2.sections || []).length} items</p>
                <div className="space-y-1 font-mono text-[11px] text-[#AAA] p-2 bg-[#0E0E0E] rounded">
                  {(compareV2.sections || []).map((s) => (
                    <div key={s.id}>• {s.name} ({s.type})</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button type="button" onClick={() => setShowCompareModal(false)} className="px-4 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#E8E4DF] font-bold rounded-[8px]">Close Comparison</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
