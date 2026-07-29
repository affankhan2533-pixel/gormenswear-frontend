"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  FolderTree,
  Plus,
  Search,
  Grid,
  List,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  Copy,
  Eye,
  CheckSquare,
  Square,
  Sparkles,
  X,
  ImageIcon,
  BarChart3,
  Globe,
  ChevronRight,
  ChevronDown,
  Calendar,
  Tag,
  Check,
  Loader2,
  ArrowUpRight,
  Sliders,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import MediaLibrary from "@/components/cms/MediaLibrary";
import { useToast } from "@/context/ToastContext";

const INITIAL_COLLECTIONS = [
  {
    id: "col-1",
    name: "Co-Ord Sets Collection",
    slug: "co-ord-sets-collection",
    type: "Manual",
    status: "Published",
    productCount: 12,
    banner: "/images/hero/hero-main.jpg",
    description: "Architectural two-piece co-ord sets designed for precision layering and daily comfort.",
    views: 14200,
    sales: 48900,
    conversion: "4.2%",
    featured: true,
    scheduledDate: "2026-08-01",
    rules: [],
  },
  {
    id: "col-2",
    name: "Autumn Outerwear Release",
    slug: "autumn-outerwear-release",
    type: "Smart",
    status: "Scheduled",
    productCount: 8,
    banner: "/images/lookbook/gor-lookbook-1.webp",
    description: "Heavyweight trench coats, bomber jackets, and wool zip layers automatically curated for Autumn.",
    views: 9800,
    sales: 32400,
    conversion: "3.8%",
    featured: false,
    scheduledDate: "2026-09-15",
    rules: [
      { field: "Category", operator: "equals", value: "Outerwear" },
      { field: "Price", operator: "greater_than", value: "200" },
    ],
  },
  {
    id: "col-3",
    name: "New Arrivals Capsule",
    slug: "new-arrivals-capsule",
    type: "Smart",
    status: "Published",
    productCount: 15,
    banner: "/images/products/gor-codset-burgundy-alo.webp",
    description: "Latest garment arrivals automatically populated based on release date.",
    views: 18500,
    sales: 62100,
    conversion: "5.1%",
    featured: true,
    scheduledDate: "2026-07-20",
    rules: [{ field: "Tag", operator: "equals", value: "New" }],
  },
];

const INITIAL_CATEGORIES = [
  {
    id: "cat-1",
    name: "Co-Ord Sets",
    slug: "codset",
    productCount: 14,
    children: [],
  },
  {
    id: "cat-2",
    name: "Outerwear",
    slug: "outerwear",
    productCount: 8,
    children: [
      { id: "cat-2-1", name: "Trench Coats", slug: "trench-coats", productCount: 3 },
      { id: "cat-2-2", name: "Bomber Jackets", slug: "bomber-jackets", productCount: 5 },
    ],
  },
  {
    id: "cat-3",
    name: "Shirts",
    slug: "shirts",
    productCount: 18,
    children: [
      { id: "cat-3-1", name: "Camp Shirts", slug: "camp-shirts", productCount: 10 },
      { id: "cat-3-2", name: "Oversized Tees", slug: "oversized-tees", productCount: 8 },
    ],
  },
  {
    id: "cat-4",
    name: "Trousers",
    slug: "trousers",
    productCount: 10,
    children: [],
  },
];

