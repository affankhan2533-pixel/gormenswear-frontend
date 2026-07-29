"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import { productService, exportProductsCSV } from "@/lib/productService";
import { categoriesService } from "@/lib/categoriesService";
import { collectionsService } from "@/lib/collectionsService";
import DeleteConfirmModal from "@/components/admin/products/DeleteConfirmModal";
import {
  Plus,
  Search,
  X,
  Package,
  EyeOff,
  Edit,
  Trash2,
  Globe,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Copy,
  RotateCcw,
  Filter,
} from "lucide-react";

const PAGE_SIZE = 20;

const STATUS_PILL = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Draft: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Hidden: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Archived: "bg-zinc-800 text-zinc-500 border-zinc-700/30",
  OutOfStock: "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

function statusLabel(p) {
  if (p.status === "Archived") return "Archived";
  if (p.stock === 0) return "Out of Stock";
  if (p.visibility === "Hidden") return "Hidden";
  if (p.status === "Draft") return "Draft";
  return "Published";
}

function statusClass(p) {
  const s = statusLabel(p);
  if (s === "Published") return STATUS_PILL.Active;
  if (s === "Out of Stock") return STATUS_PILL.OutOfStock;
  if (s === "Hidden") return STATUS_PILL.Hidden;
  if (s === "Draft") return STATUS_PILL.Draft;
  return STATUS_PILL.Archived;
}

