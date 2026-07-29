"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  ShoppingBag,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Send,
  RefreshCw,
  AlertTriangle,
  Package,
} from "lucide-react";
import AdminShell from "@/components/admin/shell/AdminShell";
import { ordersService } from "@/lib/ordersService";
import { formatPrice } from "@/lib/utils";
import OrderTimeline from "@/components/admin/orders/OrderTimeline";
import OrderInvoiceModal from "@/components/admin/orders/OrderInvoiceModal";
import { useToast } from "@/context/ToastContext";

const STATUS_PILL = {
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Confirmed: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Processing: "bg-[#C8A45D]/15 text-[#C8A45D] border-[#C8A45D]/25",
  Packed: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Shipped: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Cancelled: "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(null);

  const orderId = params?.id;

  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const data = await ordersService.getOrder(orderId);
      setOrder(data);
    } catch (err) {
      console.error("Error loading order detail:", err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleUpdateStatus = async (newStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      const updated = await ordersService.updateOrderStatus(order.id, newStatus);
      if (updated) {
        setOrder(updated);
        success("Status Updated", `Order #${order.orderNo} updated to ${newStatus}`);
      }
    } catch (err) {
      toastError("Update Failed", err.message);
    } finally {
      setUpdating(false);
      setConfirmStatus(null);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim() || !order) return;
    setAddingNote(true);
    try {
      const res = await ordersService.addOrderNote(order.id, noteInput.trim());
      if (res && res.order) {
        setOrder(res.order);
        setNoteInput("");
        success("Note Added", "Internal note appended to order history.");
      }
    } catch (err) {
      toastError("Failed to add note", err.message);
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="space-y-4 max-w-5xl mx-auto p-4 animate-pulse">
          <div className="h-6 bg-[#1A1A1A] rounded w-1/4" />
          <div className="h-24 bg-[#111] rounded-[14px]" />
          <div className="h-64 bg-[#111] rounded-[14px]" />
        </div>
      </AdminShell>
    );
  }

  if (!order) {
    return (
      <AdminShell>
        <div className="text-center py-20 max-w-lg mx-auto space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#444] mx-auto" />
          <h2 className="text-lg font-bold text-[#E8E4DF]">Order Not Found</h2>
          <p className="text-xs text-[#777]">The requested order could not be located.</p>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-[#090909] font-bold text-xs rounded-[8px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </AdminShell>
    );
  }

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN")
    : "—";

  return (
    <AdminShell>
      <div className="space-y-5 max-w-5xl mx-auto pb-12">
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E1E1E] pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="p-2 rounded-[8px] bg-[#141414] hover:bg-[#1A1A1A] text-[#888] hover:text-[#E8E4DF] border border-[#222] transition-colors"
              title="Back to Orders"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-[#F8F6F3] font-mono">#{order.orderNo}</h1>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    STATUS_PILL[order.status] || "bg-[#222] text-[#888]"
                  }`}
                >
                  {order.status}
                </span>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-[#1C1C1C] text-[#E8E4DF] border border-[#2A2A2A]">
                  Payment: {order.paymentStatus}
                </span>
              </div>
              <p className="text-xs text-[#777] mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#555]" />
                <span>Placed on {formattedDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowInvoice(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#2A2A2A] text-xs font-semibold text-[#E8E4DF] rounded-[9px] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>Print Invoice</span>
            </button>

            {/* Quick Status Dropdown */}
            <select
              value={order.status}
              onChange={(e) => setConfirmStatus(e.target.value)}
              disabled={updating}
              className="px-3 py-2 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] text-xs font-bold rounded-[9px] transition-colors cursor-pointer outline-none border-none"
            >
              <option value="Pending">Set Pending</option>
              <option value="Confirmed">Set Confirmed</option>
              <option value="Processing">Set Processing</option>
              <option value="Packed">Set Packed</option>
              <option value="Shipped">Set Shipped</option>
              <option value="Delivered">Set Delivered</option>
              <option value="Cancelled">Set Cancelled</option>
            </select>
          </div>
        </div>

        {/* ── ORDER TIMELINE STEPPER ── */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-4 sm:p-5">
          <OrderTimeline status={order.status} timeline={order.timeline} />
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT: ORDERED ITEMS & CALCULATIONS */}
          <div className="lg:col-span-8 space-y-5">
            {/* Ordered Products */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-4 sm:p-5 space-y-4">
              <h2 className="text-sm font-bold text-[#E8E4DF] border-b border-[#1E1E1E] pb-2.5">
                Ordered Products ({(order.items || []).length})
              </h2>

              <div className="divide-y divide-[#1A1A1A]">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-[8px] bg-[#161616] border border-[#222] overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-[#444]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#E8E4DF] truncate">{item.name}</p>
                        <p className="text-[10px] font-mono text-[#777]">SKU: {item.sku || "N/A"}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#666]">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono font-bold text-[#C8A45D]">
                        {formatPrice(item.itemTotal || item.price * item.quantity)}
                      </p>
                      <p className="text-[10px] font-mono text-[#666]">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="border-t border-[#1E1E1E] pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#888]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#E8E4DF]">{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#888]">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-[#E8E4DF]">
                    {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
                  </span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between text-[#888]">
                    <span>Estimated Tax</span>
                    <span className="font-mono text-[#E8E4DF]">{formatPrice(order.tax)}</span>
                  </div>
                )}
                <div className="border-t border-[#222222] pt-2 flex justify-between font-bold text-sm text-[#C8A45D]">
                  <span>Grand Total</span>
                  <span className="font-mono">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* INTERNAL ADMIN NOTES */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-4 sm:p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#E8E4DF]">Internal Admin Notes</h2>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add internal note for staff..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50"
                />
                <button
                  type="submit"
                  disabled={addingNote || !noteInput.trim()}
                  className="px-3.5 py-2 bg-[#C8A45D] text-[#090909] font-bold text-xs rounded-[8px] hover:bg-[#D4B572] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </button>
              </form>

              <div className="space-y-2 mt-2">
                {(!order.notes || order.notes.length === 0) ? (
                  <p className="text-xs text-[#666]">No internal notes recorded.</p>
                ) : (
                  order.notes.slice().reverse().map((note) => (
                    <div key={note.id} className="p-2.5 rounded-[8px] bg-[#161616] border border-[#222] text-xs space-y-1">
                      <p className="text-[#E8E4DF]">{note.text}</p>
                      <div className="flex justify-between text-[10px] text-[#666]">
                        <span>By {note.author || "Admin"}</span>
                        <span>{note.createdAt ? new Date(note.createdAt).toLocaleString("en-IN") : "—"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: CUSTOMER & DESTINATION DETAILS */}
          <div className="lg:col-span-4 space-y-5">
            {/* Customer Profile */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E8E4DF] border-b border-[#1E1E1E] pb-2.5">
                <User className="w-4 h-4 text-[#C8A45D]" />
                <span>Customer Profile</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#F8F6F3]">{order.customerName}</p>
                <p className="text-xs text-[#888]">{order.customerEmail}</p>
                <p className="text-xs text-[#888]">{order.customerPhone || "No Phone Provided"}</p>
              </div>

              {order.customerId && (
                <Link
                  href={`/admin/customers?id=${order.customerId}`}
                  className="text-xs font-semibold text-[#C8A45D] hover:underline inline-block pt-1"
                >
                  View CRM Profile →
                </Link>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E8E4DF] border-b border-[#1E1E1E] pb-2.5">
                <MapPin className="w-4 h-4 text-[#C8A45D]" />
                <span>Shipping Address</span>
              </div>

              <div className="text-xs text-[#888] space-y-1">
                <p className="text-[#E8E4DF] font-medium">{order.shippingAddress?.address || "On File"}</p>
                <p>
                  {[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.zip]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p>{order.shippingAddress?.country || "India"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Confirmation Modal */}
        {confirmStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setConfirmStatus(null)} />
            <div className="relative bg-[#141414] border border-[#2A2A2A] rounded-[18px] p-6 max-w-sm w-full shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-[#E8E4DF]">Confirm Status Change</h3>
              <p className="text-xs text-[#888]">
                Change order status from <span className="text-[#C8A45D] font-bold">{order.status}</span> to{" "}
                <span className="text-[#C8A45D] font-bold">{confirmStatus}</span>?
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmStatus(null)}
                  className="px-3.5 py-1.5 text-xs text-[#888] hover:text-[#E8E4DF] rounded-[8px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(confirmStatus)}
                  disabled={updating}
                  className="px-4 py-1.5 bg-[#C8A45D] text-[#090909] font-bold text-xs rounded-[8px] hover:bg-[#D4B572]"
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        <OrderInvoiceModal
          isOpen={showInvoice}
          order={order}
          onClose={() => setShowInvoice(false)}
        />
      </div>
    </AdminShell>
  );
}
