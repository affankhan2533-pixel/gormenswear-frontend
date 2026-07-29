"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Activity,
  Radio,
  Key,
  RefreshCw,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Clock,
  ChevronRight,
  AlertTriangle,
  Zap,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";

// Data Imports
import {
  INITIAL_CONNECTIVITY_METRICS,
  INITIAL_ERP_CONNECTORS,
  INITIAL_POS_CONNECTORS,
  INITIAL_ACCOUNTING_CONNECTORS,
  INITIAL_SHIPPING_CONNECTORS,
  INITIAL_PAYMENT_GATEWAYS,
  INITIAL_TAX_SERVICES,
  INITIAL_WEBHOOK_LOGS,
  INITIAL_API_KEYS,
  INITIAL_SYNC_JOBS,
  INITIAL_SYSTEM_HEALTH,
} from "@/lib/connectivityData";

// Components Import
import ConnectorCard from "@/components/connectivity/ConnectorCard";
import ConnectorConfigModal from "@/components/connectivity/ConnectorConfigModal";
import ERPConnectorsView from "@/components/connectivity/ERPConnectorsView";
import POSConnectorsView from "@/components/connectivity/POSConnectorsView";
import AccountingConnectorsView from "@/components/connectivity/AccountingConnectorsView";
import ShippingConnectorsView from "@/components/connectivity/ShippingConnectorsView";
import PaymentGatewayView from "@/components/connectivity/PaymentGatewayView";
import TaxServicesView from "@/components/connectivity/TaxServicesView";
import WebhookCenterView from "@/components/connectivity/WebhookCenterView";
import APIManagementView from "@/components/connectivity/APIManagementView";
import APIKeyModal from "@/components/connectivity/APIKeyModal";
import SyncMonitorView from "@/components/connectivity/SyncMonitorView";
import SystemHealthView from "@/components/connectivity/SystemHealthView";

