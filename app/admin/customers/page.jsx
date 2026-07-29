"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import { customersService } from "@/lib/customersService";
import { formatPrice } from "@/lib/utils";
import {
  Users,
  Search,
  X,
  Eye,
  Edit,
  UserCheck,
  UserX,
  MapPin,
  ShoppingBag,
  Calendar,
  RefreshCw,
  Mail,
  Phone,
  Save,
  MessageSquare,
  Plus,
  Trash2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Send,
} from "lucide-react";

const PAGE_SIZE = 15;

const TIER_PILL = {
  VIP: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Returning: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  New: "bg-zinc-800 text-zinc-400 border-zinc-700/40",
};

const STATUS_PILL = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Inactive: "bg-zinc-800 text-zinc-500 border-zinc-700/40",
  Blocked: "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

export default function CustomersPage() {
  const { success, info, error: toastError } = useToast();

  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0, activeCustomers: 0,
    returningCustomers: 0, newThisMonth: 0,
    lifetimeRevenue: 0, averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  // Bulk Selection
  const [selected, setSelected] = useState([]);

  // Detail drawer
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // Edit Modal
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", status: "Active" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, listData] = await Promise.all([
        customersService.getCustomerStats(),
        search.trim()
          ? customersService.searchCustomers(search.trim())
          : customersService.filterCustomers(filter),
      ]);
      setStats(statsData);
      // Client-side date range filter
      let filtered = listData || [];
      if (startDate || endDate) {
        filtered = filtered.filter((c) => {
          const d = new Date(c.createdAt);
          if (startDate && d < new Date(startDate)) return false;
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (d > end) return false;
          }
          return true;
        });
      }
      setCustomers(filtered);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  }, [search, filter, startDate, endDate]);

  useEffect(() => { load(); }, [load]);

  const toggleAll = () => {
    if (selected.length === customers.length) setSelected([]);
    else setSelected(customers.map((c) => c.id));
  };

  const toggleOne = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleBulkActivate = async () => {
    for (const id of selected) {
      const cust = customers.find((c) => c.id === id);
      if (cust && cust.status !== "Active") {
        await customersService.updateCustomer(id, { status: "Active" });
      }
    }
    success("Bulk Activated", `${selected.length} customer(s) set to Active.`);
    setSelected([]);
    load();
  };

  const handleBulkDeactivate = async () => {
    for (const id of selected) {
      const cust = customers.find((c) => c.id === id);
      if (cust && cust.status !== "Inactive") {
        await customersService.updateCustomer(id, { status: "Inactive" });
      }
    }
    info("Bulk Deactivated", `${selected.length} customer(s) set to Inactive.`);
    setSelected([]);
    load();
  };

  const handleToggleStatus = async (cust) => {
    try {
      const updated = await customersService.toggleCustomerStatus(cust.id || cust._id, cust.status);
      if (updated) {
        success("Status Updated", `${updated.name} is now ${updated.status}.`);
        load();
      }
    } catch (err) { toastError("Update Failed", err.message); }
  };

  const handleOpenEdit = (cust) => {
    setEditingCustomer(cust);
    setEditForm({ name: cust.name, email: cust.email, phone: cust.phone || "", status: cust.status || "Active" });
  };

  const handleSaveEdit = async () => {
    if (!editingCustomer) return;
    try {
      const updated = await customersService.updateCustomer(editingCustomer.id || editingCustomer._id, editForm);
      if (updated) {
        success("Customer Updated", `${updated.name}'s profile was saved.`);
        setEditingCustomer(null);
        load();
      }
    } catch (err) { toastError("Update Failed", err.message); }
  };

  const handleOpenDrawer = async (cust) => {
    const full = await customersService.getCustomer(cust.id || cust._id);
    setSelectedCustomer(full || cust);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !noteContent.trim()) return;
    setAddingNote(true);
    try {
      await customersService.addCustomerNote(selectedCustomer.id || selectedCustomer._id, noteContent.trim());
      success("Note Added", "Customer note recorded.");
      setNoteContent("");
      const refreshed = await customersService.getCustomer(selectedCustomer.id || selectedCustomer._id);
      if (refreshed) setSelectedCustomer(refreshed);
    } catch (err) { toastError("Failed to add note", err.message); }
    finally { setAddingNote(false); }
  };

  const handleDeleteNote = async (noteId) => {
    if (!selectedCustomer || !noteId) return;
    try {
      await customersService.deleteCustomerNote(selectedCustomer.id || selectedCustomer._id, noteId);
      const refreshed = await customersService.getCustomer(selectedCustomer.id || selectedCustomer._id);
      if (refreshed) setSelectedCustomer(refreshed);
    } catch (err) { toastError("Failed to delete note", err.message); }
  };

  const clearFilters = () => { setSearch(""); setFilter("all"); setStartDate(""); setEndDate(""); setPage(1); };
  const hasFilters = search || filter !== "all" || startDate || endDate;

  const totalPages = Math.ceil(customers.length / PAGE_SIZE) || 1;
  const paged = customers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AdminShell>
      <div className="space-y-4 sm:space-y-5 min-w-0 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#F0EDE8]">Customer CRM</h1>
            <p className="text-[11px] text-[#666] mt-0.5">Manage accounts, lifetime value, and notes</p>
          </div>
          <button
            type="button" onClick={load} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-[#262626] text-xs text-[#E8E4DF] font-medium rounded-[8px] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#C8A45D]" : ""}`} />
            Refresh
          </button>
        </div>

        {/* CRM Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total Customers", value: stats.totalCustomers, color: "text-[#E8E4DF]" },
            { label: "Active Users", value: stats.activeCustomers, color: "text-emerald-400" },
            { label: "Returning", value: stats.returningCustomers, color: "text-cyan-400" },
            { label: "New This Month", value: stats.newThisMonth, color: "text-purple-400" },
            { label: "Lifetime Revenue", value: formatPrice(stats.lifetimeRevenue), color: "text-[#C8A45D]" },
            { label: "Avg Order Value", value: formatPrice(stats.averageOrderValue), color: "text-[#E8E4DF]" },
          ].map((card) => (
            <div key={card.label} className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-3.5 h-full flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">{card.label}</span>
              <p className={`text-lg font-bold font-mono ${card.color} truncate`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "New (1 Order)", value: "new" },
            { label: "Returning (2+)", value: "returning" },
            { label: "VIP Clients", value: "vip" },
          ].map((tab) => (
            <button
              key={tab.value} type="button"
              onClick={() => { setFilter(tab.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors border cursor-pointer shrink-0 ${
                filter === tab.value
                  ? "bg-[#C8A45D]/15 border-[#C8A45D]/40 text-[#C8A45D]"
                  : "border-[#1E1E1E] text-[#666] hover:text-[#E8E4DF] hover:bg-[#161616]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Date Filter */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#888]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Filter Customers</span>
          </div>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
            <input
              type="text" placeholder="Search Name, Email, or Phone…"
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-8 pr-3 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] placeholder:text-[#555] focus:outline-none focus:border-[#C8A45D]/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date" value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-full px-2.5 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#888] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer"
              title="Registration Start Date"
            />
            <input
              type="date" value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-full px-2.5 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#888] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer"
              title="Registration End Date"
            />
          </div>
          {hasFilters && (
            <button
              type="button" onClick={clearFilters}
              className="px-3 py-1 text-xs text-[#666] hover:text-[#E8E4DF] flex items-center gap-1.5 bg-[#141414] border border-[#222] rounded-[6px] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        {/* Bulk Action Bar */}
        {selected.length > 0 && (
          <div className="flex items-center justify-between gap-3 p-3 bg-[#1A1A14] border border-[#C8A45D]/30 rounded-[10px] flex-wrap">
            <span className="text-xs font-semibold text-[#C8A45D]">{selected.length} selected</span>
            <div className="flex gap-2">
              <button type="button" onClick={handleBulkActivate}
                className="px-2.5 py-1 text-xs font-semibold bg-[#222] hover:bg-[#2A2A2A] text-emerald-400 rounded-[6px] border border-emerald-500/30 cursor-pointer">
                Activate All
              </button>
              <button type="button" onClick={handleBulkDeactivate}
                className="px-2.5 py-1 text-xs font-semibold bg-[#222] hover:bg-[#2A2A2A] text-rose-400 rounded-[6px] border border-rose-500/30 cursor-pointer">
                Deactivate All
              </button>
            </div>
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-[#111] z-10 border-b border-[#1E1E1E] shadow-sm">
                <tr className="text-[#555] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 w-10">
                    <input type="checkbox" checked={customers.length > 0 && selected.length === customers.length}
                      onChange={toggleAll} className="w-3.5 h-3.5 accent-[#C8A45D] cursor-pointer" />
                  </th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Phone</th>
                  <th className="py-3.5 px-4 text-center">Orders</th>
                  <th className="py-3.5 px-4 text-right">Total Spent</th>
                  <th className="py-3.5 px-4 text-center hidden md:table-cell">Tier</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="py-4 px-4"><div className="h-4 bg-[#1A1A1A] rounded animate-pulse" /></td>
                    ))}</tr>
                  ))
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <Users className="w-10 h-10 text-[#333] mx-auto mb-3" />
                      <p className="text-[#555] text-sm">No customers found</p>
                      {hasFilters && (
                        <button type="button" onClick={clearFilters} className="mt-3 text-xs text-[#C8A45D] hover:underline cursor-pointer">
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  paged.map((cust) => (
                    <tr key={cust.id || cust._id}
                      className={`hover:bg-[#161616] transition-colors ${selected.includes(cust.id) ? "bg-[#1A1A14]" : ""}`}
                    >
                      <td className="py-3.5 px-4">
                        <input type="checkbox" checked={selected.includes(cust.id)}
                          onChange={() => toggleOne(cust.id)} className="w-3.5 h-3.5 accent-[#C8A45D] cursor-pointer" />
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#E8E4DF] max-w-[160px] truncate">{cust.name}</p>
                        <p className="text-[10px] text-[#666] truncate">{cust.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-[#888] hidden sm:table-cell">{cust.phone || "N/A"}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#E8E4DF]">{cust.ordersCount || 0}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#C8A45D]">{formatPrice(cust.totalSpent || 0)}</td>
                      <td className="py-3.5 px-4 text-center hidden md:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${TIER_PILL[cust.tier] || TIER_PILL.New}`}>
                          {cust.tier || "New"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_PILL[cust.status] || "bg-[#222] text-[#888]"}`}>
                          {cust.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" onClick={() => handleOpenDrawer(cust)}
                            className="p-1.5 text-[#666] hover:text-[#C8A45D] hover:bg-[#1A1A1A] rounded-[6px] cursor-pointer transition-colors" title="Quick View">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <Link href={`/admin/customers/${cust.id || cust._id}`}
                            className="p-1.5 text-[#666] hover:text-[#E8E4DF] hover:bg-[#1A1A1A] rounded-[6px] transition-colors" title="Full Profile">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <button type="button" onClick={() => handleOpenEdit(cust)}
                            className="p-1.5 text-[#666] hover:text-[#E8E4DF] hover:bg-[#1A1A1A] rounded-[6px] cursor-pointer transition-colors" title="Edit">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => handleToggleStatus(cust)}
                            className={`p-1.5 rounded-[6px] cursor-pointer transition-colors ${cust.status === "Active" ? "text-[#666] hover:text-rose-400 hover:bg-rose-950/40" : "text-[#666] hover:text-emerald-400 hover:bg-emerald-950/40"}`}
                            title={cust.status === "Active" ? "Deactivate" : "Activate"}>
                            {cust.status === "Active" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {customers.length > 0 && (
            <div className="px-4 py-3 border-t border-[#1E1E1E] flex items-center justify-between text-xs text-[#777]">
              <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, customers.length)} of {customers.length}</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 rounded-[6px] border border-[#222] disabled:opacity-30 cursor-pointer">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono">{page} / {totalPages}</span>
                <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 rounded-[6px] border border-[#222] disabled:opacity-30 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CUSTOMER PROFILE SLIDE-OVER DRAWER ── */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />

          <div className="relative z-10 w-full max-w-lg bg-[#0D0D0D] border-l border-[#1E1E1E] h-full flex flex-col shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#1E1E1E] flex items-start justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-[#F0EDE8]">{selectedCustomer.name}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_PILL[selectedCustomer.status] || "bg-[#222] text-[#888]"}`}>
                    {selectedCustomer.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${TIER_PILL[selectedCustomer.tier] || TIER_PILL.New}`}>
                    {selectedCustomer.tier || "New"}
                  </span>
                </div>
                <p className="text-[11px] text-[#666] mt-0.5">
                  Registered: {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString("en-IN") : "—"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/admin/customers/${selectedCustomer.id || selectedCustomer._id}`}
                  className="text-xs font-bold text-[#C8A45D] hover:underline flex items-center gap-1">
                  Full Profile <ArrowRight className="w-3 h-3" />
                </Link>
                <button type="button" onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 text-[#666] hover:text-[#E8E4DF] rounded-[6px] cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 p-5 space-y-5 overflow-y-auto">
              {/* Metric Chips */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#141414] border border-[#1E1E1E] rounded-[12px] p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">Total Orders</span>
                  <p className="text-xl font-bold font-mono text-[#E8E4DF]">{selectedCustomer.ordersCount || 0}</p>
                </div>
                <div className="bg-[#141414] border border-[#1E1E1E] rounded-[12px] p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">Lifetime Value</span>
                  <p className="text-xl font-bold font-mono text-[#C8A45D]">{formatPrice(selectedCustomer.totalSpent || 0)}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-[#141414] border border-[#1E1E1E] rounded-[12px] p-4 space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45D]">Contact</h3>
                <div className="text-xs space-y-1.5 text-[#888]">
                  <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#555] shrink-0" />{selectedCustomer.email}</p>
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#555] shrink-0" />{selectedCustomer.phone || "N/A"}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#141414] border border-[#1E1E1E] rounded-[12px] p-4 space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Shipping Address
                </h3>
                {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                  selectedCustomer.addresses.slice(0, 1).map((addr, idx) => (
                    <div key={idx} className="text-xs text-[#888] leading-relaxed">
                      <p className="text-[#E8E4DF]">{addr.address}</p>
                      <p>{[addr.city, addr.state, addr.zip].filter(Boolean).join(", ")}</p>
                      <p>{addr.country || "India"}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#555]">No address on record</p>
                )}
              </div>

              {/* Order History (compact) */}
              <div className="bg-[#141414] border border-[#1E1E1E] rounded-[12px] p-4 space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" /> Recent Orders ({selectedCustomer.orders ? selectedCustomer.orders.length : 0})
                </h3>
                {!selectedCustomer.orders || selectedCustomer.orders.length === 0 ? (
                  <p className="text-xs text-[#555]">No orders placed yet</p>
                ) : (
                  <div className="divide-y divide-[#1E1E1E]">
                    {selectedCustomer.orders.slice(0, 5).map((ord) => (
                      <div key={ord.id || ord._id} className="py-2 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-mono font-bold text-[#C8A45D]">{ord.orderNo}</p>
                          <p className="text-[10px] text-[#555]">
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString("en-IN") : "—"} · {ord.status}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-[#E8E4DF]">{formatPrice(ord.totalAmount)}</span>
                          <Link href={`/admin/orders/${ord.id || ord._id}`}
                            className="text-[10px] text-[#C8A45D] hover:underline font-bold">View</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              <div className="bg-[#141414] border border-[#1E1E1E] rounded-[12px] p-4 space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Admin Notes
                </h3>
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input type="text" placeholder="Add internal note…" value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-[#0D0D0D] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50"
                  />
                  <button type="submit" disabled={addingNote || !noteContent.trim()}
                    className="px-3 py-1.5 bg-[#C8A45D] text-[#090909] font-bold text-xs rounded-[8px] disabled:opacity-50 flex items-center gap-1 cursor-pointer">
                    <Send className="w-3 h-3" /> Add
                  </button>
                </form>
                {!selectedCustomer.notes || selectedCustomer.notes.length === 0 ? (
                  <p className="text-xs text-[#555]">No notes added yet</p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {selectedCustomer.notes.slice().reverse().map((n) => (
                      <div key={n._id} className="p-2 bg-[#1C1C1C] border border-[#262626] rounded-[7px] flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-[#E8E4DF] leading-snug">{n.content}</p>
                          <p className="text-[10px] text-[#666] mt-0.5">{n.author || "Admin"} · {new Date(n.createdAt).toLocaleString("en-IN")}</p>
                        </div>
                        <button type="button" onClick={() => handleDeleteNote(n._id)}
                          className="p-1 text-[#666] hover:text-rose-400 cursor-pointer shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT CUSTOMER MODAL ── */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingCustomer(null)} />
          <div className="relative z-10 w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-[20px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#F0EDE8]">Edit Customer</h2>
              <button type="button" onClick={() => setEditingCustomer(null)} className="p-1 text-[#666] hover:text-[#E8E4DF]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              {[{ label: "Name", key: "name", type: "text" }, { label: "Email", key: "email", type: "email" }, { label: "Phone", key: "phone", type: "text" }].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-[#888] font-semibold mb-1 uppercase tracking-wider">{label}</label>
                  <input type={type} value={editForm[key]}
                    onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#222] rounded-[8px] text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[#888] font-semibold mb-1 uppercase tracking-wider">Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#222] rounded-[8px] text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingCustomer(null)} className="px-3.5 py-2 text-xs text-[#666] hover:text-[#E8E4DF] rounded-[8px]">Cancel</button>
              <button type="button" onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] font-bold text-xs rounded-[8px] flex items-center gap-1.5 cursor-pointer">
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
