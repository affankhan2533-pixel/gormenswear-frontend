"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Tag, Percent, Layers, Plus, ChevronRight, Edit2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function WholesalePriceListTable({ priceLists, onEditPriceList }) {
  const [selectedListId, setSelectedListId] = useState(priceLists[0] ? priceLists[0].id : "");
  const [searchQuery, setSearchQuery] = useState("");

  const activeList = priceLists.find((pl) => pl.id === selectedListId) || priceLists[0];

  const filteredItems = activeList
    ? activeList.items.filter((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Price List Selector Header */}
      <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Tag className="w-5 h-5 text-[#C8A45D]" />
          <div>
            <span className="text-[10px] text-[#8E8A85] font-bold uppercase tracking-wider block">
              Active Wholesale Contract Catalog
            </span>
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              className="bg-transparent text-[#F8F6F3] font-editorial text-xl font-normal outline-none cursor-pointer"
            >
              {priceLists.map((pl) => (
                <option key={pl.id} value={pl.id} className="bg-[#151515] text-[#F8F6F3] text-sm">
                  {pl.name} ({pl.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8E8A85] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog SKUs..."
              className="pl-9 pr-4 py-2 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => onEditPriceList(activeList)}
            className="px-3.5 py-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] text-xs font-bold uppercase tracking-wider rounded-[8px] border border-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Contract Rules
          </button>
        </div>
      </div>

      {/* Price Table Matrix */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">SKU / Product Name</th>
                <th className="py-4 px-4 text-center">Retail MSRP</th>
                <th className="py-4 px-4 text-center">Base Wholesale Price</th>
                <th className="py-4 px-4 text-center">Tier 1 (1 - 50 Units)</th>
                <th className="py-4 px-4 text-center">Tier 2 (51 - 200 Units)</th>
                <th className="py-4 px-4 text-center">Tier 3 (201+ Bulk)</th>
                <th className="py-4 px-4 text-center">Wholesale Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#8E8A85]">
                    No products found in this price list catalog.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const t1 = item.tierPricing?.[0]?.price || item.wholesalePrice;
                  const t2 = item.tierPricing?.[1]?.price || t1;
                  const t3 = item.tierPricing?.[2]?.price || t2;
                  const marginPercent = Math.round(((item.msrp - item.wholesalePrice) / item.msrp) * 100);

                  return (
                    <tr key={idx} className="hover:bg-[#090909]/60 transition-colors font-sans">
                      <td className="py-4 px-4">
                        <span className="font-semibold text-[#F8F6F3] block text-sm">
                          {item.productName}
                        </span>
                        <span className="text-[10px] font-mono text-[#C8A45D]">{item.sku}</span>
                      </td>

                      <td className="py-4 px-4 text-center font-mono text-xs text-[#8E8A85] line-through">
                        ${item.msrp}
                      </td>

                      <td className="py-4 px-4 text-center font-editorial text-base font-bold text-[#F8F6F3]">
                        ${item.wholesalePrice}
                      </td>

                      <td className="py-4 px-4 text-center font-editorial text-sm font-bold text-[#C8A45D]">
                        ${t1}
                      </td>

                      <td className="py-4 px-4 text-center font-editorial text-sm font-bold text-emerald-400">
                        ${t2}
                      </td>

                      <td className="py-4 px-4 text-center font-editorial text-sm font-bold text-blue-400">
                        ${t3}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full">
                          {marginPercent}% Off MSRP
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
