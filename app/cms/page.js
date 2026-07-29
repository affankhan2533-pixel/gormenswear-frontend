"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  Home,
  Sliders,
  Image as ImageIcon,
  ShoppingBag,
  Users,
  Star,
  Ticket,
  Award,
  BookOpen,
  HardDrive,
  Globe,
  Settings,
  Search,
  Plus,
  ArrowRight,
  Clock,
  Edit2,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import MediaLibrary from "@/components/cms/MediaLibrary";
import { useToast } from "@/context/ToastContext";

const CMS_MODULES = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "collections", label: "Collections", icon: Layers },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "homepage", label: "Homepage", icon: Home },
  { id: "hero", label: "Hero Slider", icon: Sliders },
  { id: "banners", label: "Banners", icon: ImageIcon },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "customers", label: "Customers", icon: Users },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "coupons", label: "Coupons", icon: Ticket },
  { id: "loyalty", label: "Loyalty", icon: Award },
  { id: "blog", label: "Blog Journal", icon: BookOpen },
  { id: "media", label: "Media Library", icon: HardDrive },
  { id: "seo", label: "SEO Config", icon: Globe },
  { id: "settings", label: "Settings", icon: Settings },
];

const RECENT_ACTIVITY = [
  { id: "a1", action: "Edited Product", title: "GOR Alo Burgundy Heavyweight Co-Ord", time: "10 mins ago", type: "edit" },
  { id: "a2", action: "Published Post", title: "Autumn Seasonal Lookbook Release", time: "1 hour ago", type: "publish" },
  { id: "a3", action: "Uploaded Media", title: "hero-main-v2.webp", time: "3 hours ago", type: "upload" },
  { id: "a4", action: "Created Coupon", title: "SUMMER15 (15% Off)", time: "5 hours ago", type: "create" },
];

export default function HeadlessCMSPage() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showPickerModal, setShowPickerModal] = useState(false);

  const { success } = useToast();

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 select-none relative font-sans">
        <Container>
          
          {/* Header Title & Global CMS Search */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" /> HEADLESS ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Content Management System
              </h1>
            </div>

            {/* Instant Global CMS Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Global CMS Search (Ctrl + K)..."
                className="w-full h-11 pl-10 pr-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] placeholder-[#8E8A85] outline-none"
              />
            </div>
          </div>

          {/* ── MAIN 2-COLUMN LAYOUT (COLLAPSIBLE SIDEBAR + MODULE WORKSPACE) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT PERMANENT SIDEBAR ── */}
            <aside className={`${isSidebarCollapsed ? "lg:col-span-1" : "lg:col-span-3"} transition-all duration-300`}>
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-3 space-y-1 sticky top-28 shadow-xl">
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A2A2A] mb-2">
                  {!isSidebarCollapsed && (
                    <span className="text-[10px] uppercase tracking-widest text-[#8E8A85] font-bold">MODULES</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="p-1 text-[#8E8A85] hover:text-[#C8A45D] transition-colors cursor-pointer"
                  >
                    {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>
                </div>

                {CMS_MODULES.map((mod) => {
                  const IconComp = mod.icon;
                  const isActive = activeModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setActiveModule(mod.id)}
                      className={`w-full h-10 rounded-[10px] px-3 font-sans text-xs flex items-center transition-all cursor-pointer ${
                        isSidebarCollapsed ? "justify-center" : "justify-between"
                      } ${
                        isActive
                          ? "bg-[#C8A45D] text-[#090909] font-bold shadow-md"
                          : "text-[#8E8A85] hover:text-[#F8F6F3] hover:bg-[#090909]/60"
                      }`}
                      title={mod.label}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <IconComp className="w-4 h-4 shrink-0" />
                        {!isSidebarCollapsed && <span className="truncate">{mod.label}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* ── WORKSPACE MODULE AREA ── */}
            <main className={`${isSidebarCollapsed ? "lg:col-span-11" : "lg:col-span-9"}`}>
              {activeModule === "dashboard" && (
                <div className="space-y-8">
                  
                  {/* Dashboard Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-2 shadow-lg">
                      <span className="text-[10px] uppercase text-[#8E8A85] block font-bold">Storage Usage</span>
                      <span className="font-editorial text-3xl font-normal text-[#F8F6F3]">4.2 GB / 10 GB</span>
                      <div className="h-2 w-full bg-[#090909] rounded-full overflow-hidden border border-[#2A2A2A]">
                        <div className="h-full bg-[#C8A45D] rounded-full w-[42%]" />
                      </div>
                    </div>

                    <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-2 shadow-lg">
                      <span className="text-[10px] uppercase text-[#8E8A85] block font-bold">Draft Content</span>
                      <span className="font-editorial text-3xl font-normal text-amber-400">8 Items</span>
                      <span className="text-[10px] text-[#8E8A85] block">Awaiting publication</span>
                    </div>

                    <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-2 shadow-lg">
                      <span className="text-[10px] uppercase text-[#8E8A85] block font-bold">Pending Reviews</span>
                      <span className="font-editorial text-3xl font-normal text-emerald-400">14 Reviews</span>
                      <span className="text-[10px] text-[#8E8A85] block">Ready for moderation</span>
                    </div>
                  </div>

                  {/* Recent Activity Log */}
                  <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
                      <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Recent CMS Activity</h3>
                      <span className="text-xs text-[#8E8A85] font-mono">Live Timeline</span>
                    </div>

                    <div className="divide-y divide-[#2A2A2A]">
                      {RECENT_ACTIVITY.map((act) => (
                        <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs font-sans">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#C8A45D] block mb-0.5">{act.action}</span>
                            <h4 className="font-semibold text-[#F8F6F3]">{act.title}</h4>
                          </div>
                          <span className="text-xs text-[#8E8A85] font-mono">{act.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Media Library Module */}
              {activeModule === "media" && <MediaLibrary />}

              {/* Generic Module Fallback */}
              {activeModule !== "dashboard" && activeModule !== "media" && (
                <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-8 space-y-6 text-center shadow-xl">
                  <div className="w-12 h-12 rounded-full bg-[#090909] border border-[#2A2A2A] text-[#C8A45D] flex items-center justify-center mx-auto">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-3xl text-[#F8F6F3] capitalize">{activeModule} Management Module</h3>
                    <p className="text-xs text-[#8E8A85] mt-1">Full content management interface configured for {activeModule}.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPickerModal(true)}
                    className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px] hover:bg-[#D4B77D] transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Open Shared Media Picker</span>
                  </button>
                </div>
              )}
            </main>

          </div>

        </Container>
      </main>

      {/* Shared Media Picker Modal */}
      {showPickerModal && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 max-w-4xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Select Asset from Media Library</h3>
              <button type="button" onClick={() => setShowPickerModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MediaLibrary
              isPickerMode={true}
              onSelectMedia={(item) => {
                setShowPickerModal(false);
                success("Asset Selected", `Selected ${item.name}`);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
