"use client";

import { Package, Globe, Tag, Sparkles, Star, Layers, BarChart3, Eye } from "lucide-react";
import SlideOverDrawer from "@/components/admin/overlays/SlideOverDrawer";

export default function PreviewDrawer({ isOpen, onClose, product }) {
  if (!product) return null;

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      subtitle={`PRODUCT PREVIEW • SKU #${product.sku}`}
    >
      <div className="space-y-6">
        {/* Media Frame */}
        <div className="h-64 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[20px] overflow-hidden flex items-center justify-center relative">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-16 h-16 text-[#C8A45D]" />
          )}

          <span className="absolute top-3 left-3 text-[10px] font-mono px-3 py-1 bg-[#090909]/90 text-[#C8A45D] border border-[#2A2A2A] rounded-full font-bold uppercase backdrop-blur-md">
            {product.status}
          </span>

          <span className="absolute bottom-3 right-3 text-[10px] font-mono px-3 py-1 bg-[#090909]/90 text-[#F8F6F3] border border-[#2A2A2A] rounded-full font-bold backdrop-blur-md">
            {product.variantsCount} Variants Configured
          </span>
        </div>

        {/* Pricing & Stock Card Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#8E8A85]">Retail Price</span>
            <div className="font-editorial text-2xl font-bold text-emerald-400 font-mono">
              ${product.price.toFixed(2)}
            </div>
            {product.compareAtPrice && (
              <span className="text-xs text-[#8E8A85] line-through block font-mono">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[16px] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#8E8A85]">Inventory Level</span>
            <div className="font-editorial text-2xl font-bold text-[#F8F6F3] font-mono">
              {product.stock} Units
            </div>
            <span className="text-xs text-[#8E8A85] block">Min Threshold: {product.minStockThreshold}</span>
          </div>
        </div>

        {/* Technical Attributes */}
        <div className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[16px] space-y-3 text-xs">
          <h4 className="font-bold text-[#F8F6F3] uppercase text-[10px] tracking-wider border-b border-[#2A2A2A] pb-2">
            Catalog Specifications
          </h4>

          <div className="grid grid-cols-2 gap-2 text-[#8E8A85]">
            <div>Category: <strong className="text-[#F8F6F3]">{product.category}</strong></div>
            <div>Collection: <strong className="text-[#F8F6F3]">{product.collection}</strong></div>
            <div>Brand: <strong className="text-[#F8F6F3]">{product.brand}</strong></div>
            <div>Barcode: <strong className="text-[#F8F6F3] font-mono">{product.barcode}</strong></div>
          </div>
        </div>

        {/* SEO Health Card */}
        <div className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[16px] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#8E8A85] block">SEO Optimization Score</span>
            <span className="font-editorial text-xl font-bold text-[#C8A45D]">
              {product.seoScore} / 100 Grade A+
            </span>
          </div>
          <Sparkles className="w-6 h-6 text-purple-400" />
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-[#8E8A85] block">Product Tags</span>
          <div className="flex flex-wrap gap-1.5">
            {product.tags?.map((t, i) => (
              <span key={i} className="text-xs font-mono text-[#C8A45D] px-2.5 py-0.5 bg-[#0D0D0D] border border-[#2A2A2A] rounded">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SlideOverDrawer>
  );
}
