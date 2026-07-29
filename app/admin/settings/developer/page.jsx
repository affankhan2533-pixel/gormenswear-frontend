"use client";

import Link from "next/link";
import AdminShell from "@/components/admin/shell/AdminShell";
import { Code, Paintbrush, Database, Terminal, ShieldAlert, Cpu, ArrowRight } from "lucide-react";

export default function DeveloperToolsPage() {
  return (
    <AdminShell>
      <div className="space-y-6 max-w-5xl pb-24 text-xs">
        {/* Header */}
        <div className="bg-[#111] border border-[#1E1E1E] rounded-[20px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-[#F0EDE8]">Developer Tools & Advanced Mode</h1>
                <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-400 text-[10px] font-bold rounded">
                  Advanced Mode
                </span>
              </div>
              <p className="text-xs text-[#777] mt-0.5">
                Technical layout editor, raw JSON schemas, design tokens, and system diagnostics
              </p>
            </div>
          </div>
        </div>

        {/* Developer Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Theme Builder Studio */}
          <Link
            href="/admin/theme"
            className="p-5 bg-[#141414] hover:bg-[#181818] border border-[#222] hover:border-[#C8A45D] rounded-[16px] space-y-3 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-[10px] bg-[#C8A45D]/15 border border-[#C8A45D]/30 flex items-center justify-center text-[#C8A45D]">
                <Paintbrush className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#666] group-hover:text-[#C8A45D] transition-colors" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-[#E8E4DF] group-hover:text-[#C8A45D] transition-colors">
                Theme Builder Studio (Developer Mode)
              </h3>
              <p className="text-xs text-[#777] mt-1">
                Visual block editor, responsive viewport overrides, raw design tokens, version rollback, and JSON schemas.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-[#555]">
              <span>100% Full Access</span> • <span>Version Engine v1.3</span>
            </div>
          </Link>

          {/* Database Diagnostics */}
          <div className="p-5 bg-[#141414] border border-[#222] rounded-[16px] space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-[10px] bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Healthy</span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-[#E8E4DF]">Database & Schema Health</h3>
              <p className="text-xs text-[#777] mt-1">
                MongoDB collection aggregations, index validation, and reference integrity scanners.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-[#555]">
              <span>Latency: 12ms</span> • <span>Connected</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
