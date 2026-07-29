"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  MessageSquare,
  Calendar,
  Award,
  TrendingUp,
  DollarSign,
  Package,
  X,
  Plus,
  Trash2,
  Send,
  Clock,
  RefreshCw,
  Edit,
  Save,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import AdminShell from "@/components/admin/shell/AdminShell";
import { customersService } from "@/lib/customersService";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

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

const ORDER_STATUS_PILL = {
  Delivered: "bg-emerald-500/15 text-emerald-400",
  Shipped: "bg-blue-500/15 text-blue-400",
  Packed: "bg-blue-500/15 text-blue-400",
  Processing: "bg-amber-500/15 text-amber-400",
  Confirmed: "bg-amber-500/15 text-amber-400",
  Pending: "bg-amber-500/15 text-amber-400",
  Cancelled: "bg-rose-500/15 text-rose-400",
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Order History" },
  { id: "timeline", label: "Activity" },
  { id: "notes", label: "Notes" },
];

export default function CustomerDetailsPage() {
  const params = useParams();
  const { success, error: toastError } = useToast();
  const customerId = params?.id;

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", status: "Active" });
  const [saving, setSaving] = useState(false);

  // Notes state
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const load = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await customersService.getCustomer(customerId);
      setCustomer(data);
      if (data) {
        setEditForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          status: data.status || "Active",
        });
      }
    } catch (err) {
      console.error("Error loading customer:", err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveEdit = async () => {
    if (!customer) return;
    setSaving(true);
    try {
      const updated = await customersService.updateCustomer(customer.id, editForm);
      if (updated) {
        setCustomer((prev) => ({ ...prev, ...updated }));
        success("Profile Updated", `${updated.name}'s details have been saved.`);
        setEditMode(false);
        await load();
      }
    } catch (err) {
      toastError("Update Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim() || !customer) return;
    setAddingNote(true);
    try {
      await customersService.addCustomerNote(customer.id, noteText.trim());
      success("Note Added", "Admin note recorded.");
      setNoteText("");
      await load();
    } catch (err) {
      toastError("Failed to add note", err.message);
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!customer || !noteId) return;
    try {
      await customersService.deleteCustomerNote(customer.id, noteId);
      await load();
    } catch (err) {
      toastError("Failed to delete note", err.message);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="animate-pulse space-y-4 max-w-5xl mx-auto">
          <div className="h-6 bg-[#1A1A1A] rounded w-1/4" />
          <div className="h-32 bg-[#111] rounded-[14px]" />
          <div className="h-64 bg-[#111] rounded-[14px]" />
        </div>
      </AdminShell>
    );
  }

  if (!customer) {
    return (
      <AdminShell>
        <div className="text-center py-20 max-w-lg mx-auto space-y-4">
          <User className="w-12 h-12 text-[#444] mx-auto" />
          <h2 className="text-lg font-bold text-[#E8E4DF]">Customer Not Found</h2>
          <p className="text-xs text-[#777]">The requested customer profile could not be located.</p>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-[#090909] font-bold text-xs rounded-[8px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </Link>
        </div>
      </AdminShell>
    );
  }

  const initials = customer.name
    ? customer.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const lastOrder = customer.orders && customer.orders.length > 0 ? customer.orders[0] : null;

  return (
    <AdminShell>
      <div className="space-y-5 max-w-5xl mx-auto pb-12">
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E1E1E] pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/customers"
              className="p-2 rounded-[8px] bg-[#141414] hover:bg-[#1A1A1A] text-[#888] hover:text-[#E8E4DF] border border-[#222] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            {/* Avatar + Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C8A45D]/20 border border-[#C8A45D]/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[#C8A45D]">{initials}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-[#F8F6F3]">{customer.name}</h1>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${TIER_PILL[customer.tier] || TIER_PILL.New}`}>
                    {customer.tier || "New"}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_PILL[customer.status] || "bg-[#222] text-[#888]"}`}>
                    {customer.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#777] mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  Registered {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("en-IN") : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={load}
              className="p-2 bg-[#141414] hover:bg-[#1A1A1A] border border-[#222] text-[#888] rounded-[8px] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-semibold text-[#E8E4DF] rounded-[9px] transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-[#C8A45D]" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">Total Orders</span>
            <p className="text-xl font-bold font-mono text-[#E8E4DF]">{customer.ordersCount || 0}</p>
          </div>
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">Total Spent</span>
            <p className="text-xl font-bold font-mono text-[#C8A45D]">{formatPrice(customer.totalSpent || 0)}</p>
          </div>
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">Avg Order</span>
            <p className="text-xl font-bold font-mono text-[#E8E4DF]">{formatPrice(customer.averageOrderValue || 0)}</p>
          </div>
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">Last Order</span>
            <p className="text-sm font-bold text-[#E8E4DF]">
              {lastOrder
                ? new Date(lastOrder.createdAt).toLocaleDateString("en-IN")
                : "Never"}
            </p>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-[#1E1E1E]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "text-[#C8A45D] border-[#C8A45D]"
                  : "text-[#666] border-transparent hover:text-[#E8E4DF]"
              }`}
            >
              {tab.label}
              {tab.id === "orders" && customer.orders?.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-[#1A1A1A] rounded text-[10px] font-mono text-[#888]">
                  {customer.orders.length}
                </span>
              )}
              {tab.id === "notes" && customer.notes?.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-[#1A1A1A] rounded text-[10px] font-mono text-[#888]">
                  {customer.notes.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Contact Info */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Contact Information
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-[#888]">
                  <Mail className="w-3.5 h-3.5 text-[#555] shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#888]">
                  <Phone className="w-3.5 h-3.5 text-[#555] shrink-0" />
                  <span>{customer.phone || "Not provided"}</span>
                </div>
                <div className="flex items-start gap-2.5 text-[#888]">
                  <Calendar className="w-3.5 h-3.5 text-[#555] shrink-0 mt-0.5" />
                  <div>
                    <p>Registered: {customer.createdAt ? new Date(customer.createdAt).toLocaleString("en-IN") : "—"}</p>
                    {customer.updatedAt && (
                      <p className="text-[10px] text-[#555]">Last Updated: {new Date(customer.updatedAt).toLocaleDateString("en-IN")}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Addresses */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Shipping Addresses
              </h3>
              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="space-y-3">
                  {customer.addresses.map((addr, idx) => (
                    <div key={idx} className="p-3 bg-[#161616] rounded-[8px] border border-[#1E1E1E] text-xs text-[#888] space-y-0.5">
                      {idx === 0 && (
                        <span className="inline-block px-1.5 py-0.5 bg-[#C8A45D]/10 text-[#C8A45D] text-[9px] font-bold rounded mb-1">DEFAULT</span>
                      )}
                      <p className="text-[#E8E4DF] font-medium">{addr.address}</p>
                      <p>{[addr.city, addr.state, addr.zip].filter(Boolean).join(", ")}</p>
                      <p>{addr.country || "India"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#555]">No shipping address on record</p>
              )}
            </div>

            {/* Account Status */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Account Activity
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#888]">Account Status</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold border ${STATUS_PILL[customer.status] || "bg-[#222] text-[#888]"}`}>
                    {customer.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#888]">Customer Tier</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold border ${TIER_PILL[customer.tier] || TIER_PILL.New}`}>
                    {customer.tier || "New"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#888]">Total Orders</span>
                  <span className="font-mono font-bold text-[#E8E4DF]">{customer.ordersCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#888]">Last Order Date</span>
                  <span className="font-mono text-[#E8E4DF]">
                    {lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString("en-IN") : "No orders yet"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Recent Order */}
            {lastOrder && (
              <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" /> Most Recent Order
                </h3>
                <div className="p-3 bg-[#161616] rounded-[8px] border border-[#1E1E1E] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#C8A45D]">{lastOrder.orderNo}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ORDER_STATUS_PILL[lastOrder.status] || "bg-[#222] text-[#888]"}`}>
                      {lastOrder.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#888]">
                    <span>{new Date(lastOrder.createdAt).toLocaleDateString("en-IN")}</span>
                    <span className="font-mono font-bold text-[#E8E4DF]">{formatPrice(lastOrder.totalAmount)}</span>
                  </div>
                  <Link
                    href={`/admin/orders/${lastOrder.id || lastOrder._id}`}
                    className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-[#C8A45D] hover:underline"
                  >
                    View Full Order <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDER HISTORY TAB */}
        {activeTab === "orders" && (
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden">
            <div className="p-4 border-b border-[#1E1E1E] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#E8E4DF]">
                Order History ({(customer.orders || []).length})
              </h3>
              <span className="text-xs text-[#666] font-mono">{formatPrice(customer.totalSpent || 0)} Total Spent</span>
            </div>
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-[#111] border-b border-[#1E1E1E] z-10">
                  <tr className="text-[#555] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Order No.</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {(!customer.orders || customer.orders.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <ShoppingBag className="w-8 h-8 text-[#333] mx-auto mb-2" />
                        <p className="text-[#555] text-xs">No orders placed yet</p>
                      </td>
                    </tr>
                  ) : (
                    customer.orders.map((ord) => (
                      <tr key={ord.id || ord._id} className="hover:bg-[#161616] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#C8A45D]">{ord.orderNo}</td>
                        <td className="py-3 px-4 text-[#888]">
                          {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString("en-IN") : "—"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ORDER_STATUS_PILL[ord.status] || "bg-[#222] text-[#888]"}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#E8E4DF]">
                          {formatPrice(ord.totalAmount)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/admin/orders/${ord.id || ord._id}`}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C8A45D] hover:underline"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACTIVITY TIMELINE TAB */}
        {activeTab === "timeline" && (
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#E8E4DF] border-b border-[#1E1E1E] pb-2.5">
              Customer Activity Timeline ({(customer.timeline || []).length} Events)
            </h3>
            {(!customer.timeline || customer.timeline.length === 0) ? (
              <div className="py-10 text-center">
                <Clock className="w-8 h-8 text-[#333] mx-auto mb-2" />
                <p className="text-xs text-[#555]">No activity recorded yet</p>
              </div>
            ) : (
              <div className="relative space-y-0">
                {/* Vertical line */}
                <div className="absolute left-3.5 top-2 bottom-2 w-px bg-[#1E1E1E]" />

                {customer.timeline.map((event, idx) => (
                  <div key={idx} className="relative flex gap-3 pl-9 py-2.5">
                    {/* Dot */}
                    <div className="absolute left-2 top-3.5 w-3 h-3 rounded-full bg-[#1A1A1A] border-2 border-[#C8A45D]/40 z-10" />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#E8E4DF]">{event.title}</p>
                      <p className="text-[11px] text-[#777] mt-0.5">{event.description}</p>
                      <p className="text-[10px] text-[#555] font-mono mt-0.5">
                        {event.date ? new Date(event.date).toLocaleString("en-IN") : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === "notes" && (
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#E8E4DF]">Internal Admin Notes</h3>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <textarea
                rows={2}
                placeholder="Type an internal note regarding this client…"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] placeholder:text-[#444] focus:outline-none focus:border-[#C8A45D]/50 resize-none"
              />
              <button
                type="submit"
                disabled={addingNote || !noteText.trim()}
                className="px-4 py-2 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] font-bold text-xs rounded-[8px] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer self-end"
              >
                <Send className="w-3.5 h-3.5" />
                Add
              </button>
            </form>

            {/* Notes List */}
            {(!customer.notes || customer.notes.length === 0) ? (
              <div className="py-8 text-center">
                <MessageSquare className="w-8 h-8 text-[#333] mx-auto mb-2" />
                <p className="text-xs text-[#555]">No notes added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {customer.notes.slice().reverse().map((note) => (
                  <div
                    key={note._id}
                    className="p-3 bg-[#161616] border border-[#222] rounded-[8px] flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-[#E8E4DF] leading-snug">{note.content}</p>
                      <p className="text-[10px] text-[#666] mt-1 font-mono">
                        By {note.author || "Admin"} · {note.createdAt ? new Date(note.createdAt).toLocaleString("en-IN") : "—"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note._id)}
                      className="p-1 text-[#555] hover:text-rose-400 transition-colors shrink-0 cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── EDIT PROFILE MODAL ── */}
        {editMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditMode(false)} />
            <div className="relative z-10 w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-[20px] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#F0EDE8]">Edit Customer Profile</h2>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="p-1.5 text-[#666] hover:text-[#E8E4DF]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { label: "Full Name", key: "name", type: "text" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Phone", key: "phone", type: "text" },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-[#888] font-semibold mb-1 uppercase tracking-wider">{label}</label>
                    <input
                      type={type}
                      value={editForm[key]}
                      onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#222] rounded-[8px] text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-[#888] font-semibold mb-1 uppercase tracking-wider">Account Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#222] rounded-[8px] text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-3.5 py-2 text-xs text-[#666] hover:text-[#E8E4DF] rounded-[8px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="px-4 py-2 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] font-bold text-xs rounded-[8px] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
