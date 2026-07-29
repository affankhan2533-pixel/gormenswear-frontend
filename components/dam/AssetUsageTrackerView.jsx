"use client";

import { motion } from "framer-motion";
import { Link2, Layers, ShoppingBag, Globe, Download } from "lucide-react";

export default function AssetUsageTrackerView({ assets }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Asset Usage Matrix & Product Dependency Tracking
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Inspect live links between media assets, catalog SKUs, CMS storefront pages, and marketing campaigns.
        </p>
      </div>

      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">Asset Name</th>
                <th className="py-4 px-4">Linked Products</th>
                <th className="py-4 px-4">Linked CMS Pages</th>
                <th className="py-4 px-4 text-center">Download Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {assets.map((a) => (
                <tr key={a.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                  <td className="py-4 px-4 font-semibold text-[#F8F6F3]">
                    {a.name}
                    <span className="text-[10px] text-[#8E8A85] block font-mono">ID: {a.id}</span>
                  </td>
                  <td className="py-4 px-4 text-[#C8A45D]">
                    {a.usedInProducts?.join(", ") || "Unlinked"}
                  </td>
                  <td className="py-4 px-4 text-[#F8F6F3]">
                    {a.usedInCMS?.join(", ") || "Unlinked"}
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-emerald-400">
                    {a.usageCount} downloads
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
