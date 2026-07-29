"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  Crown,
  Edit2,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  Sparkles,
  X,
  Loader2,
  DollarSign,
  UserCheck,
  Award,
  Calendar,
  Grid,
  List,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

const INITIAL_CUSTOMERS = [
  {
    id: "cust-1",
    name: "Alexander Vance",
    email: "alexander@vance.com",
    phone: "+1 (555) 234-5678",
    avatar: "AV",
    tier: "Gold Tier",
    segment: "VIP Customer",
    status: "Active",
    registrationDate: "July 12, 2026",
    lifetimeSpend: 1420,
    totalOrders: 3,
    avgOrderValue: 473.33,
    wishlistCount: 4,
    favoriteCategory: "Co-Ord Sets",
    address: {
      street: "742 Evergreen Terrace, Suite 4B",
      city: "New York",
      state: "NY",
      pincode: "10001",
      country: "United States",
    },
    notes: "Prefers express delivery. High repeat buyer for co-ord sets.",
    timeline: [
      { date: "July 24, 2026", text: "Placed Order #GOR-892401 ($900)" },
      { date: "July 18, 2026", text: "Added 2 garments to Wishlist" },
      { date: "July 12, 2026", text: "Registered account via Google Sign-In" },
    ],
  },
  {
    id: "cust-2",
    name: "Marcus Sterling",
    email: "marcus@sterling.com",
    phone: "+1 (555) 987-6543",
    avatar: "MS",
    tier: "Silver Tier",
    segment: "Returning Customer",
    status: "Active",
    registrationDate: "June 05, 2026",
    lifetimeSpend: 980,
    totalOrders: 2,
    avgOrderValue: 490,
    wishlistCount: 2,
    favoriteCategory: "Co-Ord Sets",
    address: {
      street: "1200 Wilshire Blvd, Apt 12A",
      city: "Los Angeles",
      state: "CA",
      pincode: "90017",
      country: "United States",
    },
    notes: "Interested in technical outerwear releases.",
    timeline: [
      { date: "July 24, 2026", text: "Placed Order #GOR-892402 ($520)" },
      { date: "June 05, 2026", text: "Registered account" },
    ],
  },
  {
    id: "cust-3",
    name: "Julian Thorne",
    email: "julian@thorne.com",
    phone: "+44 20 7946 0912",
    avatar: "JT",
    tier: "Platinum Tier",
    segment: "VIP Customer",
    status: "Active",
    registrationDate: "May 14, 2026",
    lifetimeSpend: 2850,
    totalOrders: 5,
    avgOrderValue: 570,
    wishlistCount: 6,
    favoriteCategory: "Outerwear",
    address: {
      street: "45 Regent Street, Flat 3",
      city: "London",
      state: "Greater London",
      pincode: "W1B 4BH",
      country: "United Kingdom",
    },
    notes: "Platinum Tier member. Priority international customer.",
    timeline: [
      { date: "July 23, 2026", text: "Placed Order #GOR-892403 ($1,350)" },
      { date: "June 10, 2026", text: "Redeemed 1,000 Points for Store Credit" },
    ],
  },
  {
    id: "cust-4",
    name: "Dominic Croft",
    email: "dominic@croft.com",
    phone: "+1 (555) 443-2109",
    avatar: "DC",
    tier: "Silver Tier",
    segment: "New Customer",
    status: "Active",
    registrationDate: "July 22, 2026",
    lifetimeSpend: 180,
    totalOrders: 1,
    avgOrderValue: 180,
    wishlistCount: 1,
    favoriteCategory: "Shirts",
    address: {
      street: "88 North Michigan Ave",
      city: "Chicago",
      state: "IL",
      pincode: "60611",
      country: "United States",
    },
    notes: "",
    timeline: [{ date: "July 23, 2026", text: "Placed Order #GOR-892404 ($180)" }],
  },
];

