"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import { productService } from "@/lib/productService";
import { categoriesService } from "@/lib/categoriesService";
import { collectionsService } from "@/lib/collectionsService";
import { ChevronLeft, Save, Eye, AlertCircle, Upload, X, Star } from "lucide-react";

const FIELD = "w-full px-3 py-2.5 bg-[#0D0D0D] border border-[#222] rounded-[9px] text-xs text-[#E8E4DF] placeholder:text-[#444] focus:outline-none focus:border-[#C8A45D]/60 transition-colors";
const LABEL = "block text-xs font-semibold text-[#888] mb-1.5 uppercase tracking-wider";
const SECTION = "bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 space-y-4";

export default function AddProductPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    description: "",
    images: [],
    imageUrl: "",
    price: "",
    compareAtPrice: "",
    categoryId: "",
    collectionId: "",
    tagsInput: "",
    tags: [],
    stock: "10",
    minStockThreshold: "5",
    sku: "",
    status: "Draft",
    visibility: "Hidden",
  });

  useEffect(() => {
    setCategories(categoriesService.getAll());
    setCollections(collectionsService.getAll());
  }, []);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleAddImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target.result;
        setForm((f) => ({
          ...f,
          images: [...f.images, base64Url],
          imageUrl: f.imageUrl || base64Url,
        }));
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = form.images.filter((_, i) => i !== index);
    const newPrimary = newImages[0] || "";
    setForm((f) => ({
      ...f,
      images: newImages,
      imageUrl: newPrimary,
    }));
  };

  const handleSetPrimaryImage = (index) => {
    const selected = form.images[index];
    const remaining = form.images.filter((_, i) => i !== index);
    const reordered = [selected, ...remaining];
    setForm((f) => ({
      ...f,
      images: reordered,
      imageUrl: selected,
    }));
  };

  const handleTagsAdd = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = form.tagsInput.trim().replace(/,/g, "");
      if (val && !form.tags.includes(val)) {
        setForm((f) => ({
          ...f,
          tags: [...f.tags, val],
          tagsInput: "",
        }));
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0)
      e.price = "Valid price is required";
    return e;
  };

  const handleSave = async (targetStatus = "Draft", targetVisibility = "Hidden") => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const cat = categories.find((c) => c.id === form.categoryId);
      const col = collections.find((c) => c.id === form.collectionId);

      const product = await productService.createProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl || form.images[0] || "/images/lookbook/gor-lookbook-1.webp",
        images: form.images.length > 0 ? form.images : ["/images/lookbook/gor-lookbook-1.webp"],
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
        categoryId: form.categoryId || null,
        category: cat?.name || "",
        collectionId: form.collectionId || null,
        collection: col?.name || "",
        tags: form.tags,
        stock: parseInt(form.stock || "0", 10),
        minStockThreshold: parseInt(form.minStockThreshold || "5", 10),
        sku: form.sku.trim() || undefined,
        status: targetStatus,
        visibility: targetVisibility,
      });

      success(
        targetStatus === "Active" ? "Product Published" : "Draft Saved",
        `${product.name} saved successfully.`
      );
      router.push(`/admin/products/${product.id || product._id}`);
    } catch (err) {
      error("Save Failed", err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto space-y-6 pb-12">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="p-2 rounded-[8px] text-[#555] hover:text-[#E8E4DF] hover:bg-[#161616] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#F0EDE8]">Add Product</h1>
              <p className="text-xs text-[#555] mt-0.5">
                Create a new product for your catalog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave("Draft", "Hidden")}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-[#E8E4DF] text-xs font-medium rounded-[10px] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave("Active", "Published")}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] text-xs font-bold rounded-[10px] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              {saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>

        {/* 1. Basic Information */}
        <div className={SECTION}>
          <h2 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] text-xs flex items-center justify-center font-bold">1</span>
            Basic Information
          </h2>

          <div>
            <label className={LABEL}>Product Name *</label>
            <input
              type="text"
              placeholder="e.g. Italian Merino Wool Polo Shirt"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={`${FIELD} ${errors.name ? "border-rose-500/50" : ""}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className={LABEL}>Description</label>
            <textarea
              rows={4}
              placeholder="Detailed garment specification, silhouette description, fabric composition..."
              value={form.description}
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
            {form.images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-square bg-[#1A1A1A] rounded-[10px] border border-[#222] overflow-hidden group"
              >
                <img
                  src={img}
                  alt={`Product view ${i + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Tag */}
                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 text-[9px] bg-[#C8A45D] text-[#090909] font-bold px-1.5 py-0.5 rounded-[4px] shadow">
                    Primary
                  </span>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(i)}
                      className="p-1.5 bg-[#141414] text-[#C8A45D] hover:bg-[#222] rounded-[6px] text-xs"
                      title="Set as Primary Image"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="p-1.5 bg-rose-950/80 text-rose-400 hover:bg-rose-900 rounded-[6px] text-xs"
                    title="Remove Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Drop / Upload button */}
            <label className="aspect-square bg-[#141414] border-2 border-dashed border-[#222] hover:border-[#C8A45D]/40 rounded-[10px] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-[#555]" />
              <span className="text-[11px] text-[#777] font-medium">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAddImage}
              />
            </label>
          </div>
          <p className="text-[11px] text-[#555]">
            First image will be set as the Primary Product Image on listings.
          </p>
        </div>

        {/* 3. Pricing */}
        <div className={SECTION}>
          <h2 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] text-xs flex items-center justify-center font-bold">3</span>
            Pricing
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Price (₹) *</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={`${FIELD} ${errors.price ? "border-rose-500/50" : ""}`}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.price}
                </p>
              )}
            </div>
            <div>
              <label className={LABEL}>Compare Price (₹)</label>
              <input
                type="number"
                placeholder="Original Price (Optional)"
                min="0"
                step="0.01"
                value={form.compareAtPrice}
                onChange={(e) => set("compareAtPrice", e.target.value)}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
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
              <label className={LABEL}>Collection</label>
              <select
                value={form.collectionId}
                onChange={(e) => set("collectionId", e.target.value)}
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

          <div>
            <label className={LABEL}>Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map((tag) => (
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
              value={form.tagsInput}
              onChange={(e) => set("tagsInput", e.target.value)}
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
                placeholder="Auto-generated if blank"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                className={FIELD}
              />
            </div>

            <div>
              <label className={LABEL}>Available Stock</label>
              <input
                type="number"
                min="0"
                placeholder="10"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                className={FIELD}
              />
            </div>

            <div>
              <label className={LABEL}>Low Stock Threshold</label>
              <input
                type="number"
                min="0"
                placeholder="5"
                value={form.minStockThreshold}
                onChange={(e) => set("minStockThreshold", e.target.value)}
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
              { status: "Draft", vis: "Hidden", title: "Draft", desc: "Saved internally, not visible on storefront" },
              { status: "Active", vis: "Published", title: "Published", desc: "Live on storefront for customer purchase" },
              { status: "Draft", vis: "Hidden", title: "Hidden", desc: "Catalog item hidden from customer view" },
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

      </div>
    </AdminShell>
  );
}