export default function CollectionsManagementPage() {
  const [activeTab, setActiveTab] = useState("collections"); // "collections" or "categories"
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [viewMode, setViewMode] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Filtered Collections
  const filteredCollections = useMemo(() => {
    return collections.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === "all" || c.type.toLowerCase() === typeFilter.toLowerCase();
      const matchStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchType && matchStatus;
    });
  }, [collections, searchQuery, typeFilter, statusFilter]);

  // Open Create Collection Modal
  const handleOpenCreateModal = () => {
    setEditingCollection({
      id: `col-${Date.now()}`,
      name: "",
      slug: "",
      type: "Manual",
      status: "Draft",
      productCount: 0,
      banner: "/images/hero/hero-main.jpg",
      description: "",
      views: 0,
      sales: 0,
      conversion: "0.0%",
      featured: false,
      scheduledDate: new Date().toISOString().split("T")[0],
      rules: [{ field: "Category", operator: "equals", value: "Co-Ord Sets" }],
    });
    setShowEditorModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (col) => {
    setEditingCollection({ ...col });
    setShowEditorModal(true);
  };

  // Save Collection Handler
  const handleSaveCollection = (e) => {
    e.preventDefault();
    if (!editingCollection.name.trim()) return;

    setCollections((prev) => {
      const exists = prev.some((c) => c.id === editingCollection.id);
      if (exists) {
        return prev.map((c) => (c.id === editingCollection.id ? editingCollection : c));
      }
      return [editingCollection, ...prev];
    });

    setShowEditorModal(false);
    success("Collection Saved", `Collection "${editingCollection.name}" updated successfully.`);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "ID,Name,Type,Status,Products,Views,Sales\n";
        const rows = collections.map((c) => `${c.id},"${c.name}",${c.type},${c.status},${c.productCount},${c.views},${c.sales}`).join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_Collections_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("CSV Exported", "Collections report downloaded successfully.");
    }, 800);
  };

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 font-sans select-none relative">
        <Container className="space-y-8">
          
          {/* Header Title & Mode Selector */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4" /> CATALOG TAXONOMY
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Collections & Category Management
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
                <span>Create Collection</span>
              </button>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("collections")}
              className={`px-5 py-2 rounded-[10px] text-xs font-sans font-bold uppercase tracking-wider transition-colors ${
                activeTab === "collections" ? "bg-[#C8A45D] text-[#090909]" : "bg-[#090909] text-[#8E8A85] border border-[#2A2A2A]"
              }`}
            >
              Product Collections ({collections.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`px-5 py-2 rounded-[10px] text-xs font-sans font-bold uppercase tracking-wider transition-colors ${
                activeTab === "categories" ? "bg-[#C8A45D] text-[#090909]" : "bg-[#090909] text-[#8E8A85] border border-[#2A2A2A]"
              }`}
            >
              Nested Category Tree ({categories.length})
            </button>
          </div>

          {activeTab === "collections" ? (
            <div className="space-y-6">
              
              {/* ── TOOLBAR ── */}
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search collections..."
                      className="w-full h-10 pl-10 pr-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                    />
                  </div>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
                  >
                    <option value="all">All Collection Types</option>
                    <option value="manual">Manual Collection</option>
                    <option value="smart">Smart Collection</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
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

              {/* ── COLLECTIONS TABLE ── */}
              {viewMode === "table" ? (
                <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                        <th className="py-3.5 px-4 font-bold">Collection</th>
                        <th className="py-3.5 px-4 font-bold">Type</th>
                        <th className="py-3.5 px-4 font-bold">Products</th>
                        <th className="py-3.5 px-4 font-bold">Views</th>
                        <th className="py-3.5 px-4 font-bold">Sales</th>
                        <th className="py-3.5 px-4 font-bold">Status</th>
                        <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                      {filteredCollections.map((c) => (
                        <tr key={c.id} className="hover:bg-[#090909]/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#F8F6F3] flex items-center gap-3">
                            <div className="w-12 h-8 rounded bg-[#090909] border border-[#2A2A2A] overflow-hidden shrink-0">
                              <img src={c.banner} alt={c.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="truncate max-w-xs">{c.name}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className={`text-[9.5px] uppercase font-bold px-2 py-0.5 rounded border ${c.type === "Smart" ? "bg-purple-950/80 text-purple-300 border-purple-500/30" : "bg-zinc-800 text-zinc-300 border-zinc-700"}`}>
                              {c.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[#F8F6F3]">{c.productCount} items</td>
                          <td className="py-3.5 px-4 text-[#8E8A85]">{c.views.toLocaleString()}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#C8A45D]">${c.sales.toLocaleString()}</td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${
                              c.status === "Published" ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30" : c.status === "Scheduled" ? "bg-blue-950/80 text-blue-400 border-blue-500/30" : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                            }`}>
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
                  {filteredCollections.map((c) => (
                    <div key={c.id} className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-5 space-y-4 shadow-xl">
                      <div className="h-32 w-full rounded-[12px] overflow-hidden bg-[#090909] border border-[#2A2A2A] relative">
                        <img src={c.banner} alt={c.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#090909]/80 text-[#C8A45D]">
                          {c.type}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-editorial text-lg text-[#F8F6F3]">{c.name}</h4>
                        <p className="text-xs text-[#8E8A85] font-light line-clamp-2 mt-1">{c.description}</p>
                      </div>
                      <div className="pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-xs">
                        <span className="font-mono text-[#C8A45D] font-bold">{c.productCount} Garments</span>
                        <button type="button" onClick={() => handleOpenEditModal(c)} className="px-3 py-1 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] rounded-[6px]">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            /* NESTED CATEGORY TREE */
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 space-y-4 shadow-2xl">
              <h3 className="font-editorial text-2xl text-[#F8F6F3]">Category Hierarchy Tree</h3>
              <div className="space-y-2 font-sans">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[12px] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-[#C8A45D]" />
                        <h4 className="font-bold text-[#F8F6F3] text-sm">{cat.name}</h4>
                        <span className="text-xs text-[#8E8A85] font-mono">({cat.slug})</span>
                      </div>
                      <span className="text-xs font-mono text-[#C8A45D]">{cat.productCount} Products</span>
                    </div>

                    {/* Children Subcategories */}
                    {cat.children && cat.children.length > 0 && (
                      <div className="pl-6 border-l border-[#2A2A2A] space-y-2 pt-1">
                        {cat.children.map((sub) => (
                          <div key={sub.id} className="flex justify-between items-center text-xs text-[#8E8A85]">
                            <span>└ {sub.name} <span className="font-mono text-[10px]">({sub.slug})</span></span>
                            <span className="font-mono text-[#F8F6F3]">{sub.productCount} Products</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </Container>
      </main>

      {/* ── COLLECTION EDITOR MODAL ── */}
      {showEditorModal && editingCollection && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans select-none">
            
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  COLLECTION CONFIGURATOR
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">{editingCollection.name || "New Collection"}</h3>
              </div>
              <button type="button" onClick={() => setShowEditorModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="space-y-4">
              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Collection Name</label>
                <input
                  type="text"
                  required
                  value={editingCollection.name}
                  onChange={(e) => setEditingCollection({ ...editingCollection, name: e.target.value })}
                  className="w-full h-11 px-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Collection Type</label>
                  <select
                    value={editingCollection.type}
                    onChange={(e) => setEditingCollection({ ...editingCollection, type: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  >
                    <option value="Manual">Manual Collection</option>
                    <option value="Smart">Smart Collection (Automated Rules)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Status State</label>
                  <select
                    value={editingCollection.status}
                    onChange={(e) => setEditingCollection({ ...editingCollection, status: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Banner Image Asset Selector */}
              <div className="space-y-2">
                <label className="text-xs text-[#8E8A85] block font-medium">Banner Header Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-12 rounded bg-[#090909] overflow-hidden border border-[#2A2A2A] shrink-0">
                    <img src={editingCollection.banner} alt="Banner" className="w-full h-full object-cover" />
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

              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCollection.description}
                  onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })}
                  className="w-full p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              {/* SERP SEO Preview */}
              <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-1">
                <span className="text-[10px] text-emerald-400 font-mono block">https://gormenswear.com/shop/{editingCollection.slug || "collection-slug"}</span>
                <h4 className="text-sm font-bold text-blue-400 font-sans">{editingCollection.name || "Collection Title"} | GOR Menswear</h4>
                <p className="text-xs text-[#8E8A85] font-light leading-relaxed">{editingCollection.description || "Collection SEO description preview..."}</p>
              </div>

              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditorModal(false)} className="px-5 py-2.5 text-xs text-[#8E8A85]">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md">
                  Save Collection
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
                if (editingCollection) {
                  setEditingCollection({ ...editingCollection, banner: item.url });
                }
                setShowMediaPicker(false);
                success("Banner Updated", `Set collection banner to ${item.name}`);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
