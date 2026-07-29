"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Save,
  Globe,
  RotateCcw,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  EyeOff,
  Sliders,
  Sparkles,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Film,
  Type,
  LayoutGrid,
  HelpCircle,
  Mail,
  X,
  Check,
  Download,
  Upload,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import MediaLibrary from "@/components/cms/MediaLibrary";
import { useToast } from "@/context/ToastContext";

const INITIAL_SECTIONS = [
  {
    id: "sec-announcement",
    type: "Announcement Bar",
    isGlobal: true,
    enabled: true,
    title: "Complimentary Express Delivery on Orders Over $200",
    bgColor: "#C8A45D",
    textColor: "#090909",
  },
  {
    id: "sec-hero",
    type: "Hero Banner",
    isGlobal: false,
    enabled: true,
    title: "MODERN PRECISION MENSWEAR",
    subtitle: "Precision engineering meets architectural luxury for Autumn/Winter 2026.",
    ctaText: "Explore Collection",
    ctaLink: "/shop",
    bgImage: "/images/hero/hero-main.jpg",
    overlayOpacity: 40,
    textAlignment: "center",
    paddingY: 32,
  },
  {
    id: "sec-products",
    type: "Product Grid",
    isGlobal: false,
    enabled: true,
    title: "Featured Garments",
    category: "all",
    columns: 4,
    paddingY: 24,
  },
  {
    id: "sec-promo",
    type: "Promotional Banner",
    isGlobal: false,
    enabled: true,
    title: "THE CO-ORD STATEMENT",
    subtitle: "Heavyweight Alo cotton & Prada textured knits designed for daily movement.",
    ctaText: "Shop Co-Ords",
    ctaLink: "/shop/codset",
    bgImage: "/images/products/gor-codset-burgundy-alo.webp",
    paddingY: 24,
  },
  {
    id: "sec-[#footer]",
    type: "Footer",
    isGlobal: true,
    enabled: true,
    title: "GOR Menswear Footer",
  },
];

