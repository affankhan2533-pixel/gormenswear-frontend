"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter, Clock, CheckCircle2, AlertTriangle, ChevronRight, UserCheck } from "lucide-react";

export default function SupportCaseTable({
  cases,
  onOpenCaseDetail,
  onCreateCase,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case "Urgent":
        return "bg-rose-950/80 text-rose-400 border-rose-500/30";
      case "High":
        return "bg-amber-950/80 text-amber-400 border-amber-500/30";
      case "Medium":
        return "bg-blue-950/80 text-blue-400 border-blue-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
            Support Case Management Hub
          </h2>
          <p className="text-xs text-[#8E8A85]">
            Manage support tickets, assign concierge agents, monitor SLA targets, and update case statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateCase}
          className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Support Case
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151515] p-3 rounded-[16px] border border-[#2A2A2A]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8E8A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search case #, customer, or subject..."
            className="w-full pl-10 pr-4 py-2 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {["all", "Open", "Pending", "Resolved"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-[8px] text-[11px] font-bold uppercase transition-colors shrink-0 ${
                filterStatus === st
                  ? "bg-[#C8A45D] text-[#090909]"
                  : "bg-[#090909] text-[#8E8A85] border border-[#2A2A2A]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Case Management Table */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">Case # & Customer</th>
                <th className="py-4 px-4">Subject</th>
                <th className="py-4 px-4 text-center">Channel</th>
                <th className="py-4 px-4 text-center">Priority</th>
                <th className="py-4 px-4 text-center">SLA Countdown</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-mono text-[#C8A45D] font-bold text-sm block">
                      {c.caseNumber}
                    </span>
                    <span className="text-xs font-semibold text-[#F8F6F3] block">
                      {c.customerName}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-medium text-[#F8F6F3]">
                    {c.subject}
                    <span className="text-[10px] text-[#8E8A85] block font-mono">Assigned: {c.assignedAgent}</span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#F8F6F3] border border-[#2A2A2A] rounded">
                      {c.channel}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getPriorityBadge(
                        c.priority
                      )}`}
                    >
                      {c.priority}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center font-mono text-[11px] text-emerald-400 font-bold">
                    {c.slaTarget}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        c.status === "Open"
                          ? "bg-blue-950/80 text-blue-400 border-blue-500/30"
                          : c.status === "Pending"
                          ? "bg-amber-950/80 text-amber-400 border-amber-500/30"
                          : "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenCaseDetail(c)}
                      className="px-3 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                    >
                      View & Manage
                    </button>
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
