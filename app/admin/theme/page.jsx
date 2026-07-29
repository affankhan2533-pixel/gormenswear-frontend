"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AdminShell from "@/components/admin/shell/AdminShell";
import RightPropertiesPanel from "@/components/admin/theme/RightPropertiesPanel";
import BlockLibraryModal from "@/components/admin/theme/BlockLibraryModal";
import SectionsLayoutEditor from "@/components/admin/theme/SectionsLayoutEditor";
import VersionHistoryModal from "@/components/admin/theme/VersionHistoryModal";
import { useToast } from "@/context/ToastContext";
import {
  Paintbrush, Layout, Palette, History, Monitor, Tablet, Smartphone,
  Eye, Save, Upload, RotateCcw, RotateCw, ArrowUp, ArrowDown, Copy, Trash2,
  Check, ChevronDown, ChevronUp, Image as ImageIcon, Video, Type,
  Sliders, Layers, Sparkles, RefreshCw, X, Plus, AlertCircle, Clock
} from "lucide-react";

export default function ThemeBuilderPage() {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved just now"); // "Saved just now" | "Saving..." | "Unsaved changes" | "Save failed"
  const [activeTab, setActiveTab] = useState("sections"); // "sections" | "tokens" | "history"
  const [deviceMode, setDeviceMode] = useState("desktop"); // "desktop" | "tablet" | "mobile"

  // Active Selected Section ID for Right Properties Panel
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isBlockLibraryOpen, setIsBlockLibraryOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // Deleted Section State for Undo Restoration
  const [deletedSection, setDeletedSection] = useState(null);

  // Theme Config State
  const [sections, setSections] = useState([]);
  const [themeTokens, setThemeTokens] = useState({
    primaryColor: "#090909",
    secondaryColor: "#151515",
    accentColor: "#C8A45D",
    typography: "Editorial Serif & Inter",
    buttonRadius: "Curved (8px)",
    containerWidth: "Luxury Max (1440px)",
    sectionSpacing: "Spacious (96px)",
  });
  const [status, setStatus] = useState("Draft");
  const [versionHistory, setVersionHistory] = useState([]);

  // ========================================================
  // PHASE 5 & 6: HISTORY STACK & AUTO SAVE
  // ========================================================
  const historyStackRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState([]);
  const autoSaveTimerRef = useRef(null);

  // Push State to History Stack
  const pushHistoryState = useCallback((newSections, newTokens, actionLabel = "State Changed") => {
    const nextState = {
      sections: JSON.parse(JSON.stringify(newSections)),
      themeTokens: JSON.parse(JSON.stringify(newTokens)),
    };

    const newStack = historyStackRef.current.slice(0, historyIndexRef.current + 1);
    newStack.push(nextState);
    if (newStack.length > 100) newStack.shift();

    historyStackRef.current = newStack;
    historyIndexRef.current = newStack.length - 1;

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setEditingTimeline((prev) => [{ time: timeStr, label: actionLabel, id: Date.now() }, ...prev].slice(0, 30));

    setSaveStatus("Unsaved changes");
    triggerAutoSave(newSections, newTokens);
  }, []);

  // Debounced Auto Save (1000ms)
  const triggerAutoSave = (secData, tokenData) => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      setSaveStatus("Saving...");
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/theme`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sections: secData, themeTokens: tokenData }),
        });
        const json = await res.json();
        if (json.success) {
          setSaveStatus("Saved just now");
        } else {
          setSaveStatus("Save failed");
        }
      } catch (err) {
        setSaveStatus("Save failed");
      }
    }, 1000);
  };

  // Undo Handler
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const targetState = historyStackRef.current[historyIndexRef.current];
      setSections(JSON.parse(JSON.stringify(targetState.sections)));
      setThemeTokens(JSON.parse(JSON.stringify(targetState.themeTokens)));
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyStackRef.current.length - 1);
      setSaveStatus("Unsaved changes");
    }
  }, []);

  // Redo Handler
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyStackRef.current.length - 1) {
      historyIndexRef.current += 1;
      const targetState = historyStackRef.current[historyIndexRef.current];
      setSections(JSON.parse(JSON.stringify(targetState.sections)));
      setThemeTokens(JSON.parse(JSON.stringify(targetState.themeTokens)));
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyStackRef.current.length - 1);
      setSaveStatus("Unsaved changes");
    }
  }, []);

  // Fetch Current Theme Config & Initialize History
  const loadTheme = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/theme`, { credentials: "include" });
      const json = await res.json();
      if (json.success && json.theme) {
        const loadedSections = json.theme.sections || [];
        const loadedTokens = json.theme.themeTokens || themeTokens;
        setSections(loadedSections);
        setThemeTokens(loadedTokens);
        if (loadedSections.length > 0 && !selectedSectionId) {
          setSelectedSectionId(loadedSections[0].id);
        }
        setStatus(json.theme.status || "Draft");
        setVersionHistory(json.theme.versionHistory || []);

        historyStackRef.current = [{ sections: loadedSections, themeTokens: loadedTokens }];
        historyIndexRef.current = 0;
      }
    } catch (err) {
      console.error("Failed to load theme config:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedSectionId, themeTokens]);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  // Save Manual Named Version
  const handleSaveManualVersion = async (name, notes) => {
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/theme/version`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, notes }),
      });
      const json = await res.json();
      if (json.success && json.theme) {
        setVersionHistory(json.theme.versionHistory || []);
        success("Version Saved", `Named version snapshot '${name}' created.`);
      } else {
        toastError("Version Failed", json.error);
      }
    } catch (err) {
      toastError("Version Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Restore Historical Version
  const handleRestoreVersion = async (versionId) => {
    if (!window.confirm("Restore this historical theme version?")) return;
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/theme/restore/${versionId}`, {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success && json.theme) {
        const resSec = json.theme.sections || [];
        const resTok = json.theme.themeTokens || themeTokens;
        setSections(resSec);
        setThemeTokens(resTok);
        setStatus("Published");
        setVersionHistory(json.theme.versionHistory || []);
        pushHistoryState(resSec, resTok, "Restored Version");
        success("Version Restored", "Theme restored to selected version.");
      } else {
        toastError("Restore Failed", json.error);
      }
    } catch (err) {
      toastError("Restore Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete Archived Version Snapshot
  const handleDeleteVersion = async (versionId) => {
    if (!window.confirm("Delete this archived version snapshot?")) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/theme/version/${versionId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success && json.theme) {
        setVersionHistory(json.theme.versionHistory || []);
        success("Version Removed", "Archived version snapshot deleted.");
      }
    } catch (err) {
      toastError("Delete Failed", err.message);
    }
  };

  // Insert New Block Section from Library Modal
  const handleInsertBlock = (block) => {
    const newSection = {
      id: `${block.type}_${Date.now()}`,
      type: block.type,
      name: block.name,
      enabled: true,
      settings: { ...(block.defaultSettings || {}) },
    };

    const updated = [...sections, newSection];
    setSections(updated);
    setSelectedSectionId(newSection.id);
    pushHistoryState(updated, themeTokens, `Added ${block.name}`);
    success("Section Added", `'${block.name}' section inserted into layout.`);
  };

  // Layout Updates from Drag & Drop Editor
  const handleUpdateSections = (newSections) => {
    setSections(newSections);
    pushHistoryState(newSections, themeTokens, "Reordered Layout");
  };

  // Update Section Settings
  const updateSectionSettings = (id, newSettings) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, settings: { ...s.settings, ...newSettings } } : s));
    setSections(updated);
    pushHistoryState(updated, themeTokens, "Property Updated");
  };

  // Reset Section Settings to Default
  const resetSectionDefault = (id) => {
    const updated = sections.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          settings: {
            ...s.settings,
            heading: "SAVILE ROW CRAFTSMANSHIP",
            subheading: "Redefining luxury menswear through precision tailoring and modern streetwear aesthetics",
            ctaText: "EXPLORE ATELIER COLLECTION",
            ctaLink: "/shop",
            bgImage: "/images/lookbook/gor-lookbook-1.webp",
            overlayOpacity: 40,
          },
        };
      }
      return s;
    });
    setSections(updated);
    pushHistoryState(updated, themeTokens, "Reset Section Defaults");
  };

  // Publish Live Theme
  const handlePublishTheme = async () => {
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/theme/publish`, {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        setStatus("Published");
        setSaveStatus("Saved just now");
        if (json.theme?.versionHistory) setVersionHistory(json.theme.versionHistory);
        success("Theme Published", "Live storefront layout and design tokens updated!");
      } else {
        toastError("Publish Failed", json.error);
      }
    } catch (err) {
      toastError("Publish Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  // Dynamic Viewport Size for Preview
  const getViewportWidth = () => {
    if (deviceMode === "mobile") return "w-[375px]";
    if (deviceMode === "tablet") return "w-[768px]";
    return "w-full max-w-[1280px]";
  };

  return (
    <AdminShell>
      <div className="space-y-4 max-w-7xl pb-24">
        {/* Top Header & Studio Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#F0EDE8] flex items-center gap-2">
                <Paintbrush className="w-6 h-6 text-[#C8A45D]" />
                Theme Builder Studio Phase 6
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                status === "Published" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30"
              }`}>
                {status}
              </span>

              {/* Auto Save Status Indicator */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                saveStatus === "Saving..." ? "bg-sky-500/15 text-sky-400 border-sky-500/30 animate-pulse" :
                saveStatus === "Saved just now" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                "bg-amber-500/15 text-amber-400 border-amber-500/30"
              }`}>
                {saveStatus}
              </span>
            </div>
            <p className="text-xs text-[#777] mt-0.5">
              Version History, side-by-side diff compare, named manual snapshots, and 1-click version restore
            </p>
          </div>

          {/* Controls & Version History Trigger */}
          <div className="flex items-center gap-3">
            {/* Version History Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsVersionModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-bold text-[#C8A45D] rounded-[8px] cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span>Version History ({versionHistory.length})</span>
            </button>

            {/* Undo / Redo Toolbar */}
            <div className="bg-[#141414] border border-[#222] rounded-[8px] p-1 flex items-center gap-1">
              <button
                type="button"
                onClick={handleUndo}
                disabled={!canUndo}
                className="p-1.5 hover:bg-[#222] text-[#777] hover:text-[#FFF] disabled:opacity-30 rounded transition-colors"
                title="Undo Action (Ctrl+Z)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={!canRedo}
                className="p-1.5 hover:bg-[#222] text-[#777] hover:text-[#FFF] disabled:opacity-30 rounded transition-colors"
                title="Redo Action (Ctrl+Y)"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Device Switcher */}
            <div className="bg-[#141414] border border-[#222] rounded-[8px] p-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setDeviceMode("desktop")}
                className={`p-1.5 rounded-[6px] transition-colors ${deviceMode === "desktop" ? "bg-[#C8A45D] text-[#0D0D0D]" : "text-[#777] hover:text-[#FFF]"}`}
                title="Desktop View (1440px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode("tablet")}
                className={`p-1.5 rounded-[6px] transition-colors ${deviceMode === "tablet" ? "bg-[#C8A45D] text-[#0D0D0D]" : "text-[#777] hover:text-[#FFF]"}`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode("mobile")}
                className={`p-1.5 rounded-[6px] transition-colors ${deviceMode === "mobile" ? "bg-[#C8A45D] text-[#0D0D0D]" : "text-[#777] hover:text-[#FFF]"}`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <button
              type="button"
              onClick={handlePublishTheme}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] text-xs font-bold rounded-[8px] transition-colors cursor-pointer shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Publish Live</span>
            </button>
          </div>
        </div>

        {/* Studio 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT PANEL: SECTIONS & TIMELINE (3 Cols) */}
          <div className="lg:col-span-3 bg-[#111] border border-[#1E1E1E] rounded-[16px] overflow-hidden flex flex-col h-[750px]">
            <div className="bg-[#141414] border-b border-[#1E1E1E] grid grid-cols-3 text-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("sections")}
                className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === "sections" ? "border-[#C8A45D] text-[#C8A45D]" : "border-transparent text-[#777] hover:text-[#AAA]"
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Sections</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tokens")}
                className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === "tokens" ? "border-[#C8A45D] text-[#C8A45D]" : "border-transparent text-[#777] hover:text-[#AAA]"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Tokens</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === "history" ? "border-[#C8A45D] text-[#C8A45D]" : "border-transparent text-[#777] hover:text-[#AAA]"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none">
              {activeTab === "sections" && (
                <SectionsLayoutEditor
                  sections={sections}
                  selectedSectionId={selectedSectionId}
                  onSelectSection={setSelectedSectionId}
                  onUpdateSections={handleUpdateSections}
                  onOpenBlockLibrary={() => setIsBlockLibraryOpen(true)}
                />
              )}

              {activeTab === "tokens" && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#161616] border border-[#222] rounded-[10px] space-y-2">
                    <span className="text-[10px] text-[#C8A45D] font-bold uppercase block">Brand Colors</span>
                    <div>
                      <label className="text-[10px] text-[#777] block mb-1">Primary Color</label>
                      <input
                        type="color"
                        value={themeTokens.primaryColor}
                        onChange={(e) => setThemeTokens({ ...themeTokens, primaryColor: e.target.value })}
                        className="w-full h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#777] block mb-1">Accent Gold</label>
                      <input
                        type="color"
                        value={themeTokens.accentColor}
                        onChange={(e) => setThemeTokens({ ...themeTokens, accentColor: e.target.value })}
                        className="w-full h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsVersionModalOpen(true)}
                    className="w-full py-2 bg-[#C8A45D]/15 hover:bg-[#C8A45D]/25 border border-[#C8A45D]/40 text-[#C8A45D] font-bold rounded-[8px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Open Version Comparison Engine</span>
                  </button>

                  <div className="space-y-2">
                    <span className="text-[10px] text-[#C8A45D] font-bold uppercase block px-1">Recent Activity Timeline</span>
                    {editingTimeline.map((item) => (
                      <div key={item.id} className="p-2 bg-[#161616] border border-[#222] rounded-[8px] flex items-center justify-between">
                        <span className="font-bold text-[#E8E4DF]">{item.label}</span>
                        <span className="text-[10px] font-mono text-[#777]">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER PANEL: LIVE PREVIEW CANVAS (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between text-xs text-[#777] mb-2 px-1">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#C8A45D]" />
                Live Canvas Real-Time Preview
              </span>
              <span className="font-mono text-[11px] text-[#555] uppercase">{deviceMode} view</span>
            </div>

            {/* Viewport Frame Container */}
            <div className={`bg-[#000] border-2 border-[#222] rounded-[18px] overflow-hidden transition-all duration-300 shadow-2xl ${getViewportWidth()} h-[750px] flex flex-col`}>
              <div className="bg-[#141414] border-b border-[#222] px-4 py-2 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="flex-1 max-w-xs mx-auto bg-[#0A0A0A] border border-[#222] rounded-full py-0.5 px-3 text-[10px] font-mono text-[#777] text-center truncate">
                  https://gormenswear.com
                </div>
              </div>

              {/* Live Rendered Canvas */}
              <div className="flex-1 overflow-y-auto bg-[#090909] text-[#F8F6F3]">
                {sections.filter((s) => s.enabled).map((sec) => {
                  const isSelected = selectedSectionId === sec.id;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedSectionId(sec.id)}
                      className={`relative cursor-pointer transition-all ${
                        isSelected ? "ring-2 ring-[#C8A45D] ring-offset-2 ring-offset-black z-10" : "hover:opacity-95"
                      }`}
                    >
                      {/* Announcement Bar */}
                      {sec.type === "announcement" && (
                        <div
                          style={{
                            backgroundColor: sec.settings?.bgColor || "#C8A45D",
                            color: sec.settings?.textColor || "#0D0D0D",
                          }}
                          className="py-2 px-4 text-[10px] font-bold tracking-widest text-center uppercase"
                        >
                          {sec.settings?.text}
                        </div>
                      )}

                      {/* Hero Banner */}
                      {sec.type === "hero" && (
                        <div
                          className="relative flex items-center justify-center text-center p-6 bg-cover bg-center overflow-hidden transition-all"
                          style={{
                            backgroundImage: `url('${sec.settings?.responsive?.[deviceMode]?.bgImage || sec.settings?.bgImage || "/images/lookbook/gor-lookbook-1.webp"}')`,
                            minHeight: sec.settings?.heroHeight === "large" ? "550px" : sec.settings?.heroHeight === "small" ? "360px" : "450px",
                          }}
                        >
                          <div
                            className="absolute inset-0 bg-black"
                            style={{ opacity: (sec.settings?.overlayOpacity ?? 40) / 100 }}
                          ></div>
                          <div className="relative z-10 max-w-2xl space-y-3">
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8F6F3] tracking-tight font-serif uppercase">
                              {sec.settings?.heading}
                            </h2>
                            <p className="text-xs sm:text-sm text-[#CCCCCC]">
                              {sec.settings?.subheading}
                            </p>
                            <div className="pt-2">
                              <span className="inline-block px-6 py-2.5 bg-[#C8A45D] text-[#0D0D0D] font-bold text-xs rounded uppercase tracking-wider">
                                {sec.settings?.ctaText}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Featured Collections */}
                      {sec.type === "collections" && (
                        <div className="p-8 space-y-4 max-w-4xl mx-auto">
                          <h3 className="text-lg font-bold text-[#C8A45D] uppercase tracking-widest text-center">
                            {sec.settings?.title}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {["SAVILE TAILORING", "URBAN CASUAL", "ATELIER ACCESSORIES"].map((c, i) => (
                              <div key={i} className="h-36 bg-[#161616] border border-[#222] rounded-[12px] p-4 flex items-end font-bold text-xs text-[#E8E4DF]">
                                {c}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Featured Products */}
                      {sec.type === "featured_products" && (
                        <div className="p-8 space-y-4 max-w-4xl mx-auto border-t border-[#1A1A1A]">
                          <h3 className="text-lg font-bold text-[#E8E4DF] uppercase tracking-widest text-center">
                            {sec.settings?.title}
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {["Tailored Double Jacket", "Silk Poplin Shirt", "Cashmere Overcoat", "Pleated Trousers"].slice(0, sec.settings?.limit || 4).map((p, i) => (
                              <div key={i} className="bg-[#141414] border border-[#222] rounded-[10px] p-3 space-y-2 text-xs">
                                <div className="h-32 bg-[#1C1C1C] rounded flex items-center justify-center text-[#555]">Garment Image</div>
                                <div className="font-semibold text-[#E8E4DF] truncate">{p}</div>
                                {sec.settings?.showPrice !== false && <div className="text-[#C8A45D] font-bold">₹14,999</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Newsletter */}
                      {sec.type === "newsletter" && (
                        <div className="p-10 bg-[#0F0F0F] border-t border-[#1A1A1A] text-center space-y-3">
                          <h3 className="text-lg font-bold text-[#E8E4DF] uppercase tracking-widest">
                            {sec.settings?.title}
                          </h3>
                          <p className="text-xs text-[#777]">{sec.settings?.subtitle}</p>
                          <div className="max-w-md mx-auto flex gap-2">
                            <input type="text" readOnly placeholder="Enter email address" className="flex-1 px-3 py-2 bg-[#181818] border border-[#282828] rounded text-xs text-[#AAA]" />
                            <button type="button" className="px-4 py-2 bg-[#C8A45D] text-[#0D0D0D] font-bold text-xs rounded">
                              {sec.settings?.buttonText || "JOIN"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: DYNAMIC PROPERTIES PANEL (3 Cols Desktop / Tablet) */}
          <div className="hidden lg:block lg:col-span-3">
            <RightPropertiesPanel
              selectedSection={selectedSection}
              deviceMode={deviceMode}
              onUpdateSettings={updateSectionSettings}
              onResetDefault={resetSectionDefault}
            />
          </div>
        </div>
      </div>

      {/* BLOCK LIBRARY MODAL */}
      <BlockLibraryModal
        isOpen={isBlockLibraryOpen}
        onClose={() => setIsBlockLibraryOpen(false)}
        onSelectBlock={handleInsertBlock}
      />

      {/* VERSION HISTORY & COMPARISON ENGINE MODAL */}
      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        versionHistory={versionHistory}
        currentSections={sections}
        currentTokens={themeTokens}
        onSaveManualVersion={handleSaveManualVersion}
        onRestoreVersion={handleRestoreVersion}
        onDeleteVersion={handleDeleteVersion}
      />

      {/* MOBILE SLIDE-OVER DRAWER (< 1024px) */}
      {isMobilePanelOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="bg-[#111] w-full max-w-md h-full flex flex-col p-4 shadow-2xl">
            <RightPropertiesPanel
              selectedSection={selectedSection}
              deviceMode={deviceMode}
              onUpdateSettings={updateSectionSettings}
              onResetDefault={resetSectionDefault}
              onClose={() => setIsMobilePanelOpen(false)}
              isMobileDrawer={true}
            />
          </div>
        </div>
      )}
    </AdminShell>
  );
}
