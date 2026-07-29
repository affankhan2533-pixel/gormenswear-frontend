"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Globe2,
  DollarSign,
  Languages,
  MapPin,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  Sparkles,
  X,
  Loader2,
  Grid,
  List,
  ExternalLink,
  Layers,
  Check,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";

const INITIAL_STORES = [
  {
    id: "str-1",
    name: "GOR Main Global",
    domain: "gormenswear.com",
    region: "Global / North America",
    currency: "USD ($)",
    symbol: "$",
    taxRate: "US Sales Tax (8.875%)",
    languages: ["English (US)", "Spanish"],
    theme: "GOR Midnight Gold",
    status: "Active",
    revenue: 128450,
    orders: 412,
  },
  {
    id: "str-2",
    name: "GOR UK & Europe Flagship",
    domain: "uk.gormenswear.com",
    region: "United Kingdom & EU",
    currency: "GBP (£) / EUR (€)",
    symbol: "£",
    taxRate: "UK VAT (20.0%)",
    languages: ["English (UK)", "French", "German"],
    theme: "GOR Midnight Gold",
    status: "Active",
    revenue: 42100,
    orders: 128,
  },
  {
    id: "str-3",
    name: "GOR Asia-Pacific Hub",
    domain: "apac.gormenswear.com",
    region: "Asia-Pacific",
    currency: "AUD ($) / SGD ($)",
    symbol: "A$",
    taxRate: "GST (10.0%)",
    languages: ["English (AU)", "Japanese"],
    theme: "GOR Midnight Gold",
    status: "Active",
    revenue: 18900,
    orders: 64,
  },
  {
    id: "str-4",
    name: "GOR Middle East Storefront",
    domain: "ae.gormenswear.com",
    region: "Middle East",
    currency: "AED (د.إ)",
    symbol: "AED",
    taxRate: "UAE VAT (5.0%)",
    languages: ["English", "Arabic"],
    theme: "GOR Midnight Gold",
    status: "Scheduled",
    revenue: 0,
    orders: 0,
  },
];

