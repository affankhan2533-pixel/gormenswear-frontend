"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Compass,
  Plus,
  Search,
  Grid,
  List,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Globe,
  Sparkles,
  X,
  ImageIcon,
  Download,
  Upload,
  Link2,
  Tag,
  Check,
  Loader2,
  Columns3,
  Columns2,
  LayoutGrid,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import MediaLibrary from "@/components/cms/MediaLibrary";
import { useToast } from "@/context/ToastContext";

const INITIAL_NAVIGATIONS = {
  header: [
    {
      id: "nav-1",
      label: "Shop All",
      url: "/shop",
      linkType: "Page",
      badge: "HOT",
      enabled: true,
      isMegaMenu: true,
      megaColumns: 4,
      megaBanner: "/images/products/gor-codset-burgundy-alo.webp",
      children: [
        { id: "nav-1-1", label: "Co-Ord Sets", url: "/shop/codset", enabled: true },
        { id: "nav-1-2", label: "Outerwear", url: "/shop/outerwear", enabled: true },
        { id: "nav-1-3", label: "Shirts", url: "/shop/shirts", enabled: true },
        { id: "nav-1-4", label: "Trousers", url: "/shop/trousers", enabled: true },
      ],
    },
    { id: "nav-2", label: "New Arrivals", url: "/new-arrivals", linkType: "Page", badge: "NEW", enabled: true, isMegaMenu: false, children: [] },
    { id: "nav-3", label: "About GOR", url: "/about", linkType: "Page", badge: "", enabled: true, isMegaMenu: false, children: [] },
    { id: "nav-4", label: "Contact Us", url: "/contact", linkType: "Page", badge: "", enabled: true, isMegaMenu: false, children: [] },
  ],
  footer: [
    { id: "f-1", label: "Shipping Policy", url: "/shipping", enabled: true },
    { id: "f-2", label: "Returns & Exchanges", url: "/returns", enabled: true },
    { id: "f-3", label: "Terms of Service", url: "/terms", enabled: true },
    { id: "f-4", label: "Privacy Policy", url: "/privacy", enabled: true },
  ],
  mobile: [
    { id: "m-1", label: "Home", url: "/", enabled: true },
    { id: "m-2", label: "Catalog", url: "/shop", enabled: true },
    { id: "m-3", label: "Wishlist", url: "/wishlist", enabled: true },
    { id: "m-4", label: "Account Portal", url: "/account", enabled: true },
  ],
};

