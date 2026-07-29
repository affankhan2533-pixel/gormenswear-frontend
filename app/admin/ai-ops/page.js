"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  Plus,
  Zap,
  ShieldCheck,
  Search,
  MessageSquare,
  Sliders,
  CheckSquare,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";

// Data Imports
import {
  INITIAL_AI_OPS_METRICS,
  INITIAL_BUSINESS_INSIGHTS,
  INITIAL_SMART_ALERTS,
  INITIAL_AI_RECOMMENDATIONS,
  INITIAL_APPROVAL_CENTER_ACTIONS,
  INITIAL_WORKFLOW_AUTOMATIONS,
  INITIAL_KNOWLEDGE_ASSISTANT_QA,
  INITIAL_AI_GOVERNANCE_CONFIG,
} from "@/lib/aiOpsData";

// Components Import
import AIOpsDashboardView from "@/components/aiOps/AIOpsDashboardView";
import BusinessInsightsView from "@/components/aiOps/BusinessInsightsView";
import SmartAlertsView from "@/components/aiOps/SmartAlertsView";
import AIRecommendationsView from "@/components/aiOps/AIRecommendationsView";
import ApprovalCenterView from "@/components/aiOps/ApprovalCenterView";
import WorkflowAutomationView from "@/components/aiOps/WorkflowAutomationView";
import KnowledgeAssistantView from "@/components/aiOps/KnowledgeAssistantView";
import AIGovernanceConfigView from "@/components/aiOps/AIGovernanceConfigView";

