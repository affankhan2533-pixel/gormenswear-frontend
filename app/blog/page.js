"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
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
  Tag,
  Clock,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import MediaLibrary from "@/components/cms/MediaLibrary";
import { useToast } from "@/context/ToastContext";

const INITIAL_ARTICLES = [
  {
    id: "art-1",
    title: "The Anatomy of Heavyweight Alo Co-Ords",
    slug: "anatomy-heavyweight-alo-co-ords",
    category: "Fabric Engineering",
    status: "Published",
    author: "Julian Thorne",
    authorBio: "Senior Garment Designer & Fabric Specialist at GOR Menswear.",
    readTime: "5 min read",
    views: 12400,
    date: "Jan 24, 2026",
    featuredImage: "/images/products/gor-codset-burgundy-alo.webp",
    excerpt: "Exploring the 420GSM cotton weave and architectural shoulder construction behind our flagship co-ord set.",
    tags: ["Co-Ords", "Fabric", "Design"],
  },
  {
    id: "art-2",
    title: "Autumn/Winter 2026 Lookbook Capsule",
    slug: "autumn-winter-2026-lookbook-capsule",
    category: "Lookbook Releases",
    status: "Published",
    author: "Elena Rostova",
    authorBio: "Creative Director & Stylist at GOR Menswear.",
    readTime: "4 min read",
    views: 18900,
    date: "Jan 18, 2026",
    featuredImage: "/images/lookbook/gor-lookbook-1.webp",
    excerpt: "A visual exploration of textured sand knits, oversized shirting, and daily street luxury silhouettes.",
    tags: ["Lookbook", "Campaign", "Styling"],
  },
  {
    id: "art-3",
    title: "Modern Streetwear Layering Guide",
    slug: "modern-streetwear-layering-guide",
    category: "Style Guides",
    status: "Published",
    author: "Marcus Vance",
    authorBio: "Editorial Contributor & Menswear Analyst.",
    readTime: "6 min read",
    views: 9400,
    date: "Jan 12, 2026",
    featuredImage: "/images/lookbook/gor-lookbook-2.webp",
    excerpt: "Mastering proportion, collar drop, and cuff breaks with our boxy camp shirting and double-pleated trousers.",
    tags: ["Style", "Layering", "Trousers"],
  },
  {
    id: "art-4",
    title: "Prada Textured Zip Series: Design Retrospective",
    slug: "prada-textured-zip-series-retrospective",
    category: "Behind the Design",
    status: "Scheduled",
    author: "Julian Thorne",
    authorBio: "Senior Garment Designer & Fabric Specialist at GOR Menswear.",
    readTime: "7 min read",
    views: 0,
    date: "Aug 05, 2026",
    featuredImage: "/images/products/gor-codset-beige-prada.webp",
    excerpt: "An insider look into sourcing technical poly-cotton blends and custom matte hardware.",
    tags: ["Behind The Scenes", "Outerwear"],
  },
];