export default function NavigationBuilderPage() {
  const [activeLocation, setActiveLocation] = useState("header"); // header, footer, mobile
  const [navData, setNavData] = useState(INITIAL_NAVIGATIONS);
  const [selectedItemId, setSelectedItemId] = useState("nav-1");
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Active location items list
  const currentItems = useMemo(() => {
    return navData[activeLocation] || [];
  }, [navData, activeLocation]);

  // Open Edit Item Modal
  const handleOpenEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditorModal(true);
  };

  // Open Create Item Modal
  const handleOpenCreate = () => {
    setEditingItem({
      id: `nav-${Date.now()}`,
      label: "",
      url: "/shop",
      linkType: "Page",
      badge: "",
      enabled: true,
      isMegaMenu: false,
      megaColumns: 3,
      megaBanner: "/images/hero/hero-main.jpg",
      children: [],
    });
    setShowEditorModal(true);
  };

  // Save Item Handler
  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!editingItem.label.trim()) return;

    setNavData((prev) => {
      const list = prev[activeLocation] || [];
      const exists = list.some((i) => i.id === editingItem.id);
      let updatedList = [];
      if (exists) {
        updatedList = list.map((i) => (i.id === editingItem.id ? editingItem : i));
      } else {
        updatedList = [...list, editingItem];
      }
      return { ...prev, [activeLocation]: updatedList };
    });

    setShowEditorModal(false);
    success("Menu Item Saved", `Navigation item "${editingItem.label}" updated.`);
  };

  // Move Item Up/Down
  const moveItem = (idx, direction) => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const list = [...currentItems];
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;

    setNavData((prev) => ({ ...prev, [activeLocation]: list }));
  };

  // Toggle Visibility
  const toggleVisibility = (id) => {
    setNavData((prev) => {
      const list = (prev[activeLocation] || []).map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i));
      return { ...prev, [activeLocation]: list };
    });
  };

  // Export Navigation JSON
  const handleExportJSON = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const jsonStr = JSON.stringify(navData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_Navigation_Config_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
      }
      success("JSON Exported", "Navigation configuration downloaded as JSON.");
    }, 800);
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
                <Compass className="w-4 h-4" /> MENU ARCHITECTURE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Navigation & Mega Menu Builder
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportJSON}
                disabled={exporting}
                className="h-10 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs font-semibold text-[#F8F6F3] rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin text-[#C8A45D]" /> : <Download className="w-4 h-4 text-[#C8A45D]" />}
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="h-10 px-5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Menu Item</span>
              </button>
            </div>
          </div>

          {/* Navigation Location Tabs */}
          <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-3">
            {[
              { id: "header", label: "Header Navigation" },
              { id: "footer", label: "Footer Navigation" },
              { id: "mobile", label: "Mobile Drawer Navigation" },
            ].map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setActiveLocation(loc.id)}
                className={`px-5 py-2 rounded-[10px] text-xs font-sans font-bold uppercase tracking-wider transition-colors ${
                  activeLocation === loc.id ? "bg-[#C8A45D] text-[#090909]" : "bg-[#090909] text-[#8E8A85] border border-[#2A2A2A]"
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>

          {/* ── MENU STRUCTURE TREE ── */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
              <h3 className="font-editorial text-2xl text-[#F8F6F3]">Active Menu Tree ({activeLocation})</h3>
              <span className="text-xs text-[#8E8A85] font-mono">{currentItems.length} Top-Level Items</span>
            </div>

            <div className="space-y-3">
              {currentItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 bg-[#090909] border rounded-[14px] space-y-3 transition-all ${
                    !item.enabled ? "opacity-50 border-[#2A2A2A]" : "border-[#2A2A2A] hover:border-[#C8A45D]/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Menu className="w-4 h-4 text-[#C8A45D]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[#F8F6F3] text-sm">{item.label}</h4>
                          {item.badge && (
                            <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-[#C8A45D] text-[#090909]">
                              {item.badge}
                            </span>
                          )}
                          {item.isMegaMenu && (
                            <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-500/30">
                              Mega Menu ({item.megaColumns} Col)
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#8E8A85] font-mono block mt-0.5">{item.url}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => moveItem(idx, "up")} className="p-1 text-[#8E8A85] hover:text-[#F8F6F3]">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => moveItem(idx, "down")} className="p-1 text-[#8E8A85] hover:text-[#F8F6F3]">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => toggleVisibility(item.id)} className="p-1 text-[#8E8A85] hover:text-[#F8F6F3]">
                        {item.enabled ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-rose-400" />}
                      </button>
                      <button type="button" onClick={() => handleOpenEdit(item)} className="p-1 text-[#8E8A85] hover:text-[#C8A45D]">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Submenu Items */}
                  {item.children && item.children.length > 0 && (
                    <div className="pl-8 border-l border-[#2A2A2A] space-y-2 pt-2">
                      {item.children.map((sub) => (
                        <div key={sub.id} className="flex justify-between items-center text-xs text-[#8E8A85] bg-[#151515] p-2.5 rounded-[8px] border border-[#2A2A2A]">
                          <span>└ <strong className="text-[#F8F6F3]">{sub.label}</strong> ({sub.url})</span>
                          <span className="text-[10px] text-emerald-400 font-mono">Active Sublink</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </Container>
      </main>

      {/* ── EDIT MENU ITEM MODAL ── */}
      {showEditorModal && editingItem && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans select-none">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  MENU ITEM EDITOR
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">{editingItem.label || "New Link"}</h3>
              </div>
              <button type="button" onClick={() => setShowEditorModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Navigation Label</label>
                <input
                  type="text"
                  required
                  value={editingItem.label}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  className="w-full h-11 px-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Target Route / URL</label>
                  <input
                    type="text"
                    required
                    value={editingItem.url}
                    onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Badge Tag</label>
                  <select
                    value={editingItem.badge || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  >
                    <option value="">No Badge</option>
                    <option value="NEW">NEW</option>
                    <option value="HOT">HOT</option>
                    <option value="SALE">SALE</option>
                  </select>
                </div>
              </div>

              {/* Mega Menu Toggle & Settings */}
              {activeLocation === "header" && (
                <div className="pt-4 border-t border-[#2A2A2A] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#F8F6F3]">Enable Mega Menu Dropdown</label>
                    <input
                      type="checkbox"
                      checked={editingItem.isMegaMenu}
                      onChange={(e) => setEditingItem({ ...editingItem, isMegaMenu: e.target.checked })}
                      className="w-4 h-4 accent-[#C8A45D] cursor-pointer"
                    />
                  </div>

                  {editingItem.isMegaMenu && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="text-xs text-[#8E8A85] block mb-1">Mega Menu Columns</label>
                        <select
                          value={editingItem.megaColumns || 3}
                          onChange={(e) => setEditingItem({ ...editingItem, megaColumns: parseInt(e.target.value) })}
                          className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                        >
                          <option value={2}>2 Columns</option>
                          <option value={3}>3 Columns</option>
                          <option value={4}>4 Columns</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-[#8E8A85] block font-medium">Promotional Banner Asset</label>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-10 rounded bg-[#090909] overflow-hidden border border-[#2A2A2A] shrink-0">
                            <img src={editingItem.megaBanner} alt="Banner" className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowMediaPicker(true)}
                            className="h-9 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs text-[#F8F6F3] rounded-[8px] flex items-center gap-1.5"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-[#C8A45D]" />
                            <span>Select Banner</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditorModal(false)} className="px-5 py-2.5 text-xs text-[#8E8A85]">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md">
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-[260] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 max-w-4xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Select Banner Image</h3>
              <button type="button" onClick={() => setShowMediaPicker(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MediaLibrary
              isPickerMode={true}
              onSelectMedia={(item) => {
                if (editingItem) {
                  setEditingItem({ ...editingItem, megaBanner: item.url });
                }
                setShowMediaPicker(false);
                success("Banner Updated", `Set mega menu banner to ${item.name}`);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
