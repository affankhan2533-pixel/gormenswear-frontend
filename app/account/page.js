"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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


// Sidebar tabs definition
const SIDEBAR_TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "loyalty", label: "Rewards & Membership", icon: Award },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "tracking", label: "Order Tracking", icon: Truck },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Account Settings", icon: Settings },
];


// Sample Orders dataset for realistic demonstration
const SAMPLE_ORDERS = [
  {
    orderId: "GOR-892401",
    date: "July 24, 2026",
    status: "Preparing",
    statusBadgeColor: "bg-[#C8A45D]/15 text-[#C8A45D] border-[#C8A45D]/30",
    total: 900,
    itemsCount: 2,
    eta: "July 28, 2026",
    items: [
      {
        name: "GOR Alo Burgundy Heavyweight Co-Ord Set",
        size: "L",
        qty: 1,
        price: 380,
        image: "/images/products/gor-codset-burgundy-alo.webp",
      },
      {
        name: "Prada Desert Sand Textured Zip Set",
        size: "M",
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
        name: "GOR Designer Camp Shirting",
        size: "L",
        qty: 1,
        price: 240,
        image: "/images/lookbook/gor-lookbook-2.webp",
      },
    ],
  },
];

// Default Saved Addresses dataset
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
  const { wishlist } = useCart();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(SAMPLE_ORDERS[0]);
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    tag: "Home",
    fullName: "",
    flat: "",
    street: "",
    landmark: "",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "",
    phone: "",
  });

  // Account Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    fullName: "",
    email: "",
    phone: "+91 98765 43210",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Wishlist state
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Live Customer Orders State
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Redirect unauthenticated user
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    } else if (user) {
      setSettingsForm((prev) => ({
        ...prev,
        fullName: user.name || "Marcus Vance",
        email: user.email || "marcus.vance@gor.com",
      }));
    }
  }, [authLoading, user, router]);

  // Fetch Wishlist Items
  useEffect(() => {
    if (activeTab !== "wishlist" || wishlist.length === 0) return;
    setLoadingWishlist(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${baseUrl}/api/products`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setWishlistProducts(data.data.filter((p) => wishlist.includes(p.id)));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingWishlist(false));
  }, [activeTab, wishlist]);

  // Fetch Live Customer Orders from MongoDB
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
                : "bg-[#C8A45D]/15 text-[#C8A45D] border-[#C8A45D]/30",
            total: o.totalAmount,
            itemsCount: (o.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0),
            eta: new Date(new Date(o.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            items: (o.items || []).map((item) => ({
              name: item.name,
              size: "Standard",
              qty: item.quantity || 1,
              price: item.price,
              image: item.image || "/images/lookbook/gor-lookbook-1.webp",
            })),
          }));
          setUserOrders(formatted);
          setSelectedOrder(formatted[0]);
        }
      })
      .catch((err) => console.warn("Customer orders load error:", err))
      .finally(() => setLoadingOrders(false));
  }, [user]);

  const displayOrders = userOrders.length > 0 ? userOrders : SAMPLE_ORDERS;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleInvoiceDownload = () => {
    window.print();
  };

  // Add Address Handler
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddrForm.fullName || !newAddrForm.flat || !newAddrForm.pincode) return;

    const newAddrObj = {
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0,
      ...newAddrForm,
    };
    setAddresses((prev) => [newAddrObj, ...prev]);
    setShowAddressModal(false);
    setNewAddrForm({
      tag: "Home",
      fullName: "",
      flat: "",
      street: "",
      landmark: "",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "",
      phone: "",
    });
    showToast("New address added successfully.");
  };

  // Set Default Address Handler
  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    showToast("Default delivery address updated.");
  };

  // Delete Address Handler
  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast("Address deleted.");
  };

  // Save Settings Handler
  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast("Account details updated successfully.");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#C8A45D] border-t-transparent rounded-full animate-spin" />
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

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 select-none">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-[120] bg-[#C8A45D] text-[#090909] px-5 py-3 rounded-[10px] font-sans text-xs font-bold shadow-2xl flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Container>
          
          {/* ── 1. LUXURY ACCOUNT HERO CARD ── */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-6 sm:p-8 mb-10 relative overflow-hidden shadow-2xl">
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A45D]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              
              <div className="flex items-center gap-5">
                {/* Avatar with Gold Border */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#090909] border-2 border-[#C8A45D] text-[#C8A45D] font-editorial text-2xl font-bold flex items-center justify-center shadow-xl shrink-0">
                  {userInitials}
                </div>

                <div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-1">
                    WELCOME BACK
                  </span>
                  <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                    {user.name}
                  </h1>
                  <p className="font-sans text-xs text-[#8E8A85] font-light mt-0.5">
                    {user.email} • Member Since July 2026
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2.5 bg-[#090909] border border-[#2A2A2A] hover:border-rose-500/50 text-[#8E8A85] hover:text-rose-400 font-sans text-xs uppercase tracking-wider font-semibold rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

            </div>
          </div>

          {/* ── 2. MAIN 2-COLUMN GRID (SIDEBAR LEFT / CONTENT RIGHT) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ── LEFT SIDEBAR NAVIGATION ── */}
            <aside className="lg:col-span-3">
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-3 space-y-1 sticky top-28 shadow-xl">
                {SIDEBAR_TABS.map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-[10px] text-xs font-sans font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#C8A45D]/15 text-[#C8A45D] border-l-4 border-[#C8A45D] shadow-sm"
                          : "text-[#8E8A85] hover:text-[#F8F6F3] hover:bg-[#090909]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className={`w-4 h-4 ${isActive ? "text-[#C8A45D]" : "text-[#8E8A85]"}`} />
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-[#C8A45D]" : "opacity-30"}`} />
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* ── RIGHT CONTENT DISPLAY ── */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  
                  {/* ── TAB 1: DASHBOARD METRICS & RECENT ORDERS ── */}
                  {activeTab === "dashboard" && (
                    <div className="space-y-8">
                      {/* 4 Stat Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-5 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D]/40 rounded-[14px] space-y-2 transition-all hover:-translate-y-1 shadow-lg">
                          <Package className="w-5 h-5 text-[#C8A45D]" />
                          <span className="font-editorial text-2xl font-normal text-[#F8F6F3] block">
                            {SAMPLE_ORDERS.length}
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold block">
                            Total Orders
                          </span>
                        </div>

                        <div className="p-5 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D]/40 rounded-[14px] space-y-2 transition-all hover:-translate-y-1 shadow-lg">
                          <Heart className="w-5 h-5 text-[#C8A45D]" />
                          <span className="font-editorial text-2xl font-normal text-[#F8F6F3] block">
                            {wishlist.length}
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold block">
                            Saved Items
                          </span>
                        </div>

                        <div className="p-5 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D]/40 rounded-[14px] space-y-2 transition-all hover:-translate-y-1 shadow-lg">
                          <MapPin className="w-5 h-5 text-[#C8A45D]" />
                          <span className="font-editorial text-2xl font-normal text-[#F8F6F3] block">
                            {addresses.length}
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold block">
                            Saved Addresses
                          </span>
                        </div>

                        <div className="p-5 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D]/40 rounded-[14px] space-y-2 transition-all hover:-translate-y-1 shadow-lg">
                          <Award className="w-5 h-5 text-[#C8A45D]" />
                          <span className="font-editorial text-2xl font-normal text-[#C8A45D] block">
                            Gold
                          </span>
                          <span className="font-sans text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold block">
                            Membership Status
                          </span>
                        </div>
                      </div>

                      {/* Recent Orders Section */}
                      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-6 sm:p-8 space-y-6 shadow-xl">
                        <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
                          <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Recent Order</h3>
                          <button
                            type="button"
                            onClick={() => setActiveTab("orders")}
                            className="font-sans text-xs uppercase tracking-wider text-[#C8A45D] hover:underline font-semibold cursor-pointer"
                          >
                            View All Orders →
                          </button>
                        </div>

                        {displayOrders.slice(0, 1).map((order) => (
                          <div key={order.orderId} className="bg-[#090909] border border-[#2A2A2A] rounded-[14px] p-5 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2A2A] pb-3">
                              <div>
                                <span className="font-mono text-sm font-bold text-[#F8F6F3] block">{order.orderId}</span>
                                <span className="font-sans text-[11px] text-[#8E8A85]">Placed on {order.date}</span>
                              </div>
                              <span className={`font-sans text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border ${order.statusBadgeColor}`}>
                                {order.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-4">
                              <img src={order.items[0].image} alt={order.items[0].name} className="w-14 aspect-[3/4] object-cover object-top rounded-[6px] border border-[#2A2A2A]" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-editorial text-sm text-[#F8F6F3] truncate">{order.items[0].name}</h4>
                                <p className="font-sans text-xs text-[#8E8A85]">Total: <strong className="text-[#C8A45D]">{formatPrice(order.total)}</strong> • {order.itemsCount} item(s)</p>
                              </div>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#2A2A2A]">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setActiveTab("tracking");
                                }}
                                className="px-4 py-2 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px] hover:bg-[#D4B77D] transition-colors cursor-pointer"
                              >
                                Track Order
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB 2: MY ORDERS ── */}
                  {activeTab === "orders" && (
                    <div className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-6 sm:p-8 space-y-6 shadow-xl">
                      <div className="border-b border-[#2A2A2A] pb-4">
                        <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">My Orders</h3>
                        <p className="font-sans text-xs text-[#8E8A85] font-light mt-0.5">Manage and view your order history</p>
                      </div>

                      {displayOrders.length === 0 ? (
                        <div className="text-center py-16 space-y-4">
                          <Package className="w-12 h-12 text-[#C8A45D]/40 mx-auto" />
                          <h4 className="font-editorial text-xl font-normal text-[#F8F6F3]">No Orders Found</h4>
                          <p className="font-sans text-xs text-[#8E8A85] font-light max-w-xs mx-auto">
                            Your order history will appear here once you place your first order.
                          </p>
                          <Link href="/shop" className="inline-block px-6 py-2.5 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px]">
                            Explore Collections
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {displayOrders.map((order) => (
                            <div key={order.orderId} className="bg-[#090909] border border-[#2A2A2A] rounded-[14px] p-5 space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2A2A] pb-3">
                                <div>
                                  <span className="font-mono text-sm font-bold text-[#F8F6F3] block">{order.orderId}</span>
                                  <span className="font-sans text-[11px] text-[#8E8A85]">Placed on {order.date}</span>
                                </div>
                                <span className={`font-sans text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border ${order.statusBadgeColor}`}>
                                  {order.status}
                                </span>
                              </div>

                              <div className="space-y-3">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 aspect-[3/4] object-cover object-top rounded border border-[#2A2A2A]" />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-editorial text-xs text-[#F8F6F3] truncate">{item.name}</h4>
                                      <span className="font-sans text-[10px] text-[#8E8A85]">Size: {item.size} | Qty: {item.qty}</span>
                                    </div>
                                    <span className="font-sans text-xs font-bold text-[#C8A45D]">{formatPrice(item.price)}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-3 border-t border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <span className="font-sans text-[10px] text-[#8E8A85] uppercase block">Total Amount</span>
                                  <span className="font-sans text-sm font-bold text-[#C8A45D]">{formatPrice(order.total)}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setActiveTab("tracking");
                                    }}
                                    className="px-4 py-2 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px] hover:bg-[#D4B77D] transition-colors cursor-pointer"
                                  >
                                    Track Order
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleInvoiceDownload}
                                    className="px-3 py-2 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#8E8A85] hover:text-[#C8A45D] font-sans text-xs rounded-[8px] flex items-center gap-1 cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Invoice</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TAB 3: ORDER TRACKING ── */}
                  {activeTab === "tracking" && <OrderTrackingView />}


                  {/* ── TAB 4: SAVED ADDRESSES ── */}
                  {activeTab === "addresses" && (
                    <div className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-6 sm:p-8 space-y-6 shadow-xl">
                      <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
                        <div>
                          <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Saved Addresses</h3>
                          <p className="font-sans text-xs text-[#8E8A85] font-light mt-0.5">Manage delivery destinations for faster checkout</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(true)}
                          className="px-4 py-2 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px] hover:bg-[#D4B77D] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add Address
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div key={addr.id} className="bg-[#090909] border border-[#2A2A2A] rounded-[14px] p-5 space-y-3 relative">
                            <div className="flex justify-between items-center">
                              <span className="font-sans text-[10px] font-bold uppercase tracking-wider bg-[#C8A45D]/15 text-[#C8A45D] px-2.5 py-0.5 rounded border border-[#C8A45D]/30">
                                {addr.tag}
                              </span>
                              {addr.isDefault && (
                                <span className="font-sans text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                  Default
                                </span>
                              )}
                            </div>

                            <div>
                              <h4 className="font-sans text-xs font-bold text-[#F8F6F3]">{addr.fullName}</h4>
                              <p className="font-sans text-xs text-[#8E8A85] font-light leading-relaxed mt-1">
                                {addr.flat}, {addr.street}, {addr.city} — {addr.pincode}
                              </p>
                              <p className="font-sans text-xs text-[#8E8A85] mt-1">{addr.phone}</p>
                            </div>

                            <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-xs">
                              {!addr.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-[#C8A45D] hover:underline font-semibold cursor-pointer"
                                >
                                  Set as Default
                                </button>
                              )}
                              <div className="flex items-center gap-3 ml-auto text-[#8E8A85]">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="hover:text-rose-400 transition-colors cursor-pointer"
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

                  {/* ── TAB 5: WISHLIST ── */}
                  {activeTab === "wishlist" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
                        <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Saved Wishlist ({wishlist.length})</h3>
                        <Link href="/shop" className="font-sans text-xs uppercase tracking-wider text-[#C8A45D] hover:underline font-semibold">
                          Explore More →
                        </Link>
                      </div>

                      {wishlist.length === 0 ? (
                        <div className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-12 text-center space-y-4 shadow-xl">
                          <Heart className="w-12 h-12 text-[#C8A45D]/40 mx-auto" />
                          <h4 className="font-editorial text-xl font-normal text-[#F8F6F3]">Your Wishlist is Empty</h4>
                          <p className="font-sans text-xs text-[#8E8A85] font-light max-w-xs mx-auto">
                            Click the heart icon on any product to save it here for quick access later.
                          </p>
                          <Link href="/shop" className="inline-block px-6 py-2.5 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px]">
                            Browse Shop
                          </Link>
                        </div>
                      ) : loadingWishlist ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-[#151515] rounded-[12px] animate-pulse" />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                          {wishlistProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TAB 6: ACCOUNT SETTINGS ── */}
                  {activeTab === "settings" && (
                    <div className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-6 sm:p-8 space-y-6 shadow-xl">
                      <div className="border-b border-[#2A2A2A] pb-4">
                        <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Account Settings</h3>
                        <p className="font-sans text-xs text-[#8E8A85] font-light mt-0.5">Update personal credentials and security preferences</p>
                      </div>

                      <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={settingsForm.fullName}
                              onChange={(e) => setSettingsForm((p) => ({ ...p, fullName: e.target.value }))}
                              className="w-full bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] px-4 py-2.5 text-xs text-[#F8F6F3] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              value={settingsForm.phone}
                              onChange={(e) => setSettingsForm((p) => ({ ...p, phone: e.target.value }))}
                              className="w-full bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] px-4 py-2.5 text-xs text-[#F8F6F3] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={settingsForm.email}
                            onChange={(e) => setSettingsForm((p) => ({ ...p, email: e.target.value }))}
                            className="w-full bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] px-4 py-2.5 text-xs text-[#F8F6F3] focus:outline-none"
                          />
                        </div>

                        <div className="pt-4 border-t border-[#2A2A2A] space-y-4">
                          <h4 className="font-sans text-xs uppercase tracking-wider text-[#C8A45D] font-bold">Change Password</h4>
                          
                          <div className="relative">
                            <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">New Password</label>
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Leave blank to keep unchanged"
                              value={settingsForm.newPassword}
                              onChange={(e) => setSettingsForm((p) => ({ ...p, newPassword: e.target.value }))}
                              className="w-full bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] px-4 py-2.5 text-xs text-[#F8F6F3] focus:outline-none pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-8 text-[#8E8A85] hover:text-[#C8A45D] transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-3 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px] hover:bg-[#D4B77D] transition-colors cursor-pointer shadow-md"
                        >
                          Save Settings
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB: LOYALTY & REWARDS */}
                  {activeTab === "loyalty" && <LoyaltyDashboard />}


                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </Container>

        {/* Add Address Modal */}
        <AnimatePresence>
          {showAddressModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-6 sm:p-8 relative space-y-4"
              >
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="absolute top-5 right-5 text-[#8E8A85] hover:text-[#C8A45D]"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Add New Address</h3>

                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold mb-1">Tag Label</label>
                      <input
                        type="text"
                        value={newAddrForm.tag}
                        onChange={(e) => setNewAddrForm((p) => ({ ...p, tag: e.target.value }))}
                        placeholder="e.g. Home, Studio"
                        className="w-full bg-[#090909] border border-[#2A2A2A] px-3 py-2 text-xs text-[#F8F6F3] rounded-[6px]"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAddrForm.fullName}
                        onChange={(e) => setNewAddrForm((p) => ({ ...p, fullName: e.target.value }))}
                        className="w-full bg-[#090909] border border-[#2A2A2A] px-3 py-2 text-xs text-[#F8F6F3] rounded-[6px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold mb-1">House / Flat / Building</label>
                    <input
                      type="text"
                      required
                      value={newAddrForm.flat}
                      onChange={(e) => setNewAddrForm((p) => ({ ...p, flat: e.target.value }))}
                      className="w-full bg-[#090909] border border-[#2A2A2A] px-3 py-2 text-xs text-[#F8F6F3] rounded-[6px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold mb-1">Street / Area</label>
                      <input
                        type="text"
                        value={newAddrForm.street}
                        onChange={(e) => setNewAddrForm((p) => ({ ...p, street: e.target.value }))}
                        className="w-full bg-[#090909] border border-[#2A2A2A] px-3 py-2 text-xs text-[#F8F6F3] rounded-[6px]"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold mb-1">PIN Code</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newAddrForm.pincode}
                        onChange={(e) => setNewAddrForm((p) => ({ ...p, pincode: e.target.value }))}
                        className="w-full bg-[#090909] border border-[#2A2A2A] px-3 py-2 text-xs text-[#F8F6F3] rounded-[6px]"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 text-xs text-[#8E8A85] hover:text-[#F8F6F3]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#C8A45D] text-[#090909] text-xs font-bold rounded-[6px]"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <CartDrawer />
      <Footer />
    </>
  );
}
