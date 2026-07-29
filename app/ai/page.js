"use client";

import { useState, useMemo, useRef } from "react";
import {
  Sparkles,
  Search,
  Brain,
  Zap,
  TrendingUp,
  Users,
  ShoppingBag,
  BarChart3,
  Copy,
  Check,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Star,
  Package,
  Lightbulb,
  MessageSquare,
  Target,
  Activity,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Hash,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";

// ─── Static AI Mock Data ───────────────────────────────────────────────
const AI_HEALTH = [
  { label: "AI Engine", status: "Operational", color: "emerald", icon: Brain },
  { label: "Recommendations", status: "Active — 6 Widgets", color: "emerald", icon: Sparkles },
  { label: "Semantic Search", status: "Active — NLP v2", color: "emerald", icon: Search },
  { label: "Content Assistant", status: "Active — LLM Ready", color: "amber", icon: MessageSquare },
];

const TRENDING_SEARCHES = [
  "burgundy co-ord set", "heavyweight jacket", "desert sand zip", "luxury aviator",
  "onyx camp shirt", "slim trousers", "minimal accessories",
];

const AI_SEARCH_RESULTS = {
  "burgundy co-ord": [
    { name: "GOR Alo Burgundy Heavyweight Co-Ord Set", price: 380, relevance: 98 },
    { name: "Deep Plum Ribbed Knit Co-Ord", price: 295, relevance: 91 },
    { name: "Oxblood Structured Jacket", price: 490, relevance: 74 },
  ],
  default: [
    { name: "Prada Desert Sand Textured Zip Set", price: 520, relevance: 96 },
    { name: "GOR Designer Camp Shirting in Onyx", price: 240, relevance: 88 },
    { name: "Luxury Shearling Collar Aviator Jacket", price: 870, relevance: 82 },
  ],
};

const RECOMMENDATION_WIDGETS = [
  { id: "fbt", label: "Frequently Bought Together", ctr: "7.4%", revenue: "$12,840", active: true, icon: ShoppingBag },
  { id: "similar", label: "Similar Products", ctr: "5.9%", revenue: "$8,210", active: true, icon: Star },
  { id: "also_like", label: "You May Also Like", ctr: "6.2%", revenue: "$9,450", active: true, icon: Sparkles },
  { id: "recently", label: "Recently Viewed", ctr: "4.8%", revenue: "$5,890", active: true, icon: Clock },
  { id: "trending", label: "Trending Products", ctr: "8.1%", revenue: "$14,300", active: true, icon: TrendingUp },
  { id: "new", label: "New Arrivals", ctr: "3.6%", revenue: "$4,120", active: false, icon: Zap },
];

const MERCHANDISING_RULES = [
  { id: "auto_feature", label: "Auto Featured Products", desc: "AI surfaces top performers to homepage hero slots", active: true },
  { id: "trending", label: "Trending Detection", desc: "Real-time spike detection across product views & add-to-cart signals", active: true },
  { id: "bestseller", label: "Best Seller Detection", desc: "Automatically badge top 10% revenue products", active: true },
  { id: "low_stock", label: "Low Stock Highlight", desc: "Surface urgency UI for products with < 10 units remaining", active: false },
  { id: "seasonal", label: "Seasonal Suggestions", desc: "AI curates contextual collections based on calendar signals", active: false },
];

const CONTENT_TYPES = [
  { id: "product_desc", label: "Product Description", placeholder: "GOR Alo Burgundy Heavyweight Co-Ord Set — luxury streetwear" },
  { id: "seo_title", label: "SEO Meta Title", placeholder: "Burgundy co-ord set luxury menswear UK" },
  { id: "meta_desc", label: "Meta Description", placeholder: "Premium streetwear brand for modern customers" },
  { id: "collection_desc", label: "Collection Description", placeholder: "AW Collection — Premium outerwear & co-ords" },
  { id: "blog_draft", label: "Blog Draft Suggestion", placeholder: "How to style a co-ord set for every occasion" },
];

const GENERATED_CONTENT = {
  product_desc: `Crafted for the modern customer who demands both structure and edge — the GOR Alo Burgundy Heavyweight Co-Ord Set redefines premium streetwear. The deep burgundy colorway is precision-dyed for depth and durability, while the heavyweight fleece construction provides warmth without sacrificing silhouette. Available as a coordinated set or separates, this piece anchors any wardrobe with quiet authority.`,
  seo_title: `GOR Alo Burgundy Co-Ord Set | Premium Heavyweight Streetwear — GOR Menswear`,
  meta_desc: `Shop the GOR Alo Burgundy Heavyweight Co-Ord Set — precision-crafted premium streetwear for the modern customer. Free shipping on orders over £250. Explore the full collection at GOR Menswear.`,
  collection_desc: `The GOR Autumn/Winter Collection channels structure, precision, and understated luxury across every piece. From heavyweight co-ord sets to shearling-lined outerwear, each garment is engineered for the customer who values both quality and aesthetic intention.`,
  blog_draft: `# How to Style a Co-Ord Set for Every Occasion\n\nThe co-ord set has evolved from gym staple to street cornerstone. In this editorial, our team breaks down three ways to wear the GOR Alo Co-Ord — from relaxed weekend to polished evening. Key: never overthink it. Let the quality of the fabric do the work.`,
};

const CUSTOMER_SEGMENTS = [
  { label: "High-Intent Browsers", count: 284, churn: "Low", ltv: "$1,240", prob: 82 },
  { label: "Lapsed Members", count: 97, churn: "High", ltv: "$680", prob: 24 },
  { label: "Loyal Repeat Buyers", count: 143, churn: "Very Low", ltv: "$3,120", prob: 94 },
  { label: "First-Time Visitors", count: 512, churn: "Medium", ltv: "$390", prob: 41 },
  { label: "VIP Members", count: 38, churn: "Very Low", ltv: "$6,840", prob: 97 },
];

const AI_ANALYTICS_BARS = [
  { label: "Mon", ctr: 64 },
  { label: "Tue", ctr: 78 },
  { label: "Wed", ctr: 71 },
  { label: "Thu", ctr: 88 },
  { label: "Fri", ctr: 92 },
  { label: "Sat", ctr: 84 },
  { label: "Sun", ctr: 56 },
];

// ─── Component ────────────────────────────────────────────────────────
export default function AICommercePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [widgets, setWidgets] = useState(RECOMMENDATION_WIDGETS);
  const [rules, setRules] = useState(MERCHANDISING_RULES);
  const [contentType, setContentType] = useState("product_desc");
  const [contentPrompt, setContentPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { success } = useToast();

  // Simulate AI search
  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    setIsSearching(true);
    setTimeout(() => {
      const key = q.toLowerCase().includes("burgundy") ? "burgundy co-ord" : "default";
      setSearchResults(AI_SEARCH_RESULTS[key] || AI_SEARCH_RESULTS.default);
      setIsSearching(false);
    }, 600);
  };

  // Toggle widget
  const toggleWidget = (id) => setWidgets((prev) => prev.map((w) => w.id === id ? { ...w, active: !w.active } : w));

  // Toggle merchandising rule
  const toggleRule = (id) => setRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));

  // Simulate content generation
  const handleGenerate = () => {
    if (!contentPrompt.trim()) return;
    setIsGenerating(true);
    setGeneratedText("");
    const output = GENERATED_CONTENT[contentType] || GENERATED_CONTENT.product_desc;
    let i = 0;
    const interval = setInterval(() => {
      setGeneratedText(output.slice(0, i));
      i += 8;
      if (i >= output.length) { clearInterval(interval); setIsGenerating(false); setGeneratedText(output); }
    }, 18);
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (typeof window !== "undefined" && generatedText) {
      navigator.clipboard?.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      success("Copied", "AI-generated content copied to clipboard.");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const rows = ["Metric,Value", "Recommendation CTR,6.84%", "AI Conversion Rate,4.2%", "Search Success Rate,91.3%", "AI Content Pieces,38"].join("\n");
        const blob = new Blob([rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_AI_Commerce_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("Exported", "AI Commerce report downloaded successfully.");
    }, 700);
  };

  const TABS = [
    { id: "dashboard", label: "AI Dashboard" },
    { id: "search", label: "AI Search" },
    { id: "recommendations", label: "Recommendations" },
    { id: "merchandising", label: "Merchandising" },
    { id: "content", label: "Content Assistant" },
    { id: "customers", label: "Customer Intel" },
    { id: "analytics", label: "AI Analytics" },
  ];

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 font-sans select-none">
        <Container className="space-y-8">

          {/* ── HEADER ── */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4" /> AI COMMERCE ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                AI Commerce & Personalization Platform
              </h1>
              <p className="text-xs text-[#8E8A85] mt-1 font-light">Modular · Future-ready · LLM-agnostic architecture</p>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={exporting}
              className="h-10 px-5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 shrink-0"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export AI Report
            </button>
          </div>

          {/* ── TABS ── */}
          <div className="flex flex-wrap bg-[#151515] border border-[#2A2A2A] rounded-[14px] p-1 gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-[10px] text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  activeTab === t.id ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════════════
              TAB: AI DASHBOARD
          ══════════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">

              {/* Health Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {AI_HEALTH.map((h) => (
                  <div key={h.label} className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-5 space-y-3 shadow-xl">
                    <div className="flex justify-between items-start">
                      <h.icon className="w-5 h-5 text-[#C8A45D]" />
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                        h.color === "emerald"
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                      }`}>
                        {h.color === "emerald" ? "● Live" : "● Standby"}
                      </span>
                    </div>
                    <div>
                      <p className="font-editorial text-lg text-[#F8F6F3]">{h.label}</p>
                      <p className="text-[11px] text-[#8E8A85]">{h.status}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* KPI Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Recommendation CTR", value: "6.84%", trend: "+1.2%", up: true },
                  { label: "AI Conversion Rate", value: "4.2%", trend: "+0.7%", up: true },
                  { label: "Search Success Rate", value: "91.3%", trend: "+3.4%", up: true },
                  { label: "AI Content Pieces", value: "38 Pieces", trend: "+12 this week", up: true },
                ].map((m) => (
                  <div key={m.label} className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
                    <span className="text-[10px] uppercase text-[#8E8A85] block">{m.label}</span>
                    <span className="font-editorial text-2xl text-[#C8A45D]">{m.value}</span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" /> {m.trend}
                    </span>
                  </div>
                ))}
              </div>

              {/* Active Features Summary */}
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 space-y-4 shadow-xl">
                <h3 className="font-editorial text-xl text-[#F8F6F3]">Active AI Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { label: "Search Widgets", value: "NLP + Typo Tolerance + Synonyms + Trending", icon: Search },
                    { label: "Recommendation Widgets", value: "5 of 6 Active (86% coverage)", icon: Sparkles },
                    { label: "Merchandising Rules", value: "3 of 5 Active", icon: TrendingUp },
                    { label: "Content Types", value: "5 Templates Available", icon: MessageSquare },
                    { label: "Customer Segments", value: "5 AI Cohorts Tracked", icon: Users },
                    { label: "AI Analytics", value: "Live CTR + Conversion Dashboards", icon: BarChart3 },
                  ].map((f) => (
                    <div key={f.label} className="flex items-start gap-3 p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px]">
                      <f.icon className="w-4 h-4 text-[#C8A45D] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[#F8F6F3]">{f.label}</p>
                        <p className="text-[#8E8A85] mt-0.5">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB: AI SEARCH
          ══════════════════════════════════════════════ */}
          {activeTab === "search" && (
            <div className="space-y-6">
              {/* Search Input */}
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 space-y-5 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Search className="w-4 h-4 text-[#C8A45D]" />
                  <h3 className="font-editorial text-xl text-[#F8F6F3]">Natural Language AI Search Simulator</h3>
                </div>
                <p className="text-xs text-[#8E8A85]">Simulate semantic NLP search with typo tolerance, synonym expansion, and no-result recovery — ready for Algolia, Typesense, or Gemini Embeddings integration.</p>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]" />
                  <input
                    type="text"
                    aria-label="AI Search input"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder='Try "burgundy co-ord set" or "something warm for winter"…'
                    className="w-full h-13 pl-11 pr-4 py-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[12px] text-sm text-[#F8F6F3] outline-none placeholder:text-[#8E8A85]/50"
                  />
                  {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[#C8A45D]" />}
                </div>

                {/* Trending chips */}
                <div>
                  <p className="text-[10px] uppercase text-[#8E8A85] mb-2 tracking-wider">Trending Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSearch(q)}
                        className="px-3 py-1 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs text-[#F8F6F3] rounded-full transition-colors cursor-pointer"
                      >
                        <Hash className="w-3 h-3 inline-block mr-1 text-[#C8A45D]" />{q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results */}
                {searchResults.length > 0 && (
                  <div className="border-t border-[#2A2A2A] pt-4 space-y-3">
                    <p className="text-[10px] uppercase text-[#8E8A85] tracking-wider">{searchResults.length} Semantic Matches</p>
                    {searchResults.map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px]">
                        <div>
                          <p className="text-sm font-bold text-[#F8F6F3]">{r.name}</p>
                          <p className="text-xs font-mono text-[#C8A45D] mt-0.5">${r.price}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-[#8E8A85] block">AI Relevance</span>
                          <span className={`text-sm font-bold font-mono ${r.relevance >= 90 ? "text-emerald-400" : r.relevance >= 75 ? "text-amber-400" : "text-[#8E8A85]"}`}>
                            {r.relevance}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No result state */}
                {searchQuery && !isSearching && searchResults.length === 0 && (
                  <div className="border-t border-[#2A2A2A] pt-4 text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-xs text-[#8E8A85]">No exact match — AI is applying synonym expansion & broader semantic retrieval…</p>
                    <button type="button" onClick={() => handleSearch("luxury jacket")} className="text-xs text-[#C8A45D] underline">
                      Try a suggested recovery query
                    </button>
                  </div>
                )}
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Typo Tolerance", desc: "Corrects 'burgrndy', 'jaket', 'trouers' automatically via phonetic matching", icon: CheckCircle2 },
                  { label: "Synonym Expansion", desc: "Maps 'coat' → 'jacket', 'blazer' → 'structured jacket', 'set' → 'co-ord'", icon: RefreshCw },
                  { label: "No-Result Recovery", desc: "Fallback to broader semantic query with category suggestions", icon: Zap },
                ].map((f) => (
                  <div key={f.label} className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-5 space-y-2">
                    <f.icon className="w-5 h-5 text-[#C8A45D]" />
                    <p className="font-bold text-[#F8F6F3] text-sm">{f.label}</p>
                    <p className="text-xs text-[#8E8A85]">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB: RECOMMENDATIONS
          ══════════════════════════════════════════════ */}
          {activeTab === "recommendations" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgets.map((w) => (
                  <div key={w.id} className={`bg-[#151515] border rounded-[18px] p-5 space-y-4 shadow-xl transition-all ${w.active ? "border-[#C8A45D]/30" : "border-[#2A2A2A]"}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <w.icon className={`w-5 h-5 ${w.active ? "text-[#C8A45D]" : "text-[#8E8A85]"}`} />
                        <p className="font-bold text-sm text-[#F8F6F3]">{w.label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleWidget(w.id)}
                        aria-label={`Toggle ${w.label}`}
                        className="cursor-pointer"
                      >
                        {w.active
                          ? <ToggleRight className="w-6 h-6 text-[#C8A45D]" />
                          : <ToggleLeft className="w-6 h-6 text-[#8E8A85]" />
                        }
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[#090909] border border-[#2A2A2A] rounded-[8px] p-2 text-center">
                        <span className="text-[#8E8A85] block text-[10px]">CTR</span>
                        <span className="font-mono font-bold text-emerald-400">{w.ctr}</span>
                      </div>
                      <div className="bg-[#090909] border border-[#2A2A2A] rounded-[8px] p-2 text-center">
                        <span className="text-[#8E8A85] block text-[10px]">Revenue</span>
                        <span className="font-mono font-bold text-[#C8A45D]">{w.revenue}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border block w-fit ${
                      w.active ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30" : "bg-[#090909] text-[#8E8A85] border-[#2A2A2A]"
                    }`}>
                      {w.active ? "● Active" : "○ Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB: AI MERCHANDISING
          ══════════════════════════════════════════════ */}
          {activeTab === "merchandising" && (
            <div className="space-y-4">
              {rules.map((r) => (
                <div key={r.id} className={`bg-[#151515] border rounded-[16px] p-5 flex items-start justify-between gap-4 shadow-xl transition-all ${r.active ? "border-[#C8A45D]/30" : "border-[#2A2A2A]"}`}>
                  <div className="space-y-1 flex-1">
                    <p className="font-bold text-[#F8F6F3]">{r.label}</p>
                    <p className="text-xs text-[#8E8A85]">{r.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRule(r.id)}
                    aria-label={`Toggle ${r.label}`}
                    className="cursor-pointer shrink-0"
                  >
                    {r.active
                      ? <ToggleRight className="w-7 h-7 text-[#C8A45D]" />
                      : <ToggleLeft className="w-7 h-7 text-[#8E8A85]" />
                    }
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB: CONTENT ASSISTANT
          ══════════════════════════════════════════════ */}
          {activeTab === "content" && (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#C8A45D]" />
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">AI Content Assistant</h3>
              </div>
              <p className="text-xs text-[#8E8A85]">Generate on-brand copy for products, SEO, collections and blog content using AI. Simulated output — wire to Gemini API or OpenAI for live generation.</p>

              {/* Content Type Selector */}
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => { setContentType(ct.id); setGeneratedText(""); }}
                    className={`px-4 py-2 rounded-[8px] text-xs font-bold uppercase transition-colors cursor-pointer ${
                      contentType === ct.id ? "bg-[#C8A45D] text-[#090909]" : "bg-[#090909] border border-[#2A2A2A] text-[#8E8A85] hover:text-[#F8F6F3]"
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>

              {/* Prompt Input */}
              <div>
                <label className="text-xs text-[#8E8A85] block mb-2">
                  Describe the product, collection, or topic
                </label>
                <textarea
                  aria-label="AI content prompt"
                  rows={3}
                  value={contentPrompt}
                  onChange={(e) => setContentPrompt(e.target.value)}
                  placeholder={CONTENT_TYPES.find((c) => c.id === contentType)?.placeholder}
                  className="w-full px-4 py-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[12px] text-xs text-[#F8F6F3] outline-none resize-none placeholder:text-[#8E8A85]/50"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !contentPrompt.trim()}
                className="h-11 px-6 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? "Generating…" : "Generate with AI"}
              </button>

              {/* Output Area */}
              {(generatedText || isGenerating) && (
                <div className="relative bg-[#090909] border border-[#2A2A2A] rounded-[12px] p-5 space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#C8A45D] font-bold">AI Output</span>
                    {generatedText && !isGenerating && (
                      <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Copy AI output"
                        className="flex items-center gap-1.5 text-xs text-[#8E8A85] hover:text-[#F8F6F3] cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[#F8F6F3] font-light leading-relaxed whitespace-pre-line">
                    {generatedText}
                    {isGenerating && <span className="inline-block w-1.5 h-3.5 bg-[#C8A45D] animate-pulse ml-0.5 rounded-sm" />}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB: CUSTOMER INTELLIGENCE
          ══════════════════════════════════════════════ */}
          {activeTab === "customers" && (
            <div className="space-y-4">
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                      <th className="py-3.5 px-4 font-bold">AI Segment</th>
                      <th className="py-3.5 px-4 font-bold">Members</th>
                      <th className="py-3.5 px-4 font-bold">Churn Risk</th>
                      <th className="py-3.5 px-4 font-bold">Avg LTV</th>
                      <th className="py-3.5 px-4 font-bold">Repeat Purchase Prob.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]">
                    {CUSTOMER_SEGMENTS.map((seg) => (
                      <tr key={seg.label} className="hover:bg-[#090909]/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#F8F6F3] flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#C8A45D] shrink-0" />
                          {seg.label}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#F8F6F3]">{seg.count.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                            seg.churn === "Very Low" || seg.churn === "Low"
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                              : seg.churn === "High"
                              ? "bg-rose-950/80 text-rose-400 border-rose-500/30"
                              : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                          }`}>
                            {seg.churn}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#C8A45D]">{seg.ltv}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-[#090909] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#C8A45D] rounded-full"
                                style={{ width: `${seg.prob}%` }}
                              />
                            </div>
                            <span className={`font-mono text-xs font-bold ${seg.prob >= 80 ? "text-emerald-400" : seg.prob >= 50 ? "text-amber-400" : "text-rose-400"}`}>
                              {seg.prob}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB: AI ANALYTICS
          ══════════════════════════════════════════════ */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* CTR Trend */}
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-editorial text-xl text-[#F8F6F3]">Recommendation CTR — Weekly Trend</h3>
                  <span className="text-xs font-mono text-[#C8A45D]">Avg 76.1%</span>
                </div>
                <div className="h-52 flex items-end justify-between gap-3 pt-4 pb-4 border-b border-[#2A2A2A]">
                  {AI_ANALYTICS_BARS.map((b) => (
                    <div key={b.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono text-[#C8A45D] opacity-0 group-hover:opacity-100 transition-opacity">{b.ctr}%</span>
                      <div
                        className="w-full bg-[#2A2A2A] group-hover:bg-[#C8A45D] transition-colors rounded-t-[4px]"
                        style={{ height: `${b.ctr}%` }}
                      />
                      <span className="text-[11px] font-mono text-[#8E8A85]">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Recommendation CTR", value: "6.84%", sub: "+1.2% vs baseline" },
                  { label: "AI Conversion Rate", value: "4.2%", sub: "vs 2.8% store avg" },
                  { label: "Search Success Rate", value: "91.3%", sub: "of queries returned results" },
                  { label: "AI Content Pieces", value: "38", sub: "generated this period" },
                ].map((m) => (
                  <div key={m.label} className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
                    <span className="text-[10px] uppercase text-[#8E8A85] block">{m.label}</span>
                    <span className="font-editorial text-2xl text-[#C8A45D]">{m.value}</span>
                    <span className="text-[10px] text-emerald-400">{m.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </Container>
      </main>
      <Footer />
    </>
  );
}
