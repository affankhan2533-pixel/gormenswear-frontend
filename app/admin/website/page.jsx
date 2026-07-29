"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/shell/AdminShell";
import ClientSectionEditDrawer from "@/components/admin/website/ClientSectionEditDrawer";
import {
  Globe, Layout, Eye, EyeOff, Edit3, ArrowUp, ArrowDown,
  Sparkles, CheckCircle2, RefreshCw, Code, Image as ImageIcon,
  ChevronRight, ExternalLink, ShieldCheck, Save
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function ClientWebsiteManagerPage() {
  const { success, error: toastError } = useToast();
  const [theme, setTheme] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [publishing, setPublishing] = useState(false);

  // Load Storefront Theme Configuration
  const loadTheme = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/theme`);
      const json = await res.json();
      if (json.success && json.theme) {
        setTheme(json.theme);
        setSections(json.theme.sections || []);
      }
    } catch (err) {
      console.error("Failed to load storefront theme:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  // Quick Toggle Section Visibility
  const handleToggleVisibility = async (secId, currentStatus) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/theme/section-update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: secId,
          enabled: !currentStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSections(json.theme.sections || []);
        success("Visibility Updated", `Section is now ${!currentStatus ? "visible" : "hidden"}.`);
      }
    } catch (err) {
      toastError("Update Failed", err.message);
    }
  };

  // Reorder Sections Up/Down
  const handleMoveSection = async (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);
    setSections(reordered);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/theme`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: reordered }),
      });
      const json = await res.json();
      if (json.success) {
        success("Layout Reordered", "Homepage section order saved.");
      }
    } catch (err) {
      toastError("Reorder Failed", err.message);
    }
  };

  // Publish Live Storefront Changes
  const handlePublishLive = async () => {
    setPublishing(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/theme/publish`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setTheme(json.theme);
        success("Website Published Live", "Storefront updated live with zero downtime!");
      } else {
        toastError("Publish Failed", json.error);
      }
    } catch (err) {
      toastError("Publish Failed", err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6 max-w-6xl pb-24 text-xs">
        {/* Top Banner & Header Bar */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[20px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] bg-[#C8A45D]/15 border border-[#C8A45D]/30 flex items-center justify-center text-[#C8A45D]">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-[#F0EDE8]">Website Manager</h1>
                <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live Storefront
                </span>
              </div>
              <p className="text-xs text-[#777] mt-0.5">
                Update your homepage content, banners, and sections in under 5 minutes — 100% merchant friendly without code.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Advanced Developer Mode Trigger */}
            <Link
              href="/admin/theme"
              className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-[#AAA] hover:text-[#C8A45D] text-xs font-bold rounded-[8px] flex items-center gap-1.5 transition-colors"
              title="Open Developer Mode (Theme Builder Studio)"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Advanced Developer Tools</span>
            </Link>

            <button
              type="button"
              onClick={handlePublishLive}
              disabled={publishing}
              className="px-4 py-2 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] font-bold text-xs rounded-[8px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{publishing ? "Publishing..." : "Publish Website Live"}</span>
            </button>
          </div>
        </div>

        {/* Homepage Sections List */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[20px] overflow-hidden shadow-xl">
          <div className="p-4 bg-[#141414] border-b border-[#1E1E1E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4 text-[#C8A45D]" />
              <h2 className="text-sm font-bold text-[#E8E4DF]">Homepage Sections ({sections.length})</h2>
            </div>
            <span className="text-[10px] text-[#666]">Click Edit to update content or media</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#666]">Loading homepage sections...</div>
          ) : sections.length === 0 ? (
            <div className="p-12 text-center text-[#666]">No website sections found.</div>
          ) : (
            <div className="divide-y divide-[#1A1A1A]">
              {sections.map((sec, index) => {
                const imgUrl = sec.settings?.bgImage || sec.settings?.image || "/images/lookbook/gor-lookbook-1.webp";
                const isFirst = index === 0;
                const isLast = index === sections.length - 1;

                return (
                  <div
                    key={sec.id}
                    className="p-4 flex items-center justify-between hover:bg-[#141414] transition-colors group"
                  >
                    {/* Section Info & Image Thumbnail */}
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Section Thumbnail */}
                      <div className="w-16 h-12 rounded-[8px] bg-[#0E0E0E] border border-[#222] overflow-hidden shrink-0 flex items-center justify-center">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[#E8E4DF] truncate">{sec.name}</h3>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                              sec.enabled ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                            }`}
                          >
                            {sec.enabled ? "Active" : "Hidden"}
                          </span>
                        </div>
                        <p className="text-xs text-[#777] truncate mt-0.5 max-w-md">
                          {sec.settings?.heading || sec.settings?.title || "Homepage Section"}
                        </p>
                      </div>
                    </div>

                    {/* Quick Section Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-0.5 bg-[#161616] border border-[#222] rounded-[6px] p-0.5">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => handleMoveSection(index, "up")}
                          className="p-1 text-[#777] hover:text-[#C8A45D] disabled:opacity-30 disabled:hover:text-[#777]"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => handleMoveSection(index, "down")}
                          className="p-1 text-[#777] hover:text-[#C8A45D] disabled:opacity-30 disabled:hover:text-[#777]"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Visibility Quick Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(sec.id, sec.enabled)}
                        className={`p-2 rounded-[6px] border transition-colors ${
                          sec.enabled
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        }`}
                        title={sec.enabled ? "Hide Section" : "Show Section"}
                      >
                        {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Client Edit Button */}
                      <button
                        type="button"
                        onClick={() => setEditingSection(sec)}
                        className="px-3.5 py-1.5 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] font-bold text-xs rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Section</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Client Section Edit Slide-Over Drawer */}
        <ClientSectionEditDrawer
          isOpen={!!editingSection}
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSectionSaved={(updatedTheme) => {
            if (updatedTheme) {
              setTheme(updatedTheme);
              setSections(updatedTheme.sections || []);
            } else {
              loadTheme();
            }
          }}
        />
      </div>
    </AdminShell>
  );
}
