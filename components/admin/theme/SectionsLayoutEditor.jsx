"use client";

import { useState, useEffect, useRef } from "react";
import {
  GripVertical, Eye, EyeOff, Copy, Lock, Unlock, Trash2,
  ChevronDown, ChevronUp, Plus, Layout, Type, ShoppingBag,
  Tag, Mail, HelpCircle, Edit3, Sparkles, Check, X, AlertTriangle, RotateCcw
} from "lucide-react";

export default function SectionsLayoutEditor({
  sections,
  selectedSectionId,
  onSelectSection,
  onUpdateSections,
  onOpenBlockLibrary,
  onUndoDelete,
  onShowToast,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [lockedSections, setLockedSections] = useState({});
  const [collapsedSections, setCollapsedSections] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState(null); // { x, y, sectionId }
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger when user is typing in an input/textarea
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

      if (e.key === "Escape") {
        setContextMenu(null);
        setSelectedIds([]);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d" && selectedSectionId) {
        e.preventDefault();
        duplicateSection(selectedSectionId);
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedSectionId) {
        e.preventDefault();
        deleteSection(selectedSectionId);
      } else if (e.key === "ArrowUp" && selectedSectionId) {
        e.preventDefault();
        const idx = sections.findIndex((s) => s.id === selectedSectionId);
        if (idx > 0) moveSection(idx, idx - 1);
      } else if (e.key === "ArrowDown" && selectedSectionId) {
        e.preventDefault();
        const idx = sections.findIndex((s) => s.id === selectedSectionId);
        if (idx >= 0 && idx < sections.length - 1) moveSection(idx, idx + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSectionId, sections]);

  // Drag & Drop Handlers
  const handleDragStart = (index, e) => {
    const sec = sections[index];
    if (lockedSections[sec.id]) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index, e) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (index, e) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    moveSection(draggedIndex, index);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveSection = (fromIndex, toIndex) => {
    const updated = [...sections];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onUpdateSections(updated);
  };

  // Section Operations
  const toggleVisibility = (id, e) => {
    e?.stopPropagation();
    const updated = sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    onUpdateSections(updated);
  };

  const toggleLock = (id, e) => {
    e?.stopPropagation();
    setLockedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCollapse = (id, e) => {
    e?.stopPropagation();
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const duplicateSection = (id, e) => {
    e?.stopPropagation();
    const sec = sections.find((s) => s.id === id);
    if (!sec) return;
    const copy = {
      ...sec,
      id: `${sec.type}_${Date.now()}`,
      name: `${sec.name} (Copy)`,
    };
    const idx = sections.findIndex((s) => s.id === id);
    const updated = [...sections];
    updated.splice(idx + 1, 0, copy);
    onUpdateSections(updated);
    onSelectSection(copy.id);
  };

  const deleteSection = (id, e) => {
    e?.stopPropagation();
    const sec = sections.find((s) => s.id === id);
    if (!sec) return;

    if (!window.confirm(`Delete section '${sec.name}'?`)) return;

    const updated = sections.filter((s) => s.id !== id);
    onUpdateSections(updated);

    if (selectedSectionId === id && updated.length > 0) {
      onSelectSection(updated[0].id);
    }

    if (onUndoDelete) {
      onUndoDelete(sec);
    }
  };

  // Context Menu Handlers
  const handleContextMenu = (sec, e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      section: sec,
    });
  };

  const handleStartRename = (sec) => {
    setRenamingId(sec.id);
    setRenameValue(sec.name);
    setContextMenu(null);
  };

  const handleSaveRename = (id) => {
    if (renameValue.trim()) {
      const updated = sections.map((s) => (s.id === id ? { ...s, name: renameValue.trim() } : s));
      onUpdateSections(updated);
    }
    setRenamingId(null);
  };

  const getSectionIcon = (type) => {
    switch (type) {
      case "hero": return Layout;
      case "announcement": return Tag;
      case "collections":
      case "featured_products": return ShoppingBag;
      case "newsletter": return Mail;
      case "brand_story": return Type;
      default: return Layout;
    }
  };

  return (
    <div className="space-y-2 relative" onClick={() => setContextMenu(null)}>
      {/* Prominent Add Section Button */}
      <button
        type="button"
        onClick={onOpenBlockLibrary}
        className="w-full py-2.5 px-3 bg-[#C8A45D]/15 hover:bg-[#C8A45D]/25 border border-[#C8A45D]/40 text-[#C8A45D] font-bold text-xs rounded-[10px] flex items-center justify-center gap-2 transition-colors cursor-pointer mb-3"
      >
        <Plus className="w-4 h-4" />
        <span>Add Section Block</span>
      </button>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="p-8 text-center bg-[#161616] border border-[#222] rounded-[12px] space-y-2">
          <Layout className="w-8 h-8 text-[#555] mx-auto" />
          <p className="text-xs font-bold text-[#E8E4DF]">Start building your page</p>
          <button
            type="button"
            onClick={onOpenBlockLibrary}
            className="px-4 py-2 bg-[#C8A45D] text-[#0D0D0D] font-bold text-xs rounded-[8px]"
          >
            Add First Section
          </button>
        </div>
      ) : (
        sections.map((sec, index) => {
          const isSelected = selectedSectionId === sec.id;
          const isLocked = !!lockedSections[sec.id];
          const isCollapsed = !!collapsedSections[sec.id];
          const isDragOver = dragOverIndex === index;
          const IconComp = getSectionIcon(sec.type);

          return (
            <div
              key={sec.id}
              draggable={!isLocked}
              onDragStart={(e) => handleDragStart(index, e)}
              onDragOver={(e) => handleDragOver(index, e)}
              onDrop={(e) => handleDrop(index, e)}
              onContextMenu={(e) => handleContextMenu(sec, e)}
              onClick={() => onSelectSection(sec.id)}
              className={`group bg-[#141414] border rounded-[12px] transition-all cursor-pointer overflow-hidden ${
                isSelected ? "border-[#C8A45D] bg-[#1C1C1C] shadow-lg" : "border-[#222] hover:border-[#333]"
              } ${isDragOver ? "border-t-2 border-t-[#C8A45D] bg-[#222]" : ""}`}
            >
              {/* Row Bar Header */}
              <div className="p-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="text-[#555] group-hover:text-[#AAA] cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  <div className="w-6 h-6 rounded bg-[#1C1C1C] flex items-center justify-center text-[#C8A45D] shrink-0">
                    <IconComp className="w-3.5 h-3.5" />
                  </div>

                  {renamingId === sec.id ? (
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleSaveRename(sec.id)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveRename(sec.id)}
                      autoFocus
                      className="px-2 py-0.5 bg-[#101010] border border-[#C8A45D] rounded text-xs text-[#E8E4DF]"
                    />
                  ) : (
                    <span className={`text-xs font-bold truncate ${sec.enabled ? "text-[#E8E4DF]" : "text-[#555] line-through"}`}>
                      {sec.name}
                    </span>
                  )}
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => toggleVisibility(sec.id, e)}
                    className="p-1 text-[#666] hover:text-[#E8E4DF] rounded"
                    title={sec.enabled ? "Hide Section" : "Show Section"}
                  >
                    {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => toggleLock(sec.id, e)}
                    className="p-1 text-[#666] hover:text-[#E8E4DF] rounded"
                    title={isLocked ? "Unlock Section" : "Lock Section"}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => duplicateSection(sec.id, e)}
                    className="p-1 text-[#666] hover:text-[#C8A45D] rounded"
                    title="Duplicate Section (Ctrl+D)"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => deleteSection(sec.id, e)}
                    className="p-1 text-[#666] hover:text-rose-400 rounded"
                    title="Delete Section (Delete)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Context Menu Dropdown */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 bg-[#161616] border border-[#262626] rounded-[10px] p-1.5 shadow-2xl w-44 text-xs space-y-1 text-[#E8E4DF]"
        >
          <button
            type="button"
            onClick={() => handleStartRename(contextMenu.section)}
            className="w-full text-left px-2.5 py-1.5 hover:bg-[#222] rounded flex items-center gap-2"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Rename</span>
          </button>
          <button
            type="button"
            onClick={() => duplicateSection(contextMenu.section.id)}
            className="w-full text-left px-2.5 py-1.5 hover:bg-[#222] rounded flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5 text-[#AAA]" />
            <span>Duplicate</span>
          </button>
          <button
            type="button"
            onClick={() => toggleVisibility(contextMenu.section.id)}
            className="w-full text-left px-2.5 py-1.5 hover:bg-[#222] rounded flex items-center gap-2"
          >
            <Eye className="w-3.5 h-3.5 text-[#AAA]" />
            <span>{contextMenu.section.enabled ? "Hide" : "Show"}</span>
          </button>
          <button
            type="button"
            onClick={() => toggleLock(contextMenu.section.id)}
            className="w-full text-left px-2.5 py-1.5 hover:bg-[#222] rounded flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{lockedSections[contextMenu.section.id] ? "Unlock" : "Lock"}</span>
          </button>

          <div className="border-t border-[#262626] pt-1">
            <button
              type="button"
              onClick={() => deleteSection(contextMenu.section.id)}
              className="w-full text-left px-2.5 py-1.5 hover:bg-rose-500/20 text-rose-400 rounded flex items-center gap-2 font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