export default function BlogCMSPage() {
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === "all" || a.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchStatus = statusFilter === "all" || a.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchCategory && matchStatus;
    });
  }, [articles, searchQuery, categoryFilter, statusFilter]);

  // Open Create Article Modal
  const handleOpenCreateModal = () => {
    setEditingArticle({
      id: `art-${Date.now()}`,
      title: "",
      slug: "",
      category: "Style Guides",
      status: "Draft",
      author: "Julian Thorne",
      authorBio: "Senior Garment Designer at GOR Menswear.",
      readTime: "4 min read",
      views: 0,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      featuredImage: "/images/hero/hero-main.jpg",
      excerpt: "",
      tags: ["Styling"],
    });
    setShowEditorModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (art) => {
    setEditingArticle({ ...art });
    setShowEditorModal(true);
  };

  // Save Article Handler
  const handleSaveArticle = (e) => {
    e.preventDefault();
    if (!editingArticle.title.trim()) return;

    setArticles((prev) => {
      const exists = prev.some((a) => a.id === editingArticle.id);
      if (exists) {
        return prev.map((a) => (a.id === editingArticle.id ? editingArticle : a));
      }
      return [editingArticle, ...prev];
    });

    setShowEditorModal(false);
    success("Article Saved", `Article "${editingArticle.title}" updated successfully.`);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "ID,Title,Slug,Category,Status,Author,Views\n";
        const rows = articles.map((a) => `${a.id},"${a.title}",${a.slug},"${a.category}",${a.status},"${a.author}",${a.views}`).join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_Blog_CMS_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("CSV Exported", "Blog articles report downloaded successfully.");
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
                <BookOpen className="w-4 h-4" /> EDITORIAL CMS ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Blog & Editorial Article Manager
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
                <span>Write Article</span>
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
                  placeholder="Search articles by title or slug..."
                  className="w-full h-10 pl-10 pr-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="style guides">Style Guides</option>
                <option value="lookbook releases">Lookbook Releases</option>
                <option value="fabric engineering">Fabric Engineering</option>
                <option value="behind the design">Behind the Design</option>
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
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded ${viewMode === "table" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── ARTICLES GRID / TABLE VIEW ── */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredArticles.map((art) => (
                <div key={art.id} className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-4 flex flex-col justify-between space-y-4 shadow-xl">
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-[12px] overflow-hidden bg-[#090909] border border-[#2A2A2A]">
                      <img src={art.featuredImage} alt={art.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-[#C8A45D] block mb-1">{art.category}</span>
                      <h4 className="font-editorial text-base text-[#F8F6F3] leading-snug">{art.title}</h4>
                      <p className="text-xs text-[#8E8A85] font-light line-clamp-2 mt-1">{art.excerpt}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-xs">
                    <span className="text-[#8E8A85] font-mono">{art.readTime}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(art)}
                      className="px-3 py-1 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] rounded-[6px]"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                    <th className="py-3.5 px-4 font-bold">Article</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Author</th>
                    <th className="py-3.5 px-4 font-bold">Read Time</th>
                    <th className="py-3.5 px-4 font-bold">Views</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-[#090909]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#F8F6F3] flex items-center gap-3">
                        <div className="w-10 h-8 rounded bg-[#090909] border border-[#2A2A2A] overflow-hidden shrink-0">
                          <img src={art.featuredImage} alt={art.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="truncate max-w-xs">{art.title}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{art.category}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{art.author}</td>
                      <td className="py-3.5 px-4 font-mono text-[#8E8A85]">{art.readTime}</td>
                      <td className="py-3.5 px-4 font-mono text-[#F8F6F3]">{art.views.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${
                            art.status === "Published"
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                              : art.status === "Scheduled"
                              ? "bg-blue-950/80 text-blue-400 border-blue-500/30"
                              : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(art)}
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
          )}

        </Container>
      </main>

      {/* ── ARTICLE EDITOR MODAL ── */}
      {showEditorModal && editingArticle && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans select-none">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  EDITORIAL ARTICLE EDITOR
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">{editingArticle.title || "New Article Entry"}</h3>
              </div>
              <button type="button" onClick={() => setShowEditorModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Article Headline</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full h-11 px-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Category</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  >
                    <option value="Style Guides">Style Guides</option>
                    <option value="Lookbook Releases">Lookbook Releases</option>
                    <option value="Fabric Engineering">Fabric Engineering</option>
                    <option value="Behind the Design">Behind the Design</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#8E8A85] block mb-1">Publishing Status</label>
                  <select
                    value={editingArticle.status}
                    onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value })}
                    className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Featured Cover Asset */}
              <div className="space-y-2">
                <label className="text-xs text-[#8E8A85] block font-medium">Featured Cover Asset</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-12 rounded bg-[#090909] overflow-hidden border border-[#2A2A2A] shrink-0">
                    <img src={editingArticle.featuredImage} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="h-9 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs text-[#F8F6F3] rounded-[8px] flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Select Media</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Article Excerpt</label>
                <textarea
                  rows={3}
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  className="w-full p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              {/* SERP SEO Preview */}
              <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-1">
                <span className="text-[10px] text-emerald-400 font-mono block">https://gormenswear.com/blog/{editingArticle.slug || "article-slug"}</span>
                <h4 className="text-sm font-bold text-blue-400 font-sans">{editingArticle.title || "Article Headline"} | GOR Menswear</h4>
                <p className="text-xs text-[#8E8A85] font-light leading-relaxed">{editingArticle.excerpt || "Article meta description preview..."}</p>
              </div>

              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditorModal(false)} className="px-5 py-2.5 text-xs text-[#8E8A85]">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md">
                  Save Article
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
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Select Cover Image</h3>
              <button type="button" onClick={() => setShowMediaPicker(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MediaLibrary
              isPickerMode={true}
              onSelectMedia={(item) => {
                if (editingArticle) {
                  setEditingArticle({ ...editingArticle, featuredImage: item.url });
                }
                setShowMediaPicker(false);
                success("Cover Updated", `Set cover asset to ${item.name}`);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