export default function VisualBuilderPage() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState("sec-hero");
  const [viewport, setViewport] = useState("desktop"); // "desktop" | "tablet" | "mobile"
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [history, setHistory] = useState([INITIAL_SECTIONS]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const { success } = useToast();

  // Selected Active Section
  const activeSection = useMemo(() => {
    return sections.find((s) => s.id === activeSectionId) || sections[0];
  }, [sections, activeSectionId]);

  // Update Section Handler
  const updateActiveSection = (key, value) => {
    const updated = sections.map((s) => (s.id === activeSectionId ? { ...s, [key]: value } : s));
    setSections(updated);
    
    // Save to history stack
    const newHist = history.slice(0, historyIndex + 1);
    setHistory([...newHist, updated]);
    setHistoryIndex(newHist.length);
  };

  // Move Section Up/Down
  const moveSection = (idx, direction) => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const copy = [...sections];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setSections(copy);
  };

  // Toggle Visibility
  const toggleVisibility = (id) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  // Duplicate Section
  const duplicateSection = (id) => {
    const target = sections.find((s) => s.id === id);
    if (!target) return;
    const newSec = { ...target, id: `sec-${Date.now()}`, title: `${target.title} (Copy)` };
    setSections((prev) => [...prev, newSec]);
    success("Section Duplicated", `Created copy of ${target.type}.`);
  };

  // Delete Section
  const deleteSection = (id) => {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (activeSectionId === id) setActiveSectionId(sections[0].id);
    success("Section Removed", "Section removed from page structure.");
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setSections(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setSections(history[historyIndex + 1]);
    }
  };

  // Publish Live
  const handlePublishLive = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gor_homepage_config", JSON.stringify(sections));
    }
    success("Published Live!", "Homepage structure and styles published to live store.");
  };

  return (
    <>
      <NoiseOverlay />
      {!isFullscreen && <Navbar />}

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-20 pb-10 font-sans select-none overflow-hidden">
        
        {/* ── 1. TOP BUILDER TOOLBAR ── */}
        <div className="bg-[#151515] border-b border-[#2A2A2A] px-6 py-3 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> NO-CODE PAGE BUILDER
            </span>
            <span className="text-xs text-[#8E8A85]">|</span>
            <span className="text-xs font-semibold text-[#F8F6F3]">Homepage Layout v1.0</span>
          </div>

          {/* Device Viewport & Zoom Switchers */}
          <div className="flex items-center gap-2">
            <div className="flex bg-[#090909] border border-[#2A2A2A] rounded-[8px] p-1 gap-1">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewport === "desktop" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                }`}
                title="Desktop View (100%)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewport("tablet")}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewport === "tablet" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewport === "mobile" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Undo / Redo */}
            <div className="flex bg-[#090909] border border-[#2A2A2A] rounded-[8px] p-1 gap-1">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 text-[#8E8A85] hover:text-[#F8F6F3] disabled:opacity-40"
                title="Undo Change"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 text-[#8E8A85] hover:text-[#F8F6F3] disabled:opacity-40"
                title="Redo Change"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-[#8E8A85] hover:text-[#F8F6F3] cursor-pointer"
              title="Toggle Fullscreen Canvas"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handlePublishLive}
              className="h-9 px-5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Globe className="w-4 h-4" />
              <span>Publish Live</span>
            </button>
          </div>
        </div>

        {/* ── 2. SPLIT-SCREEN WORKSPACE ── */}
        <div className="flex h-[calc(100vh-140px)] overflow-hidden">
          
          {/* ── LEFT PROPERTY INSPECTOR PANEL (35%) ── */}
          {!isFullscreen && (
            <aside className="w-[360px] lg:w-[400px] bg-[#151515] border-r border-[#2A2A2A] flex flex-col h-full shrink-0 shadow-2xl">
              
              {/* Tabs: Section Tree vs Property Inspector */}
              <div className="p-4 border-b border-[#2A2A2A] space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A45D] font-bold block">
                  PAGE STRUCTURE
                </span>

                {/* Section Manager Tree */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {sections.map((sec, idx) => {
                    const isActive = activeSectionId === sec.id;
                    return (
                      <div
                        key={sec.id}
                        onClick={() => setActiveSectionId(sec.id)}
                        className={`p-2.5 rounded-[10px] border flex items-center justify-between text-xs transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#C8A45D] text-[#090909] border-[#C8A45D] font-bold"
                            : "bg-[#090909] border-[#2A2A2A] text-[#F8F6F3] hover:border-[#C8A45D]/40"
                        } ${!sec.enabled ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {sec.isGlobal && <Globe className="w-3.5 h-3.5 shrink-0 text-[#C8A45D]" />}
                          <span className="truncate">{sec.type}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button type="button" onClick={() => moveSection(idx, "up")} className="p-1 hover:opacity-80">
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => moveSection(idx, "down")} className="p-1 hover:opacity-80">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => toggleVisibility(sec.id)} className="p-1 hover:opacity-80">
                            {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── PROPERTY INSPECTOR FOR ACTIVE SECTION ── */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                <div className="border-b border-[#2A2A2A] pb-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A45D] font-bold block mb-1">
                    INSPECTOR SETTINGS
                  </span>
                  <h3 className="font-editorial text-xl text-[#F8F6F3]">{activeSection.type}</h3>
                </div>

                {/* Title Input */}
                <div className="space-y-1">
                  <label className="text-xs text-[#8E8A85] block font-medium">Heading Title</label>
                  <input
                    type="text"
                    value={activeSection.title || ""}
                    onChange={(e) => updateActiveSection("title", e.target.value)}
                    className="w-full h-9 px-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  />
                </div>

                {/* Subtitle Input */}
                {activeSection.subtitle !== undefined && (
                  <div className="space-y-1">
                    <label className="text-xs text-[#8E8A85] block font-medium">Subtitle / Body</label>
                    <textarea
                      rows={3}
                      value={activeSection.subtitle || ""}
                      onChange={(e) => updateActiveSection("subtitle", e.target.value)}
                      className="w-full p-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                    />
                  </div>
                )}

                {/* CTA Button Text */}
                {activeSection.ctaText !== undefined && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-[#8E8A85] block mb-1">CTA Label</label>
                      <input
                        type="text"
                        value={activeSection.ctaText || ""}
                        onChange={(e) => updateActiveSection("ctaText", e.target.value)}
                        className="w-full h-9 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#8E8A85] block mb-1">CTA Link</label>
                      <input
                        type="text"
                        value={activeSection.ctaLink || ""}
                        onChange={(e) => updateActiveSection("ctaLink", e.target.value)}
                        className="w-full h-9 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Media Image Picker Trigger */}
                {activeSection.bgImage !== undefined && (
                  <div className="space-y-2">
                    <label className="text-xs text-[#8E8A85] block font-medium">Background Image</label>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-[8px] bg-[#090909] overflow-hidden border border-[#2A2A2A] shrink-0">
                        <img src={activeSection.bgImage} alt="Bg" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker(true)}
                        className="h-9 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs font-semibold text-[#F8F6F3] rounded-[8px] flex items-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#C8A45D]" />
                        <span>Select Media</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Section Spacing Slider */}
                {activeSection.paddingY !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#8E8A85]">
                      <span>Vertical Padding (px)</span>
                      <span className="font-mono text-[#C8A45D]">{activeSection.paddingY}px</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={64}
                      value={activeSection.paddingY || 24}
                      onChange={(e) => updateActiveSection("paddingY", parseInt(e.target.value))}
                      className="w-full accent-[#C8A45D] cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* ── RIGHT LIVE PREVIEW CANVAS (65%) ── */}
          <div className="flex-1 bg-[#090909] p-6 overflow-y-auto flex items-center justify-center relative">
            <div
              className={`bg-[#090909] border border-[#2A2A2A] rounded-[20px] overflow-hidden transition-all duration-300 shadow-2xl ${
                viewport === "desktop" ? "w-full max-w-5xl" : viewport === "tablet" ? "w-[768px]" : "w-[375px]"
              }`}
            >
              {/* Canvas Render Engine */}
              <div className="divide-y divide-[#2A2A2A]/40">
                {sections
                  .filter((s) => s.enabled)
                  .map((sec) => (
                    <div
                      key={sec.id}
                      onClick={() => setActiveSectionId(sec.id)}
                      className={`relative transition-all cursor-pointer ${
                        activeSectionId === sec.id ? "ring-2 ring-[#C8A45D] ring-offset-2 ring-offset-[#090909]" : ""
                      }`}
                      style={{ padding: `${sec.paddingY || 24}px 24px` }}
                    >
                      {sec.type === "Announcement Bar" && (
                        <div className="bg-[#C8A45D] text-[#090909] py-2 text-center text-xs font-bold uppercase tracking-wider">
                          {sec.title}
                        </div>
                      )}

                      {sec.type === "Hero Banner" && (
                        <div className="relative h-[320px] rounded-[16px] overflow-hidden flex items-center justify-center text-center p-8 bg-zinc-900">
                          <img src={sec.bgImage} alt={sec.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                          <div className="relative z-10 space-y-3 max-w-xl">
                            <h2 className="font-editorial text-3xl sm:text-4xl text-[#F8F6F3]">{sec.title}</h2>
                            <p className="text-xs text-[#8E8A85] font-light">{sec.subtitle}</p>
                            <button type="button" className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px]">
                              {sec.ctaText}
                            </button>
                          </div>
                        </div>
                      )}

                      {sec.type === "Product Grid" && (
                        <div className="space-y-4">
                          <h3 className="font-editorial text-2xl text-[#F8F6F3] text-center">{sec.title}</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="aspect-[3/4] bg-[#151515] border border-[#2A2A2A] rounded-[12px] p-3 flex flex-col justify-end">
                                <span className="font-editorial text-sm text-[#F8F6F3]">GOR Sample Garment #{i}</span>
                                <span className="text-xs text-[#C8A45D] font-mono">$380</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.type === "Promotional Banner" && (
                        <div className="p-8 bg-[#151515] border border-[#2A2A2A] rounded-[16px] space-y-3 text-center">
                          <h3 className="font-editorial text-2xl text-[#F8F6F3]">{sec.title}</h3>
                          <p className="text-xs text-[#8E8A85] max-w-md mx-auto">{sec.subtitle}</p>
                        </div>
                      )}

                      {sec.type === "Footer" && (
                        <div className="py-6 text-center text-xs text-[#8E8A85] font-mono">
                          © 2026 GOR Menswear Inc. All Rights Reserved.
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Shared Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 max-w-4xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Select Background Asset</h3>
              <button type="button" onClick={() => setShowMediaPicker(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MediaLibrary
              isPickerMode={true}
              onSelectMedia={(item) => {
                updateActiveSection("bgImage", item.url);
                setShowMediaPicker(false);
                success("Asset Applied", `Background set to ${item.name}`);
              }}
            />
          </div>
        </div>
      )}

      {!isFullscreen && <Footer />}
    </>
  );
}
