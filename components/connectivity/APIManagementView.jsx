"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Plus, Copy, ShieldCheck, Trash2, CheckCircle2 } from "lucide-react";

export default function APIManagementView({ apiKeys, onCreateKey, onRevokeKey }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
            API Key & Client Authentication Management
          </h2>
          <p className="text-xs text-[#8E8A85]">
            Generate and govern REST API Keys, GraphQL Storefront Tokens, OAuth Clients, and Webhook Secrets with rate limiting rules.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateKey}
          className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
        >
          <Plus className="w-4 h-4" /> Generate API Key
        </button>
      </div>

      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">Key Identifier / Name</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4 font-mono">Key Prefix Secret</th>
                <th className="py-4 px-4 text-center">Rate Limit</th>
                <th className="py-4 px-4 text-center">Last Used</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {apiKeys.map((k) => (
                <tr key={k.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                  <td className="py-4 px-4 font-semibold text-[#F8F6F3]">
                    {k.keyName}
                    <span className="text-[10px] text-[#8E8A85] block font-mono">Created: {k.createdDate}</span>
                  </td>

                  <td className="py-4 px-4 text-[#C8A45D]">
                    {k.keyType}
                  </td>

                  <td className="py-4 px-4 font-mono text-[#F8F6F3]">
                    <div className="flex items-center gap-2">
                      <span>{k.prefix}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(k.id, k.prefix)}
                        className="text-[#8E8A85] hover:text-[#C8A45D] transition-colors"
                      >
                        {copiedId === k.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-mono text-xs text-blue-400">
                    {k.rateLimit}
                  </td>

                  <td className="py-4 px-4 text-center text-[#8E8A85]">
                    {k.lastUsed}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        k.status === "Active"
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-950/80 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {k.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    {k.status === "Active" && (
                      <button
                        type="button"
                        onClick={() => onRevokeKey(k.id)}
                        className="px-2.5 py-1.5 bg-[#090909] hover:bg-rose-950 hover:text-rose-400 text-rose-400 text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                      >
                        Revoke Secret
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