export default function EnterpriseConnectivityPage() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("overview"); // overview, erp, pos, accounting, shipping, payments, tax, webhooks, apikeys, sync, health

  // State Management
  const [erpConnectors, setErpConnectors] = useState(INITIAL_ERP_CONNECTORS);
  const [posConnectors, setPosConnectors] = useState(INITIAL_POS_CONNECTORS);
  const [accountingConnectors, setAccountingConnectors] = useState(INITIAL_ACCOUNTING_CONNECTORS);
  const [shippingConnectors, setShippingConnectors] = useState(INITIAL_SHIPPING_CONNECTORS);
  const [paymentGateways, setPaymentGateways] = useState(INITIAL_PAYMENT_GATEWAYS);
  const [taxServices, setTaxServices] = useState(INITIAL_TAX_SERVICES);
  const [webhookLogs, setWebhookLogs] = useState(INITIAL_WEBHOOK_LOGS);
  const [apiKeys, setApiKeys] = useState(INITIAL_API_KEYS);
  const [syncJobs, setSyncJobs] = useState(INITIAL_SYNC_JOBS);
  const [systemHealth, setSystemHealth] = useState(INITIAL_SYSTEM_HEALTH);

  // Modals Visibility
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingConnector, setEditingConnector] = useState(null);

  const [isAPIKeyModalOpen, setIsAPIKeyModalOpen] = useState(false);

  const { success, info, error: toastError } = useToast();

  // ── HANDLERS: CONNECTOR CONFIG ──
  const handleSaveConnectorConfig = (connectorData) => {
    const updater = (list) =>
      list.map((c) => (c.id === connectorData.id ? connectorData : c));

    if (connectorData.category === "ERP") setErpConnectors(updater);
    else if (connectorData.category === "POS") setPosConnectors(updater);
    else if (connectorData.category === "Accounting") setAccountingConnectors(updater);
    else if (connectorData.category === "Shipping") setShippingConnectors(updater);
    else if (connectorData.category === "Payment") setPaymentGateways(updater);
    else if (connectorData.category === "Tax Services") setTaxServices(updater);

    success("Connector Configured", `${connectorData.name} settings saved.`);
  };

  const handleTestConnectionDiagnostic = (connectorObj) => {
    info("Testing Connector", `Running OData/REST ping diagnostic for ${connectorObj.name}...`);
    setTimeout(() => {
      success("Connection Verified", `${connectorObj.name} responds with 38ms latency. SSL Valid.`);
    }, 800);
  };

  // ── HANDLERS: WEBHOOKS ──
  const handleRetryWebhook = (logId) => {
    setWebhookLogs(
      webhookLogs.map((w) => (w.id === logId ? { ...w, status: "Delivered" } : w))
    );
    success("Webhook Delivered", `Event #${logId} re-sent successfully.`);
  };

  // ── HANDLERS: API KEYS ──
  const handleSaveKey = (newKeyObj) => {
    setApiKeys([newKeyObj, ...apiKeys]);
    success("API Secret Key Created", `Secret key "${newKeyObj.keyName}" issued.`);
  };

  const handleRevokeKey = (keyId) => {
    setApiKeys(
      apiKeys.map((k) => (k.id === keyId ? { ...k, status: "Revoked" } : k))
    );
    info("API Key Revoked", `Secret key #${keyId} access disabled.`);
  };

  // ── HANDLERS: SYNC MONITOR ──
  const handleTriggerGlobalSync = () => {
    info("Sync Triggered", "Global background sync initiated for ERP, POS, and Logistics.");
    setTimeout(() => {
      success("Sync Completed", "Processed 2,890 records across 24 connected systems.");
    }, 1200);
  };

  const handleRetrySyncJob = (jobId) => {
    setSyncJobs(
      syncJobs.map((j) => (j.id === jobId ? { ...j, status: "Success", errorDetails: "None" } : j))
    );
    success("Sync Job Retried", `Job #${jobId} completed successfully.`);
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
                    <Layers className="w-4 h-4" /> ENTERPRISE CONNECTIVITY PLATFORM
                  </span>
                </div>
                <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#F8F6F3]">
                  Integration & System Connectivity
                </h1>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleTriggerGlobalSync}
                  className="h-[40px] px-3.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#C8A45D]" />
                  <span>Trigger Global Sync</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAPIKeyModalOpen(true)}
                  className="h-[40px] px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate API Key</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none border-t border-[#2A2A2A] pt-4">
              {[
                { id: "overview", label: "Executive Overview" },
                { id: "erp", label: `ERP Systems (${erpConnectors.length})` },
                { id: "pos", label: `POS Solutions (${posConnectors.length})` },
                { id: "accounting", label: `Accounting (${accountingConnectors.length})` },
                { id: "shipping", label: `Shipping (${shippingConnectors.length})` },
                { id: "payments", label: `Payments (${paymentGateways.length})` },
                { id: "tax", label: `Tax Services (${taxServices.length})` },
                { id: "webhooks", label: `Webhook Center (${webhookLogs.length})` },
                { id: "apikeys", label: `API Management (${apiKeys.length})` },
                { id: "sync", label: `Sync Monitor (${syncJobs.length})` },
                { id: "health", label: "System Health" },
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
                Connected Systems
              </span>
              <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
                {INITIAL_CONNECTIVITY_METRICS.connectedSystemsCount}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Active Connections
              </span>
              <span className="font-editorial text-2xl font-bold text-emerald-400 block">
                {INITIAL_CONNECTIVITY_METRICS.activeConnectionsCount}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Failed Connections
              </span>
              <span className="font-editorial text-2xl font-bold text-rose-400 block">
                {INITIAL_CONNECTIVITY_METRICS.failedConnectionsCount}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Last Synchronization
              </span>
              <span className="font-editorial text-xl font-bold text-[#C8A45D] block">
                {INITIAL_CONNECTIVITY_METRICS.lastSyncTimestamp}
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Integration Health
              </span>
              <span className="font-editorial text-2xl font-bold text-emerald-400 block">
                {INITIAL_CONNECTIVITY_METRICS.integrationHealthScore}%
              </span>
            </div>

            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85] block">
                Sync Queue Items
              </span>
              <span className="font-editorial text-2xl font-bold text-blue-400 block">
                {INITIAL_CONNECTIVITY_METRICS.syncQueueCount} Items
              </span>
            </div>
          </div>

          {/* ── 2. TAB CONTENT VIEWS ── */}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* ERP Section */}
              <ERPConnectorsView
                erpConnectors={erpConnectors}
                onConfigure={(c) => {
                  setEditingConnector(c);
                  setIsConfigModalOpen(true);
                }}
                onTestConnection={handleTestConnectionDiagnostic}
              />

              {/* Shipping Section */}
              <ShippingConnectorsView
                shippingConnectors={shippingConnectors}
                onConfigure={(c) => {
                  setEditingConnector(c);
                  setIsConfigModalOpen(true);
                }}
                onTestConnection={handleTestConnectionDiagnostic}
              />
            </div>
          )}

          {/* TAB 2: ERP */}
          {activeTab === "erp" && (
            <ERPConnectorsView
              erpConnectors={erpConnectors}
              onConfigure={(c) => {
                setEditingConnector(c);
                setIsConfigModalOpen(true);
              }}
              onTestConnection={handleTestConnectionDiagnostic}
            />
          )}

          {/* TAB 3: POS */}
          {activeTab === "pos" && (
            <POSConnectorsView
              posConnectors={posConnectors}
              onConfigure={(c) => {
                setEditingConnector(c);
                setIsConfigModalOpen(true);
              }}
              onTestConnection={handleTestConnectionDiagnostic}
            />
          )}

          {/* TAB 4: ACCOUNTING */}
          {activeTab === "accounting" && (
            <AccountingConnectorsView
              accountingConnectors={accountingConnectors}
              onConfigure={(c) => {
                setEditingConnector(c);
                setIsConfigModalOpen(true);
              }}
              onTestConnection={handleTestConnectionDiagnostic}
            />
          )}

          {/* TAB 5: SHIPPING */}
          {activeTab === "shipping" && (
            <ShippingConnectorsView
              shippingConnectors={shippingConnectors}
              onConfigure={(c) => {
                setEditingConnector(c);
                setIsConfigModalOpen(true);
              }}
              onTestConnection={handleTestConnectionDiagnostic}
            />
          )}

          {/* TAB 6: PAYMENTS */}
          {activeTab === "payments" && (
            <PaymentGatewayView
              paymentGateways={paymentGateways}
              onConfigure={(c) => {
                setEditingConnector(c);
                setIsConfigModalOpen(true);
              }}
              onTestConnection={handleTestConnectionDiagnostic}
            />
          )}

          {/* TAB 7: TAX */}
          {activeTab === "tax" && (
            <TaxServicesView
              taxServices={taxServices}
              onConfigure={(c) => {
                setEditingConnector(c);
                setIsConfigModalOpen(true);
              }}
              onTestConnection={handleTestConnectionDiagnostic}
            />
          )}

          {/* TAB 8: WEBHOOKS */}
          {activeTab === "webhooks" && (
            <WebhookCenterView
              webhookLogs={webhookLogs}
              onRetryWebhook={handleRetryWebhook}
            />
          )}

          {/* TAB 9: API KEYS */}
          {activeTab === "apikeys" && (
            <APIManagementView
              apiKeys={apiKeys}
              onCreateKey={() => setIsAPIKeyModalOpen(true)}
              onRevokeKey={handleRevokeKey}
            />
          )}

          {/* TAB 10: SYNC MONITOR */}
          {activeTab === "sync" && (
            <SyncMonitorView
              syncJobs={syncJobs}
              onTriggerManualSync={handleTriggerGlobalSync}
              onRetryJob={handleRetrySyncJob}
            />
          )}

          {/* TAB 11: HEALTH */}
          {activeTab === "health" && <SystemHealthView healthData={systemHealth} />}

        </Container>
      </main>

      {/* ── MODALS ── */}
      <ConnectorConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveConnectorConfig}
        connector={editingConnector}
      />

      <APIKeyModal
        isOpen={isAPIKeyModalOpen}
        onClose={() => setIsAPIKeyModalOpen(false)}
        onSave={handleSaveKey}
      />

      <Footer />
    </>
  );
}
