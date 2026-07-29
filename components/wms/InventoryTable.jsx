"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Package,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RefreshCw,
  Plus,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function InventoryTable({
  inventory,
  warehouses,
  onAdjustStock,
  onCreatePOForItem,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("productName");
  const [sortOrder, setSortOrder] = useState("asc");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(inventory.map((item) => item.category));
    return Array.from(set);
  }, [inventory]);

  // Filtering & Sorting with useMemo for high performance
  const filteredInventory = useMemo(() => {
    return inventory
      .filter((item) => {
        const matchesSearch =
          item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.locationBin.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesWarehouse =
          warehouseFilter === "all" || item.warehouseId === warehouseFilter;

        const matchesCategory =
          categoryFilter === "all" || item.category === categoryFilter;

        const matchesStatus =
          statusFilter === "all" ||
          item.status.toLowerCase().replace(/\s+/g, "") ===
            statusFilter.toLowerCase().replace(/\s+/g, "");

        return matchesSearch && matchesWarehouse && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [inventory, searchQuery, warehouseFilter, categoryFilter, statusFilter, sortField, sortOrder]);

  // Pagination Math
  const totalPages = Math.ceil(filteredInventory.length / pageSize) || 1;
  const paginatedInventory = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInventory.slice(start, start + pageSize);
  }, [filteredInventory, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
      case "Low Stock":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Out of Stock":
        return "bg-rose-950/80 text-rose-400 border-rose-500/30";
      case "Overstock":
        return "bg-blue-950/80 text-blue-400 border-blue-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#8E8A85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search SKU, Product Name, or Location Bin..."
            className="w-full pl-9 pr-4 py-2 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Warehouse Filter */}
          <select
            value={warehouseFilter}
            onChange={(e) => {
              setWarehouseFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3] text-xs font-semibold rounded-[10px] px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3] text-xs font-semibold rounded-[10px] px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3] text-xs font-semibold rounded-[10px] px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Overstock">Overstock</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th
                  onClick={() => handleSort("productName")}
                  className="py-4 px-4 cursor-pointer hover:text-[#C8A45D]"
                >
                  <div className="flex items-center gap-1">
                    Product / SKU <ArrowUpDown className="w-3 h-3 text-[#C8A45D]" />
                  </div>
                </th>
                <th className="py-4 px-4">Warehouse & Bin</th>
                <th
                  onClick={() => handleSort("currentStock")}
                  className="py-4 px-4 text-center cursor-pointer hover:text-[#C8A45D]"
                >
                  Current
                </th>
                <th className="py-4 px-4 text-center">Reserved</th>
                <th
                  onClick={() => handleSort("availableStock")}
                  className="py-4 px-4 text-center cursor-pointer hover:text-[#C8A45D]"
                >
                  Available
                </th>
                <th className="py-4 px-4 text-center">Incoming</th>
                <th className="py-4 px-4 text-center">Damaged</th>
                <th className="py-4 px-4 text-center">Safety Level</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {paginatedInventory.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-[#8E8A85]">
                    No inventory SKUs match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedInventory.map((item) => {
                  const availableStock = item.currentStock - item.reservedStock;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#090909]/60 transition-colors font-sans"
                    >
                      <td className="py-4 px-4">
                        <span className="font-semibold text-[#F8F6F3] block text-sm">
                          {item.productName}
                        </span>
                        <span className="text-[10px] font-mono text-[#C8A45D] block mt-0.5">
                          {item.sku}
                        </span>
                        <span className="text-[10px] text-[#8E8A85]">
                          Unit Cost: ${item.unitCost} | MSRP: ${item.unitPrice}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-[#F8F6F3] block font-medium">
                          {item.warehouseName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#8E8A85] border border-[#2A2A2A] rounded inline-block mt-1">
                          Bin: {item.locationBin}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center font-editorial text-sm text-[#F8F6F3] font-bold">
                        {item.currentStock}
                      </td>

                      <td className="py-4 px-4 text-center font-editorial text-sm text-amber-400 font-bold">
                        {item.reservedStock}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`font-editorial text-base font-bold ${
                            availableStock > 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {availableStock}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center font-editorial text-sm text-blue-400 font-bold">
                        +{item.incomingStock}
                      </td>

                      <td className="py-4 px-4 text-center font-editorial text-sm text-rose-400">
                        {item.damagedStock}
                      </td>

                      <td className="py-4 px-4 text-center text-[11px]">
                        <span className="block text-[#F8F6F3]">Min: {item.safetyStock}</span>
                        <span className="block text-[#8E8A85]">Reorder @ {item.reorderPoint}</span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onAdjustStock(item)}
                            className="px-2.5 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                          >
                            Adjust Stock
                          </button>
                          <button
                            type="button"
                            onClick={() => onCreatePOForItem(item)}
                            className="px-2.5 py-1.5 bg-[#090909] hover:bg-blue-600 hover:text-[#090909] text-blue-400 text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> PO
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 bg-[#090909] border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-[#8E8A85]">
            Showing <span className="text-[#F8F6F3] font-bold">{paginatedInventory.length}</span> of{" "}
            <span className="text-[#F8F6F3] font-bold">{filteredInventory.length}</span> inventory SKUs
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[#8E8A85]">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#151515] border border-[#2A2A2A] text-[#F8F6F3] rounded px-2 py-1 outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 bg-[#151515] border border-[#2A2A2A] rounded text-[#F8F6F3] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C8A45D] hover:text-[#090909] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-[#F8F6F3] font-bold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 bg-[#151515] border border-[#2A2A2A] rounded text-[#F8F6F3] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C8A45D] hover:text-[#090909] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
