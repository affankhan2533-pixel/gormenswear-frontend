"use client";

import { motion } from "framer-motion";
import { GitBranch, CheckCircle2, RotateCcw, ArrowUpRight, Clock, ShieldCheck, Play } from "lucide-react";

export default function PipelineDeploymentView({ deployments, onTriggerRollback }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
            CI/CD Deployment Pipelines & Release History
          </h2>
          <p className="text-xs text-[#8E8A85]">
            Track automated build pipelines across Development, Staging, and Production environments with instant rollback capabilities.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {deployments.map((dep) => (
          <div
            key={dep.id}
            className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[20px] shadow-xl space-y-4 hover:border-[#C8A45D]/40 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-editorial text-2xl font-bold text-[#F8F6F3]">
                    {dep.version}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded font-bold">
                    {dep.environment}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full">
                    {dep.status}
                  </span>
                </div>
                <span className="text-xs text-[#8E8A85]">
                  Deployed by <strong className="text-[#F8F6F3]">{dep.author}</strong> on {dep.deployedAt} (Commit: <code className="text-[#C8A45D] font-mono">{dep.commitHash}</code>)
                </span>
              </div>

              {dep.environment === "Production" && (
                <button
                  type="button"
                  onClick={() => onTriggerRollback(dep.version)}
                  className="px-3.5 py-1.5 bg-[#090909] hover:bg-rose-950 hover:text-rose-400 text-rose-400 text-xs font-bold rounded-[8px] border border-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer font-bold shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Rollback Release
                </button>
              )}
            </div>

            <div className="p-3.5 bg-[#090909] border border-[#2A2A2A] rounded-[12px] text-xs text-[#8E8A85]">
              <span className="font-bold text-[#F8F6F3] block uppercase text-[10px] tracking-wider mb-1">
                Release Notes Summary
              </span>
              <p>{dep.releaseNotes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
