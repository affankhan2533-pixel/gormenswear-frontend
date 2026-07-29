"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "@/components/admin/shell/AdminShell";
import { useToast } from "@/context/ToastContext";
import {
  FileText, Search, Download, Filter, Calendar, User, ShieldCheck,
  Clock, Eye, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2,
  AlertTriangle, Lock, Globe, Server, Info, X, Tag
} from "lucide-react";

export default function AuditLogsPage() {
  const { error: toastError } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Detail Modal State
  const [selectedLog, setSelectedLog] = useState(null);

  // Load Audit Logs from API
  const loadLogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        search: search.trim(),
        module: selectedModule,
        action: selectedAction,
      });

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`${baseUrl}/api/admin/audit?${params.toString()}`, { credentials: "include" });
      const json = await res.json();

      if (json.success) {
        setLogs(json.logs || []);
        if (json.pagination) {
          setPagination(json.pagination);
        }
      } else {
        toastError("Load Error", json.error || "Failed to load audit logs");
      }
    } catch (err) {
      console.error("Fetch audit logs failed:", err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedModule, selectedAction, startDate, endDate, toastError]);

  useEffect(() => {
    loadLogs(1);
  }, [loadLogs]);

  // CSV Export Handler
  const handleExportCSV = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const params = new URLSearchParams({
        search: search.trim(),
        module: selectedModule,
        action: selectedAction,
      });
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      window.open(`${baseUrl}/api/admin/audit/export?${params.toString()}`, "_blank");
    } catch (err) {
      toastError("Export Error", "Could not export CSV");
    }
  };

  const getActionBadgeColor = (act = "") => {
    if (act.includes("LOGIN") || act.includes("SUCCESS")) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    if (act.includes("LOGOUT") || act.includes("DELETE") || act.includes("CANCEL")) return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    if (act.includes("CREATE") || act.includes("ADD")) return "bg-sky-500/15 text-sky-400 border-sky-500/30";
    return "bg-[#C8A45D]/15 text-[#C8A45D] border-[#C8A45D]/30";
  };

  const MODULE_OPTIONS = ["all", "Auth", "Products", "Categories", "Collections", "Inventory", "Orders", "Customers", "Coupons", "Settings"];
  const ACTION_OPTIONS = ["all", "ADMIN_LOGIN", "ADMIN_LOGOUT", "PRODUCT_CREATED", "PRODUCT_UPDATED", "PRODUCT_DELETED", "ORDER_STATUS_CHANGED", "SETTINGS_UPDATED", "INVENTORY_UPDATED"];

  return (
    <AdminShell>
      <div className="space-y-6 max-w-7xl pb-24">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F0EDE8] flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-[#C8A45D]" />
              Audit Logs & Activity Center
            </h1>
            <p className="text-xs text-[#777] mt-0.5">
              Real-time security timeline tracking administrative actions, user logins, and configuration changes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadLogs(pagination.page)}
              className="p-2 bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] text-xs text-[#E8E4DF] rounded-[8px] transition-colors cursor-pointer"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#C8A45D]" : "text-[#777]"}`} />
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C8A45D] hover:bg-[#B8944D] text-[#0D0D0D] text-xs font-bold rounded-[8px] transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, action, order ID, product..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
            />
          </div>

          {/* Module Filter */}
          <div>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
            >
              {MODULE_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m === "all" ? "All Modules" : `Module: ${m}`}
                </option>
              ))}
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
            >
              {ACTION_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {a === "all" ? "All Actions" : a}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Start */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded-[8px] text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C8A45D]"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[14px] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#161616] border-b border-[#1E1E1E] text-[#888] font-semibold">
                  <th className="py-3 px-4">TIMESTAMP</th>
                  <th className="py-3 px-4">PERFORMED BY</th>
                  <th className="py-3 px-4">MODULE</th>
                  <th className="py-3 px-4">ACTION</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4 text-right">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#666] animate-pulse">
                      Loading audit activity logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#666]">
                      No audit logs matching selected filters.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id || log._id} className="hover:bg-[#161616]/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[#888] whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#E8E4DF]">{log.userName || "Admin"}</div>
                        <div className="text-[10px] text-[#666]">{log.userEmail} ({log.userRole || "Admin"})</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-[#1C1C1C] border border-[#2A2A2A] rounded text-[10px] font-medium text-[#AAA]">
                          {log.module}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getActionBadgeColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#CCCCCC] max-w-xs truncate">
                        {log.description}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#222] border border-[#2E2E2E] text-xs text-[#C8A45D] rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Toolbar */}
          <div className="p-3.5 bg-[#141414] border-t border-[#1E1E1E] flex items-center justify-between text-xs text-[#888]">
            <span>
              Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages || 1}</strong> ({pagination.total || 0} total entries)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={pagination.page <= 1 || loading}
                onClick={() => loadLogs(pagination.page - 1)}
                className="px-3 py-1 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] rounded text-xs text-[#E8E4DF] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => loadLogs(pagination.page + 1)}
                className="px-3 py-1 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] rounded text-xs text-[#E8E4DF] disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[16px] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h3 className="text-sm font-bold text-[#E8E4DF] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C8A45D]" />
                Audit Log Activity Details
              </h3>
              <button type="button" onClick={() => setSelectedLog(null)} className="text-[#666] hover:text-[#E8E4DF]">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#161616] border border-[#222] rounded-[8px]">
                <div>
                  <span className="text-[10px] text-[#666] uppercase font-bold block mb-0.5">Performed By</span>
                  <p className="font-bold text-[#E8E4DF]">{selectedLog.userName}</p>
                  <p className="text-[11px] text-[#888]">{selectedLog.userEmail} ({selectedLog.userRole})</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#666] uppercase font-bold block mb-0.5">Exact Timestamp</span>
                  <p className="font-mono text-[#E8E4DF]">{new Date(selectedLog.createdAt).toLocaleString()}</p>
                  <p className="text-[11px] text-[#888]">IP: {selectedLog.ipAddress || "127.0.0.1"}</p>
                </div>
              </div>

              <div className="p-3 bg-[#161616] border border-[#222] rounded-[8px] space-y-1">
                <span className="text-[10px] text-[#666] uppercase font-bold block">Description</span>
                <p className="text-[#E8E4DF] font-medium">{selectedLog.description}</p>
              </div>

              {selectedLog.beforeValue && (
                <div className="p-3 bg-[#161616] border border-[#222] rounded-[8px] space-y-1">
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">Before Value</span>
                  <pre className="font-mono text-[11px] text-[#AAA] overflow-x-auto p-2 bg-[#0C0C0C] rounded border border-[#222]">
                    {JSON.stringify(selectedLog.beforeValue, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.afterValue && (
                <div className="p-3 bg-[#161616] border border-[#222] rounded-[8px] space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">After Value</span>
                  <pre className="font-mono text-[11px] text-[#AAA] overflow-x-auto p-2 bg-[#0C0C0C] rounded border border-[#222]">
                    {JSON.stringify(selectedLog.afterValue, null, 2)}
                  </pre>
                </div>
              )}

              <div className="p-3 bg-[#161616] border border-[#222] rounded-[8px] text-[10px] font-mono text-[#666] truncate">
                User Agent: {selectedLog.userAgent}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#E8E4DF] font-bold rounded-[8px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
