"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
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
  EyeOff,
  CheckSquare,
  Square,
  Sparkles,
  X,
  ImageIcon,
  Globe,
  Calendar,
  User,
  Check,
  Loader2,
  ExternalLink,
  Layers,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import MediaLibrary from "@/components/cms/MediaLibrary";
import { useToast } from "@/context/ToastContext";

const INITIAL_PAGES = [
  {
    id: "pg-1",
    title: "About GOR Menswear",
    slug: "about",
    type: "System Page",
    status: "Published",
    author: "Editorial Team",
    lastModified: "Jan 24, 2026",
    views: 8900,
    featuredImage: "/images/hero/hero-main.jpg",
    content: "GOR Menswear is built on architectural precision and modern street luxury...",
  },
  {
    id: "pg-2",
    title: "Contact & Client Support",
    slug: "contact",
    type: "System Page",
    status: "Published",
    author: "Support Operations",
    lastModified: "Jan 22, 2026",
    views: 4500,
    featuredImage: "/images/lookbook/gor-lookbook-1.webp",
    content: "Get in touch with our team for order inquiries, sizing assistance, and global express shipping.",
  },
  {
    id: "pg-3",
    title: "Privacy Policy",
    slug: "privacy",
    type: "Legal Policy",
    status: "Published",
    author: "Legal Dept",
    lastModified: "Jan 15, 2026",
    views: 1200,
    featuredImage: "/images/products/gor-codset-burgundy-alo.webp",
    content: "We value your privacy and comply with global data protection regulations...",
  },
  {
    id: "pg-4",
    title: "Terms & Conditions",
    slug: "terms",
    type: "Legal Policy",
    status: "Published",
    author: "Legal Dept",
    lastModified: "Jan 15, 2026",
    views: 980,
    featuredImage: "/images/products/gor-codset-beige-prada.webp",
    content: "Terms governing online purchases, express shipping, and store vouchers...",
  },
  {
    id: "pg-5",
    title: "Shipping & Delivery Policy",
    slug: "shipping",
    type: "Legal Policy",
    status: "Published",
    author: "Logistics Team",
    lastModified: "Jan 10, 2026",
    views: 3100,
    featuredImage: "/images/hero/hero-main.jpg",
    content: "Complimentary global express shipping on all orders over $200...",
  },
  {
    id: "pg-6",
    title: "Autumn Capsule Campaign",
    slug: "autumn-capsule-campaign",
    type: "Landing Page",
    status: "Scheduled",
    author: "Marketing Team",
    lastModified: "Jan 25, 2026",
    views: 0,
    featuredImage: "/images/lookbook/gor-lookbook-2.webp",
    content: "Exclusive lookbook capsule unveiling heavyweight Alo Co-Ords...",
  },
];

