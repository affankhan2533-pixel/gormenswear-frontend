"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Percent,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  Package,
  Layers,
  Sparkles,
  Filter,
  RefreshCw,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

const WEEKLY_SALES = [
  { day: "Mon", sales: 18400 },
  { day: "Tue", sales: 24200 },
  { day: "Wed", sales: 21900 },
  { day: "Thu", sales: 31500 },
  { day: "Fri", sales: 38900 },
  { day: "Sat", sales: 42100 },
  { day: "Sun", sales: 12450 },
];

const TOP_PRODUCTS = [
  { name: "GOR Alo Burgundy Heavyweight Co-Ord Set", category: "Co-Ord Sets", sold: 184, revenue: 69920, stock: "28 in stock" },
  { name: "Prada Desert Sand Textured Zip Set", category: "Co-Ord Sets", sold: 142, revenue: 73840, stock: "14 in stock" },
  { name: "GOR Designer Camp Shirting in Onyx", category: "Shirts", sold: 98, revenue: 23520, stock: "42 in stock" },
  { name: "Luxury Shearling Collar Aviator Jacket", category: "Outerwear", sold: 46, revenue: 40020, stock: "8 in stock (Low)" },
];

export default function AnalyticsBIPage() {
  const [dateRange, setDateRange] = useState("30d"); // "7d", "30d", "ytd"
  const [activeTab, setActiveTab] = useState("sales"); // "sales", "customers", "products", "marketing", "inventory"
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  const maxWeeklySales = useMemo(() => Math.max(...WEEKLY_SALES.map((d) => d.sales)), []);

  // Export CSV Handler
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "Metric,Value,Trend\n";
        const rows = [
          `Total Revenue,$189450,+18.4%`,
          `Total Orders,604,+12.1%`,
          `Average Order Value,$313.65,+4.2%`,
          `Conversion Rate,3.82%,+0.8%`,
          `Returning Customer Rate,42.5%,+3.5%`,
        ].join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_BI_Executive_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("Report Exported", "Executive BI analytics report downloaded successfully.");
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
                <BarChart3 className="w-4 h-4" /> BUSINESS INTELLIGENCE ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Executive Analytics & BI Platform
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-[#090909] border border-[#2A2A2A] rounded-[10px] p-1">
                {["7d", "30d", "ytd"].map((rng) => (
                  <button
                    key={rng}
                    type="button"
                    onClick={() => setDateRange(rng)}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-bold uppercase transition-colors ${
                      dateRange === rng ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                    }`}
                  >
                    {rng === "7d" ? "7 Days" : rng === "30d" ? "30 Days" : "YTD"}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                disabled={exporting}
                className="h-10 px-5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Export BI Report</span>
              </button>
            </div>
          </div>

          {/* ── 6 EXECUTIVE KPI CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Total Revenue</span>
              <span className="font-editorial text-2xl text-[#C8A45D]">$189,450</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +18.4% vs last period
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Total Orders</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">604</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +12.1%
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Average Order Value</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">$313.65</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +4.2%
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Conversion Rate</span>
              <span className="font-editorial text-2xl text-emerald-400">3.82%</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +0.8%
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Repeat Buyer Rate</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">42.5%</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +3.5%
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Inventory Health</span>
              <span className="font-editorial text-2xl text-[#C8A45D]">98.4%</span>
              <span className="text-[10px] font-mono text-[#8E8A85]">Optimal turn</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-[#151515] border border-[#2A2A2A] rounded-[14px] p-1 gap-1">
            {[
              { id: "sales", label: "Sales Analytics" },
              { id: "customers", label: "Customer Cohorts" },
              { id: "products", label: "Product Performance" },
              { id: "marketing", label: "Marketing ROI" },
              { id: "inventory", label: "Inventory Intelligence" },
            ].map((tb) => (
              <button
                key={tb.id}
                type="button"
                onClick={() => setActiveTab(tb.id)}
                className={`flex-1 py-2.5 px-3 rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === tb.id ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {/* ── TAB 1: SALES ANALYTICS ── */}
          {activeTab === "sales" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Revenue Trend Chart Card */}
              <div className="lg:col-span-8 bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 space-y-6 shadow-xl">
                <div className="flex justify-between items-center">
                  <h3 className="font-editorial text-xl text-[#F8F6F3]">Weekly Revenue Trend</h3>
                  <span className="text-xs font-mono text-[#C8A45D]">$189,450 Total</span>
                </div>

                <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-4 border-b border-[#2A2A2A]">
                  {WEEKLY_SALES.map((item) => {
                    const heightPercent = (item.sales / maxWeeklySales) * 100;
                    return (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] font-mono text-[#C8A45D] opacity-0 group-hover:opacity-100 transition-opacity">
                          ${(item.sales / 1000).toFixed(1)}k
                        </span>
                        <div
                          className="w-full bg-[#2A2A2A] group-hover:bg-[#C8A45D] transition-colors rounded-t-[6px]"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-xs font-mono text-[#8E8A85]">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sales Distribution Card */}
              <div className="lg:col-span-4 bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 space-y-6 shadow-xl">
                <h3 className="font-editorial text-xl text-[#F8F6F3]">Sales by Category</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#F8F6F3]">Co-Ord Sets</span>
                      <span className="font-mono text-[#C8A45D]">48% ($90,936)</span>
                    </div>
                    <div className="w-full bg-[#090909] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#C8A45D] h-full w-[48%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#F8F6F3]">Outerwear</span>
                      <span className="font-mono text-[#C8A45D]">32% ($60,624)</span>
                    </div>
                    <div className="w-full bg-[#090909] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#C8A45D] h-full w-[32%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#F8F6F3]">Shirts & Tops</span>
                      <span className="font-mono text-[#C8A45D]">20% ($37,890)</span>
                    </div>
                    <div className="w-full bg-[#090909] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#C8A45D] h-full w-[20%]" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ── TAB 3: PRODUCT PERFORMANCE ── */}
          {activeTab === "products" && (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                    <th className="py-3.5 px-4 font-bold">Garment Title</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Units Sold</th>
                    <th className="py-3.5 px-4 font-bold">Gross Revenue</th>
                    <th className="py-3.5 px-4 font-bold">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {TOP_PRODUCTS.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-[#090909]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#F8F6F3]">{prod.name}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{prod.category}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F8F6F3]">{prod.sold} units</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C8A45D]">${prod.revenue.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400">{prod.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </Container>
      </main>

      <Footer />
    </>
  );
}
