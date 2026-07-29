"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import { inventoryService } from "@/lib/inventoryService";
import { categoriesService } from "@/lib/categoriesService";
import { collectionsService } from "@/lib/collectionsService";
import {
  Archive,
  Minus,
  Plus,
  Search,
  AlertTriangle,
  RefreshCw,
  Eye,
  History,
  X,
  Check,
  SlidersHorizontal,
  Package,
  Clock,
  User,
  Layers,
} from "lucide-react";

export default function InventoryPage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  
  // Search and Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");

  // Detail Modal & Adjustment State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustUser, setAdjustUser] = useState("Store Owner");
  const [newThreshold, setNewThreshold] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await inventoryService.getInventorySnapshot();
      setItems(data.inventory || []);
      setSummary(data.summary || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
      const cats = categoriesService.getAll();
      const cols = collectionsService.getAll();
      setCategories(cats);
      setCollections(cols);

      if (selectedProduct) {
        const updatedDetail = await inventoryService.getByProductId(selectedProduct.productId);
        if (updatedDetail) {
          setSelectedProduct(updatedDetail);
        }
      }
    } catch (err) {
      console.error("Error loading inventory from API:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered Inventory List
  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.productName.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "inStock" && item.status === "In Stock") ||
      (statusFilter === "lowStock" && item.status === "Low Stock") ||
      (statusFilter === "outOfStock" && item.status === "Out of Stock");

    const matchesCategory =
      categoryFilter === "all" ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesCollection =
      collectionFilter === "all" ||
      item.collection.toLowerCase() === collectionFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory && matchesCollection;
  });

  // Inline Quick Adjust (+1 / -1)
  const handleQuickAdjust = async (productId, delta, productName) => {
    const current = items.find((i) => i.productId === productId);
    const stockVal = current ? (current.currentStock !== undefined ? current.currentStock : current.stock) : 0;
    if (delta < 0 && stockVal <= 0) {
      toastError("Validation Error", "Stock cannot be negative.");
      return;
    }
    const reason = delta > 0 ? "Quick Restock (+1)" : "Quick Adjustment (-1)";
    await inventoryService.adjustStock(productId, delta, reason, "Store Owner");
    success("Stock Updated", `${productName} stock ${delta > 0 ? "+1" : "-1"}`);
    await loadData();
  };

  // Detailed Modal Stock Adjustment
  const handleModalAdjust = async (type) => {
    if (!selectedProduct) return;
    const qtyNum = parseInt(adjustQty, 10);

    if (isNaN(qtyNum) || qtyNum === 0) {
      toastError("Invalid Input", "Please enter a valid quantity amount.");
      return;
    }

    const delta = type === "increase" ? Math.abs(qtyNum) : -Math.abs(qtyNum);
    const currentVal = selectedProduct.currentStock !== undefined ? selectedProduct.currentStock : selectedProduct.stock;

    if (type === "decrease" && currentVal + delta < 0) {
      toastError("Validation Error", "Stock cannot be reduced below 0.");
      return;
    }

    const reasonNote = adjustReason.trim() || (type === "increase" ? "Restock shipment" : "Inventory adjustment");
    await inventoryService.adjustStock(selectedProduct.productId, delta, reasonNote, adjustUser);

    success(
      "Stock Logged",
      `${selectedProduct.productName} stock updated by ${delta > 0 ? `+${delta}` : delta} units.`
    );
    setAdjustQty("");
    setAdjustReason("");
    await loadData();
  };

  // Set Direct Minimum Stock Threshold
  const handleSaveThreshold = () => {
    if (!selectedProduct) return;
    const val = parseInt(newThreshold, 10);
    if (isNaN(val) || val < 1) {
      toastError("Invalid Threshold", "Minimum stock threshold must be at least 1.");
      return;
    }

    inventoryService.setThreshold(selectedProduct.productId, val);
    success("Threshold Saved", `Minimum stock threshold set to ${val} units.`);
    setNewThreshold("");
    loadData();
  };

  const statusColor = (s) => {
    if (s === "In Stock") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    if (s === "Low Stock") return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    return "bg-rose-500/15 text-rose-400 border-rose-500/25";
  };

  return (
    <AdminShell>
      <div className="space-y-6 max-w-7xl pb-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#F0EDE8]">Inventory Management</h1>
            <p className="text-xs text-[#777] mt-1">
              Production stock control, reserved order allocations, and movement audit logs
            </p>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#262626] text-xs text-[#E8E4DF] font-medium rounded-[8px] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C8A45D]" />
            Refresh Inventory
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4">
            <p className="text-[11px] text-[#555] uppercase tracking-wider font-semibold mb-1">Total SKUs</p>
            <p className="text-2xl font-bold text-[#E8E4DF]">{summary.total}</p>
          </div>
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4">
            <p className="text-[11px] text-[#555] uppercase tracking-wider font-semibold mb-1">In Stock</p>
            <p className="text-2xl font-bold text-emerald-400">{summary.inStock}</p>
          </div>
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4">
            <p className="text-[11px] text-[#555] uppercase tracking-wider font-semibold mb-1">Low Stock</p>
            <p className="text-2xl font-bold text-amber-400">{summary.lowStock}</p>
          </div>
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4">
            <p className="text-[11px] text-[#555] uppercase tracking-wider font-semibold mb-1">Out of Stock</p>
            <p className="text-2xl font-bold text-rose-400">{summary.outOfStock}</p>
          </div>
        </div>

        {/* Low Stock Warning Alert */}
        {(summary.outOfStock > 0 || summary.lowStock > 0) && (
          <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-[12px] text-amber-400 text-xs sm:text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {summary.outOfStock > 0 && <strong>{summary.outOfStock} product(s) out of stock. </strong>}
              {summary.lowStock > 0 && <span><strong>{summary.lowStock} product(s)</strong> require stock replenishment.</span>}
            </span>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#888]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Filter Inventory</span>
          </div>

          <div className="space-y-2">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
              <input
                type="text"
                placeholder="Search Product Name or SKU…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] placeholder:text-[#555] focus:outline-none focus:border-[#C8A45D]/50 transition-colors"
              />
            </div>

            {/* Responsive Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer truncate"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
                className="w-full px-3 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer truncate"
              >
                <option value="all">All Collections</option>
                {collections.map((col) => (
                  <option key={col.id || col.slug} value={col.name}>
                    {col.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer truncate"
              >
                <option value="all">All Status</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory List Table */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-[#141414] z-10 border-b border-[#1E1E1E] shadow-sm">
                <tr className="text-[#555] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3 hidden md:table-cell">Category</th>
                  <th className="py-3 px-3 hidden lg:table-cell">Collection</th>
                  <th className="py-3 px-3 text-center">Current</th>
                  <th className="py-3 px-3 text-center">Reserved</th>
                  <th className="py-3 px-3 text-center">Available</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right hidden xl:table-cell">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-14 text-center">
                      <Archive className="w-8 h-8 text-[#333] mx-auto mb-2" />
                      <p className="text-xs text-[#666]">No inventory items match your search or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.productId} className="hover:bg-[#151515] transition-colors">
                      {/* Product Image & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-10 h-10 rounded-[6px] object-cover bg-[#161616] border border-[#222] shrink-0"
                          />
                          <span className="font-semibold text-[#E8E4DF] line-clamp-1 min-w-[120px]">
                            {item.productName}
                          </span>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 font-mono text-[#777] whitespace-nowrap">
                        {item.sku}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-[#888] hidden md:table-cell whitespace-nowrap">
                        {item.category}
                      </td>

                      {/* Collection */}
                      <td className="py-3 px-3 text-[#777] hidden lg:table-cell whitespace-nowrap">
                        {item.collection}
                      </td>

                      {/* Current Stock */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#E8E4DF]">
                        {item.stock}
                      </td>

                      {/* Reserved Stock */}
                      <td className="py-3 px-3 text-center font-mono text-amber-400">
                        {item.reservedStock}
                      </td>

                      {/* Available Stock */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                        {item.availableStock}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td className="py-3 px-3 text-right text-[10px] text-[#666] hidden xl:table-cell whitespace-nowrap">
                        {item.lastUpdated}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Decrement */}
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(item.productId, -1, item.productName)}
                            className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-[#888] hover:text-rose-400 transition-colors cursor-pointer"
                            title="Decrease Stock (-1)"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          {/* Quick Increment */}
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(item.productId, 1, item.productName)}
                            className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-[#888] hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Increase Stock (+1)"
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                          {/* View Details & Audit Log */}
                          <button
                            type="button"
                            onClick={() => {
                              const detail = inventoryService.getByProductId(item.productId);
                              setSelectedProduct(detail);
                            }}
                            className="px-2.5 py-1.5 rounded-[6px] bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-[#E8E4DF] hover:text-[#C8A45D] text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
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

        {/* ── PRODUCT INVENTORY DETAILS & AUDIT LOG MODAL ── */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#111] border border-[#222] rounded-[16px] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-[#777] hover:text-[#E8E4DF] transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Header */}
              <div className="flex items-center gap-4 border-b border-[#1E1E1E] pb-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.productName}
                  className="w-16 h-16 rounded-[8px] object-cover bg-[#161616] border border-[#222] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#C8A45D] uppercase tracking-wider bg-[#C8A45D]/10 px-2 py-0.5 rounded border border-[#C8A45D]/20">
                      {selectedProduct.sku}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor(selectedProduct.status)}`}>
                      {selectedProduct.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#F0EDE8]">{selectedProduct.productName}</h2>
                  <p className="text-xs text-[#777]">
                    Category: {selectedProduct.category} • Collection: {selectedProduct.collection}
                  </p>
                </div>
              </div>

              {/* Stock Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#161616] border border-[#222] rounded-[10px] p-3 text-center">
                  <p className="text-[10px] text-[#666] uppercase font-semibold">Current Stock</p>
                  <p className="text-xl font-bold font-mono text-[#E8E4DF] mt-0.5">{selectedProduct.stock}</p>
                </div>
                <div className="bg-[#161616] border border-[#222] rounded-[10px] p-3 text-center">
                  <p className="text-[10px] text-[#666] uppercase font-semibold">Reserved Stock</p>
                  <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">{selectedProduct.reservedStock}</p>
                </div>
                <div className="bg-[#161616] border border-[#222] rounded-[10px] p-3 text-center">
                  <p className="text-[10px] text-[#666] uppercase font-semibold">Available Stock</p>
                  <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{selectedProduct.availableStock}</p>
                </div>
                <div className="bg-[#161616] border border-[#222] rounded-[10px] p-3 text-center">
                  <p className="text-[10px] text-[#666] uppercase font-semibold">Min Threshold</p>
                  <p className="text-xl font-bold font-mono text-[#C8A45D] mt-0.5">{selectedProduct.minStockThreshold}</p>
                </div>
              </div>

              {/* Stock Adjustment Controls */}
              <div className="bg-[#161616] border border-[#222] rounded-[12px] p-4 space-y-4">
                <h3 className="text-xs font-bold text-[#E8E4DF] uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>Adjust Inventory Stock</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-[#666] uppercase font-semibold mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 10"
                      value={adjustQty}
                      onChange={(e) => setAdjustQty(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[10px] text-[#666] uppercase font-semibold mb-1">Reason / Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Supplier Shipment #402"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50"
                    />
                  </div>

                  <div className="sm:col-span-4 flex items-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleModalAdjust("increase")}
                      className="flex-1 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-[8px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Increase</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModalAdjust("decrease")}
                      className="flex-1 py-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-[8px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      <span>Decrease</span>
                    </button>
                  </div>
                </div>

                {/* Configure Minimum Stock Threshold */}
                <div className="pt-3 border-t border-[#222] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#777]">Set Minimum Stock Threshold:</span>
                    <input
                      type="number"
                      min="1"
                      placeholder={selectedProduct.minStockThreshold}
                      value={newThreshold}
                      onChange={(e) => setNewThreshold(e.target.value)}
                      className="w-20 px-2 py-1 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[6px] text-xs text-[#E8E4DF] text-center focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveThreshold}
                    className="px-3 py-1 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333] text-[#E8E4DF] text-xs font-medium rounded-[6px] transition-colors cursor-pointer"
                  >
                    Save Threshold
                  </button>
                </div>
              </div>

              {/* Stock Movement Audit Log History */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#E8E4DF] uppercase tracking-wider flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>Stock Movement Audit Log</span>
                </h3>

                {!selectedProduct.history || selectedProduct.history.length === 0 ? (
                  <p className="text-xs text-[#666] py-4 text-center">No stock adjustment logs recorded for this product yet.</p>
                ) : (
                  <div className="bg-[#161616] border border-[#222] rounded-[10px] overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-[#222] bg-[#0D0D0D] text-[#555] uppercase tracking-wider font-semibold text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">User</th>
                          <th className="py-2.5 px-3 text-center">Qty Changed</th>
                          <th className="py-2.5 px-3">Reason / Event</th>
                          <th className="py-2.5 px-3 text-right">Stock After</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222]">
                        {selectedProduct.history.map((log) => (
                          <tr key={log.id} className="hover:bg-[#1A1A1A] transition-colors">
                            <td className="py-2.5 px-3 font-mono text-[11px] text-[#777] whitespace-nowrap">
                              {log.date}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-[#E8E4DF]">
                              {log.user || "Store Owner"}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold">
                              <span
                                className={
                                  String(log.qty).startsWith("+")
                                    ? "text-emerald-400"
                                    : String(log.qty).startsWith("-")
                                    ? "text-rose-400"
                                    : "text-[#C8A45D]"
                                }
                              >
                                {log.qty}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-[#888]">
                              {log.reason}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#E8E4DF]">
                              {log.stockAfter !== undefined ? log.stockAfter : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
