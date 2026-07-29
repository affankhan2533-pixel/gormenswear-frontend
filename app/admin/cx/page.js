"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageSquare,
  Clock,
  Star,
  Users,
  ShieldCheck,
  ArrowLeft,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Scissors,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";

// Data Imports
import {
  INITIAL_CX_METRICS,
  INITIAL_SUPPORT_CASES,
  INITIAL_CUSTOMER_TIMELINE,
  INITIAL_POST_PURCHASE_SERVICES,
  INITIAL_CUSTOMER_FEEDBACK,
  INITIAL_KNOWLEDGE_BASE_ARTICLES,
  INITIAL_SLA_GOVERNANCE,
  INITIAL_CX_REPORTING,
} from "@/lib/cxData";

// Components Import
import CXDashboardView from "@/components/cx/CXDashboardView";
import SupportCaseTable from "@/components/cx/SupportCaseTable";
import CaseDetailModal from "@/components/cx/CaseDetailModal";
import CustomerTimelineView from "@/components/cx/CustomerTimelineView";
import CommunicationCenterView from "@/components/cx/CommunicationCenterView";
import PostPurchaseServiceView from "@/components/cx/PostPurchaseServiceView";
import CustomerFeedbackView from "@/components/cx/CustomerFeedbackView";
import KnowledgeBaseView from "@/components/cx/KnowledgeBaseView";
import SLAGovernanceView from "@/components/cx/SLAGovernanceView";
import CXReportingView from "@/components/cx/CXReportingView";

export default function EnterpriseCXPage() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("overview"); // overview, cases, timeline, inbox, services, feedback, kb, sla, analytics

  // State Management
  const [metrics, setMetrics] = useState(INITIAL_CX_METRICS);
  const [cases, setCases] = useState(INITIAL_SUPPORT_CASES);
  const [timelineEvents, setTimelineEvents] = useState(INITIAL_CUSTOMER_TIMELINE);
  const [postPurchaseServices, setPostPurchaseServices] = useState(INITIAL_POST_PURCHASE_SERVICES);
  const [feedback, setFeedback] = useState(INITIAL_CUSTOMER_FEEDBACK);
  const [knowledgeBase, setKnowledgeBase] = useState(INITIAL_KNOWLEDGE_BASE_ARTICLES);
  const [slaData, setSlaData] = useState(INITIAL_SLA_GOVERNANCE);
  const [reportingData, setReportingData] = useState(INITIAL_CX_REPORTING);

  // Modals Visibility
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  const { success, info, error: toastError } = useToast();

  // ── HANDLERS: CASES ──
  const handleSaveCase = (updatedCase) => {
    setCases(cases.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
    success("Support Case Updated", `Case #${updatedCase.caseNumber} updated successfully.`);
  };

  const handleCreateNewCase = () => {
    const newCase = {
      id: `case-${Date.now()}`,
      caseNumber: `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: "Lord Julian Sterling",
      customerEmail: "j.sterling@mayfair.co.uk",
      channel: "WhatsApp",
      priority: "Urgent",
      status: "New",
      assignedAgent: "Marcus Sterling (Lead Concierge)",
      subject: "Bespoke Suit Fit Query",
      createdAt: "Just now",
      slaTarget: "Target: 15 mins remaining",
      sentiment: "Positive",
      notes: "VIP Client inquiry.",
    };

    setCases([newCase, ...cases]);
    setEditingCase(newCase);
    setIsCaseModalOpen(true);
    success("New Case Created", `Case #${newCase.caseNumber} registered.`);
  };

  // ── HANDLERS: FEEDBACK MODERATION ──
  const handleModerateFeedback = (feedbackId, newStatus) => {
    setFeedback(
      feedback.map((f) => (f.id === feedbackId ? { ...f, status: newStatus } : f))
    );
    success("Review Moderated", `Customer review status set to ${newStatus}.`);
  };

  const handleSendOmnichannelReply = (replyText) => {
    success("Message Dispatched", "Reply sent via Concierge Messaging System.");
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
                    <Heart className="w-4 h-4" /> ENTERPRISE CUSTOMER EXPERIENCE PLATFORM
                  </span>
                </div>
                <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#F8F6F3]">
                  Customer Experience & Concierge Hub
                </h1>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCreateNewCase}
                  className="h-[40px] px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Support Case</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-t border-[#2A2A2A] pt-4">
              {[
                { id: "overview", label: "CX Overview" },
                { id: "cases", label: `Support Cases (${cases.length})` },
                { id: "timeline", label: "360° Customer Timeline" },
                { id: "inbox", label: "Omnichannel Inbox" },
                { id: "services", label: `Post-Purchase Services (${postPurchaseServices.length})` },
                { id: "feedback", label: `Feedback (${feedback.length})` },
                { id: "kb", label: `Knowledge Base (${knowledgeBase.length})` },
                { id: "sla", label: "SLA Governance" },
                { id: "analytics", label: "Support Analytics" },
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
            <CXDashboardView
              metrics={metrics}
              onNavigateTab={(t) => setActiveTab(t)}
            />
          )}

          {activeTab === "cases" && (
            <SupportCaseTable
              cases={cases}
              onOpenCaseDetail={(c) => {
                setEditingCase(c);
                setIsCaseModalOpen(true);
              }}
              onCreateCase={handleCreateNewCase}
            />
          )}

          {activeTab === "timeline" && (
            <CustomerTimelineView timelineEvents={timelineEvents} />
          )}

          {activeTab === "inbox" && (
            <CommunicationCenterView onSendReply={handleSendOmnichannelReply} />
          )}

          {activeTab === "services" && (
            <PostPurchaseServiceView services={postPurchaseServices} />
          )}

          {activeTab === "feedback" && (
            <CustomerFeedbackView
              feedback={feedback}
              onModerateFeedback={handleModerateFeedback}
            />
          )}

          {activeTab === "kb" && <KnowledgeBaseView articles={knowledgeBase} />}

          {activeTab === "sla" && <SLAGovernanceView slaData={slaData} />}

          {activeTab === "analytics" && (
            <CXReportingView reportingData={reportingData} />
          )}

        </Container>
      </main>

      {/* ── MODALS ── */}
      <CaseDetailModal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        onSaveCase={handleSaveCase}
        caseObj={editingCase}
      />

      <Footer />
    </>
  );
}
