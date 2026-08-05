"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Truck,
  ShieldCheck,
  Download,
  Settings,
  LayoutDashboard,
  Eye,
  EyeOff,
  Check,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Award,
  AlertCircle,
  X,
  Share2,
  Bell,
  Lock,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CartDrawer from "@/components/ui/CartDrawer";
import ProductCard from "@/components/ui/ProductCard";
import { Container } from "@/components/ui/Section";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import LoyaltyDashboard from "@/components/loyalty/LoyaltyDashboard";
import OrderTrackingView from "@/components/orders/OrderTrackingView";

// Sidebar & Mobile Tabs Navigation Definition
const ACCOUNT_TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Saved Wishlist", icon: Heart },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "profile", label: "Profile & Settings", icon: User },
  { id: "rewards", label: "Atelier Rewards", icon: Award },
];

// Sample Orders Dataset for fallback
const SAMPLE_ORDERS = [
  {
    orderId: "GOR-892401",
    date: "July 24, 2026",
    status: "Preparing",
    statusBadgeColor: "bg-[#C9A86A]/15 text-[#C9A86A] border-[#C9A86A]/30",
    total: 900,
    itemsCount: 2,
    eta: "July 28, 2026",
    items: [
      {
        id: "p-1",
        name: "GOR Alo Burgundy Heavyweight Co-Ord Set",
        size: "L",
        color: "Burgundy",
        qty: 1,
        price: 380,
        image: "/images/products/gor-codset-burgundy-alo.webp",
      },
      {
        id: "p-2",
        name: "Prada Desert Sand Textured Zip Set",
        size: "M",
        color: "Desert Sand",
        qty: 1,
        price: 520,
        image: "/images/products/gor-codset-beige-prada.webp",
      },
    ],
  },
  {
    orderId: "GOR-771092",
    date: "June 12, 2026",
    status: "Delivered",
    statusBadgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    total: 240,
    itemsCount: 1,
    eta: "June 15, 2026",
    items: [
      {
        id: "p-3",
        name: "GOR Designer Camp Shirting",
        size: "L",
        color: "Black",
        qty: 1,
        price: 240,
        image: "/images/lookbook/gor-lookbook-2.webp",
      },
    ],
  },
];

