"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HardDrive,
  History,
  ShieldCheck,
  Activity,
  Download,
  RotateCcw,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Database,
  FileText,
  Layers,
  Sparkles,
  X,
  Loader2,
  AlertCircle,
  FolderArchive,
  Check,
  RefreshCw,
  Server,
  Zap,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";

const INITIAL_BACKUPS = [
  {
    id: "bk-1",
    name: "Full System Production Snapshot",
    type: "Full Backup",
    size: "4.8 GB",
    date: "July 27, 2026 03:00 AM",
    status: "Completed",
    retention: "30 Days",
  },
  {
    id: "bk-2",
    name: "Database & Product Catalog Dump",
    type: "Database Backup",
    size: "1.2 GB",
    date: "July 27, 2026 12:00 PM",
    status: "Completed",
    retention: "14 Days",
  },
  {
    id: "bk-3",
    name: "Media Library Digital Assets Archive",
    type: "Media Backup",
    size: "3.2 GB",
    date: "July 26, 2026 02:00 AM",
    status: "Completed",
    retention: "60 Days",
  },
  {
    id: "bk-4",
    name: "CMS Pages, Blog & Policy Settings",
    type: "CMS Backup",
    size: "420 MB",
    date: "July 25, 2026 04:00 AM",
    status: "Completed",
    retention: "30 Days",
  },
];

const INITIAL_VERSIONS = [
  { id: "ver-1", entity: "Theme Settings", item: "GOR Midnight Gold", version: "v2.4", user: "Eleanor Vance", date: "July 27, 2026", summary: "Updated hero video scale to 1.18x and bottom-right vignette" },
  { id: "ver-2", entity: "Products", item: "GOR Alo Burgundy Co-Ord Set", version: "v1.8", user: "Julian Thorne", date: "July 26, 2026", summary: "Updated stock inventory for Size L" },
  { id: "ver-3", entity: "Pages", item: "Privacy Policy", version: "v3.1", user: "Elena Rostova", date: "July 20, 2026", summary: "Updated Cookie Consent GDPR terms" },
  { id: "ver-4", entity: "Navigation", item: "Main Header Mega Menu", version: "v2.0", user: "Marcus Vance", date: "July 18, 2026", summary: "Added Autumn Capsule banner link" },
];

const INITIAL_AUDIT_LOGS = [
  { id: "log-1", time: "17:15:00", user: "Eleanor Vance", module: "Theme CMS", action: "Exported Theme JSON Design Tokens", ip: "192.168.1.100", status: "Success" },
  { id: "log-2", time: "17:10:00", user: "Julian Thorne", module: "Orders OMS", action: "Updated Order #GOR-892401 status to Shipped", ip: "192.168.1.104", status: "Success" },
  { id: "log-3", time: "16:45:00", user: "Elena Rostova", module: "Blog CMS", action: "Created article draft: Heavyweight Co-Ords", ip: "192.168.1.108", status: "Success" },
  { id: "log-4", time: "15:20:00", user: "Marcus Vance", module: "Marketing", action: "Activated Promo Voucher AUTUMN15", ip: "192.168.1.112", status: "Success" },
];

