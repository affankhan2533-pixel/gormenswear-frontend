"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HardDrive,
  Folder,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Upload,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Layers,
  RotateCcw,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";

// Data Imports
import {
  INITIAL_DAM_METRICS,
  INITIAL_DAM_ASSETS,
  INITIAL_DAM_FOLDERS,
  INITIAL_DAM_VERSIONS,
  INITIAL_APPROVAL_QUEUE,
  INITIAL_DAM_ANALYTICS,
} from "@/lib/damData";

// Components Import
import DAMDashboardView from "@/components/dam/DAMDashboardView";
import AssetGridLibrary from "@/components/dam/AssetGridLibrary";
import AssetDetailModal from "@/components/dam/AssetDetailModal";
import FolderTreeView from "@/components/dam/FolderTreeView";
import AIMediaFeaturesView from "@/components/dam/AIMediaFeaturesView";
import VersionControlView from "@/components/dam/VersionControlView";
import ApprovalWorkflowView from "@/components/dam/ApprovalWorkflowView";
import AssetUsageTrackerView from "@/components/dam/AssetUsageTrackerView";
import DAMAnalyticsView from "@/components/dam/DAMAnalyticsView";

export default function EnterpriseDAMPage() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("overview"); // overview, library, folders, ai, versions, approvals, usage, analytics

  // State Management
  const [metrics, setMetrics] = useState(INITIAL_DAM_METRICS);
  const [assets, setAssets] = useState(INITIAL_DAM_ASSETS);
  const [folders, setFolders] = useState(INITIAL_DAM_FOLDERS);
  const [versions, setVersions] = useState(INITIAL_DAM_VERSIONS);
  const [approvalQueue, setApprovalQueue] = useState(INITIAL_APPROVAL_QUEUE);
  const [analyticsData, setAnalyticsData] = useState(INITIAL_DAM_ANALYTICS);

  // Modals Visibility
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const { success, info, error: toastError } = useToast();

  // ── HANDLERS: ASSET ACTIONS ──
  const handleSaveAssetMetadata = (updatedAsset) => {
    setAssets(assets.map((a) => (a.id === updatedAsset.id ? updatedAsset : a)));
    success("Asset Metadata Saved", `Metadata updated for ${updatedAsset.name}.`);
  };

  const handleUploadNewAsset = () => {
    const newAsset = {
      id: `asset-${Date.now()}`,
      name: `New Atelier Production Shoot #${Math.floor(100 + Math.random() * 900)}`,
      fileType: "Image",
      folder: "Products/Outerwear",
      resolution: "3840 x 2160 (4K UHD)",
      fileSize: "4.5 MB",
      status: "Approved",
      version: "v1.0",
      aiTags: ["New Release", "Atelier", "4K Capture"],
      copyright: "© 2026 GOR Atelier Limited",
      photographer: "Marco Bellini",
      usageRights: "Worldwide Commercial Rights",
      expirationDate: "2028-12-31",
      usageCount: 1,
      usedInProducts: ["Biella Shearling Trimmed Suede Jacket"],
      usedInCMS: ["Homepage Hero Carousel"],
      imageUrl: "/images/products/shearling-jacket.jpg",
      uploadedAt: "Just now",
    };

    setAssets([newAsset, ...assets]);
    setEditingAsset(newAsset);
    setIsAssetModalOpen(true);
    success("Asset Uploaded", `New digital asset ${newAsset.name} processed and WebP compressed.`);
  };

  const handleRunAITagging = () => {
    info("Running AI Auto-Tagging", "Analyzing 1,480 media assets using Computer Vision...");
    setTimeout(() => {
      success("AI Auto-Tagging Complete", "Generated 4,200 taxonomy tags across all brand assets.");
    }, 1200);
  };

  const handleApproveAsset = (apprId) => {
    setApprovalQueue(approvalQueue.filter((a) => a.id !== apprId));
    setMetrics({
      ...metrics,
      pendingApprovalsCount: Math.max(0, metrics.pendingApprovalsCount - 1),
    });
    success("Asset Approved", `Asset #${apprId} approved for production publication.`);
  };

  const handleRejectAsset = (apprId) => {
    setApprovalQueue(approvalQueue.filter((a) => a.id !== apprId));
    setMetrics({
      ...metrics,
      pendingApprovalsCount: Math.max(0, metrics.pendingApprovalsCount - 1),
    });
    info("Asset Rejected", `Submission #${apprId} declined.`);
  };

  const handleRestoreVersion = (verStr) => {
    success("Version Restored", `Asset version restored to ${verStr}.`);
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
                    <HardDrive className="w-4 h-4" /> DIGITAL ASSET MANAGEMENT & BRAND MEDIA
                  </span>
                </div>
                <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#F8F6F3]">
                  Digital Asset Management (DAM)
                </h1>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleRunAITagging}
                  className="h-[40px] px-3.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                  <span>Run AI Auto-Tagging</span>
                </button>

                <button
                  type="button"
                  onClick={handleUploadNewAsset}
                  className="h-[40px] px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg font-bold"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Asset</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-t border-[#2A2A2A] pt-4">
              {[
                { id: "overview", label: "DAM Overview" },
                { id: "library", label: `Asset Library (${assets.length})` },
                { id: "folders", label: `Folders (${folders.length})` },
                { id: "ai", label: "AI Media Tagging" },
                { id: "versions", label: "Version Control" },
                { id: "approvals", label: `Approval Queue (${approvalQueue.length})` },
                { id: "usage", label: "Usage Matrix" },
                { id: "analytics", label: "DAM Analytics" },
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
            <DAMDashboardView
              metrics={metrics}
              onNavigateTab={(t) => setActiveTab(t)}
            />
          )}

          {activeTab === "library" && (
            <AssetGridLibrary
              assets={assets}
              onOpenAssetDetail={(a) => {
                setEditingAsset(a);
                setIsAssetModalOpen(true);
              }}
              onUploadNewAsset={handleUploadNewAsset}
            />
          )}

          {activeTab === "folders" && (
            <FolderTreeView
              folders={folders}
              onSelectFolder={(fPath) => {
                setActiveTab("library");
                info("Filter Applied", `Filtered library to /${fPath}`);
              }}
            />
          )}

          {activeTab === "ai" && <AIMediaFeaturesView onRunAITagging={handleRunAITagging} />}

          {activeTab === "versions" && (
            <VersionControlView
              versions={versions}
              onRestoreVersion={handleRestoreVersion}
            />
          )}

          {activeTab === "approvals" && (
            <ApprovalWorkflowView
              approvalQueue={approvalQueue}
              onApproveAsset={handleApproveAsset}
              onRejectAsset={handleRejectAsset}
            />
          )}

          {activeTab === "usage" && <AssetUsageTrackerView assets={assets} />}

          {activeTab === "analytics" && (
            <DAMAnalyticsView analyticsData={analyticsData} />
          )}

        </Container>
      </main>

      {/* ── MODALS ── */}
      <AssetDetailModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onSaveAsset={handleSaveAssetMetadata}
        assetObj={editingAsset}
      />

      <Footer />
    </>
  );
}
