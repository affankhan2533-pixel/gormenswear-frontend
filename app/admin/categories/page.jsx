"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import { categoriesService } from "@/lib/categoriesService";
import { productService } from "@/lib/productService";
import { Plus, Edit, Trash2, X, Save, Tag } from "lucide-react";

const FIELD =
  "w-full px-3 py-2.5 bg-[#0D0D0D] border border-[#222] rounded-[9px] text-sm text-[#E8E4DF] placeholder:text-[#444] focus:outline-none focus:border-[#C8A45D]/60 transition-colors";
const LABEL = "block text-xs font-semibold text-[#777] mb-1.5 uppercase tracking-wider";

const EMPTY_FORM = { name: "", status: "Active" };

export default function CategoriesPage() {
  const { success, error: toastError } = useToast();
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    const all = categoriesService.getAll();
    setCategories(all);
    const products = await productService.getProducts();
    const counts = {};
    all.forEach((c) => {
      const cName = (c.name || "").toLowerCase();
      const cSlug = (c.slug || "").toLowerCase();
      counts[c.id] = (products || []).filter((p) => {
        const pCat = (p.category || "").toLowerCase();
        const pCatId = String(p.categoryId || "");
        return (
          (pCatId && pCatId === String(c.id)) ||
          (pCat && cName && (pCat.includes(cName) || cName.includes(pCat))) ||
          (pCat && cSlug && (pCat.includes(cSlug) || cSlug.includes(pCat)))
        );
      }).length;
    });
    setProductCounts(counts);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditTarget(cat);
    setForm({ name: cat.name, status: cat.status });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toastError("Name required", "Please enter a category name.");
      return;
    }
    if (editTarget) {
      categoriesService.update(editTarget.id, form);
      success("Updated", `${form.name} updated.`);
    } else {
      categoriesService.create(form);
      success("Created", `${form.name} category created.`);
    }
    setShowForm(false);
    await load();
  };

  const handleDelete = async (cat) => {
    categoriesService.delete(cat.id);
    success("Deleted", `${cat.name} removed.`);
    setDeleteTarget(null);
    await load();
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-[#F0EDE8]">Categories</h1>
            <p className="text-xs text-[#666] mt-0.5">
              {categories.length} categories
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] text-sm font-semibold rounded-[10px] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#E8E4DF]">
                {editTarget ? "Edit Category" : "New Category"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 text-[#555] hover:text-[#E8E4DF] rounded-[6px] hover:bg-[#1E1E1E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Knitwear"
                  className={FIELD}
                />
              </div>
              <div>
                <label className={LABEL}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className={`${FIELD} cursor-pointer`}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-[#666] hover:text-[#E8E4DF] rounded-[9px] hover:bg-[#1A1A1A]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] text-sm font-semibold rounded-[9px]"
              >
                <Save className="w-3.5 h-3.5" />
                {editTarget ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="w-10 h-10 text-[#333] mx-auto mb-3" />
            <p className="text-[#555] text-sm">No categories yet</p>
          </div>
        ) : (
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#111] z-10 border-b border-[#1E1E1E] shadow-sm">
                <tr className="text-[#555] text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-5 text-left">Category</th>
                  <th className="py-3 px-5 text-left hidden md:table-cell">Slug</th>
                  <th className="py-3 px-5 text-center">Products</th>
                  <th className="py-3 px-5 text-center">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#161616] transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[7px] bg-[#1A1A1A] border border-[#222] overflow-hidden shrink-0 flex items-center justify-center">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <Tag className="w-3.5 h-3.5 text-[#444]" />
                          )}
                        </div>
                        <div>
                          <span className="text-[13px] font-medium text-[#E8E4DF]">
                            {cat.name}
                          </span>
                          {cat.subcategories && cat.subcategories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {cat.subcategories.map((sub) => (
                                <span
                                  key={sub.id}
                                  className="text-[10px] bg-[#181818] text-[#9E9A93] px-1.5 py-0.5 rounded-[4px] border border-[#252525]"
                                >
                                  {sub.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 hidden md:table-cell">
                      <span className="text-[11px] font-mono text-[#555]">
                        {cat.slug}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="text-[12px] font-mono text-[#888]">
                        {productCounts[cat.id] ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          cat.status === "Active"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                            : "bg-amber-500/15 text-amber-400 border-amber-500/25"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEdit(cat)}
                          className="p-1.5 rounded-[6px] text-[#555] hover:text-[#C8A45D] hover:bg-[#1E1E1E]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(cat)}
                          className="p-1.5 rounded-[6px] text-[#444] hover:text-rose-400 hover:bg-rose-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-[#141414] border border-[#2A2A2A] rounded-[20px] p-7 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-[#E8E4DF] mb-2">Delete Category?</h3>
            <p className="text-sm text-[#666] mb-1">
              <span className="font-semibold text-[#E8E4DF]">{deleteTarget.name}</span> will be permanently deleted.
            </p>
            <p className="text-xs text-amber-400 mb-6">
              {productCounts[deleteTarget.id] > 0
                ? `${productCounts[deleteTarget.id]} product(s) are in this category — they will not be deleted.`
                : "No products are in this category."}
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] rounded-[10px] text-sm font-medium">Cancel</button>
              <button type="button" onClick={() => handleDelete(deleteTarget)} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-[10px] text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
