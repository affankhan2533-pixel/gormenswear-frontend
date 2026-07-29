"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ShieldCheck,
  Terminal,
  GitBranch,
  HardDrive,
  Sliders,
  Lock,
  BookOpen,
  ArrowLeft,
  RefreshCw,
  Plus,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";

// Data Imports
import {
  INITIAL_DEVOPS_HEALTH,
  INITIAL_OBSERVABILITY_LOGS,
  INITIAL_TELEMETRY_METRICS,
  INITIAL_SECURITY_DATA,
  INITIAL_DEPLOYMENT_HISTORY,
  INITIAL_DISASTER_RECOVERY,
  INITIAL_FEATURE_FLAGS,
  INITIAL_ENV_VARS,
  SYSTEM_DOCUMENTATION_HUB,
} from "@/lib/devopsData";

// Components Import
import DevOpsHealthView from "@/components/devops/DevOpsHealthView";
import ObservabilityView from "@/components/devops/ObservabilityView";
import SecurityDashboardView from "@/components/devops/SecurityDashboardView";
import PipelineDeploymentView from "@/components/devops/PipelineDeploymentView";
import DisasterRecoveryView from "@/components/devops/DisasterRecoveryView";
import FeatureFlagsView from "@/components/devops/FeatureFlagsView";
import EnvironmentConfigView from "@/components/devops/EnvironmentConfigView";
import DocumentationCenterView from "@/components/devops/DocumentationCenterView";

export default function EnterpriseDevOpsPage() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("health"); // health, observability, security, cicd, dr, flags, env, docs

  // State Management
  const [healthData, setHealthData] = useState(INITIAL_DEVOPS_HEALTH);
  const [logs, setLogs] = useState(INITIAL_OBSERVABILITY_LOGS);
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY_METRICS);
  const [securityData, setSecurityData] = useState(INITIAL_SECURITY_DATA);
  const [deployments, setDeployments] = useState(INITIAL_DEPLOYMENT_HISTORY);
  const [disasterRecovery, setDisasterRecovery] = useState(INITIAL_DISASTER_RECOVERY);
  const [featureFlags, setFeatureFlags] = useState(INITIAL_FEATURE_FLAGS);
  const [envVars, setEnvVars] = useState(INITIAL_ENV_VARS);
  const [documentationHub, setDocumentationHub] = useState(SYSTEM_DOCUMENTATION_HUB);

  const { success, info, error: toastError } = useToast();

  // ── HANDLERS ──
  const handleTriggerRollback = (versionStr) => {
    info("Rollback Initiated", `Rolling back release ${versionStr} to previous stable checkpoint...`);
    setTimeout(() => {
      success("Rollback Successful", `Production traffic restored to v2.3.9 stable deployment.`);
    }, 1200);
  };

  const handleTriggerOnDemandBackup = () => {
    info("Snapshot Triggered", "Executing PostgreSQL Write-Ahead Log (WAL) snapshot...");
    setTimeout(() => {
      setDisasterRecovery({
        ...disasterRecovery,
        lastBackupTimestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      success("Backup Snapshot Saved", "PostgreSQL database & AWS S3 replication verified healthy.");
    }, 1200);
  };

  const handleToggleFeatureFlag = (flagId) => {
    setFeatureFlags(
      featureFlags.map((f) => (f.id === flagId ? { ...f, enabled: !f.enabled } : f))
    );
    info("Feature Flag Toggled", `Feature toggle state updated.`);
  };

  const handleChangeRolloutPercentage = (flagId, newPercent) => {
    setFeatureFlags(
      featureFlags.map((f) => (f.id === flagId ? { ...f, rolloutPercentage: newPercent } : f))
    );
    success("Rollout Percentage Adjusted", `Traffic allocation updated to ${newPercent}%.`);
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
                    <Activity className="w-4 h-4" /> PRODUCTION READINESS & DEVOPS PLATFORM
                  </span>
                </div>
                <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#F8F6F3]">
                  Platform Reliability & DevOps Center
                </h1>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleTriggerOnDemandBackup}
                  className="h-[40px] px-3.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#C8A45D]" />
                  <span>Manual DB Backup</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("docs")}
                  className="h-[40px] px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg font-bold"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Documentation Hub</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-t border-[#2A2A2A] pt-4">
              {[
                { id: "health", label: "Health & Infrastructure" },
                { id: "observability", label: "Observability & Telemetry" },
                { id: "security", label: "Security & Compliance" },
                { id: "cicd", label: `CI/CD & Deployments (${deployments.length})` },
                { id: "dr", label: "Disaster Recovery" },
                { id: "flags", label: `Feature Flags (${featureFlags.length})` },
                { id: "env", label: "Environment Management" },
                { id: "docs", label: "Documentation Hub" },
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

          {/* ── Executive KPI Bar ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Platform SLA Uptime
              </span>
              <span className="font-editorial text-2xl font-bold text-emerald-400 block">
                {healthData.uptimeSLA}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                App Server Latency
              </span>
              <span className="font-editorial text-2xl font-bold text-blue-400 block">
                {healthData.globalResponseTime}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Active Sentry Errors
              </span>
              <span className="font-editorial text-2xl font-bold text-[#C8A45D] block">
                {telemetry.sentryActiveErrors} Errors
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Security Defense
              </span>
              <span className="font-editorial text-xl font-bold text-emerald-400 block">
                Rate Limit Active
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                DR Backup SLA
              </span>
              <span className="font-editorial text-xl font-bold text-emerald-400 block">
                RPO 5m / RTO 15m
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Production Release
              </span>
              <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
                v2.4.0
              </span>
            </div>
          </div>

          {/* ── TAB CONTENT VIEWS ── */}
          {activeTab === "health" && <DevOpsHealthView healthData={healthData} />}

          {activeTab === "observability" && (
            <ObservabilityView logs={logs} telemetry={telemetry} />
          )}

          {activeTab === "security" && (
            <SecurityDashboardView securityData={securityData} />
          )}

          {activeTab === "cicd" && (
            <PipelineDeploymentView
              deployments={deployments}
              onTriggerRollback={handleTriggerRollback}
            />
          )}

          {activeTab === "dr" && (
            <DisasterRecoveryView
              disasterRecovery={disasterRecovery}
              onTriggerBackup={handleTriggerOnDemandBackup}
            />
          )}

          {activeTab === "flags" && (
            <FeatureFlagsView
              featureFlags={featureFlags}
              onToggleFlag={handleToggleFeatureFlag}
              onChangeRollout={handleChangeRolloutPercentage}
            />
          )}

          {activeTab === "env" && <EnvironmentConfigView envVars={envVars} />}

          {activeTab === "docs" && (
            <DocumentationCenterView docs={documentationHub} />
          )}

        </Container>
      </main>

      <Footer />
    </>
  );
}
