"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Clock, UserCheck, MessageSquare, AlertTriangle, ShieldCheck } from "lucide-react";

export default function CaseDetailModal({
  isOpen,
  onClose,
  onSaveCase,
  caseObj = null,
}) {
  const [formData, setFormData] = useState({
    status: "Open",
    priority: "High",
    assignedAgent: "",
    notes: "",
  });

  useEffect(() => {
    if (caseObj) {
      setFormData({
        status: caseObj.status || "Open",
        priority: caseObj.priority || "High",
        assignedAgent: caseObj.assignedAgent || "Marcus Sterling",
        notes: caseObj.notes || "",
      });
    }
  }, [caseObj, isOpen]);

  if (!isOpen || !caseObj) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveCase({
      ...caseObj,
      status: formData.status,
      priority: formData.priority,
      assignedAgent: formData.assignedAgent,
      notes: formData.notes,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div>
              <span className="font-mono text-xs text-[#C8A45D] font-bold block">
                {caseObj.caseNumber} • {caseObj.channel}
              </span>
              <h2 id="case-modal-title" className="font-editorial text-2xl font-normal">
                {caseObj.subject}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Info Bar */}
            <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex justify-between items-center text-xs">
              <div>
                <span className="text-[#8E8A85]">Customer:</span>{" "}
                <strong className="text-[#F8F6F3]">{caseObj.customerName}</strong> ({caseObj.customerEmail})
              </div>
              <span className="font-mono text-emerald-400 font-bold">{caseObj.slaTarget}</span>
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Case Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Open">Open</option>
                  <option value="Pending">Pending</option>
                  <option value="Waiting for Customer">Waiting for Customer</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                  Priority Level
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent (VIP Escalation)</option>
                </select>
              </div>
            </div>

            {/* Agent Assignee */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Assigned Concierge Agent
              </label>
              <select
                value={formData.assignedAgent}
                onChange={(e) => setFormData({ ...formData, assignedAgent: e.target.value })}
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
              >
                <option value="Marcus Sterling (Lead Concierge)">Marcus Sterling (Lead Concierge)</option>
                <option value="Sarah Jenkins">Sarah Jenkins</option>
                <option value="Elena Rostova">Elena Rostova</option>
              </select>
            </div>

            {/* Internal Staff Notes */}
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Internal Concierge Staff Notes
              </label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add private staff notes..."
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] p-3 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
              >
                <Save className="w-4 h-4" /> Save Case Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
