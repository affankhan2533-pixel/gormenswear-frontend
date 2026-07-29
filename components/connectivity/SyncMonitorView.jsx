"use client";

import { motion } from "framer-motion";
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Layers } from "lucide-react";

export default function SyncMonitorView({ syncJobs, onTriggerManualSync, onRetryJob }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
            Sync Monitor & Conflict Resolution Engine
          </h2>
          <p className="text-xs text-[#8E8A85]">
            Monitor asynchronous background sync jobs, failed payload retries, and data conflict resolution rules.
          </p>
        </div>
        <button
          type="button"
          onClick={onTriggerManualSync}
          className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
        >
          <RefreshCw className="w-4 h-4" /> Trigger Global Sync Job
        </button>
      </div>

      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">Sync Job Name & ID</th>
                <th className="py-4 px-4">Source System</th>
                <th className="py-4 px-4">Target System</th>
                <th className="py-4 px-4 text-center">Items Processed</th>
                <th className="py-4 px-4 text-center">Job Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {syncJobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                  <td className="py-4 px-4">
                    <span className="font-semibold text-[#F8F6F3] text-sm block">
                      {job.jobName}
                    </span>
                    <span className="text-[10px] font-mono text-[#C8A45D]">
                      {job.id} • {job.timestamp}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-[#F8F6F3]">{job.sourceSystem}</td>

                  <td className="py-4 px-4 text-[#F8F6F3]">{job.targetSystem}</td>

                  <td className="py-4 px-4 text-center font-mono font-bold text-emerald-400">
                    {job.itemsProcessed} items
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        job.status === "Success"
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-950/80 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    {job.status === "Failed" && (
                      <button
                        type="button"
                        onClick={() => onRetryJob(job.id)}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#090909] text-[11px] font-bold rounded-[8px] transition-colors cursor-pointer flex items-center gap-1 font-bold ml-auto"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry Failed Job
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
