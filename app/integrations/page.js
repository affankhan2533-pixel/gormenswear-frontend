"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Key,
  Webhook,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CreditCard,
  Truck,
  Mail,
  BarChart3,
  Share2,
  X,
  Loader2,
  ExternalLink,
  Check,
  Zap,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";

const INITIAL_SERVICES = [
  {
    id: "srv-1",
    name: "Stripe Payments",
    category: "Payment",
    status: "Connected",
    health: "Healthy",
    apiKey: "pk_live_99281481029481029481",
    environment: "Production",
    lastSync: "Just now",
    icon: CreditCard,
  },
  {
    id: "srv-2",
    name: "FedEx Express Priority",
    category: "Shipping",
    status: "Connected",
    health: "Healthy",
    apiKey: "fdx_live_881029481029",
    environment: "Production",
    lastSync: "3 mins ago",
    icon: Truck,
  },
  {
    id: "srv-3",
    name: "Resend Email API",
    category: "Email/SMS",
    status: "Connected",
    health: "Healthy",
    apiKey: "re_live_771029481029",
    environment: "Production",
    lastSync: "12 mins ago",
    icon: Mail,
  },
  {
    id: "srv-4",
    name: "Google Analytics 4 (GA4)",
    category: "Analytics",
    status: "Connected",
    health: "Healthy",
    apiKey: "G-GOR2026MENSWEAR",
    environment: "Production",
    lastSync: "Continuous",
    icon: BarChart3,
  },
  {
    id: "srv-5",
    name: "Meta Pixel & Conversions API",
    category: "Analytics",
    status: "Connected",
    health: "Healthy",
    apiKey: "pix_992019481029",
    environment: "Production",
    lastSync: "Continuous",
    icon: Share2,
  },
  {
    id: "srv-6",
    name: "Twilio SMS Dispatch",
    category: "Email/SMS",
    status: "Action Required",
    health: "Degraded",
    apiKey: "tw_AC99281029481029",
    environment: "Production",
    lastSync: "1 hour ago",
    icon: Mail,
  },
];

const INITIAL_WEBHOOKS = [
  { id: "wh-1", event: "order.created", target: "https://api.gormenswear.com/webhooks/orders", status: "Active", attempts: "100% Success" },
  { id: "wh-2", event: "payment.captured", target: "https://api.gormenswear.com/webhooks/payments", status: "Active", attempts: "100% Success" },
  { id: "wh-3", event: "shipment.delivered", target: "https://api.gormenswear.com/webhooks/shipping", status: "Active", attempts: "99.8% Success" },
];

export default function IntegrationsAPIPage() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [webhooks, setWebhooks] = useState(INITIAL_WEBHOOKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showMaskedKeys, setShowMaskedKeys] = useState({});
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === "all" || s.category.toLowerCase().includes(categoryFilter.toLowerCase());
      return matchSearch && matchCategory;
    });
  }, [services, searchQuery, categoryFilter]);

  // Toggle API Key Masking
  const toggleKeyMask = (id) => {
    setShowMaskedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy API Key
  const handleCopyKey = (keyText) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(keyText);
      success("Copied to Clipboard", "API Credential key copied.");
    }
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "ID,Service_Name,Category,Status,Health,Environment,Last_Sync\n";
        const rows = services
          .map((s) => `${s.id},"${s.name}",${s.category},${s.status},${s.health},${s.environment},"${s.lastSync}"`)
          .join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_Integrations_API_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("CSV Exported", "Integrations & API report downloaded successfully.");
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
                <Cpu className="w-4 h-4" /> API & GATEWAY ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Integrations & API Management Center
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowWebhookModal(true)}
                className="h-10 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs font-semibold text-[#F8F6F3] rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Webhook className="w-4 h-4 text-[#C8A45D]" />
                <span>Webhook Rules</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                disabled={exporting}
                className="h-10 px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Connected Services</span>
              <span className="font-editorial text-2xl text-[#C8A45D]">14 Active</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">API Gateway Uptime</span>
              <span className="font-editorial text-2xl text-emerald-400">99.98%</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Daily Webhook Events</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">1,420</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">API Error Rate</span>
              <span className="font-editorial text-2xl text-emerald-400">0.02%</span>
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
                  placeholder="Search provider name or integration..."
                  className="w-full h-10 pl-10 pr-3 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs text-[#F8F6F3] outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="payment">Payment Gateways</option>
                <option value="shipping">Logistics & Shipping</option>
                <option value="email">Email & SMS</option>
                <option value="analytics">Analytics & Telemetry</option>
              </select>
            </div>
          </div>

          {/* ── SERVICES GRID ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((srv) => {
              const IconComp = srv.icon;
              const isRevealed = showMaskedKeys[srv.id];
              return (
                <div key={srv.id} className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-5 space-y-4 shadow-xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[10px] bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-editorial text-base text-[#F8F6F3]">{srv.name}</h4>
                          <span className="text-[10px] font-mono text-[#8E8A85]">{srv.category}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                          srv.health === "Healthy"
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {srv.health}
                      </span>
                    </div>

                    {/* Masked API Key Display */}
                    <div className="p-2.5 bg-[#090909] border border-[#2A2A2A] rounded-[8px] flex items-center justify-between gap-2 font-mono text-xs text-[#8E8A85]">
                      <span className="truncate">
                        {isRevealed ? srv.apiKey : `${srv.apiKey.slice(0, 7)}...••••••••`}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button type="button" onClick={() => toggleKeyMask(srv.id)} className="p-1 hover:text-[#F8F6F3]">
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button type="button" onClick={() => handleCopyKey(srv.apiKey)} className="p-1 hover:text-[#C8A45D]">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-[11px] font-mono text-[#8E8A85]">
                    <span>Last Sync: {srv.lastSync}</span>
                    <span className="text-[#C8A45D]">{srv.environment}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </Container>
      </main>

      {/* Webhook Configurator Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans select-none">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  WEBHOOK DISPATCH ENGINE
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">Active Event Webhooks</h3>
              </div>
              <button type="button" onClick={() => setShowWebhookModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {webhooks.map((wh) => (
                <div key={wh.id} className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-xs text-[#C8A45D] block">{wh.event}</span>
                    <span className="font-mono text-xs text-[#8E8A85] block truncate max-w-sm">{wh.target}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-emerald-400">{wh.attempts}</span>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded">
                      {wh.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#2A2A2A] flex justify-end">
              <button
                type="button"
                onClick={() => setShowWebhookModal(false)}
                className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md"
              >
                Close Webhooks
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