export default function PagesCMSPage() {
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Filtered Pages
  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === "all" || p.type.toLowerCase() === typeFilter.toLowerCase();
      const matchStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchType && matchStatus;
    });
  }, [pages, searchQuery, typeFilter, statusFilter]);

  // Open Create Page Modal
  const handleOpenCreateModal = () => {
    setEditingPage({
      id: `pg-${Date.now()}`,
      title: "",
      slug: "",
      type: "Custom Landing Page",
      status: "Draft",
      author: "Admin User",
      lastModified: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      views: 0,
      featuredImage: "/images/hero/hero-main.jpg",
      content: "",
    });
    setShowEditorModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (pg) => {
    setEditingPage({ ...pg });
    setShowEditorModal(true);
  };

  // Save Page Handler
  const handleSavePage = (e) => {
    e.preventDefault();
    if (!editingPage.title.trim()) return;

    setPages((prev) => {
      const exists = prev.some((p) => p.id === editingPage.id);
      if (exists) {
        return prev.map((p) => (p.id === editingPage.id ? editingPage : p));
      }
      return [editingPage, ...prev];
    });

    setShowEditorModal(false);
    success("Page Saved", `Page "${editingPage.title}" updated successfully.`);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "ID,Title,Slug,Type,Status,Author,Views\n";
        const rows = pages.map((p) => `${p.id},"${p.title}",${p.slug},"${p.type}",${p.status},"${p.author}",${p.views}`).join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_Pages_CMS_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("CSV Exported", "Pages CMS report downloaded successfully.");
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
                <FileText className="w-4 h-4" /> CONTENT ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Pages CMS & Policy Configurator
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
                <span>Create New Page</span>
              </button>
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
                  placeholder="Search pages by title or slug..."
                  className="w-full h-10 pl-10 pr-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
              >
                <option value="all">All Page Types</option>
                <option value="system page">System Pages</option>
                <option value="legal policy">Legal Policies</option>
                <option value="landing page">Landing Pages</option>
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

          {/* ── PAGES TABLE / GRID VIEW ── */}
          {viewMode === "table" ? (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                    <th className="py-3.5 px-4 font-bold">Page Title</th>
                    <th className="py-3.5 px-4 font-bold">Slug / Route</th>
                    <th className="py-3.5 px-4 font-bold">Type</th>
                    <th className="py-3.5 px-4 font-bold">Author</th>
                    <th className="py-3.5 px-4 font-bold">Views</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredPages.map((pg) => (
                    <tr key={pg.id} className="hover:bg-[#090909]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#F8F6F3] flex items-center gap-3">
                        <FileText className="w-4 h-4 text-[#C8A45D] shrink-0" />
                        <span className="truncate max-w-xs">{pg.title}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#8E8A85]">/{pg.slug}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{pg.type}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{pg.author}</td>
                      <td className="py-3.5 px-4 font-mono text-[#F8F6F3]">{pg.views.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${
                            pg.status === "Published"
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                              : pg.status === "Scheduled"
                              ? "bg-blue-950/80 text-blue-400 border-blue-500/30"
                              : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {pg.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(pg)}
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
              {filteredPages.map((pg) => (
                <div key={pg.id} className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-5 space-y-4 shadow-xl">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#090909] text-[#C8A45D] border border-[#2A2A2A]">
                      {pg.type}
                    </span>
                    <span className="text-xs font-mono text-[#8E8A85]">/{pg.slug}</span>
                  </div>

                  <div>
                    <h4 className="font-editorial text-lg text-[#F8F6F3]">{pg.title}</h4>
                    <p className="text-xs text-[#8E8A85] font-light line-clamp-2 mt-1">{pg.content}</p>
                  </div>

                  <div className="pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-xs">
                    <span className="text-[#8E8A85]">By {pg.author}</span>
                    <button type="button" onClick={() => handleOpenEditModal(pg)} className="px-3 py-1 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] rounded-[6px]">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </Container>
      </main>

      {/* ── PAGE CONFIGURATOR MODAL ── */}
      {showEditorModal && editingPage && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans select-none">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  PAGE CONFIGURATOR
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">{editingPage.title || "New Page Entry"}</h3>
              </div>
              <button type="button" onClick={() => setShowEditorModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4">
              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full h-11 px-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingPage.slug}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Publishing Status</label>
                  <select
                    value={editingPage.status}
                    onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Page Body Content</label>
                <textarea
                  rows={6}
                  value={editingPage.content}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  className="w-full p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              {/* SERP SEO Preview */}
              <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-1">
                <span className="text-[10px] text-emerald-400 font-mono block">https://gormenswear.com/{editingPage.slug || "page-slug"}</span>
                <h4 className="text-sm font-bold text-blue-400 font-sans">{editingPage.title || "Page Title"} | GOR Menswear</h4>
                <p className="text-xs text-[#8E8A85] font-light leading-relaxed">{editingPage.content || "Page meta description preview..."}</p>
              </div>

              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditorModal(false)} className="px-5 py-2.5 text-xs text-[#8E8A85]">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md">
                  Save Page
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
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Select Featured Image</h3>
              <button type="button" onClick={() => setShowMediaPicker(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MediaLibrary
              isPickerMode={true}
              onSelectMedia={(item) => {
                if (editingPage) {
                  setEditingPage({ ...editingPage, featuredImage: item.url });
                }
                setShowMediaPicker(false);
                success("Image Updated", `Set featured image to ${item.name}`);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
