"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Ticket,
  Percent,
  TrendingUp,
  Search,
  Filter,
  Download,
  Plus,
  Grid,
  List,
  Edit2,
  Trash2,
  Copy,
  Eye,
  CheckSquare,
  Square,
  X,
  ImageIcon,
  Calendar,
  Users,
  DollarSign,
  Check,
  Loader2,
  Tag,
  Clock,
  Send,
  Zap,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import MediaLibrary from "@/components/cms/MediaLibrary";
import { useToast } from "@/context/ToastContext";

const INITIAL_CAMPAIGNS = [
  {
    id: "cmp-1",
    name: "Autumn Season Launch Offer",
    code: "AUTUMN15",
    type: "Percentage Discount",
    discountValue: "15% Off",
    minSpend: 150,
    segment: "All Customers",
    status: "Active",
    startDate: "Jul 20, 2026",
    endDate: "Aug 20, 2026",
    banner: "/images/hero/hero-main.jpg",
    redemptions: 118,
    revenue: 8400,
    ctr: "9.2%",
  },
  {
    id: "cmp-2",
    name: "Complimentary Express Delivery Pass",
    code: "FREESHIP200",
    type: "Free Shipping",
    discountValue: "Free Express Shipping",
    minSpend: 200,
    segment: "VIP Customers",
    status: "Active",
    startDate: "Jul 01, 2026",
    endDate: "Dec 31, 2026",
    banner: "/images/products/gor-codset-burgundy-alo.webp",
    redemptions: 66,
    revenue: 5800,
    ctr: "7.6%",
  },
  {
    id: "cmp-3",
    name: "Flash Weekend Co-Ord Sale",
    code: "FLASH30",
    type: "Fixed Discount",
    discountValue: "$30 Off",
    minSpend: 250,
    segment: "Returning Customers",
    status: "Scheduled",
    startDate: "Aug 15, 2026",
    endDate: "Aug 18, 2026",
    banner: "/images/lookbook/gor-lookbook-1.webp",
    redemptions: 0,
    revenue: 0,
    ctr: "0.0%",
  },
  {
    id: "cmp-4",
    name: "Summer Clearout Flash Sale",
    code: "SUMMER50",
    type: "Percentage Discount",
    discountValue: "20% Off",
    minSpend: 300,
    segment: "All Customers",
    status: "Expired",
    startDate: "Jun 01, 2026",
    endDate: "Jun 30, 2026",
    banner: "/images/products/gor-codset-beige-prada.webp",
    redemptions: 142,
    revenue: 11200,
    ctr: "11.4%",
  },
];