export default function MultiStoreLocalizationPage() {
  const [stores, setStores] = useState(INITIAL_STORES);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Filtered Stores
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRegion = regionFilter === "all" || s.region.toLowerCase().includes(regionFilter.toLowerCase());
      return matchSearch && matchRegion;
    });
  }, [stores, searchQuery, regionFilter]);

  // Open Create Store Modal
  const handleOpenCreateModal = () => {
    setEditingStore({
      id: `str-${Date.now()}`,
      name: "",
      domain: "store.gormenswear.com",
      region: "North America",
      currency: "USD ($)",
      symbol: "$",
      taxRate: "US Sales Tax (8.0%)",
      languages: ["English (US)"],
      theme: "GOR Midnight Gold",
      status: "Draft",
      revenue: 0,
      orders: 0,
    });
    setShowStoreModal(true);
  };

  // Open Edit Store Modal
  const handleOpenEditModal = (str) => {
    setEditingStore({ ...str });
    setShowStoreModal(true);
  };

  // Save Store Handler
  const handleSaveStore = (e) => {
    e.preventDefault();
    if (!editingStore.name.trim()) return;

    setStores((prev) => {
      const exists = prev.some((s) => s.id === editingStore.id);
      if (exists) {
        return prev.map((s) => (s.id === editingStore.id ? editingStore : s));
      }
      return [editingStore, ...prev];
    });

    setShowStoreModal(false);
    success("Storefront Saved", `Storefront "${editingStore.name}" updated successfully.`);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "ID,Store_Name,Domain,Region,Currency,Tax_Rate,Status,Revenue,Orders\n";
        const rows = stores
          .map((s) => `${s.id},"${s.name}",${s.domain},"${s.region}",${s.currency},"${s.taxRate}",${s.status},${s.revenue},${s.orders}`)
          .join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_MultiStore_Localization_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("CSV Exported", "Multi-store report downloaded successfully.");
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
                <Globe className="w-4 h-4" /> REGIONAL LOCALIZATION ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Multi-Store & Localization Center
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={exporting}
                className="h-10 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs font-semibold text-[#F8F6F3] rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin text-[#C8A45D]" /> : <Download className="w-4 h-4 text-[#C8A45D]" />}
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="h-10 px-5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create Storefront</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Active Storefronts</span>
              <span className="font-editorial text-2xl text-[#C8A45D]">4 Regional</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Supported Currencies</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">6 Currencies</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Active Languages</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">5 Languages</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Global Revenue</span>
              <span className="font-editorial text-2xl text-emerald-400">$189,450</span>
            </div>
          </div>

          {/* ── TOOLBAR ── */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search store name or domain..."
                  className="w-full h-10 pl-10 pr-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
              >
                <option value="all">All Regions</option>
                <option value="global">Global / North America</option>
                <option value="uk">United Kingdom & EU</option>
                <option value="apac">Asia-Pacific</option>
              </select>
            </div>

            <div className="flex bg-[#090909] border border-[#2A2A2A] rounded-[8px] p-1 gap-1">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded ${viewMode === "table" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── STORES TABLE / GRID VIEW ── */}
          {viewMode === "table" ? (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                    <th className="py-3.5 px-4 font-bold">Storefront</th>
                    <th className="py-3.5 px-4 font-bold">Domain</th>
                    <th className="py-3.5 px-4 font-bold">Region</th>
                    <th className="py-3.5 px-4 font-bold">Currency</th>
                    <th className="py-3.5 px-4 font-bold">Tax / VAT</th>
                    <th className="py-3.5 px-4 font-bold">Revenue</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredStores.map((s) => (
                    <tr key={s.id} className="hover:bg-[#090909]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#F8F6F3] flex items-center gap-3">
                        <Globe className="w-4 h-4 text-[#C8A45D] shrink-0" />
                        <span>{s.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#8E8A85]">{s.domain}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{s.region}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C8A45D]">{s.currency}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{s.taxRate}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">${s.revenue.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${
                            s.status === "Active"
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(s)}
                          className="p-1.5 text-[#8E8A85] hover:text-[#C8A45D] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {filteredStores.map((s) => (
                <div key={s.id} className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-5 space-y-4 shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-editorial text-lg text-[#F8F6F3]">{s.name}</h4>
                      <span className="text-xs text-[#8E8A85] font-mono block mt-1">{s.domain}</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#090909] text-[#C8A45D] border border-[#2A2A2A]">
                      {s.symbol}
                    </span>
                  </div>

                  <div className="text-xs text-[#8E8A85] font-light space-y-1">
                    <p>Region: {s.region}</p>
                    <p>Tax: {s.taxRate}</p>
                  </div>

                  <div className="pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-mono font-bold">${s.revenue.toLocaleString()} Revenue</span>
                    <button type="button" onClick={() => handleOpenEditModal(s)} className="px-3 py-1 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] rounded-[6px]">
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </Container>
      </main>

      {/* Store Configurator Modal */}
      {showStoreModal && editingStore && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans select-none">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  STOREFRONT CONFIGURATOR
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">{editingStore.name || "New Regional Store"}</h3>
              </div>
              <button type="button" onClick={() => setShowStoreModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-4">
              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Storefront Name</label>
                <input
                  type="text"
                  required
                  value={editingStore.name}
                  onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                  className="w-full h-11 px-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Primary Domain</label>
                  <input
                    type="text"
                    required
                    value={editingStore.domain}
                    onChange={(e) => setEditingStore({ ...editingStore, domain: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Primary Currency</label>
                  <select
                    value={editingStore.currency}
                    onChange={(e) => setEditingStore({ ...editingStore, currency: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="AUD ($)">AUD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Regional Tax / VAT Rate</label>
                <input
                  type="text"
                  value={editingStore.taxRate}
                  onChange={(e) => setEditingStore({ ...editingStore, taxRate: e.target.value })}
                  className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                <button type="button" onClick={() => setShowStoreModal(false)} className="px-5 py-2.5 text-xs text-[#8E8A85]">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md">
                  Save Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
