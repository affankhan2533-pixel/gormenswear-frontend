"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
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
  DollarSign,
  Tag,
  BarChart3,
  Globe,
  Check,
  Loader2,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import MediaLibrary from "@/components/cms/MediaLibrary";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

const INITIAL_PRODUCTS = [
  {
    id: "gor-codset-1",
    name: "GOR Alo Burgundy Heavyweight Co-Ord Set",
    slug: "gor-alo-burgundy-co-ord-set",
    category: "Uncategorized",
    price: 380,
    compareAtPrice: 450,
    costPerItem: 120,
    stock: 18,
    reservedStock: 2,
    sku: "GOR-COD-ALO-01",
    barcode: "89042109281",
    status: "Published",
    image: "/images/products/gor-codset-burgundy-alo.webp",
    description: "Heavyweight Alo cotton blend co-ord set featuring structured shoulders and relaxed fit pants.",
    views: 4200,
    wishlists: 680,
    sales: 142,
    conversion: "4.8%",
    variants: [
      { size: "S", color: "Burgundy", stock: 4, sku: "GOR-COD-ALO-S" },
      { size: "M", color: "Burgundy", stock: 6, sku: "GOR-COD-ALO-M" },
      { size: "L", color: "Burgundy", stock: 5, sku: "GOR-COD-ALO-L" },
      { size: "XL", color: "Burgundy", stock: 3, sku: "GOR-COD-ALO-XL" },
    ],
  },
  {
    id: "gor-codset-2",
    name: "Prada Desert Sand Textured Zip Set",
    slug: "prada-desert-sand-zip-set",
    category: "Uncategorized",
    price: 520,
    compareAtPrice: 600,
    costPerItem: 180,
    stock: 4,
    reservedStock: 1,
    sku: "GOR-COD-PRA-02",
    barcode: "89042109282",
    status: "Published",
    image: "/images/products/gor-codset-beige-prada.webp",
    description: "Textured desert sand zip shirt with matching relaxed trousers crafted from technical poly-cotton.",
    views: 3890,
    wishlists: 540,
    sales: 118,
    conversion: "5.1%",
    variants: [
      { size: "M", color: "Desert Sand", stock: 2, sku: "GOR-COD-PRA-M" },
      { size: "L", color: "Desert Sand", stock: 2, sku: "GOR-COD-PRA-L" },
    ],
  },
  {
    id: "gor-shirt-1",
    name: "GOR Designer Camp Shirting in Onyx",
    slug: "gor-designer-camp-shirting-onyx",
    category: "Shirts",
    price: 240,
    compareAtPrice: 280,
    costPerItem: 75,
    stock: 28,
    reservedStock: 4,
    sku: "GOR-SHT-CMP-03",
    barcode: "89042109283",
    status: "Published",
    image: "/images/lookbook/gor-lookbook-2.webp",
    description: "Open camp collar shirt with mother-of-pearl buttons and relaxed boxy silhouette.",
    views: 3100,
    wishlists: 410,
    sales: 95,
    conversion: "3.9%",
    variants: [
      { size: "S", color: "Onyx", stock: 8, sku: "GOR-SHT-CMP-S" },
      { size: "M", color: "Onyx", stock: 10, sku: "GOR-SHT-CMP-M" },
      { size: "L", color: "Onyx", stock: 10, sku: "GOR-SHT-CMP-L" },
    ],
  },
  {
    id: "gor-trouser-1",
    name: "Structured Tailored Trousers in Charcoal",
    slug: "structured-tailored-trousers-charcoal",
    category: "Trousers",
    price: 290,
    compareAtPrice: 340,
    costPerItem: 90,
    stock: 0,
    reservedStock: 0,
    sku: "GOR-TRS-STR-04",
    barcode: "89042109284",
    status: "Archived",
    image: "/images/products/gor-codset-burgundy-alo.webp",
    description: "Deep double-pleated trousers with side adjusters and clean tapered break.",
    views: 2750,
    wishlists: 390,
    sales: 84,
    conversion: "4.2%",
    variants: [
      { size: "30", color: "Charcoal", stock: 0, sku: "GOR-TRS-30" },
      { size: "32", color: "Charcoal", stock: 0, sku: "GOR-TRS-32" },
    ],
  },
];