export default function MarketingCampaignsPage() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === "all" || c.type.toLowerCase().includes(typeFilter.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchType && matchStatus;
    });
  }, [campaigns, searchQuery, typeFilter, statusFilter]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingCampaign({
      id: `cmp-${Date.now()}`,
      name: "",
      code: "PROMO2026",
      type: "Percentage Discount",
      discountValue: "10% Off",
      minSpend: 100,
      segment: "All Customers",
      status: "Draft",
      startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      endDate: "Dec 31, 2026",
      banner: "/images/hero/hero-main.jpg",
      redemptions: 0,
      revenue: 0,
      ctr: "0.0%",
    });
    setShowConfigModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cmp) => {
    setEditingCampaign({ ...cmp });
    setShowConfigModal(true);
  };

  // Save Campaign Handler
  const handleSaveCampaign = (e) => {
    e.preventDefault();
    if (!editingCampaign.name.trim()) return;

    setCampaigns((prev) => {
      const exists = prev.some((c) => c.id === editingCampaign.id);
      if (exists) {
        return prev.map((c) => (c.id === editingCampaign.id ? editingCampaign : c));
      }
      return [editingCampaign, ...prev];
    });

    setShowConfigModal(false);
    success("Campaign Saved", `Campaign "${editingCampaign.name}" updated successfully.`);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "ID,Name,Code,Type,Status,Redemptions,Revenue,CTR\n";
        const rows = campaigns
          .map((c) => `${c.id},"${c.name}",${c.code},"${c.type}",${c.status},${c.redemptions},${c.revenue},${c.ctr}`)
          .join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_Marketing_Campaigns_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("CSV Exported", "Marketing campaigns report downloaded successfully.");
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
                <Ticket className="w-4 h-4" /> CAMPAIGN ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Marketing & Promotional Campaign Center
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
                <span>Create Campaign</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Active Campaigns</span>
              <span className="font-editorial text-2xl text-[#C8A45D]">4</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Total Redemptions</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">184</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Campaign Revenue</span>
              <span className="font-editorial text-2xl text-emerald-400">$14,200</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Average CTR</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">8.4%</span>
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
                  placeholder="Search campaign name or code..."
                  className="w-full h-10 pl-10 pr-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
              >
                <option value="all">All Campaign Types</option>
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Discount</option>
                <option value="free shipping">Free Shipping</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="expired">Expired</option>
                <option value="draft">Draft</option>
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

          {/* ── CAMPAIGNS TABLE / GRID VIEW ── */}
          {viewMode === "table" ? (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                    <th className="py-3.5 px-4 font-bold">Campaign Name</th>
                    <th className="py-3.5 px-4 font-bold">Code</th>
                    <th className="py-3.5 px-4 font-bold">Discount</th>
                    <th className="py-3.5 px-4 font-bold">Target Segment</th>
                    <th className="py-3.5 px-4 font-bold">Redemptions</th>
                    <th className="py-3.5 px-4 font-bold">Revenue</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredCampaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-[#090909]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#F8F6F3] flex items-center gap-3">
                        <div className="w-10 h-8 rounded bg-[#090909] border border-[#2A2A2A] overflow-hidden shrink-0">
                          <img src={c.banner} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="truncate max-w-xs">{c.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C8A45D]">{c.code}</td>
                      <td className="py-3.5 px-4 font-mono text-[#F8F6F3]">{c.discountValue}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{c.segment}</td>
                      <td className="py-3.5 px-4 font-mono text-[#F8F6F3]">{c.redemptions}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">${c.revenue.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${
                            c.status === "Active"
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                              : c.status === "Scheduled"
                              ? "bg-blue-950/80 text-blue-400 border-blue-500/30"
                              : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(c)}
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
              {filteredCampaigns.map((c) => (
                <div key={c.id} className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-5 space-y-4 shadow-xl">
                  <div className="h-28 w-full rounded-[12px] overflow-hidden bg-[#090909] border border-[#2A2A2A] relative">
                    <img src={c.banner} alt={c.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#090909]/90 text-[#C8A45D]">
                      {c.code}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-editorial text-lg text-[#F8F6F3]">{c.name}</h4>
                    <span className="text-xs text-[#8E8A85] font-mono block mt-1">{c.discountValue} • Min Spend ${c.minSpend}</span>
                  </div>
                  <div className="pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-mono font-bold">${c.revenue} Generated</span>
                    <button type="button" onClick={() => handleOpenEditModal(c)} className="px-3 py-1 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] rounded-[6px]">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </Container>
      </main>

      {/* ── CAMPAIGN CONFIGURATOR MODAL ── */}
      {showConfigModal && editingCampaign && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans select-none">
            
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  CAMPAIGN CONFIGURATOR
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">{editingCampaign.name || "New Campaign"}</h3>
              </div>
              <button type="button" onClick={() => setShowConfigModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Campaign Name</label>
                  <input
                    type="text"
                    required
                    value={editingCampaign.name}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
                    className="w-full h-11 px-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Promo Voucher Code</label>
                  <input
                    type="text"
                    required
                    value={editingCampaign.code}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, code: e.target.value.toUpperCase() })}
                    className="w-full h-11 px-4 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#C8A45D] font-mono font-bold outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Discount Type</label>
                  <select
                    value={editingCampaign.type}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, type: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  >
                    <option value="Percentage Discount">Percentage Discount</option>
                    <option value="Fixed Discount">Fixed Amount Discount</option>
                    <option value="Free Shipping">Free Express Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Minimum Spend ($)</label>
                  <input
                    type="number"
                    value={editingCampaign.minSpend}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, minSpend: parseInt(e.target.value) || 0 })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Status State</label>
                  <select
                    value={editingCampaign.status}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, status: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Expired">Expired</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Banner Asset Selector */}
              <div className="space-y-2">
                <label className="text-xs text-[#8E8A85] block font-medium">Promotional Banner Asset</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-12 rounded bg-[#090909] overflow-hidden border border-[#2A2A2A] shrink-0">
                    <img src={editingCampaign.banner} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="h-9 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs text-[#F8F6F3] rounded-[8px] flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Select Asset</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                <button type="button" onClick={() => setShowConfigModal(false)} className="px-5 py-2.5 text-xs text-[#8E8A85]">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md">
                  Save Campaign
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
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Select Banner Asset</h3>
              <button type="button" onClick={() => setShowMediaPicker(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MediaLibrary
              isPickerMode={true}
              onSelectMedia={(item) => {
                if (editingCampaign) {
                  setEditingCampaign({ ...editingCampaign, banner: item.url });
                }
                setShowMediaPicker(false);
                success("Banner Updated", `Set promo banner to ${item.name}`);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
