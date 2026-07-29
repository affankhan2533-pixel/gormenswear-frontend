"use client";

import { useState, useEffect } from "react";
import { Save, Package, DollarSign, Tag, Globe, Sparkles } from "lucide-react";
import SlideOverDrawer from "@/components/admin/overlays/SlideOverDrawer";

export default function EditDrawer({
  isOpen,
  onClose,
  product,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: 0,
    status: "Active",
    category: "Outerwear",
    collection: "Autumn 2026",
    visibility: "Published",
    featured: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || 0,
        status: product.status || "Active",
        category: product.category || "Outerwear",
        collection: product.collection || "Autumn 2026",
        visibility: product.visibility || "Published",
        featured: product.featured || false,
      });
    }
  }, [product, isOpen]);

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product.id, {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    });
    onClose();
  };

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Quick Edit SKU #${product.sku}`}
      subtitle="INLINE PRODUCT SPECIFICATION & INVENTORY"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Product Title
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-medium"
          />
        </div>

        {/* Price & Stock Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
              Retail Price ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
              Inventory Units
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
            />
          </div>
        </div>

        {/* Status & Visibility */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
              Catalog Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
              Storefront Visibility
            </label>
            <select
              value={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
            >
              <option value="Published">Published</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
        </div>

        {/* Category & Collection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
              Collection
            </label>
            <input
              type="text"
              value={formData.collection}
              onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
            />
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="p-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between">
          <span className="text-xs font-bold text-[#F8F6F3]">Featured Hero Product</span>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, featured: !formData.featured })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
              formData.featured ? "bg-[#C8A45D]" : "bg-[#2A2A2A]"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-[#090909] transition-transform ${
                formData.featured ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#2A2A2A] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-[#0D0D0D] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[10px] text-xs font-bold uppercase"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase flex items-center gap-1.5 font-bold shadow-lg"
          >
            <Save className="w-4 h-4" /> Save SKU Changes
          </button>
        </div>
      </form>
    </SlideOverDrawer>
  );
}