// Default Saved Addresses Dataset
const INITIAL_ADDRESSES = [
  {
    id: "addr-1",
    tag: "Home",
    isDefault: true,
    fullName: "Marcus Vance",
    flat: "Apt 14B, Skyline Towers",
    street: "740 Park Avenue",
    landmark: "Near Central Park",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "+91 98765 43210",
  },
  {
    id: "addr-2",
    tag: "Studio / Office",
    isDefault: false,
    fullName: "Marcus Vance",
    flat: "Suite 402, Design Quarter",
    street: "Bandra Kurla Complex",
    landmark: "Opposite Financial Center",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400051",
    phone: "+91 98765 43210",
  },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, authLoading, logout } = useAuth();
  const { wishlist, addToCart } = useCart();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(SAMPLE_ORDERS[0]);
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState(null);
  const [addrForm, setAddrForm] = useState({
    tag: "Home",
    fullName: "Marcus Vance",
    flat: "",
    street: "",
    landmark: "",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "",
    phone: "+91 98765 43210",
  });

  // Profile Settings Form State
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "+91 98765 43210",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    smsNotifications: true,
    marketingConsent: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Wishlist state
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Live Orders State
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);

  // Authenticate user
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    } else if (user) {
      setProfileForm((prev) => ({
        ...prev,
        fullName: user.name || "Marcus Vance",
        email: user.email || "marcus.vance@gor.com",
      }));
    }
  }, [authLoading, user, router]);

  // Fetch Wishlist products
  useEffect(() => {
    if (activeTab !== "wishlist" || wishlist.length === 0) return;
    setLoadingWishlist(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${baseUrl}/api/products`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setWishlistProducts(data.data.filter((p) => wishlist.includes(p.id || p._id)));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingWishlist(false));
  }, [activeTab, wishlist]);

  // Fetch Customer Orders from API
  useEffect(() => {
    if (!user?.email) return;
    setLoadingOrders(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${baseUrl}/api/orders?search=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const formatted = data.data.map((o) => ({
            orderId: o.orderNo || o.id,
            date: new Date(o.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            status: o.status || "Pending",
            statusBadgeColor:
              o.status === "Delivered" || o.status === "Fulfilled"
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : o.status === "Cancelled"
                ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                : "bg-[#C9A86A]/15 text-[#C9A86A] border-[#C9A86A]/30",
            total: o.totalAmount,
            itemsCount: (o.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0),
            eta: new Date(new Date(o.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            items: (o.items || []).map((item) => ({
              id: item.productId || item._id,
              name: item.name,
              size: item.size || "Standard",
              qty: item.quantity || 1,
              price: item.price,
              image: item.image || "/images/products/gor-codset-burgundy-alo.webp",
            })),
          }));
          setUserOrders(formatted);
          setSelectedOrder(formatted[0]);
        }
      })
      .catch((err) => console.warn("Orders fetch fallback:", err))
      .finally(() => setLoadingOrders(false));
  }, [user]);

  const displayOrders = userOrders.length > 0 ? userOrders : SAMPLE_ORDERS;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleInvoiceDownload = () => {
    window.print();
  };

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item, item.qty, item.size);
    });
    showToast(`Items from order ${order.orderId} added to your bag.`);
  };

  // Add/Edit Address Form Submit
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addrForm.fullName || !addrForm.flat || !addrForm.pincode) return;

    if (editingAddrId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddrId ? { ...a, ...addrForm } : a))
      );
      showToast("Address updated successfully.");
    } else {
      const newObj = {
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0,
        ...addrForm,
      };
      setAddresses((prev) => [newObj, ...prev]);
      showToast("New delivery address added.");
    }

    setShowAddressModal(false);
    setEditingAddrId(null);
  };

  const handleEditAddress = (addr) => {
    setEditingAddrId(addr.id);
    setAddrForm({ ...addr });
    setShowAddressModal(true);
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    showToast("Default address updated.");
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast("Address removed.");
  };

  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: "My GOR Menswear Wishlist",
        text: "Check out my saved luxury menswear garments at GOR Atelier.",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Wishlist link copied to clipboard.");
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center select-none">
        <div className="w-10 h-10 border-2 border-[#C9A86A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MV";

  // Account Completion Percentage
  const accountCompletion = Math.min(
    100,
    (user.name ? 25 : 0) + (user.email ? 25 : 0) + (addresses.length > 0 ? 25 : 0) + (displayOrders.length > 0 ? 25 : 0)
  );

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#0B0B0B] text-[#F7F5F2] pt-24 pb-24 select-none">
        
        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-6 z-[180] bg-[#C9A86A] text-[#0B0B0B] px-5 py-3 rounded-xl font-sans text-xs font-bold shadow-2xl flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Container className="max-w-[1400px]">

          {/* ── 1. MATTE BLACK & GOLD LUXURY ACCOUNT HERO CARD ── */}
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A86A]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0B0B0B] border-2 border-[#C9A86A] text-[#C9A86A] font-serif text-2xl font-bold flex items-center justify-center shadow-xl shrink-0">
                  {userInitials}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-[0.25em] bg-[#C9A86A]/15 text-[#C9A86A] border border-[#C9A86A]/40 px-2.5 py-0.5 rounded-full font-bold">
                      GOR ATELIER VIP MEMBER
                    </span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#F7F5F2]">
                    Welcome, {user.name}
                  </h1>
                  <p className="font-sans text-xs text-[#B8B6B0] font-light mt-0.5">
                    {user.email} • Client ID: <strong className="text-[#F7F5F2]">GOR-VIP-882</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] hover:border-rose-500/50 text-[#B8B6B0] hover:text-rose-400 font-sans text-xs uppercase tracking-wider font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Account Completion Progress Bar */}
            <div className="mt-6 pt-5 border-t border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-sans text-[#B8B6B0]">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>Account Profile Completion: <strong className="text-[#C9A86A]">{accountCompletion}%</strong></span>
              </div>
              <div className="w-full sm:w-64 h-1.5 bg-[#0B0B0B] rounded-full overflow-hidden border border-[#2A2A2A]">
                <div className="h-full bg-[#C9A86A] rounded-full" style={{ width: `${accountCompletion}%` }} />
              </div>
            </div>
          </div>

          {/* ── 2. MOBILE HORIZONTAL NAVIGATION TABS ── */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {ACCOUNT_TABS.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#C9A86A] text-[#0B0B0B] shadow-md"
                      : "bg-[#111111] text-[#B8B6B0] border border-[#2A2A2A]"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── 3. MAIN 2-COLUMN GRID (SIDEBAR LEFT 25% / CONTENT RIGHT 75%) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* DESKTOP LEFT SIDEBAR */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-3 space-y-1 sticky top-28 shadow-xl">
                {ACCOUNT_TABS.map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-sans font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#C9A86A]/15 text-[#C9A86A] border-l-4 border-[#C9A86A] shadow-sm"
                          : "text-[#B8B6B0] hover:text-[#F7F5F2] hover:bg-[#0B0B0B]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className={`w-4 h-4 ${isActive ? "text-[#C9A86A]" : "text-[#B8B6B0]"}`} />
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-[#C9A86A]" : "opacity-30"}`} />
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* RIGHT CONTENT PANEL */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  
                  {/* ── TAB 1: DASHBOARD OVERVIEW ── */}
                  {activeTab === "dashboard" && (
                    <div className="space-y-8">
                      {/* Metric Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-5 bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A]/40 rounded-2xl space-y-2 transition-all hover:-translate-y-1 shadow-lg">
                          <Package className="w-5 h-5 text-[#C9A86A]" />
                          <span className="font-serif text-3xl font-normal text-[#F7F5F2] block">
                            {displayOrders.length}
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-wider text-[#B8B6B0] font-bold block">
                            Total Orders
                          </span>
                        </div>

                        <div className="p-5 bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A]/40 rounded-2xl space-y-2 transition-all hover:-translate-y-1 shadow-lg">
                          <Heart className="w-5 h-5 text-[#C9A86A]" />
                          <span className="font-serif text-3xl font-normal text-[#F7F5F2] block">
                            {wishlist.length}
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-wider text-[#B8B6B0] font-bold block">
                            Wishlist Items
                          </span>
                        </div>

                        <div className="p-5 bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A]/40 rounded-2xl space-y-2 transition-all hover:-translate-y-1 shadow-lg">
                          <MapPin className="w-5 h-5 text-[#C9A86A]" />
                          <span className="font-serif text-3xl font-normal text-[#F7F5F2] block">
                            {addresses.length}
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-wider text-[#B8B6B0] font-bold block">
                            Saved Addresses
                          </span>
                        </div>

                        <div className="p-5 bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A]/40 rounded-2xl space-y-2 transition-all hover:-translate-y-1 shadow-lg">
                          <Award className="w-5 h-5 text-[#C9A86A]" />
                          <span className="font-serif text-3xl font-normal text-[#C9A86A] block">
                            Gold
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-wider text-[#B8B6B0] font-bold block">
                            Atelier Status
                          </span>
                        </div>
                      </div>

                      {/* Recent Order Preview */}
                      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                        <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
                          <h3 className="font-serif text-2xl font-normal text-[#F7F5F2]">Most Recent Order</h3>
                          <button
                            type="button"
                            onClick={() => setActiveTab("orders")}
                            className="font-sans text-xs uppercase tracking-wider text-[#C9A86A] hover:underline font-bold cursor-pointer"
                          >
                            View Order History →
                          </button>
                        </div>

                        {displayOrders.slice(0, 1).map((order) => (
                          <div key={order.orderId} className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl p-5 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2A2A] pb-3">
                              <div>
                                <span className="font-mono text-sm font-bold text-[#F7F5F2] block">{order.orderId}</span>
                                <span className="font-sans text-[11px] text-[#B8B6B0]">Placed on {order.date}</span>
                              </div>
                              <span className={`font-sans text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border ${order.statusBadgeColor}`}>
                                {order.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="relative w-14 aspect-[3/4] rounded-lg overflow-hidden border border-[#2A2A2A] shrink-0 bg-[#0B0B0B]">
                                <Image src={order.items[0].image} alt={order.items[0].name} fill unoptimized className="object-cover object-top" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif text-sm text-[#F7F5F2] truncate">{order.items[0].name}</h4>
                                <p className="font-sans text-xs text-[#B8B6B0]">Total: <strong className="text-[#C9A86A]">{formatPrice(order.total)}</strong> • {order.itemsCount} item(s)</p>
                              </div>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#2A2A2A]">
                              <button
                                type="button"
                                onClick={() => handleReorder(order)}
                                className="px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#F7F5F2] font-sans text-xs uppercase tracking-wider font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-[#C9A86A]" /> Reorder
                              </button>
                              <Link
                                href={`/order-confirmation/${order.orderId}`}
                                className="px-5 py-2 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-wider font-bold rounded-xl hover:bg-[#D4B57C] transition-colors cursor-pointer"
                              >
                                Track & Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB 2: MY ORDERS ── */}
                  {activeTab === "orders" && (
                    <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                      <div className="border-b border-[#2A2A2A] pb-4">
                        <h3 className="font-serif text-2xl font-normal text-[#F7F5F2]">Order History</h3>
                        <p className="font-sans text-xs text-[#B8B6B0] font-light mt-0.5">Track, review, or reorder past purchases</p>
                      </div>

                      {displayOrders.length === 0 ? (
                        <div className="text-center py-16 space-y-4">
                          <Package className="w-12 h-12 text-[#C9A86A]/40 mx-auto" />
                          <h4 className="font-serif text-2xl font-normal text-[#F7F5F2]">No Orders Found</h4>
                          <p className="font-sans text-xs text-[#B8B6B0] font-light max-w-xs mx-auto">
                            Your order history will appear here once you place your first purchase.
                          </p>
                          <Link href="/shop" className="inline-block px-8 py-3.5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl">
                            Explore Collections
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {displayOrders.map((order) => (
                            <div key={order.orderId} className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl p-5 space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2A2A] pb-3">
                                <div>
                                  <span className="font-mono text-sm font-bold text-[#F7F5F2] block">{order.orderId}</span>
                                  <span className="font-sans text-[11px] text-[#B8B6B0]">Placed on {order.date}</span>
                                </div>
                                <span className={`font-sans text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border ${order.statusBadgeColor}`}>
                                  {order.status}
                                </span>
                              </div>

                              <div className="space-y-3">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <div className="relative w-12 aspect-[3/4] rounded-md overflow-hidden border border-[#2A2A2A] shrink-0 bg-[#0B0B0B]">
                                      <Image src={item.image} alt={item.name} fill unoptimized className="object-cover object-top" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-serif text-xs text-[#F7F5F2] truncate">{item.name}</h4>
                                      <span className="font-sans text-[10px] text-[#B8B6B0]">Size: {item.size} | Qty: {item.qty}</span>
                                    </div>
                                    <span className="font-sans text-xs font-bold text-[#C9A86A] price-display">{formatPrice(item.price)}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-3 border-t border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <span className="font-sans text-[10px] text-[#B8B6B0] uppercase block">Total Amount</span>
                                  <span className="font-sans text-sm font-bold text-[#C9A86A] price-display">{formatPrice(order.total)}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleReorder(order)}
                                    className="px-3.5 py-2 bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#F7F5F2] font-sans text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5 text-[#C9A86A]" /> Reorder
                                  </button>
                                  <Link
                                    href={`/order-confirmation/${order.orderId}`}
                                    className="px-4 py-2 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-wider font-bold rounded-xl hover:bg-[#D4B57C] transition-colors cursor-pointer"
                                  >
                                    Track Status
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={handleInvoiceDownload}
                                    className="px-3 py-2 bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#B8B6B0] hover:text-[#C9A86A] font-sans text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5" /> Invoice
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TAB 3: WISHLIST ── */}
                  {activeTab === "wishlist" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl">
                        <div>
                          <h3 className="font-serif text-2xl font-normal text-[#F7F5F2]">Saved Wishlist ({wishlist.length})</h3>
                          <p className="font-sans text-xs text-[#B8B6B0] font-light mt-0.5">Your personal curated collection of favorite garments</p>
                        </div>
                        {wishlist.length > 0 && (
                          <button
                            type="button"
                            onClick={handleShareWishlist}
                            className="px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#C9A86A] font-sans text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Share
                          </button>
                        )}
                      </div>

                      {wishlist.length === 0 ? (
                        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-16 text-center space-y-4 shadow-xl">
                          <Heart className="w-12 h-12 text-[#C9A86A]/40 mx-auto" />
                          <h4 className="font-serif text-2xl font-normal text-[#F7F5F2]">Your Wishlist is Empty</h4>
                          <p className="font-sans text-xs text-[#B8B6B0] font-light max-w-xs mx-auto">
                            Save items you love by clicking the heart icon on any garment card.
                          </p>
                          <Link href="/shop" className="inline-block px-8 py-3.5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl">
                            Browse Collection
                          </Link>
                        </div>
                      ) : loadingWishlist ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-[#111111] rounded-2xl animate-pulse" />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                          {wishlistProducts.map((p) => (
                            <ProductCard key={p.id || p._id} product={p} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TAB 4: SAVED ADDRESSES ── */}
                  {activeTab === "addresses" && (
                    <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                      <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
                        <div>
                          <h3 className="font-serif text-2xl font-normal text-[#F7F5F2]">Saved Addresses</h3>
                          <p className="font-sans text-xs text-[#B8B6B0] font-light mt-0.5">Manage express delivery destinations</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddrId(null);
                            setAddrForm({
                              tag: "Home",
                              fullName: user.name || "Marcus Vance",
                              flat: "",
                              street: "",
                              landmark: "",
                              city: "Mumbai",
                              state: "Maharashtra",
                              pincode: "",
                              phone: "+91 98765 43210",
                            });
                            setShowAddressModal(true);
                          }}
                          className="px-4 py-2.5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#D4B57C] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Plus className="w-4 h-4" /> Add New Address
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div key={addr.id} className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl p-5 space-y-3 relative">
                            <div className="flex justify-between items-center">
                              <span className="font-sans text-[10px] font-bold uppercase tracking-wider bg-[#C9A86A]/15 text-[#C9A86A] px-2.5 py-0.5 rounded border border-[#C9A86A]/30">
                                {addr.tag}
                              </span>
                              {addr.isDefault && (
                                <span className="font-sans text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                  Default Address
                                </span>
                              )}
                            </div>

                            <div>
                              <h4 className="font-sans text-xs font-bold text-[#F7F5F2]">{addr.fullName}</h4>
                              <p className="font-sans text-xs text-[#B8B6B0] font-light leading-relaxed mt-1">
                                {addr.flat}, {addr.street}, {addr.city} — {addr.pincode}
                              </p>
                              <p className="font-sans text-xs text-[#B8B6B0] mt-1 font-mono">{addr.phone}</p>
                            </div>

                            <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-xs">
                              {!addr.isDefault ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-[#C9A86A] hover:underline font-bold cursor-pointer"
                                >
                                  Set as Default
                                </button>
                              ) : <span />}

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleEditAddress(addr)}
                                  className="text-[#B8B6B0] hover:text-[#C9A86A] cursor-pointer"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="text-[#B8B6B0] hover:text-rose-400 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB 5: PROFILE & SETTINGS ── */}
                  {activeTab === "profile" && (
                    <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                      <div className="border-b border-[#2A2A2A] pb-4">
                        <h3 className="font-serif text-2xl font-normal text-[#F7F5F2]">Profile Credentials & Security</h3>
                        <p className="font-sans text-xs text-[#B8B6B0] font-light mt-0.5">Manage personal information and notification preferences</p>
                      </div>

                      <form onSubmit={(e) => { e.preventDefault(); showToast("Profile settings saved successfully."); }} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">Full Name</label>
                            <input
                              type="text"
                              value={profileForm.fullName}
                              onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] focus:outline-none font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">Mobile Phone</label>
                            <input
                              type="tel"
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] focus:outline-none font-sans"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">Email Address</label>
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                            className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] focus:outline-none font-sans"
                          />
                        </div>

                        {/* Password Change */}
                        <div className="pt-4 border-t border-[#2A2A2A] space-y-4">
                          <h4 className="text-xs uppercase tracking-wider text-[#C9A86A] font-bold">Password Security</h4>
                          <div className="relative">
                            <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">New Password</label>
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Leave blank to keep current password"
                              value={profileForm.newPassword}
                              onChange={(e) => setProfileForm((p) => ({ ...p, newPassword: e.target.value }))}
                              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] focus:outline-none pr-10 font-sans"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-8 text-[#B8B6B0] hover:text-[#C9A86A]"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Notification Preferences */}
                        <div className="pt-4 border-t border-[#2A2A2A] space-y-3">
                          <h4 className="text-xs uppercase tracking-wider text-[#C9A86A] font-bold">Notification & Communication</h4>
                          <label className="flex items-center justify-between text-xs text-[#F7F5F2] font-semibold cursor-pointer">
                            <span>Order Status Email Dispatch Updates</span>
                            <input
                              type="checkbox"
                              checked={profileForm.emailNotifications}
                              onChange={(e) => setProfileForm((p) => ({ ...p, emailNotifications: e.target.checked }))}
                              className="accent-[#C9A86A] w-4 h-4 cursor-pointer"
                            />
                          </label>
                          <label className="flex items-center justify-between text-xs text-[#F7F5F2] font-semibold cursor-pointer">
                            <span>SMS & WhatsApp Delivery Notifications</span>
                            <input
                              type="checkbox"
                              checked={profileForm.smsNotifications}
                              onChange={(e) => setProfileForm((p) => ({ ...p, smsNotifications: e.target.checked }))}
                              className="accent-[#C9A86A] w-4 h-4 cursor-pointer"
                            />
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="px-8 py-3.5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#D4B57C] transition-colors cursor-pointer shadow-lg active:scale-95"
                        >
                          Save Credentials & Settings
                        </button>
                      </form>
                    </div>
                  )}

                  {/* ── TAB 6: ATELIER REWARDS & MEMBERSHIP ── */}
                  {activeTab === "rewards" && <LoyaltyDashboard />}

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </Container>
      </main>

      {/* Add / Edit Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl text-[#F7F5F2] font-sans"
            >
              <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
                <h3 className="font-serif text-2xl font-normal">
                  {editingAddrId ? "Edit Delivery Address" : "Add New Delivery Address"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="w-8 h-8 rounded-full bg-[#0B0B0B] border border-[#2A2A2A] text-[#B8B6B0] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1">Address Label (Tag)</label>
                  <select
                    value={addrForm.tag}
                    onChange={(e) => setAddrForm((p) => ({ ...p, tag: e.target.value }))}
                    className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] px-3 py-2 text-xs rounded-xl text-[#F7F5F2]"
                  >
                    <option value="Home">Home</option>
                    <option value="Studio / Office">Studio / Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.fullName}
                    onChange={(e) => setAddrForm((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] px-3 py-2 text-xs rounded-xl text-[#F7F5F2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1">House / Flat *</label>
                    <input
                      type="text"
                      required
                      value={addrForm.flat}
                      onChange={(e) => setAddrForm((p) => ({ ...p, flat: e.target.value }))}
                      className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] px-3 py-2 text-xs rounded-xl text-[#F7F5F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1">Street / Area</label>
                    <input
                      type="text"
                      value={addrForm.street}
                      onChange={(e) => setAddrForm((p) => ({ ...p, street: e.target.value }))}
                      className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] px-3 py-2 text-xs rounded-xl text-[#F7F5F2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1">City</label>
                    <input
                      type="text"
                      value={addrForm.city}
                      onChange={(e) => setAddrForm((p) => ({ ...p, city: e.target.value }))}
                      className="w-full bg-[#0B0B0B] border border-[#2A2A2A] px-3 py-2 text-xs rounded-xl text-[#F7F5F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1">State</label>
                    <input
                      type="text"
                      value={addrForm.state}
                      onChange={(e) => setAddrForm((p) => ({ ...p, state: e.target.value }))}
                      className="w-full bg-[#0B0B0B] border border-[#2A2A2A] px-3 py-2 text-xs rounded-xl text-[#F7F5F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={addrForm.pincode}
                      onChange={(e) => setAddrForm((p) => ({ ...p, pincode: e.target.value }))}
                      className="w-full bg-[#0B0B0B] border border-[#2A2A2A] px-3 py-2 text-xs rounded-xl text-[#F7F5F2] font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2A2A2A] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-5 py-2.5 bg-[#0B0B0B] border border-[#2A2A2A] text-[#B8B6B0] text-xs font-bold uppercase rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C9A86A] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