export default function ProductsPage() {
  const router = useRouter();
  const { success, warning, info } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);

  // Selection
  const [selected, setSelected] = useState([]);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setCategories(categoriesService.getAll());
    setCollections(collectionsService.getAll());
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    let data;
    if (search.trim()) {
      data = await productService.searchProducts(search.trim());
    } else {
      const f = {
        stockStatus: stockFilter !== "all" ? stockFilter : undefined,
      };
      if (categoryFilter !== "all") f.categoryId = categoryFilter;
      if (collectionFilter !== "all") f.collectionId = collectionFilter;

      if (statusFilter === "Published") {
        data = (await productService.filterProducts(f)).filter(
          (p) => p.status === "Active" && p.visibility === "Published"
        );
      } else if (statusFilter === "Hidden") {
        data = (await productService.filterProducts(f)).filter(
          (p) => p.visibility === "Hidden" && p.status !== "Archived"
        );
      } else if (statusFilter === "OutOfStock") {
        data = (await productService.filterProducts(f)).filter(
          (p) => p.stock === 0
        );
      } else if (statusFilter !== "all") {
        data = await productService.filterProducts({ ...f, status: statusFilter });
      } else {
        data = await productService.filterProducts(f);
      }
    }
    setProducts(data);
    setPage(1);
    setSelected([]);
    setLoading(false);
  }, [search, statusFilter, categoryFilter, collectionFilter, stockFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const metrics = {
    total: products.length,
    published: products.filter((p) => p.status === "Active" && p.visibility === "Published").length,
    draft: products.filter((p) => p.status === "Draft").length,
    hidden: products.filter((p) => p.visibility === "Hidden" && p.status !== "Archived").length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    archived: products.filter((p) => p.status === "Archived").length,
  };

  const allPageSelected =
    paginated.length > 0 && paginated.every((p) => selected.includes(p.id));
  const someSelected = selected.length > 0;

  const toggleAll = () => {
    if (allPageSelected) {
      setSelected((s) => s.filter((id) => !paginated.map((p) => p.id).includes(id)));
    } else {
      setSelected((s) => [...new Set([...s, ...paginated.map((p) => p.id)])]);
    }
  };

  const toggleOne = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleToggleVisibility = async (product) => {
    const newVis = product.visibility === "Published" ? "Hidden" : "Published";
    const newStatus = newVis === "Published" ? "Active" : product.status;
    await productService.updateProduct(product.id, { visibility: newVis, status: newStatus });
    success(
      newVis === "Published" ? "Product Published" : "Product Hidden",
      product.name
    );
    load();
  };

  const handleDuplicate = async (product) => {
    const dup = await productService.duplicateProduct(product.id);
    if (dup) {
      info("Product Duplicated", `Created ${dup.name}`);
      load();
    }
  };

  const handleSoftDelete = async () => {
    if (!deleteTarget) return;
    await productService.softDeleteProduct(deleteTarget.id);
    warning("Product Archived", `${deleteTarget.name} soft deleted.`);
    setDeleteTarget(null);
    load();
  };

  const handleRestore = async (product) => {
    await productService.restoreProduct(product.id);
    success("Product Restored", `${product.name} restored to Draft.`);
    load();
  };

  const handleExport = () => {
    exportProductsCSV(products);
    success("Export Complete", `Exported ${products.length} products to CSV.`);
  };

  const handleBulk = async (action) => {
    if (selected.length === 0) return;
    await productService.bulkActions(action, selected);
    success(
      "Done",
      `${action.charAt(0).toUpperCase() + action.slice(1)} applied to ${selected.length} product(s).`
    );
    setSelected([]);
    load();
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setCollectionFilter("all");
    setStockFilter("all");
  };

  const hasFilters =
    search ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    collectionFilter !== "all" ||
    stockFilter !== "all";

  return (
    <AdminShell>
      <div className="space-y-5">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-[#F0EDE8]">Products</h1>
            <p className="text-xs text-[#666] mt-0.5">
              {metrics.total} total · {metrics.published} published · {metrics.draft} draft
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-[#141414] hover:bg-[#1E1E1E] border border-[#222] text-[#E8E4DF] text-xs font-semibold rounded-[10px] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#C8A45D]" />
              Export
            </button>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] text-xs font-bold rounded-[10px] transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-2">
          {/* Full width Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
            <input
              type="text"
              placeholder="Search by Product Name or SKU…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-[#111] border border-[#1E1E1E] rounded-[9px] text-xs text-[#E8E4DF] placeholder:text-[#444] focus:outline-none focus:border-[#C8A45D]/50 transition-colors"
            />
          </div>

          {/* Responsive Filter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#111] border border-[#1E1E1E] rounded-[9px] text-xs text-[#999] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer truncate"
            >
              <option value="all">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Hidden">Hidden</option>
              <option value="OutOfStock">Out of Stock</option>
              <option value="Archived">Archived</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#111] border border-[#1E1E1E] rounded-[9px] text-xs text-[#999] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer truncate"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={collectionFilter}
              onChange={(e) => setCollectionFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#111] border border-[#1E1E1E] rounded-[9px] text-xs text-[#999] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer truncate"
            >
              <option value="all">All Collections</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#111] border border-[#1E1E1E] rounded-[9px] text-xs text-[#999] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer truncate"
            >
              <option value="all">All Stock</option>
              <option value="inStock">In Stock</option>
              <option value="lowStock">Low Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          {hasFilters && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-[9px] text-xs text-[#666] hover:text-[#E8E4DF] flex items-center gap-1.5 cursor-pointer bg-[#141414] border border-[#222]"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {someSelected && (
          <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-[10px] flex-wrap">
            <span className="text-xs font-medium text-[#C8A45D]">
              {selected.length} selected
            </span>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Publish", action: "publish" },
                { label: "Hide", action: "hide" },
                { label: "Archive", action: "archive" },
                { label: "Duplicate", action: "duplicate" },
              ].map((a) => (
                <button
                  key={a.action}
                  type="button"
                  onClick={() => handleBulk(a.action)}
                  className="px-3 py-1.5 text-xs font-medium bg-[#222] hover:bg-[#2A2A2A] text-[#CCC] rounded-[7px] border border-[#333] transition-colors cursor-pointer"
                >
                  {a.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleBulk("delete")}
                className="px-3 py-1.5 text-xs font-medium bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 rounded-[7px] border border-rose-800/30 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="ml-auto text-xs text-[#555] hover:text-[#999] cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Product Table */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-[#111] z-10 border-b border-[#1E1E1E] shadow-sm">
                <tr className="text-[#555] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleAll}
                      className="w-3.5 h-3.5 accent-[#C8A45D] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">Category</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center hidden sm:table-cell">Stock</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="py-4 px-4">
                          <div className="h-4 bg-[#1A1A1A] rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <Package className="w-10 h-10 text-[#333] mx-auto mb-3" />
                      <p className="text-[#555] text-sm">No products match parameters</p>
                      {hasFilters && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-3 text-xs text-[#C8A45D] hover:underline cursor-pointer"
                        >
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  paginated.map((product) => (
                    <tr
                      key={product.id}
                      className={`hover:bg-[#161616] transition-colors group ${
                        selected.includes(product.id) ? "bg-[#1A1A14]" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(product.id)}
                          onChange={() => toggleOne(product.id)}
                          className="w-3.5 h-3.5 accent-[#C8A45D] cursor-pointer"
                        />
                      </td>

                      {/* Image */}
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded-[8px] bg-[#1A1A1A] border border-[#222] overflow-hidden shrink-0 flex items-center justify-center">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-[#444]" />
                          )}
                        </div>
                      </td>

                      {/* Name & SKU */}
                      <td className="py-3 px-4 min-w-[160px] max-w-[240px]">
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/products/${product.id}`)}
                          className="text-[#E8E4DF] font-medium text-xs hover:text-[#C8A45D] transition-colors text-left line-clamp-2 leading-tight block cursor-pointer"
                        >
                          {product.name}
                        </button>
                        <span className="text-[10px] text-[#666] font-mono block mt-0.5">
                          {product.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-[#777] text-xs">
                          {product.category || "—"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#E8E4DF]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4 text-center hidden sm:table-cell">
                        <span
                          className={`font-mono text-xs font-medium ${
                            product.stock === 0
                              ? "text-rose-400"
                              : product.stock <= (product.minStockThreshold || 5)
                              ? "text-amber-400"
                              : "text-[#888]"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusClass(
                            product
                          )}`}
                        >
                          {statusLabel(product)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/products/${product.id}`)}
                            className="p-1.5 rounded-[6px] text-[#666] hover:text-[#C8A45D] hover:bg-[#1E1E1E] transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(product)}
                            className="p-1.5 rounded-[6px] text-[#666] hover:text-[#C8A45D] hover:bg-[#1E1E1E] transition-colors cursor-pointer"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Hide / Publish Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(product)}
                            className={`p-1.5 rounded-[6px] transition-colors hover:bg-[#1E1E1E] cursor-pointer ${
                              product.visibility === "Published"
                                ? "text-emerald-500 hover:text-emerald-400"
                                : "text-[#555] hover:text-[#888]"
                            }`}
                            title={
                              product.visibility === "Published"
                                ? "Hide from storefront"
                                : "Publish to storefront"
                            }
                          >
                            {product.visibility === "Published" ? (
                              <Globe className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Restore or Soft Delete */}
                          {product.status === "Archived" ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(product)}
                              className="p-1.5 rounded-[6px] text-emerald-400 hover:bg-emerald-950/30 transition-colors cursor-pointer"
                              title="Restore Product"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(product)}
                              className="p-1.5 rounded-[6px] text-[#555] hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Soft Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#1E1E1E]">
              <span className="text-xs text-[#555]">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, products.length)} of {products.length} products
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-[6px] text-[#555] hover:text-[#E8E4DF] hover:bg-[#1E1E1E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-[6px] text-xs font-medium transition-colors cursor-pointer ${
                        page === p
                          ? "bg-[#C8A45D]/20 text-[#C8A45D] border border-[#C8A45D]/30 font-bold"
                          : "text-[#555] hover:bg-[#1E1E1E] hover:text-[#E8E4DF]"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-[6px] text-[#555] hover:text-[#E8E4DF] hover:bg-[#1E1E1E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        product={deleteTarget}
        onConfirm={handleSoftDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
