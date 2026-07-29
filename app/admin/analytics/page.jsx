"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import { analyticsService } from "@/lib/analyticsService";
import {
  BarChart3, TrendingUp, DollarSign, ShoppingBag,
  Users, Package, Download, Calendar, Filter,
  ArrowUpRight, AlertTriangle, RefreshCw, ExternalLink,
  Layers, CheckCircle2, XCircle, Clock, Truck,
  Star, Award, RotateCcw,
} from "lucide-react";

// ── HELPERS ────────────────────────────────────────────────────────────────────

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const fmtNum = (n) => (n || 0).toLocaleString("en-IN");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS_COLOR = {
  Pending: "#f59e0b",
  Processing: "#3b82f6",
  Confirmed: "#6366f1",
  Packed: "#8b5cf6",
  Shipped: "#06b6d4",
  Delivered: "#10b981",
  Fulfilled: "#10b981",
  Cancelled: "#ef4444",
  Refunded: "#f43f5e",
};

// ── PURE SVG BAR CHART ─────────────────────────────────────────────────────────

function BarChart({ data = [], valueKey = "revenue", labelKey = "date", color = "#C8A45D", height = 160 }) {
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  const barW = Math.max(4, Math.min(24, Math.floor(300 / Math.max(data.length, 1)) - 4));
  const chartH = height - 28;

  if (!data.length) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <p className="text-xs text-[#555]">No data for this period</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-none">
      <svg
        viewBox={`0 0 ${Math.max(data.length * (barW + 6), 300)} ${height}`}
        className="w-full"
        style={{ minWidth: Math.max(data.length * (barW + 6), 200) }}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={0} y1={chartH * (1 - f) + 4}
            x2="100%" y2={chartH * (1 - f) + 4}
            stroke="#1E1E1E" strokeWidth={1}
          />
        ))}
        {data.map((d, i) => {
          const val = d[valueKey] || 0;
          const barH = Math.max(2, (val / max) * chartH);
          const x = i * (barW + 6) + 2;
          const y = chartH - barH + 4;
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={barW} height={barH}
                fill={color} opacity={0.8} rx={2}
              />
              {/* Hover label */}
              <title>{`${d[labelKey]}: ${val.toLocaleString("en-IN")}`}</title>
            </g>
          );
        })}
        {/* X-axis labels (show first, middle, last) */}
        {data.length > 0 && [0, Math.floor(data.length / 2), data.length - 1].filter((v, i, a) => a.indexOf(v) === i).map((i) => {
          const d = data[i];
          const x = i * (barW + 6) + barW / 2 + 2;
          const label = d[labelKey]?.slice(-5) || "";
          return (
            <text key={i} x={x} y={height - 2} textAnchor="middle" fill="#555" fontSize={9} fontFamily="monospace">
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ── DONUT CHART ─────────────────────────────────────────────────────────────────

function DonutChart({ segments = [], size = 120 }) {
  const total = segments.reduce((s, d) => s + (d.value || 0), 0);
  if (!total) return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <p className="text-[10px] text-[#555]">No data</p>
    </div>
  );

  const r = 40, cx = size / 2, cy = size / 2;
  let cumAngle = -Math.PI / 2;

  const arcs = segments.map((seg) => {
    const angle = (seg.value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    return { ...seg, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z` };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill={arc.color} opacity={0.85}>
          <title>{arc.label}: {arc.value} ({Math.round((arc.value / total) * 100)}%)</title>
        </path>
      ))}
      <circle cx={cx} cy={cy} r={24} fill="#111" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#E8E4DF" fontSize={11} fontWeight="bold">
        {total}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#666" fontSize={8}>
        total
      </text>
    </svg>
  );
}

// ── SPARKLINE ────────────────────────────────────────────────────────────────────

function Sparkline({ data = [], color = "#C8A45D", height = 40 }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 120, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── KPI CARD ──────────────────────────────────────────────────────────────────────

function KPICard({ label, value, icon: Icon, color = "text-[#E8E4DF]", iconColor = "text-[#C8A45D]", sparkData, badge }) {
  return (
    <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-4 flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#666]">{label}</span>
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      </div>
      <p className={`text-2xl font-bold font-mono ${color} leading-none`}>{value}</p>
      {badge && (
        <span className="text-[10px] font-semibold text-[#888]">{badge}</span>
      )}
      {sparkData && sparkData.length > 1 && (
        <Sparkline data={sparkData} color={iconColor === "text-[#C8A45D]" ? "#C8A45D" : "#10b981"} />
      )}
    </div>
  );
}

// ── SKELETON ──────────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }) {
  return <div className={`bg-[#1A1A1A] rounded animate-pulse ${className}`} />;
}

// ── PERIOD LABELS ─────────────────────────────────────────────────────────────────

const PERIODS = [
  { id: "today", label: "Today" },
  { id: "7days", label: "7 Days" },
  { id: "30days", label: "30 Days" },
  { id: "90days", label: "90 Days" },
  { id: "thisYear", label: "This Year" },
  { id: "custom", label: "Custom" },
];

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("30days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getAnalyticsData(period, startDate || null, endDate || null);
      setData(result);
    } catch (err) {
      console.error("Analytics load error:", err);
      toastError("Load Failed", "Could not fetch analytics data.");
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate]);

  useEffect(() => { load(); }, [load]);

  const handleExportCSV = async () => {
    try {
      await analyticsService.exportCSV(period, data);
      success("Export Complete", "Analytics CSV downloaded.");
    } catch (err) {
      toastError("Export Failed", "Could not generate CSV.");
    }
  };

  // Derived data — all bound to real MongoDB fields
  const revenueTimeline = useMemo(() => data?.revenue?.timeline || [], [data]);
  const ordersTimeline = useMemo(() => data?.orders?.dailyVolume || [], [data]);
  const monthlyTrend = useMemo(() => data?.monthlyTrend || [], [data]);
  const topProducts = useMemo(() => data?.products?.topSellingProducts || [], [data]);
  const categoryInventory = useMemo(() => data?.products?.categoryInventory || [], [data]);
  const categorySales = useMemo(() => data?.products?.categorySales || [], [data]);
  const invSummary = useMemo(() => data?.products?.inventorySummary || {}, [data]);
  const ordersByStatus = useMemo(() => data?.orders?.byStatus || [], [data]);
  const topSpenders = useMemo(() => data?.customers?.topSpenders || [], [data]);
  const recentOrders = useMemo(() => data?.recentOrders || [], [data]);
  const acquisitionTrend = useMemo(() => data?.customers?.acquisitionTrend || [], [data]);
  const custSummary = useMemo(() => data?.customers?.summary || {}, [data]);

  const sparkRevenue = useMemo(() =>
    revenueTimeline.slice(-7).map((d) => d.grossRevenue || 0), [revenueTimeline]);

  // Only show statuses with non-zero counts in donut
  const donutSegments = useMemo(() =>
    (ordersByStatus || []).filter((s) => s.count > 0).map((s) => ({
      label: s.status,
      value: s.count,
      color: STATUS_COLOR[s.status] || "#888",
    })), [ordersByStatus]);

  const catColors = ["#C8A45D", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "revenue", label: "Revenue" },
    { id: "products", label: "Products" },
    { id: "customers", label: "Customers" },
    { id: "orders", label: "Orders" },
  ];

  return (
    <AdminShell>
      <div className="space-y-5 max-w-7xl pb-20">
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E1E1E] pb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#F0EDE8] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#C8A45D]" />
              Analytics & Reports
            </h1>
            <p className="text-[11px] text-[#777] mt-0.5">
              Revenue, product velocity & customer intelligence — all from live MongoDB data
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button" onClick={load} disabled={loading}
              className="p-2 bg-[#141414] border border-[#262626] rounded-[8px] text-[#888] hover:text-[#E8E4DF] cursor-pointer transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#C8A45D]" : ""}`} />
            </button>
            <button
              type="button" onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] text-xs font-bold rounded-[8px] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* ── PERIOD SELECTOR ── */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span className="text-xs font-semibold text-[#888]">Time Period</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PERIODS.map((p) => (
              <button
                key={p.id} type="button"
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors cursor-pointer border ${
                  period === p.id
                    ? "bg-[#C8A45D]/15 border-[#C8A45D]/40 text-[#C8A45D]"
                    : "border-[#1E1E1E] text-[#666] hover:text-[#E8E4DF] hover:bg-[#161616]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {period === "custom" && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <input
                type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none"
              />
              <span className="text-xs text-[#555]">to</span>
              <input
                type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none"
              />
              <button
                type="button" onClick={load}
                className="px-3 py-1.5 bg-[#C8A45D] hover:bg-[#B8944D] text-[#090909] text-xs font-bold rounded-[8px] cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* ── KPI CARDS (always visible) ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <Skeleton key={i} className="h-28 rounded-[14px]" />)}
          </div>
        ) : data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KPICard label="Total Revenue" value={fmt(data.overview?.totalRevenue)} icon={DollarSign} iconColor="text-[#C8A45D]" sparkData={sparkRevenue} badge="All-time (paid orders)" />
            <KPICard label="Period Revenue" value={fmt(data.overview?.revenueThisPeriod)} icon={TrendingUp} iconColor="text-emerald-400" color="text-emerald-400" badge={`${PERIODS.find((p) => p.id === period)?.label} · ${fmtNum(data.overview?.paidOrdersInPeriod)} paid orders`} />
            <KPICard label="Total Orders" value={fmtNum(data.overview?.totalOrders)} icon={ShoppingBag} iconColor="text-blue-400" badge={`${fmtNum(data.overview?.paidOrdersInPeriod)} paid in period`} />
            <KPICard label="Avg Order Value" value={fmt(data.overview?.averageOrderValue)} icon={BarChart3} iconColor="text-purple-400" color="text-purple-400" badge="Paid orders only" />
            <KPICard label="Total Customers" value={fmtNum(data.overview?.totalCustomers)} icon={Users} iconColor="text-cyan-400" badge={`${fmtNum(data.overview?.newCustomersInPeriod)} new in period`} />
            <KPICard label="Returning" value={fmtNum(data.overview?.returningCustomers)} icon={RotateCcw} iconColor="text-cyan-400" badge="2+ completed orders" />
            <KPICard label="Total Products" value={fmtNum(data.overview?.totalProducts)} icon={Package} iconColor="text-[#C8A45D]" badge={`${fmtNum(data.overview?.activeProducts)} active`} />
            <KPICard
              label="Low Stock" value={fmtNum(data.overview?.lowStockProducts)} icon={AlertTriangle}
              iconColor={data.overview?.lowStockProducts > 0 ? "text-amber-400" : "text-[#555]"}
              color={data.overview?.lowStockProducts > 0 ? "text-amber-400" : "text-[#E8E4DF]"}
              badge={`${fmtNum(data.overview?.outOfStockProducts)} out of stock`}
            />
          </div>
        )}

        {/* ── TABS ── */}
        <div className="flex items-center gap-0.5 border-b border-[#1E1E1E] overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id} type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "text-[#C8A45D] border-[#C8A45D]"
                  : "text-[#666] border-transparent hover:text-[#E8E4DF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════════ OVERVIEW TAB ══════════════════ */}
        {activeTab === "overview" && !loading && data && (
          <div className="space-y-5">
            {/* Monthly Revenue Trend */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#C8A45D]" />
                  Monthly Revenue Trend
                </h3>
                <span className="text-xs text-[#666] font-mono">₹ Revenue</span>
              </div>
              {monthlyTrend.length > 0 ? (
                <BarChart
                  data={monthlyTrend}
                  valueKey="revenue"
                  labelKey="label"
                  color="#C8A45D"
                  height={180}
                />
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <p className="text-xs text-[#555]">No monthly trend data yet</p>
                </div>
              )}
            </div>

            {/* Order Status + Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Order Status Donut */}
              <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
                <h3 className="text-sm font-bold text-[#E8E4DF] mb-4 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#C8A45D]" />
                  Order Status Breakdown
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <DonutChart segments={donutSegments} size={120} />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    {ordersByStatus.map((s) => (
                      <div key={s.status} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLOR[s.status] || "#888" }} />
                          <span className="text-[#888]">{s.status}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-[#E8E4DF]">{s.count}</span>
                          <span className="text-[#555] font-mono text-[10px]">{fmt(s.totalRevenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#C8A45D]" />
                    Recent Orders
                  </h3>
                  <Link href="/admin/orders" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">
                    View all <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                {recentOrders.length === 0 ? (
                  <p className="text-xs text-[#555] py-6 text-center">No orders yet</p>
                ) : (
                  <div className="divide-y divide-[#1A1A1A]">
                    {recentOrders.map((ord) => (
                      <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-mono font-bold text-[#C8A45D]">{ord.orderNo}</p>
                          <p className="text-[10px] text-[#666] truncate max-w-[140px]">{ord.customerName}</p>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <span className="font-mono font-bold text-[#E8E4DF]">{fmt(ord.totalAmount)}</span>
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ color: STATUS_COLOR[ord.status] || "#888", backgroundColor: `${STATUS_COLOR[ord.status] || "#888"}20` }}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Products (overview) */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#C8A45D]" />
                  Top Selling Products
                </h3>
                <button type="button" onClick={() => setActiveTab("products")} className="text-xs text-[#C8A45D] hover:underline">
                  See all
                </button>
              </div>
              {topProducts.length === 0 ? (
                <p className="text-xs text-[#555] py-4 text-center">No product sales data yet</p>
              ) : (
                <div className="space-y-3">
                  {topProducts.slice(0, 5).map((p, i) => {
                    const maxRev = topProducts[0]?.totalRevenue || 1;
                    const pct = Math.round((p.totalRevenue / maxRev) * 100);
                    return (
                      <div key={p.productId || i} className="flex items-center gap-3">
                        {p.image && (
                          <img
                            src={p.image.startsWith("/") ? `http://localhost:3000${p.image}` : p.image}
                            alt={p.name}
                            className="w-9 h-9 rounded-[6px] object-cover bg-[#1A1A1A] shrink-0"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold text-[#E8E4DF] truncate mr-2">{p.name}</p>
                            <span className="text-[10px] font-mono font-bold text-[#C8A45D] shrink-0">{fmt(p.totalRevenue)}</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-[#C8A45D]" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-[10px] text-[#555] mt-0.5">{p.totalQuantitySold} units sold</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════ REVENUE TAB ══════════════════ */}
        {activeTab === "revenue" && !loading && data && (
          <div className="space-y-5">
            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Gross Revenue", value: fmt(data.revenue?.summary?.totalGrossRevenue), color: "text-[#C8A45D]" },
                { label: "Net Revenue", value: fmt(data.revenue?.summary?.totalNetRevenue), color: "text-emerald-400" },
                { label: "Total Discounts", value: fmt(data.revenue?.summary?.totalDiscounts), color: "text-rose-400" },
                { label: "Shipping Fees", value: fmt(data.revenue?.summary?.totalShippingFees), color: "text-blue-400" },
              ].map((card) => (
                <div key={card.label} className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">{card.label}</span>
                  <p className={`text-xl font-bold font-mono ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Revenue By Day */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
              <h3 className="text-sm font-bold text-[#E8E4DF] mb-4">Daily Revenue</h3>
              <BarChart data={revenueTimeline} valueKey="grossRevenue" labelKey="date" color="#C8A45D" height={200} />
            </div>

            {/* Orders Per Day */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
              <h3 className="text-sm font-bold text-[#E8E4DF] mb-4">Daily Order Volume</h3>
              <BarChart data={ordersTimeline} valueKey="count" labelKey="date" color="#3b82f6" height={160} />
            </div>

            {/* Revenue Timeline Table */}
            {revenueTimeline.length > 0 && (
              <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden">
                <div className="p-4 border-b border-[#1E1E1E]">
                  <h3 className="text-sm font-bold text-[#E8E4DF]">Revenue Timeline</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[#0D0D0D] border-b border-[#1E1E1E]">
                      <tr className="text-[#555] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-right">Gross Revenue</th>
                        <th className="py-3 px-4 text-right">Net Revenue</th>
                        <th className="py-3 px-4 text-center">Orders</th>
                        <th className="py-3 px-4 text-right">Avg Order</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1A]">
                      {revenueTimeline.map((t) => (
                        <tr key={t.date} className="hover:bg-[#161616] transition-colors">
                          <td className="py-2.5 px-4 font-mono text-[#888]">{t.date}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-[#C8A45D]">{fmt(t.grossRevenue)}</td>
                          <td className="py-2.5 px-4 text-right font-mono text-[#888]">{fmt(t.netRevenue)}</td>
                          <td className="py-2.5 px-4 text-center font-mono font-bold text-[#E8E4DF]">{t.ordersCount}</td>
                          <td className="py-2.5 px-4 text-right font-mono text-[#888]">{fmt(t.avgOrderValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ PRODUCTS TAB ══════════════════ */}
        {activeTab === "products" && !loading && data && (
          <div className="space-y-5">
            {/* Top Selling Products */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden">
              <div className="p-5 border-b border-[#1E1E1E]">
                <h3 className="text-sm font-bold text-[#E8E4DF]">Top Selling Products</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#0D0D0D] border-b border-[#1E1E1E]">
                    <tr className="text-[#555] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4 text-left">Rank</th>
                      <th className="py-3 px-4 text-left">Product</th>
                      <th className="py-3 px-4 text-center">Units Sold</th>
                      <th className="py-3 px-4 text-right">Revenue</th>
                      <th className="py-3 px-4 text-right">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]">
                    {topProducts.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-[#555]">No product sales yet</td></tr>
                    ) : topProducts.map((p, i) => (
                      <tr key={p.productId || i} className="hover:bg-[#161616] transition-colors">
                        <td className="py-3 px-4">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                            i === 0 ? "bg-amber-500/20 text-amber-400" :
                            i === 1 ? "bg-zinc-600/20 text-zinc-400" :
                            i === 2 ? "bg-orange-700/20 text-orange-600" : "text-[#555]"
                          }`}>
                            #{i + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {p.image && (
                              <img
                                src={p.image.startsWith("/") ? `http://localhost:3000${p.image}` : p.image}
                                alt={p.name}
                                className="w-8 h-8 rounded object-cover bg-[#1A1A1A] shrink-0"
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            )}
                            <div>
                              <p className="font-semibold text-[#E8E4DF] max-w-[180px] truncate">{p.name}</p>
                              <p className="text-[10px] text-[#555] font-mono">{p.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-[#E8E4DF]">{p.totalQuantitySold}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#C8A45D]">{fmt(p.totalRevenue)}</td>
                        <td className="py-3 px-4 text-right font-mono text-[#888]">{fmt(p.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>


            {/* Inventory Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Active Products", value: invSummary.totalActive || 0, color: "text-emerald-400" },
                { label: "Draft Products", value: invSummary.totalDraft || 0, color: "text-blue-400" },
                { label: "Low Stock (≤5)", value: invSummary.lowStock || 0, color: invSummary.lowStock > 0 ? "text-amber-400" : "text-[#666]" },
                { label: "Out of Stock", value: invSummary.outOfStock || 0, color: invSummary.outOfStock > 0 ? "text-rose-400" : "text-[#666]" },
              ].map((card) => (
                <div key={card.label} className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">{card.label}</span>
                  <p className={`text-2xl font-bold font-mono ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Sales by Category — from real order aggregation */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
              <h3 className="text-sm font-bold text-[#E8E4DF] mb-4 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#C8A45D]" />
                Sales by Category
                <span className="text-[10px] font-normal text-[#555] ml-1">(from actual orders)</span>
              </h3>
              {categorySales.length === 0 ? (
                <p className="text-xs text-[#555] py-4 text-center">No category sales data for this period</p>
              ) : (
                <div className="space-y-3">
                  {categorySales.map((cat, i) => {
                    const maxRev = categorySales[0]?.totalRevenue || 1;
                    const pct = Math.round((cat.totalRevenue / maxRev) * 100);
                    return (
                      <div key={cat.category || i}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: catColors[i % catColors.length] }} />
                            <span className="text-[#E8E4DF] font-medium capitalize">{cat.category || "Uncategorized"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[#888]">
                            <span className="font-mono">{cat.totalQuantitySold} units</span>
                            <span className="font-mono font-bold text-[#C8A45D]">{fmt(cat.totalRevenue)}</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: catColors[i % catColors.length] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Inventory by Category — from Product collection */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
              <h3 className="text-sm font-bold text-[#E8E4DF] mb-4 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#C8A45D]" />
                Inventory by Category
                <span className="text-[10px] font-normal text-[#555] ml-1">(current stock value)</span>
              </h3>
              {categoryInventory.length === 0 ? (
                <p className="text-xs text-[#555] py-4 text-center">No inventory data</p>
              ) : (
                <div className="space-y-3">
                  {categoryInventory.map((cat, i) => {
                    const maxVal = categoryInventory[0]?.totalValue || 1;
                    const pct = Math.round((cat.totalValue / maxVal) * 100);
                    return (
                      <div key={cat.category || i}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: catColors[i % catColors.length] }} />
                            <span className="text-[#E8E4DF] font-medium capitalize">{cat.category || "Uncategorized"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[#888]">
                            <span>{cat.productCount} products</span>
                            <span className="font-mono">{cat.totalStock} in stock</span>
                            <span className="font-mono font-bold text-[#C8A45D]">{fmt(cat.totalValue)}</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: catColors[i % catColors.length] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════ CUSTOMERS TAB ══════════════════ */}
        {activeTab === "customers" && !loading && data && (
          <div className="space-y-5">
            {/* Customer Summary Cards — all from real MongoDB */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Customers", value: custSummary.totalCustomers || 0, color: "text-[#E8E4DF]", badge: "all time" },
                { label: "Active Accounts", value: custSummary.active || 0, color: "text-emerald-400", badge: `${custSummary.inactive || 0} inactive` },
                { label: "VIP Clients", value: custSummary.vip || 0, color: "text-amber-400", badge: `≥ ₹${(custSummary.vipThreshold || 1000).toLocaleString()} spent` },
                { label: "New in Period", value: custSummary.newInPeriod || 0, color: "text-purple-400", badge: "registered in range" },
              ].map((card) => (
                <div key={card.label} className="bg-[#111] border border-[#1E1E1E] rounded-[12px] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block mb-1">{card.label}</span>
                  <p className={`text-2xl font-bold font-mono ${card.color}`}>{card.value}</p>
                  {card.badge && <span className="text-[10px] text-[#555] mt-0.5 block">{card.badge}</span>}
                </div>
              ))}
            </div>

            {/* Customer Acquisition Trend */}
            {acquisitionTrend.length > 0 && (
              <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
                <h3 className="text-sm font-bold text-[#E8E4DF] mb-4">Customer Acquisition Trend</h3>
                <BarChart data={acquisitionTrend} valueKey="newCustomers" labelKey="label" color="#8b5cf6" height={160} />
              </div>
            )}

            {/* Customer Tier Breakdown */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
              <h3 className="text-sm font-bold text-[#E8E4DF] mb-4">Customer Tier Breakdown</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "VIP", count: custSummary.vip || 0, color: "#f59e0b", bg: "bg-amber-500/10 border-amber-500/20" },
                  { label: "Returning", count: custSummary.returning || 0, color: "#06b6d4", bg: "bg-cyan-500/10 border-cyan-500/20" },
                  { label: "New", count: custSummary.new || 0, color: "#8b5cf6", bg: "bg-purple-500/10 border-purple-500/20" },
                ].map((tier) => (
                  <div key={tier.label} className={`p-4 rounded-[12px] border text-center ${tier.bg}`}>
                    <p className="text-2xl font-bold font-mono" style={{ color: tier.color }}>{tier.count}</p>
                    <p className="text-[10px] font-semibold text-[#888] uppercase tracking-wider mt-1">{tier.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Spenders */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden">
              <div className="p-5 border-b border-[#1E1E1E] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#C8A45D]" />
                  Top Spenders
                </h3>
                <Link href="/admin/customers" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">
                  View all <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#0D0D0D] border-b border-[#1E1E1E]">
                    <tr className="text-[#555] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4 text-left">Customer</th>
                      <th className="py-3 px-4 text-center">Orders</th>
                      <th className="py-3 px-4 text-right">Total Spent</th>
                      <th className="py-3 px-4 text-right">Avg Order</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]">
                    {topSpenders.slice(0, 10).map((c, i) => (
                      <tr key={c.id} className="hover:bg-[#161616] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#C8A45D]/15 border border-[#C8A45D]/20 flex items-center justify-center shrink-0">
                              <span className="text-[9px] font-bold text-[#C8A45D]">
                                {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-[#E8E4DF]">{c.name}</p>
                              <p className="text-[10px] text-[#555]">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-[#E8E4DF]">{c.ordersCount}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#C8A45D]">{fmt(c.totalSpent)}</td>
                        <td className="py-3 px-4 text-right font-mono text-[#888]">{fmt(c.averageOrderValue)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === "Active" ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                          }`}>{c.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ ORDERS TAB ══════════════════ */}
        {activeTab === "orders" && !loading && data && (
          <div className="space-y-5">
            {/* Orders by Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
                <h3 className="text-sm font-bold text-[#E8E4DF] mb-4">Orders by Status</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <DonutChart segments={donutSegments} size={140} />
                  <div className="flex-1 space-y-2">
                    {ordersByStatus.map((s) => {
                      const total = ordersByStatus.reduce((sum, x) => sum + x.count, 0) || 1;
                      const pct = Math.round((s.count / total) * 100);
                      return (
                        <div key={s.status}>
                          <div className="flex items-center justify-between text-xs mb-0.5">
                            <span className="text-[#888]">{s.status}</span>
                            <span className="font-mono font-bold text-[#E8E4DF]">{s.count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: STATUS_COLOR[s.status] || "#888" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
                <h3 className="text-sm font-bold text-[#E8E4DF] mb-4">Payment Status</h3>
                <div className="space-y-3">
                  {(data.orders?.byPaymentStatus || []).map((p, i) => (
                    <div key={p.paymentStatus} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: i === 0 ? "#10b981" : i === 1 ? "#f59e0b" : "#ef4444" }}
                        />
                        <span className="text-[#888]">{p.paymentStatus || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[#E8E4DF]">{p.count} orders</span>
                        <span className="font-mono text-[#C8A45D]">{fmt(p.totalRevenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Order Volume */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
              <h3 className="text-sm font-bold text-[#E8E4DF] mb-4">Daily Order Volume</h3>
              <BarChart data={ordersTimeline} valueKey="count" labelKey="date" color="#3b82f6" height={180} />
            </div>

            {/* Daily Revenue from Orders */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-5">
              <h3 className="text-sm font-bold text-[#E8E4DF] mb-4">Daily Revenue</h3>
              <BarChart data={ordersTimeline} valueKey="revenue" labelKey="date" color="#C8A45D" height={160} />
            </div>

            {/* Orders Table Link */}
            <div className="flex justify-center">
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 px-4 py-2 bg-[#141414] border border-[#2A2A2A] text-xs font-semibold text-[#E8E4DF] rounded-[10px] hover:bg-[#1A1A1A] transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" />
                View All Orders
                <ExternalLink className="w-3 h-3 text-[#666]" />
              </Link>
            </div>
          </div>
        )}

        {/* ── LOADING TABS SKELETON ── */}
        {loading && activeTab !== "overview" && (
          <div className="space-y-4 animate-pulse">
            <Skeleton className="h-48 rounded-[14px]" />
            <Skeleton className="h-64 rounded-[14px]" />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