export default function CustomerCRMPage() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [searchQuery, setSearchQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSegment = segmentFilter === "all" || c.segment.toLowerCase().includes(segmentFilter.toLowerCase());
      return matchSearch && matchSegment;
    });
  }, [customers, searchQuery, segmentFilter]);

  // Open 360 Profile Modal
  const handleOpenProfile = (cust) => {
    setActiveCustomer({ ...cust });
    setShowProfileModal(true);
  };

  // Save Notes Handler
  const handleSaveNotes = (notesText) => {
    if (!activeCustomer) return;
    const updated = { ...activeCustomer, notes: notesText };
    setActiveCustomer(updated);
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    success("Notes Saved", "Internal customer notes updated.");
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "ID,Name,Email,Phone,Tier,Segment,Lifetime_Spend,Orders\n";
        const rows = customers
          .map((c) => `${c.id},"${c.name}",${c.email},${c.phone},${c.tier},"${c.segment}",${c.lifetimeSpend},${c.totalOrders}`)
          .join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_Customers_CRM_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("CSV Exported", "Customers CRM report downloaded successfully.");
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
                <Users className="w-4 h-4" /> CLIENT RELATIONS ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Customer Relationship Management (CRM)
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
                <span>Export Customers CSV</span>
              </button>
            </div>
          </div>

          {/* CRM Metric Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Active Customers</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">1,840</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">VIP Tier Members</span>
              <span className="font-editorial text-2xl text-[#C8A45D]">240</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Avg Customer Value</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">$1,420</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Repeat Buyer Rate</span>
              <span className="font-editorial text-2xl text-emerald-400">42.5%</span>
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
                  placeholder="Search by name, email, or phone..."
                  className="w-full h-10 pl-10 pr-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
              >
                <option value="all">All Segments</option>
                <option value="vip">VIP Customers</option>
                <option value="returning">Returning Customers</option>
                <option value="new">New Customers</option>
              </select>
            </div>

            <div className="flex bg-[#090909] border border-[#2A2A2A] rounded-[8px] p-1 gap-1">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded ${viewMode === "table" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── CUSTOMER TABLE / GRID VIEW ── */}
          {viewMode === "table" ? (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                    <th className="py-3.5 px-4 font-bold">Customer</th>
                    <th className="py-3.5 px-4 font-bold">Tier</th>
                    <th className="py-3.5 px-4 font-bold">Segment</th>
                    <th className="py-3.5 px-4 font-bold">Orders</th>
                    <th className="py-3.5 px-4 font-bold">Lifetime Spend</th>
                    <th className="py-3.5 px-4 font-bold">Joined</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#090909]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#F8F6F3] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#090909] border border-[#C8A45D] text-[#C8A45D] font-editorial text-xs font-bold flex items-center justify-center shrink-0">
                          {c.avatar}
                        </div>
                        <div>
                          <span className="block">{c.name}</span>
                          <span className="text-[11px] text-[#8E8A85] font-light">{c.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#C8A45D] font-bold">{c.tier}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[9.5px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {c.segment}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#F8F6F3]">{c.totalOrders} orders</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C8A45D]">${c.lifetimeSpend.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{c.registrationDate}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenProfile(c)}
                          className="px-3 py-1.5 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] text-xs font-semibold rounded-[6px] transition-colors cursor-pointer"
                        >
                          360° Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {filteredCustomers.map((c) => (
                <div key={c.id} className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-5 space-y-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#090909] border-2 border-[#C8A45D] text-[#C8A45D] font-editorial text-base font-bold flex items-center justify-center">
                      {c.avatar}
                    </div>
                    <div>
                      <h4 className="font-editorial text-lg text-[#F8F6F3]">{c.name}</h4>
                      <span className="text-xs text-[#C8A45D] font-mono font-bold block">{c.tier}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[#8E8A85] font-light">
                    <p>{c.email}</p>
                    <p>{c.phone}</p>
                  </div>

                  <div className="pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-[#C8A45D]">${c.lifetimeSpend} Spend</span>
                    <button type="button" onClick={() => handleOpenProfile(c)} className="px-3 py-1 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] rounded-[6px]">
                      Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </Container>
      </main>

      {/* ── 360° CUSTOMER PROFILE MODAL ── */}
      {showProfileModal && activeCustomer && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans select-none">
            
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#090909] border-2 border-[#C8A45D] text-[#C8A45D] font-editorial text-xl font-bold flex items-center justify-center shadow-lg">
                  {activeCustomer.avatar}
                </div>
                <div>
                  <h3 className="font-editorial text-2xl text-[#F8F6F3]">{activeCustomer.name}</h3>
                  <span className="text-xs text-[#C8A45D] font-mono font-bold">{activeCustomer.tier} • Joined {activeCustomer.registrationDate}</span>
                </div>
              </div>
              <button type="button" onClick={() => setShowProfileModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Financial & Engagement Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
                <span className="text-[10px] uppercase text-[#8E8A85] block">Lifetime Spend</span>
                <span className="font-editorial text-2xl text-[#C8A45D]">${activeCustomer.lifetimeSpend}</span>
              </div>
              <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
                <span className="text-[10px] uppercase text-[#8E8A85] block">Total Orders</span>
                <span className="font-editorial text-2xl text-[#F8F6F3]">{activeCustomer.totalOrders}</span>
              </div>
              <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
                <span className="text-[10px] uppercase text-[#8E8A85] block">Average Order Value</span>
                <span className="font-editorial text-2xl text-[#F8F6F3]">${activeCustomer.avgOrderValue.toFixed(0)}</span>
              </div>
              <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
                <span className="text-[10px] uppercase text-[#8E8A85] block">Wishlist Items</span>
                <span className="font-editorial text-2xl text-emerald-400">{activeCustomer.wishlistCount}</span>
              </div>
            </div>

            {/* Default Address & Contact */}
            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-1 text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#C8A45D] font-bold block mb-1">
                DEFAULT SHIPPING ADDRESS
              </span>
              <p className="text-[#8E8A85] font-light leading-relaxed">
                {activeCustomer.address.street}<br />
                {activeCustomer.address.city}, {activeCustomer.address.state} {activeCustomer.address.pincode}<br />
                {activeCustomer.address.country}
              </p>
            </div>

            {/* Customer Activity Timeline */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C8A45D] font-bold block">
                CUSTOMER ACTIVITY TIMELINE
              </span>
              <div className="divide-y divide-[#2A2A2A] bg-[#090909] border border-[#2A2A2A] rounded-[14px] p-4">
                {activeCustomer.timeline.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between text-xs font-sans">
                    <span className="text-[#F8F6F3]">{item.text}</span>
                    <span className="text-[10px] font-mono text-[#8E8A85]">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Internal Notes */}
            <div className="space-y-2">
              <label className="text-xs text-[#8E8A85] block font-medium">Internal CRM Notes</label>
              <textarea
                rows={2}
                defaultValue={activeCustomer.notes}
                onBlur={(e) => handleSaveNotes(e.target.value)}
                placeholder="Add confidential customer notes..."
                className="w-full p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
              />
            </div>

            <div className="pt-4 border-t border-[#2A2A2A] flex justify-end">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
