"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Type,
  Layout,
  Layers,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  ImageIcon,
  X,
  Sliders,
  Sun,
  Moon,
  Eye,
  RotateCcw,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import MediaLibrary from "@/components/cms/MediaLibrary";
import { useToast } from "@/context/ToastContext";

const DEFAULT_THEME = {
  name: "GOR Midnight Gold (Active)",
  branding: {
    logo: "/images/hero/hero-main.jpg",
    brandName: "GOR Menswear",
    tagline: "Architectural Street Luxury & Heavyweight Essentials",
  },
  colors: {
    primary: "#C8A45D",
    background: "#090909",
    surface: "#151515",
    border: "#2A2A2A",
    textPrimary: "#F8F6F3",
    textMuted: "#8E8A85",
    success: "#10B981",
  },
  typography: {
    headingFont: "Editorial New / Cormorant Garamond",
    bodyFont: "Inter / Outfit",
    letterSpacing: "0.2em",
  },
  buttons: {
    borderRadius: "12px",
    hoverScale: "1.02",
    shadow: "0 10px 30px rgba(200,164,93,0.15)",
  },
  layout: {
    maxWidth: "1280px",
    gridGap: "24px",
    cardRadius: "16px",
  },
};

export default function ThemeDesignSystemPage() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [activeTab, setActiveTab] = useState("colors"); // "branding", "colors", "typography", "buttons", "layout"
  const [viewport, setViewport] = useState("desktop"); // "desktop", "tablet", "mobile"
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Reset Theme to Default
  const handleResetTheme = () => {
    setTheme(DEFAULT_THEME);
    success("Theme Reset", "Restored GOR Midnight Gold default design tokens.");
  };

  // Export Theme JSON
  const handleExportJSON = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const jsonString = JSON.stringify(theme, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_Theme_DesignTokens_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
      }
      success("Theme Exported", "GOR Theme design tokens exported to JSON.");
    }, 600);
  };

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 font-sans select-none relative">
        <Container className="space-y-8">
          
          {/* Header Title & Actions */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-2 mb-1">
                <Palette className="w-4 h-4" /> DESIGN SYSTEM ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Theme & Design System Inspector
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleResetTheme}
                className="h-10 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs font-semibold text-[#8E8A85] hover:text-[#F8F6F3] rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                disabled={exporting}
                className="h-10 px-5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin text-[#090909]" /> : <Download className="w-4 h-4" />}
                <span>Export Theme JSON</span>
              </button>
            </div>
          </div>

          {/* Device Frame Viewport & Preset Switcher */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#8E8A85]">Active Theme Preset:</span>
              <span className="text-xs font-bold font-mono text-[#C8A45D] px-3 py-1 rounded bg-[#090909] border border-[#2A2A2A]">
                {theme.name}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#090909] border border-[#2A2A2A] rounded-[10px] p-1">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`p-2 rounded-[8px] flex items-center gap-1.5 text-xs font-semibold ${
                  viewport === "desktop" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewport("tablet")}
                className={`p-2 rounded-[8px] flex items-center gap-1.5 text-xs font-semibold ${
                  viewport === "tablet" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`p-2 rounded-[8px] flex items-center gap-1.5 text-xs font-semibold ${
                  viewport === "mobile" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
          </div>

          {/* ── SPLIT WORKSPACE: 35% INSPECTOR / 65% LIVE CANVAS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Inspector Panel (4 cols = ~35%) */}
            <div className="lg:col-span-5 bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 space-y-6 shadow-2xl">
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1 bg-[#090909] border border-[#2A2A2A] rounded-[12px] p-1">
                {["colors", "branding", "typography", "buttons", "layout"].map((tb) => (
                  <button
                    key={tb}
                    type="button"
                    onClick={() => setActiveTab(tb)}
                    className={`flex-1 py-2 px-2 rounded-[8px] text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      activeTab === tb ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                    }`}
                  >
                    {tb}
                  </button>
                ))}
              </div>

              {/* Color System Configurator */}
              {activeTab === "colors" && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-xl text-[#F8F6F3]">Color Tokens</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#8E8A85] block mb-1">Primary Accent</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={theme.colors.primary}
                          onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, primary: e.target.value } })}
                          className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={theme.colors.primary}
                          onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, primary: e.target.value } })}
                          className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs font-mono text-[#F8F6F3] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-[#8E8A85] block mb-1">Background Surface</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={theme.colors.background}
                          onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, background: e.target.value } })}
                          className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={theme.colors.background}
                          onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, background: e.target.value } })}
                          className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs font-mono text-[#F8F6F3] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-[#8E8A85] block mb-1">Card Container Surface</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={theme.colors.surface}
                          onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, surface: e.target.value } })}
                          className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={theme.colors.surface}
                          onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, surface: e.target.value } })}
                          className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs font-mono text-[#F8F6F3] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Branding Tab */}
              {activeTab === "branding" && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-xl text-[#F8F6F3]">Store Branding</h3>

                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={theme.branding.brandName}
                      onChange={(e) => setTheme({ ...theme, branding: { ...theme.branding, brandName: e.target.value } })}
                      className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Tagline</label>
                    <input
                      type="text"
                      value={theme.branding.tagline}
                      onChange={(e) => setTheme({ ...theme, branding: { ...theme.branding, tagline: e.target.value } })}
                      className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-[#8E8A85] block font-medium">Brand Logo Asset</label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded bg-[#090909] overflow-hidden border border-[#2A2A2A] shrink-0">
                        <img src={theme.branding.logo} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker(true)}
                        className="h-9 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs text-[#F8F6F3] rounded-[8px] flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#C8A45D]" />
                        <span>Select Logo Asset</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Typography Tab */}
              {activeTab === "typography" && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-xl text-[#F8F6F3]">Typography System</h3>

                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Heading Font Family</label>
                    <select
                      value={theme.typography.headingFont}
                      onChange={(e) => setTheme({ ...theme, typography: { ...theme.typography, headingFont: e.target.value } })}
                      className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                    >
                      <option value="Editorial New / Cormorant Garamond">Editorial New / Cormorant Garamond</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Cinzel Luxury">Cinzel Luxury</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Letter Spacing (Tracking)</label>
                    <input
                      type="text"
                      value={theme.typography.letterSpacing}
                      onChange={(e) => setTheme({ ...theme, typography: { ...theme.typography, letterSpacing: e.target.value } })}
                      className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs font-mono text-[#F8F6F3] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Buttons Tab */}
              {activeTab === "buttons" && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-xl text-[#F8F6F3]">Buttons & UI Elements</h3>

                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Button Border Radius</label>
                    <input
                      type="text"
                      value={theme.buttons.borderRadius}
                      onChange={(e) => setTheme({ ...theme, buttons: { ...theme.buttons, borderRadius: e.target.value } })}
                      className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs font-mono text-[#F8F6F3] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Layout Tab */}
              {activeTab === "layout" && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-xl text-[#F8F6F3]">Layout Math</h3>

                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Max Container Width</label>
                    <input
                      type="text"
                      value={theme.layout.maxWidth}
                      onChange={(e) => setTheme({ ...theme, layout: { ...theme.layout, maxWidth: e.target.value } })}
                      className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs font-mono text-[#F8F6F3] outline-none"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Live Canvas Preview Panel (7 cols = ~65%) */}
            <div className="lg:col-span-7 flex justify-center w-full">
              <div
                className={`bg-[#090909] border-2 border-[#2A2A2A] rounded-[24px] p-6 shadow-2xl transition-all duration-500 overflow-hidden ${
                  viewport === "mobile" ? "w-[375px]" : viewport === "tablet" ? "w-[768px]" : "w-full"
                }`}
                style={{ backgroundColor: theme.colors.background }}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-[#2A2A2A]">
                    <span className="font-editorial text-2xl font-bold" style={{ color: theme.colors.primary }}>
                      {theme.branding.brandName}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E8A85]">LIVE PREVIEW</span>
                  </div>

                  {/* Sample Hero Card */}
                  <div
                    className="p-6 rounded-[16px] border border-[#2A2A2A] space-y-4"
                    style={{ backgroundColor: theme.colors.surface }}
                  >
                    <span className="text-[9px] uppercase tracking-[0.25em] font-bold block" style={{ color: theme.colors.primary }}>
                      AUTUMN 2026 CAPSULE
                    </span>
                    <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                      Modern <span style={{ color: theme.colors.primary }}>Street Luxury</span>
                    </h2>
                    <p className="text-xs text-[#8E8A85] font-light leading-relaxed">
                      {theme.branding.tagline}
                    </p>
                    <button
                      type="button"
                      className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#090909] shadow-lg transition-transform"
                      style={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: theme.buttons.borderRadius,
                      }}
                    >
                      Explore Collection
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </Container>
      </main>

      {/* Shared Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-[260] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 max-w-4xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Select Logo Asset</h3>
              <button type="button" onClick={() => setShowMediaPicker(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MediaLibrary
              isPickerMode={true}
              onSelectMedia={(item) => {
                setTheme({ ...theme, branding: { ...theme.branding, logo: item.url } });
                setShowMediaPicker(false);
                success("Logo Updated", `Set storefront logo to ${item.name}`);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
