"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Save, ShieldCheck } from "lucide-react";

export default function APIKeyModal({ isOpen, onClose, onSave }) {
  const [keyName, setKeyName] = useState("");
  const [keyType, setKeyType] = useState("REST API Key");
  const [rateLimit, setRateLimit] = useState("10,000 req/min");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    const prefixMap = {
      "REST API Key": `gor_live_${Math.random().toString(36).substring(2, 8)}...`,
      "GraphQL Token": `gor_gql_${Math.random().toString(36).substring(2, 8)}...`,
      "OAuth Client": `gor_oa_${Math.random().toString(36).substring(2, 8)}...`,
      "Webhook Secret": `whsec_live_${Math.random().toString(36).substring(2, 8)}...`,
    };

    const newKey = {
      id: `key-${Date.now()}`,
      keyName,
      keyType,
      prefix: prefixMap[keyType] || "gor_secret...",
      createdDate: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      rateLimit,
      status: "Active",
    };

    onSave(newKey);
    onClose();
    setKeyName("");
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="key-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 id="key-modal-title" className="font-editorial text-2xl font-normal">
                  Generate API Secret Key
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Issue REST, GraphQL, or Webhook authentication credentials.
                </p>
              </div>
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
            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Key Identifier / Application Name *
              </label>
              <input
                type="text"
                required
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. SAP ERP OData Partner Client"
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Authentication Key Type
              </label>
              <select
                value={keyType}
                onChange={(e) => setKeyType(e.target.value)}
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
              >
                <option value="REST API Key">REST API Key</option>
                <option value="GraphQL Token">GraphQL Token</option>
                <option value="OAuth Client">OAuth Client</option>
                <option value="Webhook Secret">Webhook Secret</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
                Rate Limit Policy
              </label>
              <select
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                className="w-full bg-[#090909] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-sm text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
              >
                <option value="5,000 req/min">5,000 req/min (Standard Partner)</option>
                <option value="10,000 req/min">10,000 req/min (Enterprise ERP)</option>
                <option value="Unlimited">Unlimited (Internal Infrastructure)</option>
              </select>
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
                <Save className="w-4 h-4" /> Issue Secret Key
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
