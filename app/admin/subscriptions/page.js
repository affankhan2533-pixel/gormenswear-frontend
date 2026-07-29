"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Users,
  Award,
  DollarSign,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Clock,
  ChevronRight,
  HeartHandshake,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

// Data Imports
import {
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_MEMBERSHIP_TIERS,
  INITIAL_CUSTOMER_SUBSCRIPTIONS,
  INITIAL_BENEFITS_RULES,
  INITIAL_SUBSCRIPTION_ANALYTICS,
} from "@/lib/subscriptionData";

// Sub-components Import
import SubscriptionPlanCard from "@/components/subscriptions/SubscriptionPlanCard";
import SubscriptionPlanModal from "@/components/subscriptions/SubscriptionPlanModal";
import MembershipTierCard from "@/components/subscriptions/MembershipTierCard";
import MembershipTierModal from "@/components/subscriptions/MembershipTierModal";
import CustomerSubscriptionTable from "@/components/subscriptions/CustomerSubscriptionTable";
import CustomerSubscriptionModal from "@/components/subscriptions/CustomerSubscriptionModal";
import BenefitsEngineRuleTable from "@/components/subscriptions/BenefitsEngineRuleTable";
import SubscriptionAnalytics from "@/components/subscriptions/SubscriptionAnalytics";
import SubscriptionExportModal from "@/components/subscriptions/SubscriptionExportModal";

