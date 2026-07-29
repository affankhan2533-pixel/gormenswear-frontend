"use client";

import { Package, Plus, Download, Upload, Filter, Search } from "lucide-react";

export default function ProductWorkspaceHeader({
  metrics,
  onNewProduct,
  onExport,
  onImport,
}) {
  const { total = 0, active = 0, draft = 0, outOfStock = 0, archived = 0 } = metrics;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-[#141414] border border-[#222222] rounded-[24px] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C8A45D] font-bold block mb-1">
            AKENEO / SHOPIFY PLUS GRADE PIM WORKSPACE
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
            Enterprise Product Catalog Operating System
          </h1>
          <p className="text-xs text-[#8E8A85] mt-1">
            Centralized product information management (PIM), stock threshold tracking, variant governance, and bulk catalog publishing.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onImport}
            className="h-[38px] px-3.5 bg-[#090909] hover:bg-[#1A1A1A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#C8A45D]" /> Import CSV
          </button>

          <button
            type="button"
            onClick={onExport}
            className="h-[38px] px-3.5 bg-[#090909] hover:bg-[#1A1A1A] text-[#F8F6F3] border border-[#2A2A2A] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C8A45D]" /> Export Catalog
          </button>

          <button
            type="button"
            onClick={onNewProduct}
            className="h-[38px] px-4 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md font-bold"
          >
            <Plus className="w-4 h-4" /> Add Product (N)
          </button>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-[#141414] border border-[#222222] rounded-[18px] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Total Products</span>
          <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">{total} SKUs</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222222] rounded-[18px] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Active Published</span>
          <span className="font-editorial text-2xl font-bold text-emerald-400 block">{active} SKUs</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222222] rounded-[18px] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Draft Proposals</span>
          <span className="font-editorial text-2xl font-bold text-amber-400 block">{draft} SKUs</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222222] rounded-[18px] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Out of Stock</span>
          <span className="font-editorial text-2xl font-bold text-rose-400 block">{outOfStock} SKUs</span>
        </div>

        <div className="p-4 bg-[#141414] border border-[#222222] rounded-[18px] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">Archived</span>
          <span className="font-editorial text-2xl font-bold text-[#8E8A85] block">{archived} SKUs</span>
        </div>
      </div>
    </div>
  );
}
