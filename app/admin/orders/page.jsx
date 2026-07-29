"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  CheckCircle2,
  Truck,
  Package,
  Calendar,
  SlidersHorizontal,
  XCircle,
  Clock,
  ArrowRight,
  Send,
  User,
  MapPin,
} from "lucide-react";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import { ordersService } from "@/lib/ordersService";
import { formatPrice } from "@/lib/utils";
import OrderTimeline from "@/components/admin/orders/OrderTimeline";
import OrderInvoiceModal from "@/components/admin/orders/OrderInvoiceModal";

const PAGE_SIZE = 15;

const STATUS_PILL = {
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Confirmed: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Processing: "bg-[#C8A45D]/15 text-[#C8A45D] border-[#C8A45D]/25",
  Packed: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Shipped: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Cancelled: "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

const PAYMENT_PILL = {
  Paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Failed: "bg-rose-500/15 text-rose-400 border-rose-500/25",
  Refunded: "bg-purple-500/15 text-purple-400 border-purple-500/25",
};

export default function OrdersPage() {
  const { success, warning, error: toastError } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  // Selection
  const [selected, setSelected] = useState([]);

  // Detail Drawer & Invoice Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [confirmStatusModal, setConfirmStatusModal] = useState(null);

  // Note Input
  const [drawerNoteInput, setDrawerNoteInput] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        search: search.trim(),
        status: statusFilter !== "all" ? statusFilter : undefined,
        paymentStatus: paymentFilter !== "all" ? paymentFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      const data = await ordersService.filterOrders(filters);
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      toastError("Load Failed", "Could not retrieve orders from server.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, paymentFilter, startDate, endDate, toastError]);

  useEffect(() => {
    load();
  }, [load]);

  // Bulk Actions
  const toggleAll = () => {
    if (selected.length === orders.length) {
      setSelected([]);
    } else {
      setSelected(orders.map((o) => o.id));
    }
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = async (newStatus) => {
    if (selected.length === 0) return;
    try {
      const res = await ordersService.bulkUpdateStatus(selected, newStatus);
      if (res && res.success) {
        success("Bulk Update Complete", `Updated ${res.count} order(s) to ${newStatus}`);
        setSelected([]);
        await load();
      }
    } catch (err) {
      toastError("Bulk Action Failed", err.message);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updated = await ordersService.updateOrderStatus(orderId, newStatus);
      if (updated) {
        success("Status Updated", `Order updated to ${newStatus}`);
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updated);
        }
        await load();
      }
    } catch (err) {
      toastError("Update Failed", err.message);
    } finally {
      setConfirmStatusModal(null);
    }
  };

  const handleAddDrawerNote = async (e) => {
    e.preventDefault();
    if (!drawerNoteInput.trim() || !selectedOrder) return;
    setAddingNote(true);
    try {
      const res = await ordersService.addOrderNote(selectedOrder.id, drawerNoteInput.trim());
      if (res && res.order) {
        setSelectedOrder(res.order);
        setDrawerNoteInput("");
        success("Note Added", "Internal admin note attached.");
        await load();
      }
    } catch (err) {
      toastError("Failed to add note", err.message);
    } finally {
      setAddingNote(false);
    }
  };

  const hasFilters =
    search || statusFilter !== "all" || paymentFilter !== "all" || startDate || endDate;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setStartDate("");
    setEndDate("");
  };

  // Pagination
  const totalPages = Math.ceil(orders.length / PAGE_SIZE) || 1;
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AdminShell>
      <div className="space-y-4 sm:space-y-5 min-w-0 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#F0EDE8]">Orders Management</h1>
            <p className="text-[11px] sm:text-xs text-[#666] mt-0.5">
              {orders.length} total orders recorded
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] hover:bg-[#1C1C1C] border border-[#262626] text-xs text-[#E8E4DF] font-medium rounded-[8px] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#C8A45D]" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* ── SEARCH & MULTI-FILTER BAR ── */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#888]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Filter Orders</span>
          </div>

          {/* Full-width Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
            <input
              type="text"
              placeholder="Search Order No., Customer Name, Email or Phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] placeholder:text-[#555] focus:outline-none focus:border-[#C8A45D]/50 transition-colors"
            />
          </div>

          {/* Responsive 4-Column Filter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer truncate"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-2.5 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer truncate"
            >
              <option value="all">All Payment Status</option>
              <option value="Pending">Payment Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2.5 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#888] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer"
              title="Start Date"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2.5 h-9 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#888] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer"
              title="End Date"
            />
          </div>

          {hasFilters && (
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-1 text-xs text-[#666] hover:text-[#E8E4DF] flex items-center gap-1.5 cursor-pointer bg-[#141414] border border-[#222] rounded-[6px]"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Bulk Action Bar */}
        {selected.length > 0 && (
          <div className="flex items-center justify-between gap-3 p-3 bg-[#1A1A14] border border-[#C8A45D]/30 rounded-[10px] flex-wrap">
            <span className="text-xs font-semibold text-[#C8A45D]">
              {selected.length} orders selected
            </span>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleBulkStatus("Packed")}
                className="px-2.5 py-1 text-xs font-semibold bg-[#222] hover:bg-[#2A2A2A] text-blue-400 rounded-[6px] border border-blue-500/30"
              >
                Mark Packed
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("Shipped")}
                className="px-2.5 py-1 text-xs font-semibold bg-[#222] hover:bg-[#2A2A2A] text-blue-400 rounded-[6px] border border-blue-500/30"
              >
                Mark Shipped
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("Delivered")}
                className="px-2.5 py-1 text-xs font-semibold bg-[#222] hover:bg-[#2A2A2A] text-emerald-400 rounded-[6px] border border-emerald-500/30"
              >
                Mark Delivered
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("Cancelled")}
                className="px-2.5 py-1 text-xs font-semibold bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 rounded-[6px] border border-rose-800/30"
              >
                Cancel Selected
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-[#111] z-10 border-b border-[#1E1E1E] shadow-sm">
                <tr className="text-[#555] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={orders.length > 0 && selected.length === orders.length}
                      onChange={toggleAll}
                      className="w-3.5 h-3.5 accent-[#C8A45D] cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4">Order No.</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Payment</th>
                  <th className="py-3.5 px-4 text-center">Order Status</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
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
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <ShoppingBag className="w-10 h-10 text-[#333] mx-auto mb-3" />
                      <p className="text-[#555] text-sm">No orders found matching filters</p>
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
                  paginatedOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      className={`hover:bg-[#161616] transition-colors group ${
                        selected.includes(ord.id) ? "bg-[#1A1A14]" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(ord.id)}
                          onChange={() => toggleOne(ord.id)}
                          className="w-3.5 h-3.5 accent-[#C8A45D] cursor-pointer"
                        />
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#C8A45D] font-bold">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="hover:underline text-left cursor-pointer"
                        >
                          {ord.orderNo}
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#E8E4DF] max-w-[140px] truncate">
                          {ord.customerName}
                        </p>
                        <p className="text-[10px] text-[#666] truncate">{ord.customerPhone}</p>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#E8E4DF]">
                        {formatPrice(ord.totalAmount)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            PAYMENT_PILL[ord.paymentStatus] || "bg-[#222] text-[#888]"
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            STATUS_PILL[ord.status] || "bg-[#222] text-[#888]"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 hidden lg:table-cell text-[11px] text-[#777]">
                        {ord.createdAt ? String(ord.createdAt).split("T")[0] : "—"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 rounded-[6px] text-[#666] hover:text-[#C8A45D] hover:bg-[#1C1C1C] transition-colors cursor-pointer"
                            title="Inspect Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setInvoiceOrder(ord)}
                            className="p-1.5 rounded-[6px] text-[#666] hover:text-[#E8E4DF] hover:bg-[#1C1C1C] transition-colors cursor-pointer"
                            title="Print Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {orders.length > 0 && (
            <div className="px-4 py-3 border-t border-[#1E1E1E] flex items-center justify-between text-xs text-[#777]">
              <span>
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, orders.length)} of {orders.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-[6px] border border-[#222] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-[6px] border border-[#222] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── ORDER DETAIL SLIDE-OVER DRAWER ── */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <div className="relative z-10 w-full max-w-xl bg-[#0D0D0D] border-l border-[#1E1E1E] h-full overflow-y-auto p-5 space-y-5 shadow-2xl">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-4">
                <div>
                  <h2 className="text-lg font-bold font-mono text-[#F8F6F3]">#{selectedOrder.orderNo}</h2>
                  <p className="text-xs text-[#777]">Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString("en-IN") : "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/orders/${selectedOrder.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-[#C8A45D] hover:underline"
                  >
                    Full Page <ArrowRight className="w-3 h-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="p-1.5 text-[#666] hover:text-[#E8E4DF] rounded-[6px]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Stepper */}
              <OrderTimeline status={selectedOrder.status} timeline={selectedOrder.timeline} />

              {/* Status Changer */}
              <div className="flex items-center justify-between bg-[#141414] p-3 rounded-[10px] border border-[#222]">
                <span className="text-xs font-bold text-[#E8E4DF]">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => setConfirmStatusModal(e.target.value)}
                  className="px-3 py-1.5 bg-[#C8A45D] text-[#090909] font-bold text-xs rounded-[7px] cursor-pointer border-none outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Ordered Products Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#AAA]">Items ({(selectedOrder.items || []).length})</h3>
                <div className="divide-y divide-[#1A1A1A] bg-[#111] rounded-[10px] p-3 border border-[#1E1E1E]">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded bg-[#161616] border border-[#222] overflow-hidden shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-4 h-4 text-[#444]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#E8E4DF] truncate">{item.name}</p>
                          <p className="text-[10px] font-mono text-[#666]">SKU: {item.sku || "N/A"} | Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-xs font-mono font-bold text-[#C8A45D] shrink-0">
                        {formatPrice(item.itemTotal || item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation */}
              <div className="bg-[#111] p-3.5 rounded-[10px] border border-[#1E1E1E] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#888]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#E8E4DF]">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#888]">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-[#E8E4DF]">{selectedOrder.shippingFee === 0 ? "FREE" : formatPrice(selectedOrder.shippingFee)}</span>
                </div>
                <div className="border-t border-[#222] pt-2 flex justify-between font-bold text-sm text-[#C8A45D]">
                  <span>Grand Total</span>
                  <span className="font-mono">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#AAA]">Internal Admin Notes</h3>
                <form onSubmit={handleAddDrawerNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add internal note..."
                    value={drawerNoteInput}
                    onChange={(e) => setDrawerNoteInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF]"
                  />
                  <button
                    type="submit"
                    disabled={addingNote || !drawerNoteInput.trim()}
                    className="px-3 py-1.5 bg-[#C8A45D] text-[#090909] font-bold text-xs rounded-[8px] disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </form>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {(!selectedOrder.notes || selectedOrder.notes.length === 0) ? (
                    <p className="text-[11px] text-[#666]">No notes added.</p>
                  ) : (
                    selectedOrder.notes.slice().reverse().map((n) => (
                      <div key={n.id} className="p-2 rounded bg-[#161616] text-[11px]">
                        <p className="text-[#E8E4DF]">{n.text}</p>
                        <span className="text-[9px] text-[#666]">{n.author} • {new Date(n.createdAt).toLocaleTimeString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmStatusModal && selectedOrder && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setConfirmStatusModal(null)} />
            <div className="relative z-10 bg-[#141414] border border-[#2A2A2A] rounded-[18px] p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-[#E8E4DF]">Confirm Status Update</h3>
              <p className="text-xs text-[#888]">
                Update order <span className="font-mono text-[#C8A45D]">#{selectedOrder.orderNo}</span> status to{" "}
                <span className="font-bold text-[#C8A45D]">{confirmStatusModal}</span>?
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmStatusModal(null)}
                  className="px-3.5 py-1.5 text-xs text-[#888] rounded-[8px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, confirmStatusModal)}
                  className="px-4 py-1.5 bg-[#C8A45D] text-[#090909] font-bold text-xs rounded-[8px]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Printable Invoice Modal */}
        <OrderInvoiceModal
          isOpen={!!invoiceOrder}
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      </div>
    </AdminShell>
  );
}