export default function EnterpriseSubscriptionsPage() {
  // State Management
  const [activeTab, setActiveTab] = useState("overview"); // overview, plans, tiers, subscribers, benefits, analytics, export
  const [plans, setPlans] = useState(INITIAL_SUBSCRIPTION_PLANS);
  const [tiers, setTiers] = useState(INITIAL_MEMBERSHIP_TIERS);
  const [subscribers, setSubscribers] = useState(INITIAL_CUSTOMER_SUBSCRIPTIONS);
  const [benefitsRules, setBenefitsRules] = useState(INITIAL_BENEFITS_RULES);
  const [analyticsData, setAnalyticsData] = useState(INITIAL_SUBSCRIPTION_ANALYTICS);

  // Modal Visibilities
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState(null);

  const [isSubscriberModalOpen, setIsSubscriberModalOpen] = useState(false);
  const [viewingSubscriber, setViewingSubscriber] = useState(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const { success, info, error: toastError } = useToast();

  // ── KPI CALCULATIONS ──
  const kpis = useMemo(() => {
    const activeSubscribersCount = subscribers.filter((s) => s.status === "Active").length;
    const mrrTotal = subscribers.reduce((sum, s) => sum + (s.status === "Active" ? s.mrrValue : 0), 0);
    const arrTotal = mrrTotal * 12;
    const renewalRate = analyticsData.renewalRate;
    const churnRate = analyticsData.churnRate;
    const upcomingRenewalsCount = analyticsData.upcomingRenewals;

    return {
      activeSubscribersCount,
      mrrTotal,
      arrTotal,
      renewalRate,
      churnRate,
      upcomingRenewalsCount,
    };
  }, [subscribers, analyticsData]);

  // ── HANDLERS: PLAN MANAGEMENT ──
  const handleSavePlan = (planData) => {
    const exists = plans.find((p) => p.id === planData.id);
    if (exists) {
      setPlans(plans.map((p) => (p.id === planData.id ? planData : p)));
      success("Subscription Plan Saved", `${planData.name} parameters updated.`);
    } else {
      setPlans([planData, ...plans]);
      success("Subscription Plan Created", `${planData.name} initialized.`);
    }
  };

  const handleTogglePlanStatus = (planObj) => {
    const nextStatus = planObj.status === "Active" ? "Paused" : "Active";
    setPlans(
      plans.map((p) => (p.id === planObj.id ? { ...p, status: nextStatus } : p))
    );
    info("Plan Status Changed", `${planObj.name} is now ${nextStatus}.`);
  };

  // ── HANDLERS: MEMBERSHIP TIERS ──
  const handleSaveTier = (tierData) => {
    setTiers(tiers.map((t) => (t.id === tierData.id ? tierData : t)));
    success("Membership Tier Updated", `${tierData.name} Tier benefits saved.`);
  };

  // ── HANDLERS: SUBSCRIBERS ──
  const handleUpdateSubscriberStatus = (subId, nextStatus) => {
    setSubscribers(
      subscribers.map((s) => (s.id === subId ? { ...s, status: nextStatus } : s))
    );
    success("Subscriber Status Updated", `Subscription state changed to ${nextStatus}.`);
  };

  // ── HANDLERS: BENEFITS ENGINE ──
  const handleToggleBenefitStatus = (ruleId) => {
    setBenefitsRules(
      benefitsRules.map((r) =>
        r.id === ruleId ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r
      )
    );
    info("Benefits Rule Toggled", "Configurable rule status updated.");
  };

  // ── HANDLERS: EXPORT ──
  const handleExportCSV = () => {
    const header = "SubscriberCode,CustomerName,Email,PlanName,Tier,MRRValue,Status,RenewalDate,PaymentMethod\n";
    const rows = subscribers
      .map(
        (s) =>
          `"${s.subscriberCode}","${s.customerName}","${s.customerEmail}","${s.planName}","${s.tier}",${s.mrrValue},"${s.status}","${s.renewalDate}","${s.paymentMethod}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GOR_Subscriptions_Export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    success("CSV Exported", "Subscriber dataset downloaded.");
  };

  const handleExportExcel = () => {
    const xmlHeader = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="Subscribers">
<Table>
<Row>
<Cell><Data ss:Type="String">Code</Data></Cell>
<Cell><Data ss:Type="String">Customer Name</Data></Cell>
<Cell><Data ss:Type="String">Plan</Data></Cell>
<Cell><Data ss:Type="String">Tier</Data></Cell>
<Cell><Data ss:Type="Number">MRR</Data></Cell>
<Cell><Data ss:Type="String">Status</Data></Cell>
</Row>`;

    const xmlBody = subscribers
      .map(
        (s) => `<Row>
<Cell><Data ss:Type="String">${s.subscriberCode}</Data></Cell>
<Cell><Data ss:Type="String">${s.customerName}</Data></Cell>
<Cell><Data ss:Type="String">${s.planName}</Data></Cell>
<Cell><Data ss:Type="String">${s.tier}</Data></Cell>
<Cell><Data ss:Type="Number">${s.mrrValue}</Data></Cell>
<Cell><Data ss:Type="String">${s.status}</Data></Cell>
</Row>`
      )
      .join("");

    const xmlFooter = `</Table></Worksheet></Workbook>`;

    const blob = new Blob([xmlHeader + xmlBody + xmlFooter], { type: "application/vnd.ms-excel" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GOR_Subscriptions_Master_${new Date().toISOString().split("T")[0]}.xls`;
    a.click();
    success("Excel Exported", "Excel formatted workbook downloaded.");
  };

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 select-none relative font-sans">
        
        {/* Header */}
        <div className="bg-[#151515] border-b border-[#2A2A2A] py-10 mb-8">
          <Container>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Link
                    href="/admin"
                    className="p-1.5 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> RECURRING & MEMBERSHIP COMMERCE
                  </span>
                </div>
                <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#F8F6F3]">
                  Subscription & Membership Operations
                </h1>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="h-[40px] px-3.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Export Center</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingPlan(null);
                    setIsPlanModalOpen(true);
                  }}
                  className="h-[40px] px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Subscription Plan</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-t border-[#2A2A2A] pt-4">
              {[
                { id: "overview", label: "Executive Overview" },
                { id: "plans", label: `Subscription Plans (${plans.length})` },
                { id: "tiers", label: `Membership Tiers (${tiers.length})` },
                { id: "subscribers", label: `Subscribers (${subscribers.length})` },
                { id: "benefits", label: "Benefits Engine" },
                { id: "analytics", label: "Subscription Analytics" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-[10px] text-xs font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                    activeTab === tab.id
                      ? "bg-[#C8A45D] text-[#090909]"
                      : "bg-[#090909] text-[#8E8A85] border border-[#2A2A2A] hover:text-[#F8F6F3]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Container>
        </div>

        <Container className="space-y-8">

          {/* ── 1. EXECUTIVE KPI METRICS BAR ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Active Subscriptions
              </span>
              <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
                {kpis.activeSubscribersCount}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Monthly Recurring (MRR)
              </span>
              <span className="font-editorial text-2xl font-bold text-[#C8A45D] block">
                ${(kpis.mrrTotal / 1000).toFixed(1)}k
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Annual Run Rate (ARR)
              </span>
              <span className="font-editorial text-2xl font-bold text-emerald-400 block">
                ${(kpis.arrTotal / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Renewal Rate
              </span>
              <span className="font-editorial text-2xl font-bold text-emerald-400 block">
                {kpis.renewalRate}%
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Subscriber Churn
              </span>
              <span className="font-editorial text-2xl font-bold text-rose-400 block">
                {kpis.churnRate}%
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Upcoming Renewals
              </span>
              <span className="font-editorial text-2xl font-bold text-blue-400 block">
                {kpis.upcomingRenewalsCount} Renewals
              </span>
            </div>
          </div>

          {/* ── 2. TAB CONTENT VIEWS ── */}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Plans Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                      Active Recurring Subscription Plans
                    </h2>
                    <p className="text-xs text-[#8E8A85]">
                      Weekly, Monthly, Quarterly, Annual, and Custom Atelier Membership boxes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPlan(null);
                      setIsPlanModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-xs font-bold uppercase tracking-wider rounded-[10px] border border-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <SubscriptionPlanCard
                      key={plan.id}
                      plan={plan}
                      onEdit={(p) => {
                        setEditingPlan(p);
                        setIsPlanModalOpen(true);
                      }}
                      onToggleStatus={handleTogglePlanStatus}
                      onArchive={() => {}}
                    />
                  ))}
                </div>
              </div>

              {/* Tiers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                      Membership Tier Hierarchy
                    </h2>
                    <p className="text-xs text-[#8E8A85]">
                      Configurable Standard, Silver, Gold, and Platinum tier rules.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tiers.map((tier) => (
                    <MembershipTierCard
                      key={tier.id}
                      tier={tier}
                      onEdit={(t) => {
                        setEditingTier(t);
                        setIsTierModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLANS */}
          {activeTab === "plans" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Subscription Plan Directory
                  </h2>
                  <p className="text-xs text-[#8E8A85]">
                    Manage recurring billing intervals, pricing, discount incentives, and included features.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPlan(null);
                    setIsPlanModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" /> Create New Plan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <SubscriptionPlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={(p) => {
                      setEditingPlan(p);
                      setIsPlanModalOpen(true);
                    }}
                    onToggleStatus={handleTogglePlanStatus}
                    onArchive={() => {}}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TIERS */}
          {activeTab === "tiers" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                  Membership Tier Benefits Configurator
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Configure annual spend thresholds, member discount rates, early access hours, and exclusive collection rights.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tiers.map((tier) => (
                  <MembershipTierCard
                    key={tier.id}
                    tier={tier}
                    onEdit={(t) => {
                      setEditingTier(t);
                      setIsTierModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SUBSCRIBERS */}
          {activeTab === "subscribers" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                  Customer Subscriber Directory
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Monitor active recurring subscribers, upcoming renewal dates, shipping schedules, and audit billing history.
                </p>
              </div>

              <CustomerSubscriptionTable
                subscriptions={subscribers}
                onViewSubscriber={(sub) => {
                  setViewingSubscriber(sub);
                  setIsSubscriberModalOpen(true);
                }}
                onToggleStatus={(sub) => {
                  const nextState = sub.status === "Active" ? "Paused" : "Active";
                  handleUpdateSubscriberStatus(sub.id, nextState);
                }}
              />
            </div>
          )}

          {/* TAB 5: BENEFITS */}
          {activeTab === "benefits" && (
            <BenefitsEngineRuleTable
              benefitsRules={benefitsRules}
              onToggleBenefitStatus={handleToggleBenefitStatus}
            />
          )}

          {/* TAB 6: ANALYTICS */}
          {activeTab === "analytics" && <SubscriptionAnalytics analyticsData={analyticsData} />}

        </Container>
      </main>

      {/* ── MODALS ── */}
      <SubscriptionPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSave={handleSavePlan}
        plan={editingPlan}
      />

      <MembershipTierModal
        isOpen={isTierModalOpen}
        onClose={() => setIsTierModalOpen(false)}
        onSave={handleSaveTier}
        tier={editingTier}
      />

      <CustomerSubscriptionModal
        isOpen={isSubscriberModalOpen}
        onClose={() => setIsSubscriberModalOpen(false)}
        onUpdateStatus={handleUpdateSubscriberStatus}
        subscriber={viewingSubscriber}
      />

      <SubscriptionExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
      />

      <Footer />
    </>
  );
}
