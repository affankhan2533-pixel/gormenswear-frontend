"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function ProductAccordions({ product = {} }) {
  const [openSection, setOpenSection] = useState("description");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <div className="border border-[#2A2A2A] rounded-2xl divide-y divide-[#2A2A2A] bg-[#111111] overflow-hidden shadow-xl select-none">
      
      {/* ── 1. DESCRIPTION ACCORDION ── */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("description")}
          aria-expanded={openSection === "description"}
          className="w-full p-4 sm:p-5 flex items-center justify-between font-sans text-xs uppercase tracking-wider font-bold text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer"
        >
          <span>Product Description</span>
          <ChevronDown
            className={`w-4 h-4 text-[#C9A86A] transition-transform duration-300 ${
              openSection === "description" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSection === "description" && (
          <div className="p-4 sm:p-5 pt-0 font-sans text-xs text-[#B8B6B0] font-light leading-relaxed space-y-3 border-t border-[#2A2A2A]/40">
            <p>
              • {product.description || "Crafted with custom heavyweight cotton blends, bespoke gold hardware, and a contemporary architectural silhouette."}
            </p>
            <p>
              • Engineered for structured drape, tactile breathability, and seamless day-to-night elegance.
            </p>
            <p>
              • Features discreet GOR signature emblem branding and reinforced double-needle seams throughout.
            </p>
          </div>
        )}
      </div>

      {/* ── 2. FABRIC & CARE ACCORDION (WITH EDITORIAL "THE FABRIC" STORY) ── */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("fabric")}
          aria-expanded={openSection === "fabric"}
          className="w-full p-4 sm:p-5 flex items-center justify-between font-sans text-xs uppercase tracking-wider font-bold text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer"
        >
          <span>Fabric & Care</span>
          <ChevronDown
            className={`w-4 h-4 text-[#C9A86A] transition-transform duration-300 ${
              openSection === "fabric" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSection === "fabric" && (
          <div className="p-4 sm:p-5 pt-0 space-y-4 border-t border-[#2A2A2A]/40">
            
            {/* ── EDITORIAL "THE FABRIC" STORY BLOCK (REFINEMENT #8) ── */}
            <div className="p-4 bg-[#0B0B0B] border border-[#C9A86A]/30 rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A86A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> THE FABRIC STORY
              </span>
              <p className="font-serif text-sm font-normal text-[#F7F5F2] italic leading-relaxed">
                "Spun from long-staple organic cotton fibers and woven at 380 GSM, this textile undergoes a specialized cold-dye process that imparts deep color depth without compromising fiber structure. Hand-finished for an exceptionally rich, heavy drape that holds its shape season after season."
              </p>
            </div>

            <div className="font-sans text-xs text-[#B8B6B0] font-light leading-relaxed space-y-2">
              <p>• <strong>Composition:</strong> {product.fabric || "100% Heavyweight Organic Cotton Fleece (380 GSM)."}</p>
              <p>• <strong>Care Instructions:</strong> {product.care || "Machine wash cold inside out with like dark colors."}</p>
              <p>• Pre-shrunk weave to preserve precise shoulder drape after washing.</p>
              <p>• Cool iron on reverse avoiding direct contact with custom trims.</p>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. SHIPPING ACCORDION ── */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("shipping")}
          aria-expanded={openSection === "shipping"}
          className="w-full p-4 sm:p-5 flex items-center justify-between font-sans text-xs uppercase tracking-wider font-bold text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer"
        >
          <span>Shipping & Delivery</span>
          <ChevronDown
            className={`w-4 h-4 text-[#C9A86A] transition-transform duration-300 ${
              openSection === "shipping" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSection === "shipping" && (
          <div className="p-4 sm:p-5 pt-0 font-sans text-xs text-[#B8B6B0] font-light leading-relaxed space-y-2 border-t border-[#2A2A2A]/40">
            <p>• Complimentary Express Air Dispatch within 24 hours of order confirmation.</p>
            <p>• Standard Delivery: 3–5 Business Days | Express Air: 1–2 Business Days.</p>
            <p>• Real-time SMS and email tracking links dispatched upon shipment.</p>
            <p>• Shipped in signature GOR tamper-proof luxury rigid gift packaging.</p>
          </div>
        )}
      </div>

      {/* ── 4. RETURNS ACCORDION ── */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("returns")}
          aria-expanded={openSection === "returns"}
          className="w-full p-4 sm:p-5 flex items-center justify-between font-sans text-xs uppercase tracking-wider font-bold text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer"
        >
          <span>Returns & Exchanges</span>
          <ChevronDown
            className={`w-4 h-4 text-[#C9A86A] transition-transform duration-300 ${
              openSection === "returns" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSection === "returns" && (
          <div className="p-4 sm:p-5 pt-0 font-sans text-xs text-[#B8B6B0] font-light leading-relaxed space-y-2 border-t border-[#2A2A2A]/40">
            <p>• Complimentary 7-Day exchange policy for size or color adjustments.</p>
            <p>• Doorstep return pickup arranged at zero additional charge.</p>
            <p>• Garments must remain unworn with all security tags intact.</p>
          </div>
        )}
      </div>

    </div>
  );
}
