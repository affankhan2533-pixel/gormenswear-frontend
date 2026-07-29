"use client";

import { motion } from "framer-motion";
import { Folder, Trash2, Layers, CheckCircle2, ChevronRight, HardDrive } from "lucide-react";

export default function FolderTreeView({ folders, onSelectFolder }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Folder Hierarchy & Collections Directory
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Organize brand digital assets into nested folders, seasonal campaign lookbooks, and archived repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map((f) => (
          <div
            key={f.id}
            onClick={() => onSelectFolder(f.path)}
            className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[22px] shadow-xl space-y-3 hover:border-[#C8A45D]/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <Folder className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-[#090909] px-2.5 py-1 rounded-[8px] border border-[#2A2A2A]">
                {f.count} Assets
              </span>
            </div>

            <div>
              <h3 className="font-editorial text-2xl text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors">
                {f.name}
              </h3>
              <p className="text-xs text-[#8E8A85] font-mono mt-0.5">Path: /{f.path}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
