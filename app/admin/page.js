"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  XCircle,
  FolderPlus,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Phone,
  Calendar,
} from "lucide-react";
import AdminShell from "@/components/admin/shell/AdminShell";
import { dashboardService } from "@/lib/dashboardService";
import { formatPrice } from "@/lib/utils";

// Animation Stagger Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setIsLoading(false);
          return;
        }
      }
      // Fallback to client-side service calculation if API route responds with error
      const localData = dashboardService.getDashboardData();
      setData(localData);
    } catch (err) {
      console.warn("API Fetch failed, using service layer fallback", err);
      try {
        const localData = dashboardService.getDashboardData();
        setData(localData);
      } catch (fallbackErr) {
        setError("Failed to load dashboard metrics. Please check connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Helper for Order Status Pill styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
      case "Paid":
      case "Fulfilled":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
      case "Shipped":
      case "Packed":
        return "bg-blue-500/15 text-blue-400 border-blue-500/25";
      case "Confirmed":
      case "Processing":
        return "bg-amber-500/15 text-amber-400 border-amber-500/25";
      case "Cancelled":
        return "bg-rose-500/15 text-rose-400 border-rose-500/25";
      default:
        return "bg-neutral-500/15 text-neutral-400 border-neutral-500/25";
    }
  };

  const metrics = data?.metrics || {
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  };

  const topMetricCards = [
    {
      title: "Total Products",
      icon: Package,
      value: metrics.totalProducts,
      unit: "Products",
      href: "/admin/products",
      color: "text-[#F0EDE8]",
    },
    {
      title: "Total Orders",
      icon: ShoppingBag,
      value: metrics.totalOrders,
      unit: "Orders",
      href: "/admin/orders",
      color: "text-[#F0EDE8]",
    },
    {
      title: "Total Customers",
      icon: Users,
      value: metrics.totalCustomers,
      unit: "Customers",
      href: "/admin/customers",
      color: "text-[#F0EDE8]",
    },
    {
      title: "Revenue (This Month)",
      icon: TrendingUp,
      value: formatPrice(metrics.monthlyRevenue),
      unit: "Calculated",
      href: "/admin/orders",
      color: "text-[#C8A45D]",
    },
    {
      title: "Low Stock Products",
      icon: AlertTriangle,
      value: metrics.lowStockCount,
      unit: "Alerts",
      href: "/admin/inventory",
      color: "text-amber-400",
    },
    {
      title: "Out of Stock Products",
      icon: XCircle,
      value: metrics.outOfStockCount,
      unit: "Unavailable",
      href: "/admin/inventory",
      color: "text-rose-400",
    },
  ];

  return (
    <AdminShell>
      <div className="space-y-4 sm:space-y-6 max-w-7xl pb-8 min-w-0">
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F0EDE8]">Dashboard</h1>
            <p className="text-[11px] sm:text-xs text-[#888] mt-0.5">
              Production Store Performance & Dynamic Metrics
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#262626] text-xs text-[#E8E4DF] font-medium rounded-[8px] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#C8A45D]" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* ── ERROR STATE ── */}
        {error && (
          <div className="p-3.5 rounded-[12px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-rose-400 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold rounded-[6px] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── TOP METRIC CARDS (6 CARDS) ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4 h-24 flex flex-col justify-between animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-[#222] rounded w-24" />
                  <div className="w-4 h-4 bg-[#222] rounded-full" />
                </div>
                <div className="h-6 bg-[#222] rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4"
          >
            {topMetricCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <motion.div key={card.title} variants={itemVariants} className="h-full">
                  <Link
                    href={card.href}
                    className="bg-[#111] border border-[#1E1E1E] hover:border-[#333] rounded-[12px] p-4 h-full flex flex-col justify-between transition-all group block shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-[#888] truncate">{card.title}</span>
                      <IconComponent className={`w-4 h-4 ${card.color} shrink-0`} />
                    </div>
                    <p
                      className={`text-xl sm:text-2xl font-bold font-mono ${card.color} group-hover:text-[#C8A45D] transition-colors mt-1`}
                    >
                      {card.value}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── QUICK ACTIONS (4 ACTIONS) ── */}
        <div>
          <h2 className="text-xs font-bold text-[#AAA] uppercase tracking-wider mb-2.5">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <Link
              href="/admin/products/new"
              className="flex items-center justify-center gap-2 p-3 bg-[#C8A45D] hover:bg-[#D4B572] text-[#090909] font-bold text-xs rounded-[9px] transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Product</span>
            </Link>

            <Link
              href="/admin/collections/new"
              className="flex items-center justify-center gap-2 p-3 bg-[#141414] hover:bg-[#1C1C1C] border border-[#222] text-[#E8E4DF] font-semibold text-xs rounded-[9px] transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>Create Collection</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center justify-center gap-2 p-3 bg-[#141414] hover:bg-[#1C1C1C] border border-[#222] text-[#E8E4DF] font-semibold text-xs rounded-[9px] transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>View Orders</span>
            </Link>

            <Link
              href="/admin/inventory"
              className="flex items-center justify-center gap-2 p-3 bg-[#141414] hover:bg-[#1C1C1C] border border-[#222] text-[#E8E4DF] font-semibold text-xs rounded-[9px] transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>Manage Inventory</span>
            </Link>
          </div>
        </div>

        {/* ── MAIN DATA GRID (RECENT ORDERS & LOW STOCK) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* RECENT ORDERS (LATEST 10) */}
          <div className="lg:col-span-7 bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4 space-y-3 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#E8E4DF]">Recent Orders</h2>
                  <p className="text-[11px] text-[#666]">Latest customer transactions</p>
                </div>
                <Link
                  href="/admin/orders"
                  className="text-xs font-semibold text-[#C8A45D] hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-2 py-2 animate-pulse">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-9 bg-[#1A1A1A] rounded" />
                  ))}
                </div>
              ) : !data?.recentOrders || data.recentOrders.length === 0 ? (
                <p className="text-xs text-[#777] py-6 text-center">No recent orders found.</p>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[#555] uppercase tracking-wider font-semibold border-b border-[#1A1A1A]">
                        <th className="pb-2.5 pr-2">Order ID</th>
                        <th className="pb-2.5 px-2">Customer</th>
                        <th className="pb-2.5 px-2 text-right">Amount</th>
                        <th className="pb-2.5 px-2 text-center">Status</th>
                        <th className="pb-2.5 pl-2 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1A]">
                      {data.recentOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#161616] transition-colors">
                          <td className="py-2.5 pr-2 font-mono text-[#C8A45D] font-medium">
                            <Link href={`/admin/orders?id=${ord.id}`} className="hover:underline">
                              {ord.orderNo}
                            </Link>
                          </td>
                          <td className="py-2.5 px-2 font-medium text-[#E8E4DF] max-w-[130px] truncate">
                            {ord.customerName}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono font-semibold text-[#E8E4DF]">
                            {formatPrice(ord.totalAmount)}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                                ord.status
                              )}`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-2.5 pl-2 text-right text-[11px] text-[#777]">
                            {ord.createdAt ? String(ord.createdAt).split(" ")[0] : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* LOW STOCK PRODUCTS */}
          <div className="lg:col-span-5 bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4 space-y-3 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#E8E4DF]">Low Stock Alert</h2>
                  <p className="text-[11px] text-[#666]">Products requiring restock</p>
                </div>
                <Link
                  href="/admin/inventory"
                  className="text-xs font-semibold text-[#C8A45D] hover:underline"
                >
                  Manage →
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-2 py-2 animate-pulse">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 bg-[#1A1A1A] rounded" />
                  ))}
                </div>
              ) : !data?.lowStockProducts || data.lowStockProducts.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#777]">
                  <p>All stock levels are optimal.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {data.lowStockProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between gap-3 p-2 rounded-[9px] bg-[#161616] border border-[#222] hover:border-[#333] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-9 h-9 rounded-[6px] object-cover bg-[#222] shrink-0 border border-[#2A2A2A]"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#E8E4DF] truncate">
                            {prod.name}
                          </p>
                          <p className="text-[10px] font-mono text-[#777]">{prod.sku}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {prod.stock} left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── SECONDARY DATA GRID (TOP SELLING PRODUCTS & RECENT CUSTOMERS) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* TOP SELLING PRODUCTS */}
          <div className="lg:col-span-6 bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4 space-y-3 h-full">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#E8E4DF]">Top Selling Products</h2>
                <p className="text-[11px] text-[#666]">Best performing items by volume</p>
              </div>
              <Link
                href="/admin/products"
                className="text-xs font-semibold text-[#C8A45D] hover:underline"
              >
                View Catalog →
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-2 py-2 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-[#1A1A1A] rounded" />
                ))}
              </div>
            ) : !data?.topSellingProducts || data.topSellingProducts.length === 0 ? (
              <p className="text-xs text-[#777] py-6 text-center">No sales data recorded yet.</p>
            ) : (
              <div className="space-y-2.5">
                {data.topSellingProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-[9px] bg-[#161616] border border-[#222] hover:border-[#333] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-9 h-9 rounded-[6px] object-cover bg-[#222] shrink-0 border border-[#2A2A2A]"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#E8E4DF] truncate">{prod.name}</p>
                        <p className="text-[10px] text-[#777]">{prod.unitsSold} units sold</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono font-bold text-[#C8A45D]">
                        {formatPrice(prod.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECENT CUSTOMERS */}
          <div className="lg:col-span-6 bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4 space-y-3 h-full">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#E8E4DF]">Recent Customers</h2>
                <p className="text-[11px] text-[#666]">Newly registered & active client profiles</p>
              </div>
              <Link
                href="/admin/customers"
                className="text-xs font-semibold text-[#C8A45D] hover:underline"
              >
                View Customers →
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-2 py-2 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-[#1A1A1A] rounded" />
                ))}
              </div>
            ) : !data?.recentCustomers || data.recentCustomers.length === 0 ? (
              <p className="text-xs text-[#777] py-6 text-center">No customer records found.</p>
            ) : (
              <div className="space-y-2.5">
                {data.recentCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-[9px] bg-[#161616] border border-[#222] hover:border-[#333] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-xs font-bold text-[#C8A45D] shrink-0">
                        {cust.name ? cust.name.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#E8E4DF] truncate">{cust.name}</p>
                        <p className="text-[10px] text-[#777] flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{cust.phone}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#222] text-[#E8E4DF] border border-[#2A2A2A] mb-0.5">
                        {cust.totalOrders} {cust.totalOrders === 1 ? "Order" : "Orders"}
                      </span>
                      <p className="text-[10px] text-[#666] flex items-center justify-end gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{cust.joinedDate || "Recent"}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
