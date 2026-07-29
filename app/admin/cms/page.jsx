"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import {
  FileText, Search, Plus, Edit2, Trash2, Eye, History, Globe,
  Calendar, Check, X, RefreshCw, Sparkles, Code, Image as ImageIcon,
  Heading, Bold, Quote, List, Link, ShieldCheck, Layers, FileCode
} from "lucide-react";

const TEMPLATES = [
  { id: "standard", label: "Standard Page" },
  { id: "legal", label: "Legal Policy" },
  { id: "contact", label: "Contact & Concierge" },
  { id: "faq", label: "FAQ Accordion" },
  { id: "landing", label: "Custom Landing Page" },
];

export default function CMSPage() {
  const { success, error: toastError } = useToast();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");

  // Modal / Drawer States
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activePage, setActivePage] = useState(null);

  // Editor Form State
  const [form, setForm] = useState({
    id: null,
    title: "",
    slug: "",
    template: "standard",
    content: "",
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
    status: "Draft",
    scheduledAt: "",
  });
  const [saving, setSaving] = useState(false);

  // Fetch CMS Pages
  const loadPages = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const params = new URLSearchParams({
        search: search.trim(),
        status: statusFilter,
        template: templateFilter,
      });

      const res = await fetch(`${baseUrl}/api/cms?${params.toString()}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setPages(json.pages || []);
      } else {
        toastError("Load Error", json.error);
      }
    } catch (err) {
      console.error("Failed to load CMS pages:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, templateFilter, toastError]);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  // Open Create Page
  const openCreateModal = () => {
    setActivePage(null);
    setForm({
      id: null,
      title: "",
      slug: "",
      template: "standard",
      content: "",
      metaTitle: "",
      metaDescription: "",
      ogImage: "",
      status: "Draft",
      scheduledAt: "",
    });
    setShowEditorModal(true);
  };

  // Open Edit Page
  const openEditModal = (page) => {
    setActivePage(page);
    setForm({
      id: page.id || page._id,
      title: page.title,
      slug: page.slug,
      template: page.template || "standard",
      content: page.content || "",
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      ogImage: page.ogImage || "",
      status: page.status || "Draft",
      scheduledAt: page.scheduledAt ? new Date(page.scheduledAt).toISOString().split("T")[0] : "",
    });
    setShowEditorModal(true);
  };

  // Save Page Handler
  const handleSavePage = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const isEdit = !!form.id;
      const url = isEdit ? `${baseUrl}/api/cms/${form.id}` : `${baseUrl}/api/cms`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.success) {
        success(isEdit ? "Page Saved" : "Page Created", `Page '${form.title}' saved successfully.`);
        setShowEditorModal(false);
        loadPages();
      } else {
        toastError("Save Error", json.error);
      }
    } catch (err) {
      toastError("Save Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete Page Handler
  const handleDeletePage = async (id, title) => {
    if (!window.confirm(`Delete page '${title}' permanently?`)) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/cms/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        success("Page Deleted", `Page '${title}' removed.`);
        loadPages();
      } else {
        toastError("Delete Error", json.error);
      }
    } catch (err) {
      toastError("Delete Error", err.message);
    }
  };

  // Restore Revision Handler
  const handleRestoreRevision = async (revisionId) => {
    if (!form.id || !window.confirm("Restore this saved page revision snapshot?")) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/cms/${form.id}/restore/${revisionId}`, {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success && json.page) {
        setForm({
          ...form,
          title: json.page.title,
          content: json.page.content,
          metaTitle: json.page.metaTitle,
          metaDescription: json.page.metaDescription,
        });
        success("Revision Restored", "Page content restored from snapshot.");
      } else {
        toastError("Restore Error", json.error);
      }
    } catch (err) {
      toastError("Restore Error", err.message);
    }
  };

  // Rich Text Quick Snippet Inserter
  const insertSnippet = (snippetHtml) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content + "\n" + snippetHtml,
    }));
  };

  return (
    <AdminShell>
      <div className="space-y-6 max-w-7xl pb-24">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F0EDE8] flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-[#C8A45D]" />
              CMS Studio & Page Management
            </h1>
            <p className="text-xs text-[#777] mt-0.5">
              Create, edit, and publish About, Contact, Policies, FAQ, and custom landing pages with visual rich text and SEO tools
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadPages}
              className="p-2 bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] text-xs text-[#E8E4DF] rounded-[8px] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#C8A45D]" : "text-[#777]"}`} />
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] text-xs font-bold rounded-[8px] transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Page</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages by title, slug, content..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
            >
              <option value="all">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>

          <div>
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
            >
              <option value="all">All Templates</option>
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CMS Pages Table */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#161616] border-b border-[#1E1E1E] text-[#888] font-semibold">
                  <th className="py-3.5 px-4">PAGE TITLE & SLUG</th>
                  <th className="py-3.5 px-4">TEMPLATE</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4">REVISIONS</th>
                  <th className="py-3.5 px-4">VIEWS</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#666] animate-pulse">
                      Loading CMS pages...
                    </td>
                  </tr>
                ) : pages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#666]">
                      No CMS pages matching search filters.
                    </td>
                  </tr>
                ) : (
                  pages.map((p) => (
                    <tr key={p.id} className="hover:bg-[#161616]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#E8E4DF]">{p.title}</div>
                        <div className="text-[11px] font-mono text-[#666]">/{p.slug}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded text-[10px] text-[#AAA] capitalize font-medium">
                          {p.template}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                          p.status === "Published" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#888]">
                        {p.revisionsCount || 0} Saved Snapshots
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#C8A45D]">
                        {p.viewsCount || 0}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setActivePage(p);
                              setShowPreviewModal(true);
                            }}
                            className="p-1.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#2E2E2E] text-[#AAA] rounded-[6px]"
                            title="Preview Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#2E2E2E] text-[#C8A45D] rounded-[6px]"
                            title="Edit Page & Content"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePage(p.id, p.title)}
                            className="p-1.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#2E2E2E] text-rose-400 rounded-[6px]"
                            title="Delete Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CMS Studio Visual Editor Modal */}
      {showEditorModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSavePage} className="bg-[#111] border border-[#1E1E1E] rounded-[16px] max-w-4xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C8A45D]" />
                {form.id ? "Edit CMS Page & Content" : "Create New CMS Page"}
              </h3>
              <button type="button" onClick={() => setShowEditorModal(false)} className="text-[#666] hover:text-[#E8E4DF]">✕</button>
            </div>

            {/* Page Metadata Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-[#888] block mb-1">Page Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                  className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#888] block mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#888] block mb-1">Template</label>
                <select
                  value={form.template}
                  onChange={(e) => setForm({ ...form, template: e.target.value })}
                  className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#888] block mb-1">Publish Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#888] block mb-1">Meta Title (SEO)</label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                />
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="bg-[#161616] border border-[#222] rounded-[10px] p-2 space-y-2">
              <span className="text-[10px] text-[#C8A45D] font-bold uppercase block px-1">Quick Content Snippets Toolbar</span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => insertSnippet("<h2>SECTION HEADING</h2>")}
                  className="px-2.5 py-1 bg-[#222] hover:bg-[#2A2A2A] text-[#E8E4DF] rounded text-[11px] font-bold"
                >
                  + Heading (H2)
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("<p>Your paragraph description content goes here.</p>")}
                  className="px-2.5 py-1 bg-[#222] hover:bg-[#2A2A2A] text-[#E8E4DF] rounded text-[11px]"
                >
                  + Paragraph
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("<blockquote class='border-l-2 border-[#C8A45D] pl-4 italic text-[#AAA] my-4'>\"Luxury is in each detail.\"</blockquote>")}
                  className="px-2.5 py-1 bg-[#222] hover:bg-[#2A2A2A] text-[#C8A45D] rounded text-[11px]"
                >
                  + Quote
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("<div class='p-4 bg-[#141414] border border-[#262626] rounded-[8px] text-xs text-[#CCC]'>Important Callout Box</div>")}
                  className="px-2.5 py-1 bg-[#222] hover:bg-[#2A2A2A] text-amber-400 rounded text-[11px]"
                >
                  + Callout Box
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("<img src='/images/lookbook/gor-lookbook-1.webp' alt='Atelier' class='w-full rounded-[12px] my-4' />")}
                  className="px-2.5 py-1 bg-[#222] hover:bg-[#2A2A2A] text-sky-400 rounded text-[11px]"
                >
                  + Image
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("<a href='/shop' class='inline-block px-6 py-2.5 bg-[#C8A45D] text-[#0D0D0D] font-bold rounded uppercase'>EXPLORE COLLECTION</a>")}
                  className="px-2.5 py-1 bg-[#222] hover:bg-[#2A2A2A] text-emerald-400 rounded text-[11px]"
                >
                  + CTA Button
                </button>
              </div>
            </div>

            {/* Rich HTML / Markdown Content Editor */}
            <div>
              <label className="text-[11px] font-semibold text-[#888] block mb-1">Page HTML / Rich Content Editor *</label>
              <textarea
                rows={10}
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full p-3 bg-[#141414] border border-[#222] rounded-[8px] text-xs font-mono text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
              />
            </div>

            {/* Saved Revisions List (If Editing) */}
            {activePage?.revisions?.length > 0 && (
              <div className="p-3 bg-[#161616] border border-[#222] rounded-[10px] space-y-2">
                <span className="text-[10px] text-[#777] font-bold uppercase block">Saved Revision Snapshots</span>
                <div className="max-h-28 overflow-y-auto space-y-1.5 divide-y divide-[#222]">
                  {activePage.revisions.map((rev) => (
                    <div key={rev.revisionId} className="pt-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-[#AAA] font-mono">{new Date(rev.savedAt).toLocaleString()} — {rev.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRestoreRevision(rev.revisionId)}
                        className="text-[#C8A45D] hover:underline font-bold"
                      >
                        Restore Snapshot
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowEditorModal(false)} className="w-1/2 py-2 bg-[#1C1C1C] text-xs text-[#888] rounded-[8px]">Cancel</button>
              <button type="submit" disabled={saving} className="w-1/2 py-2 bg-[#C8A45D] text-[#0D0D0D] font-bold text-xs rounded-[8px]">Save Page</button>
            </div>
          </form>
        </div>
      )}

      {/* Live Page Preview Modal */}
      {showPreviewModal && activePage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#090909] border border-[#1E1E1E] rounded-[18px] max-w-3xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#F8F6F3]">{activePage.title}</h2>
                <p className="text-xs font-mono text-[#C8A45D]">https://gormenswear.com/{activePage.slug}</p>
              </div>
              <button type="button" onClick={() => setShowPreviewModal(null)} className="text-[#666] hover:text-[#FFF]">✕</button>
            </div>

            {/* Rendered HTML Preview */}
            <div
              className="prose prose-invert max-w-none text-xs text-[#CCCCCC] leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: activePage.content || "<p>No content written yet.</p>" }}
            />

            <div className="pt-4 border-t border-[#1E1E1E] flex justify-end">
              <button type="button" onClick={() => setShowPreviewModal(null)} className="px-4 py-2 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-[#E8E4DF] font-bold rounded-[8px]">Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
