"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import { productService } from "@/lib/productService";
import { categoriesService } from "@/lib/categoriesService";
import { collectionsService } from "@/lib/collectionsService";
import {
  ChevronLeft,
  Save,
  Globe,
  Archive,
  Trash2,
  Package,
  Check,
  Upload,
  X,
  Star,
  RotateCcw,
  Copy,
} from "lucide-react";
import DeleteConfirmModal from "@/components/admin/products/DeleteConfirmModal";

const FIELD =
  "w-full px-3 py-2.5 bg-[#0D0D0D] border border-[#222] rounded-[9px] text-xs text-[#E8E4DF] placeholder:text-[#444] focus:outline-none focus:border-[#C8A45D]/60 transition-colors";
const LABEL =
  "block text-xs font-semibold text-[#888] mb-1.5 uppercase tracking-wider";
const SECTION = "bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 space-y-4";

const STATUS_PILL = {
  Active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  Draft: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  Archived: "bg-zinc-800 text-zinc-500 border border-zinc-700",
  Hidden: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

export default function ProductEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: toastError, warning, info } = useToast();
  const productId = params?.id;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    setCategories(categoriesService.getAll());
    setCollections(collectionsService.getAll());
  }, []);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    const prod = await productService.getProduct(productId);
    if (!prod) {
      setNotFound(true);
    } else {
      setForm({
        ...prod,
        colors: prod.colors || [],
        sizes: prod.sizes || [],
        subcategoryId: prod.subcategoryId || "",
      });
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setIsDirty(true);
  };

  const handleAddImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const imgs = [...(form.images || []), url];
      set("images", imgs);
      if (!form.imageUrl) set("imageUrl", url);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (i) => {
    const imgs = [...(form.images || [])];
    imgs.splice(i, 1);
    set("images", imgs);
    if (i === 0) {
      set("imageUrl", imgs[0] || "");
    }
  };

  const handleSetPrimaryImage = (i) => {
    const imgs = [...(form.images || [])];
    const selected = imgs.splice(i, 1)[0];
    const reordered = [selected, ...imgs];
    set("images", reordered);
    set("imageUrl", selected);
  };

  const handleTagsAdd = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagsInput.trim().replace(/,/g, "");
      if (val && !(form.tags || []).includes(val)) {
        set("tags", [...(form.tags || []), val]);
        setTagsInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    set(
      "tags",
      (form.tags || []).filter((t) => t !== tagToRemove)
    );
  };

  const handleColorsAdd = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = colorsInput.trim().replace(/,/g, "");
      if (val && !(form.colors || []).includes(val)) {
        set("colors", [...(form.colors || []), val]);
        setColorsInput("");
      }
    }
  };

  const handleRemoveColor = (colToRemove) => {
    set(
      "colors",
      (form.colors || []).filter((c) => c !== colToRemove)
    );
  };

  const handleToggleSize = (sz) => {
    const current = form.sizes || [];
    set(
      "sizes",
      current.includes(sz) ? current.filter((s) => s !== sz) : [...current, sz]
    );
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const cat = categories.find((c) => c.id === form.categoryId);
      const subcat = (cat?.subcategories || []).find((s) => s.id === form.subcategoryId);
      const col = collections.find((c) => c.id === form.collectionId);

      const updated = await productService.updateProduct(productId, {
        ...form,
        category: cat?.name || form.category,
        categorySlug: cat?.slug || form.categorySlug || "",
        subcategoryId: form.subcategoryId || null,
        subcategory: subcat?.name || form.subcategory || "",
        subcategorySlug: subcat?.slug || form.subcategorySlug || "",
        collection: col?.name || form.collection,
        colors: form.colors || [],
        sizes: form.sizes || [],
      });

      if (updated) {
        setForm(updated);
        setIsDirty(false);
        setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        success("Saved", `${updated.name} updated successfully.`);
      }
    } catch (err) {
      toastError("Save Failed", err?.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const cat = categories.find((c) => c.id === form.categoryId);
      const subcat = (cat?.subcategories || []).find((s) => s.id === form.subcategoryId);
      const col = collections.find((c) => c.id === form.collectionId);

      const updated = await productService.updateProduct(productId, {
        ...form,
        status: "Active",
        visibility: "Published",
        category: cat?.name || form.category,
        categorySlug: cat?.slug || form.categorySlug || "",
        subcategoryId: form.subcategoryId || null,
        subcategory: subcat?.name || form.subcategory || "",
        subcategorySlug: subcat?.slug || form.subcategorySlug || "",
        collection: col?.name || form.collection,
        colors: form.colors || [],
        sizes: form.sizes || [],
      });
      setForm(updated);
      setIsDirty(false);
      setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      success("Published", `${updated.name} is now live on the storefront.`);
    } catch (err) {
      toastError("Publish Failed", err?.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!form) return;
    const dup = await productService.duplicateProduct(productId);
    if (dup) {
      info("Product Duplicated", `Created ${dup.name}`);
      router.push(`/admin/products/${dup.id}`);
    }
  };

  const handleSoftDelete = async () => {
    await productService.softDeleteProduct(productId);
    warning("Product Archived", `${form?.name} moved to archive.`);
    router.push("/admin/products");
  };

  const handleRestore = async () => {
    await productService.restoreProduct(productId);
    success("Product Restored", `${form?.name} restored to Draft.`);
    fetchProduct();
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [form]);

  if (loading) {
    return (
      <AdminShell>
        <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
          <div className="h-10 bg-[#1A1A1A] rounded-[10px]" />
          <div className="h-48 bg-[#111] border border-[#1E1E1E] rounded-[14px]" />
          <div className="h-32 bg-[#111] border border-[#1E1E1E] rounded-[14px]" />
        </div>
      </AdminShell>
    );
  }

  if (notFound || !form) {
    return (
      <AdminShell>
        <div className="max-w-4xl mx-auto text-center py-20">
          <Package className="w-12 h-12 text-[#333] mx-auto mb-4" />
          <h2 className="text-lg font-bold text-[#E8E4DF] mb-2">Product Not Found</h2>
          <p className="text-sm text-[#555] mb-6">
            This product may have been deleted or the ID is incorrect.
          </p>
          <Link href="/admin/products" className="text-sm text-[#C8A45D] hover:underline">
            ← Back to Products
          </Link>
        </div>
      </AdminShell>
    );
  }

  const statusDisplay =
    form.status === "Archived"
      ? "Archived"
      : form.visibility === "Hidden"
      ? "Hidden"
      : form.status === "Draft"
      ? "Draft"
      : "Published";

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">

        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-10 bg-[#090909]/90 backdrop-blur-md py-3 -mx-6 px-6 border-b border-[#1A1A1A] flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="p-2 rounded-[8px] text-[#555] hover:text-[#E8E4DF] hover:bg-[#161616] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-[#E8E4DF] max-w-[260px] truncate">
                  {form.name || "Untitled Product"}
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_PILL[statusDisplay] || STATUS_PILL.Draft}`}>
                  {statusDisplay}
                </span>
              </div>
              <p className="text-[11px] text-[#555]">
                {form.sku}
                {isDirty && <span className="ml-2 text-amber-500">● Unsaved changes</span>}
                {savedAt && !isDirty && (
                  <span className="ml-2 text-emerald-600">
                    <Check className="w-3 h-3 inline" /> Saved at {savedAt}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDuplicate}
              className="p-2 rounded-[8px] border border-[#222] bg-[#141414] text-[#888] hover:text-[#C8A45D] transition-colors cursor-pointer"
              title="Duplicate Product"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-[#E8E4DF] text-xs font-medium rounded-[9px] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving…" : "Save"}
            </button>

            {form.status === "Archived" ? (
              <button
                type="button"
                onClick={handleRestore}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-[9px] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore
              </button>
            ) : form.status !== "Active" || form.visibility !== "Published" ? (
              <button
                type="button"
                onClick={handlePublish}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] text-xs font-bold rounded-[9px] transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                Publish
              </button>
            ) : (
              <button
                type="button"
                onClick={() => set("visibility", "Hidden")}
                className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-[#888] text-xs font-medium rounded-[9px] transition-colors cursor-pointer"
              >
                Hide
              </button>
            )}
          </div>
        </div>

        {/* 1. Basic Information */}
        <div className={SECTION}>
          <h2 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] text-xs flex items-center justify-center font-bold">1</span>
            Basic Information
          </h2>

          <div>
            <label className={LABEL}>Product Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL}>Description</label>
            <textarea
              rows={5}
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              className={`${FIELD} resize-none`}
            />
          </div>
        </div>

        {/* 2. Images */}
        <div className={SECTION}>
          <h2 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] text-xs flex items-center justify-center font-bold">2</span>
            Images
          </h2>

          <div className="grid grid-cols-4 gap-3">
            {(form.images || []).map((src, i) => (
              <div
                key={i}
                className="relative aspect-square bg-[#1A1A1A] rounded-[10px] border border-[#222] overflow-hidden group"
              >
                <img src={src} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 text-[9px] bg-[#C8A45D] text-[#090909] font-bold px-1.5 py-0.5 rounded-[4px]">
                    Primary
                  </span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(i)}
                      className="p-1.5 bg-[#141414] text-[#C8A45D] rounded-[6px]"
                      title="Set Primary"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="p-1.5 bg-rose-950/80 text-rose-400 rounded-[6px]"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <label className="aspect-square bg-[#141414] border-2 border-dashed border-[#222] hover:border-[#C8A45D]/40 rounded-[10px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-[#555]" />
              <span className="text-[11px] text-[#777]">Upload Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
            </label>
          </div>
        </div>

        {/* 3. Pricing */}
        <div className={SECTION}>
          <h2 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] text-xs flex items-center justify-center font-bold">3</span>
            Pricing
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={FIELD}
              />
            </div>
            <div>
              <label className={LABEL}>Compare Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.compareAtPrice || ""}
                onChange={(e) => set("compareAtPrice", e.target.value || null)}
                className={FIELD}
              />
            </div>
          </div>
        </div>

        {/* 4. Organization */}
        <div className={SECTION}>
          <h2 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] text-xs flex items-center justify-center font-bold">4</span>
            Organization
          </h2>

          {(() => {
            const selectedCat = categories.find((c) => c.id === form.categoryId);
            const availableSubs = selectedCat?.subcategories || [];

            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={LABEL}>Category</label>
                    <select
                      value={form.categoryId || ""}
                      onChange={(e) => {
                        const cat = categories.find((c) => c.id === e.target.value);
                        set("categoryId", e.target.value);
                        set("subcategoryId", "");
                        if (cat) {
                          set("category", cat.name);
                          set("categorySlug", cat.slug);
                        }
                      }}
                      className={`${FIELD} cursor-pointer`}
                    >
                      <option value="">Select Category…</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={LABEL}>Subcategory</label>
                    <select
                      value={form.subcategoryId || ""}
                      onChange={(e) => {
                        const sub = availableSubs.find((s) => s.id === e.target.value);
                        set("subcategoryId", e.target.value);
                        if (sub) {
                          set("subcategory", sub.name);
                          set("subcategorySlug", sub.slug);
                        }
                      }}
                      disabled={!selectedCat || availableSubs.length === 0}
                      className={`${FIELD} cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      <option value="">
                        {selectedCat && availableSubs.length > 0
                          ? "Select Subcategory…"
                          : "No subcategories"}
                      </option>
                      {availableSubs.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={LABEL}>Collection</label>
                    <select
                      value={form.collectionId || ""}
                      onChange={(e) => {
                        const col = collections.find((c) => c.id === e.target.value);
                        set("collectionId", e.target.value);
                        if (col) set("collection", col.name);
                      }}
                      className={`${FIELD} cursor-pointer`}
                    >
                      <option value="">Select Collection…</option>
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Colors & Sizes Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#1E1E1E]">
                  <div>
                    <label className={LABEL}>Colors (Multi-variant)</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(form.colors || []).map((col) => (
                        <span
                          key={col}
                          className="px-2 py-1 bg-[#1E1E1E] text-[#E8E4DF] text-[11px] rounded-[6px] flex items-center gap-1 border border-[#2A2A2A]"
                        >
                          {col}
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(col)}
                            className="hover:text-rose-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Type color (e.g. Black) and press Enter…"
                      value={colorsInput}
                      onChange={(e) => setColorsInput(e.target.value)}
                      onKeyDown={handleColorsAdd}
                      className={FIELD}
                    />
                  </div>

                  <div>
                    <label className={LABEL}>Sizes Available</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((sz) => {
                        const active = (form.sizes || []).includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleToggleSize(sz)}
                            className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold border transition-all cursor-pointer ${
                              active
                                ? "bg-[#C8A45D]/20 border-[#C8A45D] text-[#C8A45D]"
                                : "bg-[#0D0D0D] border-[#222] text-[#666] hover:text-[#E8E4DF] hover:border-[#333]"
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

          <div>
            <label className={LABEL}>Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(form.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-[#1E1E1E] text-[#E8E4DF] text-[11px] rounded-[6px] flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type tag and press Enter…"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={handleTagsAdd}
              className={FIELD}
            />
          </div>
        </div>

        {/* 5. Inventory */}
        <div className={SECTION}>
          <h2 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] text-xs flex items-center justify-center font-bold">5</span>
            Inventory
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={LABEL}>SKU</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                className={FIELD}
              />
            </div>
            <div>
              <label className={LABEL}>Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set("stock", parseInt(e.target.value, 10) || 0)}
                className={FIELD}
              />
            </div>
            <div>
              <label className={LABEL}>Low Stock Threshold</label>
              <input
                type="number"
                min="0"
                value={form.minStockThreshold || 5}
                onChange={(e) => set("minStockThreshold", parseInt(e.target.value, 10) || 5)}
                className={FIELD}
              />
            </div>
          </div>
        </div>

        {/* 6. Publishing */}
        <div className={SECTION}>
          <h2 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] text-xs flex items-center justify-center font-bold">6</span>
            Publishing
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {[
              { status: "Draft", vis: "Hidden", title: "Draft", desc: "Saved internally" },
              { status: "Active", vis: "Published", title: "Published", desc: "Live on storefront" },
              { status: "Draft", vis: "Hidden", title: "Hidden", desc: "Hidden from catalog" },
            ].map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  set("status", opt.status);
                  set("visibility", opt.vis);
                }}
                className={`p-3 rounded-[10px] border text-left transition-all cursor-pointer ${
                  form.visibility === opt.vis && form.status === opt.status
                    ? "bg-[#C8A45D]/15 border-[#C8A45D] text-[#C8A45D]"
                    : "bg-[#0D0D0D] border-[#222] text-[#888] hover:border-[#333]"
                }`}
              >
                <p className="text-xs font-bold text-[#E8E4DF] mb-1">{opt.title}</p>
                <p className="text-[10px] text-[#666] leading-snug">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-rose-950/20 border border-rose-900/30 rounded-[14px] p-5 space-y-3">
          <h2 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            Danger Zone
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSoftDelete}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-[#888] hover:text-amber-400 text-xs font-medium rounded-[9px] transition-colors cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" />
              Soft Delete / Archive
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/30 text-rose-400 text-xs font-medium rounded-[9px] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Permanently Delete
            </button>
          </div>
        </div>

      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        product={form}
        onConfirm={async () => {
          await productService.deleteProduct(productId);
          success("Deleted", `${form.name} permanently deleted.`);
          router.push("/admin/products");
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </AdminShell>
  );
}
