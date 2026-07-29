"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  User,
  RotateCcw,
  Edit2,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  Sparkles,
  X,
  Loader2,
  DollarSign,
  Package,
  FileText,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

const INITIAL_ORDERS = [
  {
    id: "GOR-892401",
    customer: {
      name: "Alexander Vance",
      email: "alexander@vance.com",
      phone: "+1 (555) 234-5678",
      totalSpend: 1420,
      orderCount: 3,
    },
    date: "July 24, 2026",
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card (Visa ending in 4242)",
    txnId: "TXN-9924820",
    courier: "FedEx Express Priority",
    trackingCode: "FEDEX-892401-US",
    eta: "July 28, 2026",
    shippingAddress: {
      street: "742 Evergreen Terrace, Suite 4B",
      city: "New York",
      state: "NY",
      pincode: "10001",
      country: "United States",
    },
    items: [
      { id: "i1", name: "GOR Alo Burgundy Heavyweight Co-Ord Set", size: "L", color: "Burgundy", qty: 1, price: 380, image: "/images/products/gor-codset-burgundy-alo.webp" },
      { id: "i2", name: "Prada Desert Sand Textured Zip Set", size: "M", color: "Desert Sand", qty: 1, price: 520, image: "/images/products/gor-codset-beige-prada.webp" },
    ],
    subtotal: 900,
    shippingFee: 0,
    total: 900,
    notes: "Customer requested signature upon delivery.",
  },
  {
    id: "GOR-892402",
    customer: {
      name: "Marcus Sterling",
      email: "marcus@sterling.com",
      phone: "+1 (555) 987-6543",
      totalSpend: 980,
      orderCount: 2,
    },
    date: "July 24, 2026",
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "Apple Pay",
    txnId: "TXN-9924821",
    courier: "DHL Express",
    trackingCode: "DHL-992402-US",
    eta: "July 29, 2026",
    shippingAddress: {
      street: "1200 Wilshire Blvd, Apt 12A",
      city: "Los Angeles",
      state: "CA",
      pincode: "90017",
      country: "United States",
    },
    items: [
      { id: "i3", name: "Prada Desert Sand Textured Zip Set", size: "L", color: "Desert Sand", qty: 1, price: 520, image: "/images/products/gor-codset-beige-prada.webp" },
    ],
    subtotal: 520,
    shippingFee: 0,
    total: 520,
    notes: "",
  },
  {
    id: "GOR-892403",
    customer: {
      name: "Julian Thorne",
      email: "julian@thorne.com",
      phone: "+44 20 7946 0912",
      totalSpend: 2850,
      orderCount: 5,
    },
    date: "July 23, 2026",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card (Mastercard ending in 8812)",
    txnId: "TXN-9924822",
    courier: "Royal Mail International",
    trackingCode: "RM-10924-UK",
    eta: "July 26, 2026",
    shippingAddress: {
      street: "45 Regent Street, Flat 3",
      city: "London",
      state: "Greater London",
      pincode: "W1B 4BH",
      country: "United Kingdom",
    },
    items: [
      { id: "i4", name: "GOR Designer Camp Shirting in Onyx", size: "L", color: "Onyx", qty: 2, price: 480, image: "/images/lookbook/gor-lookbook-2.webp" },
      { id: "i5", name: "Luxury Shearling Collar Aviator Jacket", size: "L", color: "Onyx", qty: 1, price: 870, image: "/images/hero/hero-main.jpg" },
    ],
    subtotal: 1350,
    shippingFee: 0,
    total: 1350,
    notes: "Express air priority handoff complete.",
  },
  {
    id: "GOR-892404",
    customer: {
      name: "Dominic Croft",
      email: "dominic@croft.com",
      phone: "+1 (555) 443-2109",
      totalSpend: 180,
      orderCount: 1,
    },
    date: "July 23, 2026",
    status: "Pending",
    paymentStatus: "Awaiting Payment",
    paymentMethod: "Bank Wire Transfer",
    txnId: "TXN-9924823",
    courier: "Standard Courier",
    trackingCode: "PENDING",
    eta: "TBD",
    shippingAddress: {
      street: "88 North Michigan Ave",
      city: "Chicago",
      state: "IL",
      pincode: "60611",
      country: "United States",
    },
    items: [
      { id: "i6", name: "GOR Classic Heavyweight Oversized Tee", size: "M", color: "White", qty: 1, price: 180, image: "/images/products/gor-codset-burgundy-alo.webp" },
    ],
    subtotal: 180,
    shippingFee: 0,
    total: 180,
    notes: "Awaiting bank wire verification.",
  },
];

