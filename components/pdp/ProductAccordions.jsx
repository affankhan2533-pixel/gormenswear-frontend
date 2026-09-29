"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ProductAccordions({ product = {} }) {
  const [openSections, setOpenSections] = useState({
    details: true,
    sizing: false,
    delivery: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="border-t border-[#D8D2C8] divide-y divide-[#D8D2C8] select-none font-sans mt-8">
      {/* ── 1. PRODUCT DETAILS ── */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection("details")}
          aria-expanded={openSections.details}
          className="w-full flex items-center justify-between text-xs uppercase tracking-[0.2em] font-medium text-[#111111] hover:text-[#8C7A6B] transition-colors cursor-pointer"
        >
          <span>PRODUCT DETAILS</span>
          <ChevronDown
            className={`w-3.5 h-3.5 stroke-[1.5] text-[#716D66] transition-transform duration-200 ${
              openSections.details ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSections.details && (
          <div className="pt-3 text-xs text-[#716D66] font-light leading-relaxed space-y-2">
            {product.description ? (
              <p>{product.description}</p>
            ) : (
              <p>Considered proportions and signature silhouette crafted for everyday wear.</p>
            )}
            {product.sku && (
              <p className="font-mono text-[11px] text-[#716D66]/80 pt-1">
                ARCHIVE CODE: {product.sku}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── 2. SIZING GUIDE ── */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection("sizing")}
          aria-expanded={openSections.sizing}
          className="w-full flex items-center justify-between text-xs uppercase tracking-[0.2em] font-medium text-[#111111] hover:text-[#8C7A6B] transition-colors cursor-pointer"
        >
          <span>SIZING & MEASUREMENTS</span>
          <ChevronDown
            className={`w-3.5 h-3.5 stroke-[1.5] text-[#716D66] transition-transform duration-200 ${
              openSections.sizing ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSections.sizing && (
          <div className="pt-3 text-xs text-[#716D66] font-light leading-relaxed space-y-3">
            <p>
              Designed with relaxed proportions. We recommend ordering your true size for the intended drape, or sizing down for a closer fit.
            </p>
            <div className="border border-[#D8D2C8] overflow-x-auto">
              <table className="w-full text-left font-sans text-[11px]">
                <thead>
                  <tr className="border-b border-[#D8D2C8] bg-[#EFECE6]/60 text-[#111111]">
                    <th className="p-2 font-medium">SIZE</th>
                    <th className="p-2 font-medium">CHEST (IN)</th>
                    <th className="p-2 font-medium">LENGTH (IN)</th>
                    <th className="p-2 font-medium">SHOULDER (IN)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D2C8]">
                  <tr>
                    <td className="p-2 font-medium text-[#111111]">S</td>
                    <td className="p-2">42</td>
                    <td className="p-2">28</td>
                    <td className="p-2">21</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-[#111111]">M</td>
                    <td className="p-2">44</td>
                    <td className="p-2">29</td>
                    <td className="p-2">22</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-[#111111]">L</td>
                    <td className="p-2">46</td>
                    <td className="p-2">30</td>
                    <td className="p-2">23</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-[#111111]">XL</td>
                    <td className="p-2">48</td>
                    <td className="p-2">31</td>
                    <td className="p-2">24</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-[#111111]">XXL</td>
                    <td className="p-2">50</td>
                    <td className="p-2">32</td>
                    <td className="p-2">25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. DELIVERY & RETURNS ── */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection("delivery")}
          aria-expanded={openSections.delivery}
          className="w-full flex items-center justify-between text-xs uppercase tracking-[0.2em] font-medium text-[#111111] hover:text-[#8C7A6B] transition-colors cursor-pointer"
        >
          <span>DELIVERY / RETURNS</span>
          <ChevronDown
            className={`w-3.5 h-3.5 stroke-[1.5] text-[#716D66] transition-transform duration-200 ${
              openSections.delivery ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSections.delivery && (
          <div className="pt-3 text-xs text-[#716D66] font-light leading-relaxed space-y-2">
            <p>• Complimentary express courier dispatch within 24 to 48 hours.</p>
            <p>• Standard domestic delivery arrives within 3 to 5 business days.</p>
            <p>• Complimentary 7-day doorstep size or color exchange service.</p>
            <p>• Garments must remain unwashed and in original condition with security tags attached.</p>
          </div>
        )}
      </div>
    </div>
  );
}
