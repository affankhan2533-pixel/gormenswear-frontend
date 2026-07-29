"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Radio, RefreshCw, CheckCircle2, AlertTriangle, Eye, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function WebhookCenterView({ webhookLogs, onRetryWebhook }) {
  const [selectedLog, setSelectedLog] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
            Webhook Center & Event Delivery History
          </h2>
          <p className="text-xs text-[#8E8A85]">
            Inspect real-time incoming and outgoing webhook events, payload structures, and delivery retry queues.
          </p>
        </div>
      </div>

      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">Event ID & Timestamp</th>
                <th className="py-4 px-4 text-center">Direction</th>
                <th className="py-4 px-4">Event Type</th>
                <th className="py-4 px-4">Source / Destination</th>
                <th className="py-4 px-4 text-center">Delivery Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {webhookLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-mono text-[#C8A45D] font-bold text-sm block">
                      {log.id}
                    </span>
                    <span className="text-[10px] text-[#8E8A85]">{log.timestamp}</span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        log.direction === "Incoming"
                          ? "bg-blue-950/80 text-blue-400 border-blue-500/30"
                          : "bg-purple-950/80 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {log.direction === "Incoming" ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {log.direction}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono font-semibold text-[#F8F6F3]">
                    {log.eventType}
                  </td>

                  <td className="py-4 px-4 text-[#F8F6F3] font-medium">
                    {log.source}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        log.status === "Delivered"
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                          : log.status === "Retrying"
                          ? "bg-amber-950/80 text-amber-400 border-amber-500/30"
                          : "bg-rose-950/80 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                      >
                        Inspect Payload
                      </button>

                      {log.status !== "Delivered" && (
                        <button
                          type="button"
                          onClick={() => onRetryWebhook(log.id)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#090909] text-[11px] font-bold rounded-[8px] transition-colors cursor-pointer flex items-center gap-1 font-bold"
                        >
                          <RefreshCw className="w-3 h-3" /> Retry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-lg w-full p-6 space-y-4 text-[#F8F6F3]">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <h3 className="font-editorial text-xl font-normal">
                Webhook Payload ({selectedLog.id})
              </h3>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-[#8E8A85] hover:text-[#F8F6F3]"
              >
                ✕
              </button>
            </div>
            <pre className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[12px] text-xs font-mono text-emerald-400 overflow-x-auto">
              {selectedLog.payloadSnippet}
            </pre>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-[#090909] text-[#8E8A85] rounded-[8px] text-xs font-bold uppercase"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