export default function OrderManagementSystemPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Open Detail Modal
  const handleOpenDetail = (ord) => {
    setActiveOrder({ ...ord });
    setShowDetailModal(true);
  };

  // Update Status Handler
  const handleUpdateStatus = (newStatus) => {
    if (!activeOrder) return;
    const updated = { ...activeOrder, status: newStatus };
    setActiveOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    success("Status Updated", `Order ${updated.id} status changed to ${newStatus}.`);
  };

  // Save Internal Notes
  const handleSaveNotes = (notesText) => {
    if (!activeOrder) return;
    const updated = { ...activeOrder, notes: notesText };
    setActiveOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    success("Notes Saved", "Internal order notes updated.");
  };

  // Printable Invoice
  const handlePrintInvoice = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Export Orders CSV
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "Order_ID,Customer,Email,Total,Status,Payment_Status,Date\n";
        const rows = orders
          .map((o) => `${o.id},"${o.customer.name}",${o.customer.email},${o.total},${o.status},${o.paymentStatus},${o.date}`)
          .join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_Orders_OMS_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("CSV Exported", "Orders OMS report downloaded successfully.");
    }, 800);
  };

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 font-sans select-none relative">
        <Container className="space-y-8">
          
          {/* Header Title & Actions */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4" /> ORDER FULFILLMENT ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Enterprise Order Management (OMS)
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={exporting}
                className="h-10 px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Export Orders CSV</span>
              </button>
            </div>
          </div>

          {/* OMS Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Total Revenue</span>
              <span className="font-editorial text-2xl text-[#C8A45D]">$128,450</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Average Order Value</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">$311.77</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Total Orders</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">412</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Pending Orders</span>
              <span className="font-editorial text-2xl text-amber-400">14</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Refund Rate</span>
              <span className="font-editorial text-2xl text-emerald-400">0.4%</span>
            </div>
          </div>

          {/* ── TOOLBAR ── */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Order ID, Customer Name, or Email..."
                  className="w-full h-10 pl-10 pr-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
              >
                <option value="all">All Fulfillment Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* ── ORDERS TABLE ── */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                  <th className="py-3.5 px-4 font-bold">Order ID</th>
                  <th className="py-3.5 px-4 font-bold">Customer</th>
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold">Total</th>
                  <th className="py-3.5 px-4 font-bold">Payment</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#090909]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#F8F6F3]">{o.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#F8F6F3] block">{o.customer.name}</span>
                      <span className="text-[11px] text-[#8E8A85]">{o.customer.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#8E8A85]">{o.date}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#C8A45D]">{formatPrice(o.total)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono font-semibold text-emerald-400">{o.paymentStatus}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${
                          o.status === "Delivered"
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                            : o.status === "Shipped"
                            ? "bg-blue-950/80 text-blue-400 border-blue-500/30"
                            : o.status === "Processing"
                            ? "bg-amber-950/80 text-amber-400 border-amber-500/30"
                            : "bg-zinc-800 text-zinc-300 border-zinc-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(o)}
                        className="px-3 py-1.5 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] text-xs font-semibold rounded-[6px] transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Container>
      </main>

      {/* ── ITEMIZED ORDER DETAIL MODAL & FULFILLMENT DRAWER ── */}
      {showDetailModal && activeOrder && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans select-none">
            
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  ORDER FULFILLMENT MANAGER
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">Order #{activeOrder.id}</h3>
              </div>
              <button type="button" onClick={() => setShowDetailModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control Bar */}
            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase text-[#8E8A85] block font-bold">Fulfillment Status</span>
                <span className="text-sm font-bold text-[#C8A45D]">{activeOrder.status}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(st)}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-colors border ${
                      activeOrder.status === st
                        ? "bg-[#C8A45D] text-[#090909] border-[#C8A45D]"
                        : "bg-[#151515] text-[#8E8A85] border-[#2A2A2A] hover:text-[#F8F6F3]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid 2 Columns: Customer Info vs Shipping Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Customer Profile Card */}
              <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#C8A45D] font-bold block mb-1">
                  CUSTOMER PROFILE
                </span>
                <h4 className="text-sm font-bold text-[#F8F6F3]">{activeOrder.customer.name}</h4>
                <p className="text-xs text-[#8E8A85]">{activeOrder.customer.email} • {activeOrder.customer.phone}</p>
                <div className="pt-2 border-t border-[#2A2A2A] flex justify-between text-xs font-mono text-[#8E8A85]">
                  <span>Lifetime Spend: <strong className="text-[#C8A45D]">${activeOrder.customer.totalSpend}</strong></span>
                  <span>Previous Orders: {activeOrder.customer.orderCount}</span>
                </div>
              </div>

              {/* Delivery Address & Logistics */}
              <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#C8A45D] font-bold block mb-1">
                  SHIPPING & LOGISTICS
                </span>
                <p className="text-xs text-[#8E8A85] leading-relaxed">
                  {activeOrder.shippingAddress.street}<br />
                  {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.pincode}<br />
                  {activeOrder.shippingAddress.country}
                </p>
                <div className="pt-2 border-t border-[#2A2A2A] text-xs font-mono text-[#8E8A85]">
                  <span>Courier: <strong className="text-[#F8F6F3]">{activeOrder.courier}</strong> ({activeOrder.trackingCode})</span>
                </div>
              </div>

            </div>

            {/* Purchased Items List */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C8A45D] font-bold block">
                PURCHASED ITEMS
              </span>
              {activeOrder.items.map((item) => (
                <div key={item.id} className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded border border-[#2A2A2A]" />
                    <div>
                      <h5 className="font-editorial text-sm text-[#F8F6F3]">{item.name}</h5>
                      <span className="text-xs text-[#8E8A85]">Size: {item.size} • Color: {item.color} • Qty: {item.qty}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#C8A45D] text-sm">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>

            {/* Internal Notes Text Area */}
            <div className="space-y-2">
              <label className="text-xs text-[#8E8A85] block font-medium">Internal Fulfillment Notes</label>
              <textarea
                rows={2}
                defaultValue={activeOrder.notes}
                onBlur={(e) => handleSaveNotes(e.target.value)}
                placeholder="Add private staff notes..."
                className="w-full p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
              />
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-[#2A2A2A] flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrintInvoice}
                className="h-10 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs font-semibold text-[#F8F6F3] rounded-[8px] flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#C8A45D]" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md"
              >
                Close Manager
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
