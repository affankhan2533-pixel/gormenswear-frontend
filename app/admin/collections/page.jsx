"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import { collectionsService } from "@/lib/collectionsService";
import { productService } from "@/lib/productService";
import { Plus, Edit, Trash2, X, Save, Layers } from "lucide-react";

const FIELD =
  "w-full px-3 py-2.5 bg-[#0D0D0D] border border-[#222] rounded-[9px] text-sm text-[#E8E4DF] placeholder:text-[#444] focus:outline-none focus:border-[#C8A45D]/60 transition-colors";
const LABEL = "block text-xs font-semibold text-[#777] mb-1.5 uppercase tracking-wider";

const EMPTY_FORM = { name: "", description: "", status: "Active" };

export default function CollectionsPage() {
  const { success, error: toastError } = useToast();
  const [collections, setCollections] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    const all = collectionsService.getAll();
    setCollections(all);
    const products = await productService.getProducts();
    const counts = {};
    all.forEach((c) => {
      const cName = (c.name || "").toLowerCase();
      const cSlug = (c.slug || "").toLowerCase();
      counts[c.id] = (products || []).filter((p) => {
        const pCol = (p.collection || "").toLowerCase();
        const pColId = String(p.collectionId || "");
        return (
          (pColId && pColId === String(c.id)) ||
          (pCol && cName && (pCol.includes(cName) || cName.includes(pCol))) ||
          (pCol && cSlug && (pCol.includes(cSlug) || cSlug.includes(pCol)))
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

  const openEdit = (col) => {
    setEditTarget(col);
    setForm({ name: col.name, description: col.description || "", status: col.status });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toastError("Name required", "Please enter a collection name.");
      return;
    }
    if (editTarget) {
      collectionsService.update(editTarget.id, form);
      success("Updated", `${form.name} updated.`);
    } else {
      collectionsService.create(form);
      success("Created", `${form.name} collection created.`);
    }
    setShowForm(false);
    await load();
  };

  const handleDelete = async (col) => {
    collectionsService.delete(col.id);
    success("Deleted", `${col.name} removed.`);
    setDeleteTarget(null);
    await load();
  };

  return (
    <AdminShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#F0EDE8]">Collections</h1>
            <p className="text-[11px] sm:text-xs text-[#666] mt-0.5">
              {collections.length} collections
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] text-xs font-bold rounded-[9px] transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Collection</span>
          </button>
        </div>

        {/* Form Drawer */}
        {showForm && (
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#E8E4DF]">
                {editTarget ? "Edit Collection" : "New Collection"}
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
                  placeholder="e.g. Summer 2026"
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

            <div>
              <label className={LABEL}>Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of this collection…"
                className={`${FIELD} resize-none`}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-[#666] hover:text-[#E8E4DF] rounded-[9px] hover:bg-[#1A1A1A] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] text-sm font-semibold rounded-[9px] transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {editTarget ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        )}

        {/* Collections Grid */}
        {collections.length === 0 ? (
          <div className="text-center py-16">
            <Layers className="w-10 h-10 text-[#333] mx-auto mb-3" />
            <p className="text-[#555] text-sm">No collections yet</p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-3 text-xs text-[#C8A45D] hover:underline"
            >
              Create your first collection
            </button>
          </div>
        ) : (
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#111] z-10 border-b border-[#1E1E1E] shadow-sm">
                <tr className="text-[#555] text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-5 text-left">Collection</th>
                  <th className="py-3 px-5 text-left hidden md:table-cell">Description</th>
                  <th className="py-3 px-5 text-center">Products</th>
                  <th className="py-3 px-5 text-center">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {collections.map((col) => (
                  <tr key={col.id} className="hover:bg-[#161616] transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[8px] bg-[#1A1A1A] border border-[#222] overflow-hidden shrink-0">
                          {col.image ? (
                            <img src={col.image} alt={col.name} className="w-full h-full object-cover" />
                          ) : (
                            <Layers className="w-4 h-4 text-[#444] m-2.5" />
                          )}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#E8E4DF]">{col.name}</p>
                          <p className="text-[11px] text-[#555] font-mono">{col.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 hidden md:table-cell">
                      <span className="text-[12px] text-[#666] line-clamp-1">
                        {col.description || "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="text-[12px] font-mono text-[#888]">
                        {productCounts[col.id] ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          col.status === "Active"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                            : "bg-amber-500/15 text-amber-400 border-amber-500/25"
                        }`}
                      >
                        {col.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEdit(col)}
                          className="p-1.5 rounded-[6px] text-[#555] hover:text-[#C8A45D] hover:bg-[#1E1E1E] transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(col)}
                          className="p-1.5 rounded-[6px] text-[#444] hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Delete"
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
            <h3 className="text-base font-bold text-[#E8E4DF] mb-2">Delete Collection?</h3>
            <p className="text-sm text-[#666] mb-1">
              <span className="font-semibold text-[#E8E4DF]">{deleteTarget.name}</span> will be permanently deleted.
            </p>
            <p className="text-xs text-amber-400 mb-6">
              {productCounts[deleteTarget.id] > 0
                ? `${productCounts[deleteTarget.id]} product(s) reference this collection — they will not be deleted.`
                : "No products are linked to this collection."}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] rounded-[10px] text-sm font-medium hover:text-[#E8E4DF] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-[10px] text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
