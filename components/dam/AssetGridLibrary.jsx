"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, LayoutGrid, List, Filter, Download, Eye, Tag, FileText, CheckCircle2 } from "lucide-react";

export default function AssetGridLibrary({
  assets,
  onOpenAssetDetail,
  onUploadNewAsset,
}) {
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.aiTags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || a.fileType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Search & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151515] p-4 rounded-[20px] border border-[#2A2A2A]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8E8A85] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search asset title or AI tags (e.g. Suede, 4K)..."
            className="w-full pl-10 pr-4 py-2 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* File Type Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#090909] p-1 rounded-[10px] border border-[#2A2A2A]">
            {["all", "Image", "Video", "PDF", "Logo"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-[6px] text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                  filterType === t
                    ? "bg-[#C8A45D] text-[#090909]"
                    : "text-[#8E8A85] hover:text-[#F8F6F3]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Grid/List View Switcher */}
          <div className="flex items-center gap-1 bg-[#090909] p-1 rounded-[10px] border border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-[6px] transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-[6px] transition-colors cursor-pointer ${
                viewMode === "list" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => onOpenAssetDetail(asset)}
              className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl hover:border-[#C8A45D]/40 transition-colors cursor-pointer group space-y-3 p-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Media Preview Thumbnail Frame */}
                <div className="relative h-44 bg-[#090909] rounded-[14px] overflow-hidden flex items-center justify-center border border-[#2A2A2A]">
                  {asset.imageUrl ? (
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-[#C8A45D]" />
                  )}

                  <span className="absolute top-2 left-2 text-[9px] font-mono px-2 py-0.5 bg-[#090909]/90 text-[#C8A45D] border border-[#2A2A2A] rounded font-bold uppercase backdrop-blur-md">
                    {asset.fileType}
                  </span>

                  <span className="absolute bottom-2 right-2 text-[9px] font-mono px-2 py-0.5 bg-[#090909]/90 text-[#F8F6F3] border border-[#2A2A2A] rounded font-bold backdrop-blur-md">
                    {asset.version}
                  </span>
                </div>

                <div>
                  <h4 className="font-editorial text-lg text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors line-clamp-1">
                    {asset.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[#8E8A85] block">
                    {asset.resolution} • {asset.fileSize}
                  </span>
                </div>

                {/* AI Tags */}
                <div className="flex flex-wrap gap-1">
                  {asset.aiTags?.slice(0, 3).map((t, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-mono text-[#C8A45D] px-2 py-0.5 bg-[#090909] border border-[#2A2A2A] rounded"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#2A2A2A] flex justify-between items-center text-[10px] text-[#8E8A85]">
                <span>Status: <strong className="text-emerald-400">{asset.status}</strong></span>
                <span>Used: {asset.usageCount}x</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode */
        <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
              <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
                <tr>
                  <th className="py-4 px-4">Asset Name</th>
                  <th className="py-4 px-4 text-center">Type</th>
                  <th className="py-4 px-4 text-center">Resolution & Size</th>
                  <th className="py-4 px-4 text-center">Version</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {filteredAssets.map((a) => (
                  <tr key={a.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                    <td className="py-4 px-4 font-semibold text-[#F8F6F3]">
                      {a.name}
                      <span className="text-[10px] text-[#8E8A85] block font-mono">Folder: {a.folder}</span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-[#C8A45D]">{a.fileType}</td>
                    <td className="py-4 px-4 text-center font-mono text-[#F8F6F3]">{a.resolution} ({a.fileSize})</td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-blue-400">{a.version}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full">
                        {a.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenAssetDetail(a)}
                        className="px-3 py-1.5 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-[11px] font-bold rounded-[8px] border border-[#2A2A2A] transition-colors cursor-pointer"
                      >
                        Inspect & Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