export default function BackupAuditPage() {
  const [backups, setBackups] = useState(INITIAL_BACKUPS);
  const [versions, setVersions] = useState(INITIAL_VERSIONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [activeTab, setActiveTab] = useState("backups"); // "backups", "versions", "audit", "health"
  const [searchQuery, setSearchQuery] = useState("");
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [exporting, setExporting] = useState(false);

  const { success } = useToast();

  // Create Instant Backup
  const handleCreateBackup = () => {
    const newBk = {
      id: `bk-${Date.now()}`,
      name: "Manual System Snapshot",
      type: "Full Backup",
      size: "4.8 GB",
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "Completed",
      retention: "30 Days",
    };
    setBackups([newBk, ...backups]);
    success("Backup Created", "Manual system snapshot generated successfully.");
  };

  // Open Restore Modal
  const handleOpenRestore = (bk) => {
    setSelectedBackup(bk);
    setShowRestoreModal(true);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      if (typeof window !== "undefined") {
        const header = "ID,Name,Type,Size,Date,Status\n";
        const rows = backups.map((b) => `${b.id},"${b.name}",${b.type},${b.size},"${b.date}",${b.status}`).join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GOR_Backup_Audit_Report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
      success("CSV Exported", "Backup & audit report downloaded successfully.");
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
                <HardDrive className="w-4 h-4" /> RECOVERY & AUDIT ENGINE
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Backup, Versioning & Audit Center
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={exporting}
                className="h-10 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs font-semibold text-[#F8F6F3] rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin text-[#C8A45D]" /> : <Download className="w-4 h-4 text-[#C8A45D]" />}
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleCreateBackup}
                className="h-10 px-5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create Backup</span>
              </button>
            </div>
          </div>

          {/* Audit Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Storage Usage</span>
              <span className="font-editorial text-2xl text-[#C8A45D]">4.8 GB / 10 GB</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Total Snapshots</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">14 Saved</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">Daily Audit Events</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">342 Events</span>
            </div>
            <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase text-[#8E8A85] block">System Health</span>
              <span className="font-editorial text-2xl text-emerald-400">100% Healthy</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-[#151515] border border-[#2A2A2A] rounded-[14px] p-1 gap-1">
            {[
              { id: "backups", label: "System Backups", icon: HardDrive },
              { id: "versions", label: "Content Versioning", icon: History },
              { id: "audit", label: "Security Audit Log", icon: ShieldCheck },
              { id: "health", label: "System Telemetry", icon: Activity },
            ].map((tb) => {
              const IconComp = tb.icon;
              return (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setActiveTab(tb.id)}
                  className={`flex-1 py-2.5 px-3 rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    activeTab === tb.id ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="hidden sm:inline">{tb.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── TAB 1: SYSTEM BACKUPS ── */}
          {activeTab === "backups" && (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                    <th className="py-3.5 px-4 font-bold">Snapshot Name</th>
                    <th className="py-3.5 px-4 font-bold">Type</th>
                    <th className="py-3.5 px-4 font-bold">Size</th>
                    <th className="py-3.5 px-4 font-bold">Date Created</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {backups.map((b) => (
                    <tr key={b.id} className="hover:bg-[#090909]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#F8F6F3] flex items-center gap-3">
                        <FolderArchive className="w-4 h-4 text-[#C8A45D] shrink-0" />
                        <span>{b.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#8E8A85] font-mono">{b.type}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C8A45D]">{b.size}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{b.date}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenRestore(b)}
                          className="px-3 py-1.5 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] text-xs font-semibold rounded-[6px] transition-colors cursor-pointer"
                        >
                          Restore Preview
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── TAB 2: CONTENT VERSIONING ── */}
          {activeTab === "versions" && (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                    <th className="py-3.5 px-4 font-bold">Entity</th>
                    <th className="py-3.5 px-4 font-bold">Item Name</th>
                    <th className="py-3.5 px-4 font-bold">Version</th>
                    <th className="py-3.5 px-4 font-bold">Modified By</th>
                    <th className="py-3.5 px-4 font-bold">Date</th>
                    <th className="py-3.5 px-4 font-bold">Change Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {versions.map((v) => (
                    <tr key={v.id} className="hover:bg-[#090909]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#C8A45D] font-mono">{v.entity}</td>
                      <td className="py-3.5 px-4 font-bold text-[#F8F6F3]">{v.item}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F8F6F3]">{v.version}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{v.user}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85]">{v.date}</td>
                      <td className="py-3.5 px-4 text-[#8E8A85] font-light italic">{v.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── TAB 3: AUDIT LOGS ── */}
          {activeTab === "audit" && (
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#2A2A2A] text-[#C8A45D] uppercase tracking-wider text-[10px] bg-[#090909]">
                    <th className="py-3.5 px-4 font-bold">Time</th>
                    <th className="py-3.5 px-4 font-bold">User</th>
                    <th className="py-3.5 px-4 font-bold">Module</th>
                    <th className="py-3.5 px-4 font-bold">Event Action</th>
                    <th className="py-3.5 px-4 font-bold">IP Address</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {auditLogs.map((l) => (
                    <tr key={l.id} className="hover:bg-[#090909]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[#8E8A85]">{l.time}</td>
                      <td className="py-3.5 px-4 font-bold text-[#F8F6F3]">{l.user}</td>
                      <td className="py-3.5 px-4 text-[#C8A45D] font-mono">{l.module}</td>
                      <td className="py-3.5 px-4 text-[#F8F6F3]">{l.action}</td>
                      <td className="py-3.5 px-4 font-mono text-[#8E8A85]">{l.ip}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── TAB 4: SYSTEM TELEMETRY ── */}
          {activeTab === "health" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] space-y-4">
                <h3 className="font-editorial text-xl text-[#F8F6F3]">Disk Storage Allocation</h3>
                <div className="w-full bg-[#090909] border border-[#2A2A2A] rounded-full h-3 overflow-hidden">
                  <div className="bg-[#C8A45D] h-full w-[48%]" />
                </div>
                <span className="text-xs text-[#8E8A85] font-mono block">4.8 GB used of 10.0 GB (48% Capacity)</span>
              </div>

              <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] space-y-4">
                <h3 className="font-editorial text-xl text-[#F8F6F3]">Database Latency</h3>
                <span className="font-editorial text-3xl text-emerald-400 block">4.2ms</span>
                <span className="text-xs text-[#8E8A85] font-mono block">Optimal performance score across query pools.</span>
              </div>
            </div>
          )}

        </Container>
      </main>

      {/* Restore Preview Modal */}
      {showRestoreModal && selectedBackup && (
        <div className="fixed inset-0 z-[250] bg-[#090909]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[22px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 font-sans select-none">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-0.5">
                  RESTORE POINT PREVIEW
                </span>
                <h3 className="font-editorial text-2xl text-[#F8F6F3]">{selectedBackup.name}</h3>
              </div>
              <button type="button" onClick={() => setShowRestoreModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-2 text-xs font-mono">
              <p>Snapshot ID: {selectedBackup.id}</p>
              <p>Created Date: {selectedBackup.date}</p>
              <p>Archive Size: {selectedBackup.size}</p>
              <p>Type: {selectedBackup.type}</p>
            </div>

            <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-[14px] flex items-center gap-3 text-amber-300 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Restoring this snapshot will roll back current settings to the exact state saved on {selectedBackup.date}.</span>
            </div>

            <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
              <button type="button" onClick={() => setShowRestoreModal(false)} className="px-5 py-2.5 text-xs text-[#8E8A85]">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRestoreModal(false);
                  success("Restore Initiated", `Restoring snapshot ${selectedBackup.name}...`);
                }}
                className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] shadow-md"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
