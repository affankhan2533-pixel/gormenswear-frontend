"use client";

import { useState } from "react";
import {
  Sliders, Search, RotateCcw, ChevronDown, ChevronUp, Type,
  Palette, Image as ImageIcon, Video, Layers, MoveVertical, MoveHorizontal,
  AlignLeft, AlignCenter, AlignRight, Eye, ShieldCheck, Sparkles, X, Check,
  Monitor, Tablet, Smartphone, Link, Link2Off, RefreshCw, FolderPlus
} from "lucide-react";
import MediaLibraryModal from "@/components/admin/media/MediaLibraryModal";

export default function RightPropertiesPanel({
  selectedSection,
  deviceMode = "desktop",
  onUpdateSettings,
  onResetDefault,
  onClose,
  isMobileDrawer = false,
}) {
  const [propertySearch, setPropertySearch] = useState("");
  const [openGroups, setOpenGroups] = useState({
    content: true,
    media: true,
    layout: true,
    responsive: true,
  });

  const [activeDeviceTab, setActiveDeviceTab] = useState(deviceMode);
  const [isLinked, setIsLinked] = useState(true);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  if (!selectedSection) {
    return (
      <div className="bg-[#111] border border-[#1E1E1E] rounded-[16px] p-6 text-center space-y-3 h-[750px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#222] flex items-center justify-center text-[#555]">
          <Sliders className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-[#E8E4DF]">Dynamic Properties Inspector</h3>
        <p className="text-xs text-[#666] max-w-xs">
          Select a section from the left sidebar or live preview canvas to customize its properties.
        </p>
      </div>
    );
  }

  const { id, type, name, settings = {} } = selectedSection;

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleSettingChange = (key, value) => {
    if (isLinked) {
      const currentResp = settings.responsive || {};
      const updatedResp = {
        desktop: { ...(currentResp.desktop || {}), [key]: value },
        tablet: { ...(currentResp.tablet || {}), [key]: value },
        mobile: { ...(currentResp.mobile || {}), [key]: value },
      };
      onUpdateSettings(id, { [key]: value, responsive: updatedResp });
    } else {
      const currentResp = settings.responsive || {};
      const targetDevice = activeDeviceTab;
      const updatedResp = {
        ...currentResp,
        [targetDevice]: { ...(currentResp[targetDevice] || {}), [key]: value },
      };
      onUpdateSettings(id, { [key]: value, responsive: updatedResp });
    }
  };

  const getResponsiveValue = (key, fallback) => {
    const currentResp = settings.responsive || {};
    const deviceVal = currentResp[activeDeviceTab]?.[key];
    if (deviceVal !== undefined) return deviceVal;
    return settings[key] !== undefined ? settings[key] : fallback;
  };

  const matchesSearch = (text) => {
    if (!propertySearch.trim()) return true;
    return text.toLowerCase().includes(propertySearch.toLowerCase());
  };

  const hasCustomResponsive = !!settings.responsive && (
    Object.keys(settings.responsive.tablet || {}).length > 0 ||
    Object.keys(settings.responsive.mobile || {}).length > 0
  );

  return (
    <div className={`bg-[#111] border border-[#1E1E1E] rounded-[16px] flex flex-col h-[750px] overflow-hidden shadow-2xl ${isMobileDrawer ? "w-full" : ""}`}>
      {/* Panel Header Bar */}
      <div className="p-3 bg-[#141414] border-b border-[#1E1E1E] flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Sliders className="w-4 h-4 text-[#C8A45D] shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-[#E8E4DF] truncate">{name}</h3>
              {hasCustomResponsive && (
                <span className="px-1.5 py-0.2 bg-[#C8A45D]/15 border border-[#C8A45D]/30 text-[#C8A45D] text-[9px] font-bold rounded">
                  Responsive
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#666] uppercase font-mono block">Type: {type}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onResetDefault && onResetDefault(id)}
            className="p-1.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-[#AAA] hover:text-[#C8A45D] text-[10px] rounded flex items-center gap-1 transition-colors"
            title="Reset Section Properties"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          {onClose && (
            <button type="button" onClick={onClose} className="text-[#666] hover:text-[#FFF] p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Breakpoint Selector & Link/Unlink Bar */}
      <div className="p-2 bg-[#161616] border-b border-[#1E1E1E] flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#0E0E0E] p-1 rounded-[6px] border border-[#222]">
          <button
            type="button"
            onClick={() => setActiveDeviceTab("desktop")}
            className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-colors ${
              activeDeviceTab === "desktop" ? "bg-[#C8A45D] text-[#0D0D0D]" : "text-[#777] hover:text-[#AAA]"
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>1440px</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveDeviceTab("tablet")}
            className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-colors ${
              activeDeviceTab === "tablet" ? "bg-[#C8A45D] text-[#0D0D0D]" : "text-[#777] hover:text-[#AAA]"
            }`}
          >
            <Tablet className="w-3 h-3" />
            <span>768px</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveDeviceTab("mobile")}
            className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-colors ${
              activeDeviceTab === "mobile" ? "bg-[#C8A45D] text-[#0D0D0D]" : "text-[#777] hover:text-[#AAA]"
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>390px</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsLinked(!isLinked)}
          className={`p-1.5 rounded border text-[10px] font-bold flex items-center gap-1 transition-colors ${
            isLinked
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              : "bg-amber-500/15 border-amber-500/30 text-amber-400"
          }`}
          title={isLinked ? "Linked: Edits apply across all viewports" : "Unlinked: Independent device edits"}
        >
          {isLinked ? <Link className="w-3 h-3" /> : <Link2Off className="w-3 h-3" />}
          <span>{isLinked ? "Linked" : "Unlinked"}</span>
        </button>
      </div>

      {/* Property Search Filtering */}
      <div className="p-2 bg-[#121212] border-b border-[#1A1A1A]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#555] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={propertySearch}
            onChange={(e) => setPropertySearch(e.target.value)}
            placeholder="Search properties (padding, height, color)..."
            className="w-full pl-8 pr-3 py-1 bg-[#161616] border border-[#222] rounded-[6px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
          />
        </div>
      </div>

      {/* Scrollable Properties Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-none text-xs">
        {/* HERO BANNER SCHEMA */}
        {type === "hero" && (
          <>
            {/* CONTENT GROUP */}
            {matchesSearch("heading subheading description primary secondary button media image video") && (
              <div className="bg-[#141414] border border-[#222] rounded-[10px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleGroup("content")}
                  className="w-full p-2.5 bg-[#181818] flex items-center justify-between text-xs font-bold text-[#E8E4DF]"
                >
                  <span className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-[#C8A45D]" />
                    Hero Content & Media
                  </span>
                  {openGroups.content ? <ChevronUp className="w-3.5 h-3.5 text-[#666]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#666]" />}
                </button>

                {openGroups.content && (
                  <div className="p-3 space-y-3 bg-[#121212]">
                    <div>
                      <label className="text-[10px] text-[#777] font-semibold block mb-1">Heading</label>
                      <input
                        type="text"
                        value={getResponsiveValue("heading", "SAVILE ROW TAILORING")}
                        onChange={(e) => handleSettingChange("heading", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#E8E4DF]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[#777] font-semibold block mb-1">Sub Heading</label>
                      <textarea
                        rows={2}
                        value={getResponsiveValue("subheading", "")}
                        onChange={(e) => handleSettingChange("subheading", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#E8E4DF]"
                      />
                    </div>

                    {/* Background Media Thumbnail & Picker Trigger */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[#777] font-semibold block">Background Media Output</label>
                      {getResponsiveValue("bgImage", "") ? (
                        <div className="relative h-28 bg-[#0A0A0A] border border-[#2A2A2A] rounded-[8px] overflow-hidden group">
                          <img
                            src={getResponsiveValue("bgImage", "")}
                            alt="Selected Background"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setShowMediaPicker(true)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold text-[#C8A45D] transition-opacity"
                          >
                            Change Media
                          </button>
                        </div>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker(true)}
                        className="w-full py-2 px-3 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-[#C8A45D] font-bold text-xs rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>{getResponsiveValue("bgImage", "") ? "Change Media Asset" : "Select Media from Library"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#777] font-semibold block mb-1">CTA Text</label>
                        <input
                          type="text"
                          value={getResponsiveValue("ctaText", "EXPLORE COLLECTION")}
                          onChange={(e) => handleSettingChange("ctaText", e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#E8E4DF]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#777] font-semibold block mb-1">CTA Link</label>
                        <input
                          type="text"
                          value={getResponsiveValue("ctaLink", "/shop")}
                          onChange={(e) => handleSettingChange("ctaLink", e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#E8E4DF]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RESPONSIVE LAYOUT & SPACING GROUP */}
            {matchesSearch("padding margin height width opacity radius responsive") && (
              <div className="bg-[#141414] border border-[#222] rounded-[10px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleGroup("layout")}
                  className="w-full p-2.5 bg-[#181818] flex items-center justify-between text-xs font-bold text-[#E8E4DF]"
                >
                  <span className="flex items-center gap-1.5">
                    <MoveHorizontal className="w-3.5 h-3.5 text-[#C8A45D]" />
                    Responsive Spacing & Height ({activeDeviceTab.toUpperCase()})
                  </span>
                  {openGroups.layout ? <ChevronUp className="w-3.5 h-3.5 text-[#666]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#666]" />}
                </button>

                {openGroups.layout && (
                  <div className="p-3 space-y-3 bg-[#121212]">
                    <div>
                      <label className="text-[10px] text-[#777] font-semibold block mb-1">Hero Height</label>
                      <select
                        value={getResponsiveValue("heroHeight", "medium")}
                        onChange={(e) => handleSettingChange("heroHeight", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#E8E4DF]"
                      >
                        <option value="small">Small (360px)</option>
                        <option value="medium">Medium (480px)</option>
                        <option value="large">Large (600px)</option>
                        <option value="fullscreen">Fullscreen (100vh)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-[#777] font-semibold mb-1">
                        <span>Section Padding ({activeDeviceTab})</span>
                        <span>{getResponsiveValue("sectionPadding", 48)}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={getResponsiveValue("sectionPadding", 48)}
                        onChange={(e) => handleSettingChange("sectionPadding", Math.max(0, Math.min(120, Number(e.target.value))))}
                        className="w-full accent-[#C8A45D]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-[#777] font-semibold mb-1">
                        <span>Overlay Opacity</span>
                        <span>{getResponsiveValue("overlayOpacity", 40)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={getResponsiveValue("overlayOpacity", 40)}
                        onChange={(e) => handleSettingChange("overlayOpacity", Number(e.target.value))}
                        className="w-full accent-[#C8A45D]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ANNOUNCEMENT SCHEMA */}
        {type === "announcement" && (
          <div className="bg-[#141414] border border-[#222] rounded-[10px] p-3 space-y-3">
            <span className="text-[10px] text-[#C8A45D] font-bold uppercase block">Announcement ({activeDeviceTab.toUpperCase()})</span>
            <div>
              <label className="text-[10px] text-[#777] font-semibold block mb-1">Announcement Text</label>
              <input
                type="text"
                value={getResponsiveValue("text", "")}
                onChange={(e) => handleSettingChange("text", e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#E8E4DF]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Universal Context-Aware Media Library Selection Picker */}
      <MediaLibraryModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        context={{
          title: `${name} (${type.toUpperCase()})`,
          fieldName: "Background Media",
          targetModule: "Theme Builder Studio",
          href: "/admin/theme",
        }}
        onSelectAsset={(asset) => {
          handleSettingChange("bgImage", asset.url);
          handleSettingChange("mediaId", asset.mediaId);
          setShowMediaPicker(false);
        }}
        isModal={true}
      />
    </div>
  );
}