export default function ProductManagementPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("basic"); // basic, media, pricing, inventory, variants, seo, status
  const [editingProduct, setEditingProduct] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === "all" || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  // Handle Create New Product
  const handleOpenCreateModal = () => {
    setEditingProduct({
      id: `gor-prod-${Date.now()}`,
      name: "",
      slug: "",
      category: "Co-Ord Sets",
      price: 290,
      compareAtPrice: 350,
      costPerItem: 90,
      stock: 10,
      reservedStock: 0,
      sku: `GOR-SKU-${Math.floor(100 + Math.random() * 900)}`,
      barcode: "89042109999",
      status: "Draft",
      image: "/images/products/gor-codset-burgundy-alo.webp",
      description: "",
      views: 0,
      wishlists: 0,
      sales: 0,
      conversion: "0.0%",
      variants: [{ size: "M", color: "Onyx", stock: 10, sku: "GOR-VAR-M" }],
    });
    setActiveEditorTab("basic");
    setShowEditorModal(true);
  };

  // Handle Edit Existing Product
  const handleOpenEditModal = (prod) => {
    setEditingProduct({ ...prod });
    setActiveEditorTab("basic");
    setShowEditorModal(true);
  };

  // Save Product Handler
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!editingProduct.name.trim()) return;

    setProducts((prev) => {
      const exists = prev.some((p) => p.id === editingProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === editingProduct.id ? editingProduct : p));
      }
      return [editingProduct, ...prev];
    });

    setShowEditorModal(false);
    success("Product Saved", `Product "${editingProduct.name}" saved successfully.`);
  };

  // Bulk Actions
  const handleBulkAction = (actionType) => {
    if (selectedIds.length === 0) return;

    if (actionType === "delete") {
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      success("Products Deleted", `${selectedIds.length} item(s) deleted.`);
    } else if (actionType === "publish") {
      setProducts((prev) => prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: "Published" } : p)));
      success("Products Published", `${selectedIds.length} item(s) set to Published.`);
    } else if (actionType === "archive") {
      setProducts((prev) => prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: "Archived" } : p)));
      success("Products Archived", `${selectedIds.length} item(s) set to Archived.`);
    }
    setSelectedIds([]);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "ID,Name,SKU,Category,Price,Stock,Status\n";
        const rows = products.map((p) => `${p.id},"${p.name}",${p.sku},${p.category},${p.price},${p.stock},${p.status}`).join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_Product_Catalog_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("CSV Exported", "Full product catalog downloaded as CSV.");
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
                <Package className="w-4 h-4" /> CATALOG ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Enterprise Product Management
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
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* ── SEARCH, FILTERS & BULK BAR ── */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name or SKU..."
                  className="w-full h-10 pl-10 pr-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="co-ord sets">Co-Ord Sets</option>
                <option value="outerwear">Outerwear</option>
                <option value="shirts">Shirts</option>
                <option value="trousers">Trousers</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* View Mode & Bulk Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-1 bg-[#090909] border border-[#2A2A2A] rounded-[8px] p-1 text-xs">
                  <span className="px-2 text-[#8E8A85] font-mono">{selectedIds.length} selected</span>
                  <button type="button" onClick={() => handleBulkAction("publish")} className="px-2 py-1 hover:text-[#C8A45D]">Publish</button>
                  <button type="button" onClick={() => handleBulkAction("archive")} className="px-2 py-1 hover:text-amber-400">Archive</button>
                  <button type="button" onClick={() => handleBulkAction("delete")} className="px-2 py-1 text-rose-400 hover:text-rose-300">Delete</button>
                </div>
              )}

              <div className="flex bg-[#090909] border border-[#2A2A2A] rounded-[8px] p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "table" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── PRODUCT TABLE / GRID VIEW ── */}
          {viewMode === "table" ? (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                    <th className="py-3.5 px-4 font-bold">Select</th>
                    <th className="py-3.5 px-4 font-bold">Product</th>
                    <th className="py-3.5 px-4 font-bold">SKU</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Price</th>
                    <th className="py-3.5 px-4 font-bold">Stock</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#090909]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedIds((prev) =>
                              prev.includes(p.id) ? prev.filter((i) => i !== p.id) : [...prev, p.id]
                            )
                          }
                          className="text-[#C8A45D] cursor-pointer"
                        >
                          {selectedIds.includes(p.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-[#8E8A85]" />}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#F8F6F3] flex items-center gap-3">
                        <div className="w-10 h-12 rounded bg-[#090909] border border-[#2A2A2A] overflow-hidden shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="truncate max-w-xs">{p.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#8E8A85]">{p.sku}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{p.category}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C8A45D]">{formatPrice(p.price)}</td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className={p.stock === 0 ? "text-rose-400 font-bold" : p.stock < 5 ? "text-amber-400 font-bold" : "text-[#F8F6F3]"}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${
                            p.status === "Published"
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                              : p.status === "Draft"
                              ? "bg-amber-950/80 text-amber-400 border-amber-500/30"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-[#8E8A85] hover:text-[#C8A45D] transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-4 flex flex-col justify-between space-y-4 shadow-xl">
                  <div className="space-y-3">
                    <div className="aspect-[3/4] w-full rounded-[12px] overflow-hidden bg-[#090909] border border-[#2A2A2A]">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-[#C8A45D] block mb-1">{p.category}</span>
                      <h4 className="font-editorial text-base text-[#F8F6F3]">{p.name}</h4>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-[#C8A45D] text-sm">{formatPrice(p.price)}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(p)}
                      className="px-3 py-1.5 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] rounded-[6px]"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </Container>
      </main>

      {/* ── 7-TAB MULTI-STEP PRODUCT EDITOR MODAL ── */}
      {showEditorModal && editingProduct && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  PRODUCT CATALOG EDITOR
                </span>
                <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                  {editingProduct.name || "New Product Entry"}
                </h3>
              </div>
              <button type="button" onClick={() => setShowEditorModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Selector */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#2A2A2A] scrollbar-none">
              {[
                { id: "basic", label: "Basic Info" },
                { id: "media", label: "Media" },
                { id: "pricing", label: "Pricing" },
                { id: "inventory", label: "Inventory" },
                { id: "variants", label: "Variants" },
                { id: "seo", label: "SEO Preview" },
                { id: "status", label: "Publishing" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveEditorTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-[8px] text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                    activeEditorTab === tab.id
                      ? "bg-[#C8A45D] text-[#090909]"
                      : "bg-[#090909] text-[#8E8A85] border border-[#2A2A2A] hover:text-[#F8F6F3]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Forms */}
            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* TAB 1: BASIC INFO */}
              {activeEditorTab === "basic" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. GOR Alo Burgundy Heavyweight Co-Ord Set"
                      className="w-full h-11 px-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#8E8A85] block mb-1">Category</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                      >
                        <option value="Co-Ord Sets">Co-Ord Sets</option>
                        <option value="Outerwear">Outerwear</option>
                        <option value="Shirts">Shirts</option>
                        <option value="Trousers">Trousers</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-[#8E8A85] block mb-1">SKU Code</label>
                      <input
                        type="text"
                        value={editingProduct.sku}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                        className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Description</label>
                    <textarea
                      rows={4}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA */}
              {activeEditorTab === "media" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-32 rounded-[10px] bg-[#090909] border border-[#2A2A2A] overflow-hidden shrink-0">
                      <img src={editingProduct.image} alt={editingProduct.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#F8F6F3]">Featured Product Image</h4>
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker(true)}
                        className="h-10 px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Select Media Asset</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRICING */}
              {activeEditorTab === "pricing" && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Price ($)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                      className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Compare At Price ($)</label>
                    <input
                      type="number"
                      value={editingProduct.compareAtPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, compareAtPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#8E8A85] font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Cost Per Item ($)</label>
                    <input
                      type="number"
                      value={editingProduct.costPerItem}
                      onChange={(e) => setEditingProduct({ ...editingProduct, costPerItem: parseFloat(e.target.value) || 0 })}
                      className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#8E8A85] font-mono outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: INVENTORY */}
              {activeEditorTab === "inventory" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Available Stock Units</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                      className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8E8A85] block mb-1">Barcode (EAN/UPC)</label>
                    <input
                      type="text"
                      value={editingProduct.barcode}
                      onChange={(e) => setEditingProduct({ ...editingProduct, barcode: e.target.value })}
                      className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] font-mono outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: SEO PREVIEW */}
              {activeEditorTab === "seo" && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-1">
                    <span className="text-[10px] text-emerald-400 font-mono block">https://gormenswear.com/product/{editingProduct.slug || "url-slug"}</span>
                    <h4 className="text-sm font-bold text-blue-400 font-sans">{editingProduct.name || "Product Title"} | GOR Menswear</h4>
                    <p className="text-xs text-[#8E8A85] font-light leading-relaxed">{editingProduct.description || "Product meta description preview..."}</p>
                  </div>
                </div>
              )}

              {/* TAB 7: STATUS & PUBLISHING */}
              {activeEditorTab === "status" && (
                <div className="space-y-3">
                  <label className="text-xs text-[#8E8A85] block font-medium">Publishing Status</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Draft", "Published", "Archived"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, status: st })}
                        className={`h-11 rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors border ${
                          editingProduct.status === st
                            ? "bg-[#C8A45D] text-[#090909] border-[#C8A45D]"
                            : "bg-[#090909] text-[#8E8A85] border-[#2A2A2A]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditorModal(false)}
                  className="px-5 py-2.5 text-xs text-[#8E8A85] hover:text-[#F8F6F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md"
                >
                  Save Product
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
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Select Product Image</h3>
              <button type="button" onClick={() => setShowMediaPicker(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MediaLibrary
              isPickerMode={true}
              onSelectMedia={(item) => {
                if (editingProduct) {
                  setEditingProduct({ ...editingProduct, image: item.url });
                }
                setShowMediaPicker(false);
                success("Image Updated", `Set product image to ${item.name}`);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
