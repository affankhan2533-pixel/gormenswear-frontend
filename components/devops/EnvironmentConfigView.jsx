"use client";

import { motion } from "framer-motion";
import { Lock, Eye, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function EnvironmentConfigView({ envVars }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Environment Variable Configuration (.env)
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Inspect active runtime environment variables without exposing sensitive secret credentials.
        </p>
      </div>

      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4 font-mono">Environment Variable Key</th>
                <th className="py-4 px-4 font-mono">Configured Value</th>
                <th className="py-4 px-4 text-center">Environment</th>
                <th className="py-4 px-4 text-right">Security Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {envVars.map((ev, i) => (
                <tr key={i} className="hover:bg-[#090909]/60 transition-colors font-sans">
                  <td className="py-4 px-4 font-mono font-bold text-[#C8A45D]">
                    {ev.key}
                  </td>
                  <td className="py-4 px-4 font-mono text-[#F8F6F3]">
                    {ev.value}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-emerald-400 border border-emerald-500/30 rounded">
                      {ev.environment}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {ev.isSecret ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-950/80 text-rose-400 border border-rose-500/30 rounded">
                        Encrypted Secret
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-950/80 text-blue-400 border border-blue-500/30 rounded">
                        Public Config
                      </span>
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