export default function EnterpriseAIOpsPage() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("overview"); // overview, insights, alerts, recommendations, approvals, automations, assistant, governance

  // State Management
  const [metrics, setMetrics] = useState(INITIAL_AI_OPS_METRICS);
  const [insights, setInsights] = useState(INITIAL_BUSINESS_INSIGHTS);
  const [alerts, setAlerts] = useState(INITIAL_SMART_ALERTS);
  const [recommendations, setRecommendations] = useState(INITIAL_AI_RECOMMENDATIONS);
  const [pendingActions, setPendingActions] = useState(INITIAL_APPROVAL_CENTER_ACTIONS);
  const [automations, setAutomations] = useState(INITIAL_WORKFLOW_AUTOMATIONS);
  const [governanceConfig, setGovernanceConfig] = useState(INITIAL_AI_GOVERNANCE_CONFIG);

  const { success, info, error: toastError } = useToast();

  // ── HANDLERS: APPROVAL CENTER ──
  const handleApproveAction = (actionId) => {
    const approvedAct = pendingActions.find((a) => a.id === actionId);
    setPendingActions(pendingActions.filter((a) => a.id !== actionId));
    setMetrics({
      ...metrics,
      pendingApprovalsCount: Math.max(0, metrics.pendingApprovalsCount - 1),
    });

    success(
      "Action Approved & Executed",
      `${approvedAct ? approvedAct.actionName : "Action #" + actionId} executed successfully.`
    );
  };

  const handleRejectAction = (actionId) => {
    setPendingActions(pendingActions.filter((a) => a.id !== actionId));
    setMetrics({
      ...metrics,
      pendingApprovalsCount: Math.max(0, metrics.pendingApprovalsCount - 1),
    });

    info("Action Declined", `Proposed action #${actionId} rejected by administrator.`);
  };

  // ── HANDLER: DISMISS ALERT ──
  const handleDismissAlert = (alertId) => {
    setAlerts(alerts.filter((a) => a.id !== alertId));
    setMetrics({
      ...metrics,
      activeAlertsCount: Math.max(0, metrics.activeAlertsCount - 1),
    });
    info("Alert Dismissed", `Operational alert #${alertId} dismissed.`);
  };

  // ── HANDLER: PROMOTE RECOMMENDATION TO APPROVAL ──
  const handlePromoteToApproval = (recObj) => {
    const newApproval = {
      id: `act-${Date.now()}`,
      actionName: recObj.title,
      category: recObj.category,
      riskLevel: recObj.riskLevel,
      confidenceScore: recObj.confidenceScore,
      description: recObj.description,
      payload: JSON.stringify(recObj),
      status: "Pending Approval",
    };

    setPendingActions([newApproval, ...pendingActions]);
    setMetrics({
      ...metrics,
      pendingApprovalsCount: metrics.pendingApprovalsCount + 1,
    });

    success(
      "Recommendation Submitted",
      `"${recObj.title}" submitted to Human Approval Center.`
    );
  };

  // ── HANDLER: TOGGLE WORKFLOW AUTOMATION ──
  const handleToggleAutomation = (wfId) => {
    setAutomations(
      automations.map((w) =>
        (w.id === wfId || w.idStr === wfId) ? { ...w, enabled: !w.enabled } : w
      )
    );
    info("Automation Toggled", `Workflow trigger state updated.`);
  };

  // ── HANDLERS: GOVERNANCE ──
  const handleChangeThreshold = (newVal) => {
    setGovernanceConfig({ ...governanceConfig, confidenceThresholdPercent: newVal });
    success("Threshold Saved", `Minimum AI confidence threshold set to ${newVal}%.`);
  };

  const handleToggleApprovalRule = (ruleKey) => {
    setGovernanceConfig({
      ...governanceConfig,
      [ruleKey]: !governanceConfig[ruleKey],
    });
    info("Governance Rule Updated", `Approval policy rule toggled.`);
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
                    <Sparkles className="w-4 h-4" /> AI OPERATIONS & AUTONOMOUS ADMINISTRATION
                  </span>
                </div>
                <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#F8F6F3]">
                  AI Co-Pilot & Autonomous Operations
                </h1>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("approvals")}
                  className="h-[40px] px-3.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4 text-[#C8A45D]" />
                  <span>Approval Center ({pendingActions.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("assistant")}
                  className="h-[40px] px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg font-bold"
                >
                  <Bot className="w-4 h-4" />
                  <span>AI Assistant</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-t border-[#2A2A2A] pt-4">
              {[
                { id: "overview", label: "AI Overview" },
                { id: "insights", label: "Business Insights" },
                { id: "alerts", label: `Smart Alerts (${alerts.length})` },
                { id: "recommendations", label: `AI Recommendations (${recommendations.length})` },
                { id: "approvals", label: `Approval Center (${pendingActions.length})` },
                { id: "automations", label: `Automations (${automations.length})` },
                { id: "assistant", label: "Knowledge Assistant" },
                { id: "governance", label: "AI Governance" },
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

          {/* ── TAB CONTENT VIEWS ── */}
          {activeTab === "overview" && (
            <AIOpsDashboardView
              metrics={metrics}
              alerts={alerts}
              recommendations={recommendations}
              pendingApprovals={pendingActions}
              onNavigateTab={(t) => setActiveTab(t)}
            />
          )}

          {activeTab === "insights" && <BusinessInsightsView insights={insights} />}

          {activeTab === "alerts" && (
            <SmartAlertsView alerts={alerts} onDismissAlert={handleDismissAlert} />
          )}

          {activeTab === "recommendations" && (
            <AIRecommendationsView
              recommendations={recommendations}
              onPromoteToApproval={handlePromoteToApproval}
            />
          )}

          {activeTab === "approvals" && (
            <ApprovalCenterView
              pendingActions={pendingActions}
              onApproveAction={handleApproveAction}
              onRejectAction={handleRejectAction}
            />
          )}

          {activeTab === "automations" && (
            <WorkflowAutomationView
              automations={automations}
              onToggleAutomation={handleToggleAutomation}
            />
          )}

          {activeTab === "assistant" && (
            <KnowledgeAssistantView preIndexedQA={INITIAL_KNOWLEDGE_ASSISTANT_QA} />
          )}

          {activeTab === "governance" && (
            <AIGovernanceConfigView
              config={governanceConfig}
              onChangeThreshold={handleChangeThreshold}
              onToggleApprovalRule={handleToggleApprovalRule}
            />
          )}

        </Container>
      </main>

      <Footer />
    </>
  );
}
