"use client";

import { Truck, Package, Scale } from "lucide-react";

export default function ShippingSection({ formData, onChange }) {
  return (
    <div id="section-shipping" className="p-6 bg-[#141414] border border-[#222222] rounded-[24px] space-y-6 shadow-xl">
      <div className="border-b border-[#2A2A2A] pb-3">
        <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
          Logistics & Physical Shipping
        </h3>
        <p className="text-xs text-[#8E8A85]">
          Physical parcel weight, box dimensions, shipping class rates, and courier packaging rules.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Parcel Weight (kg)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.weight || "1.85"}
            onChange={(e) => onChange("weight", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Dimensions (L x W x H cm)
          </label>
          <input
            type="text"
            value={formData.dimensions || "45 x 35 x 10 cm"}
            onChange={(e) => onChange("dimensions", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Shipping Class
          </label>
          <select
            value={formData.shippingClass || "DHL Express Luxury Garment"}
            onChange={(e) => onChange("shippingClass", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
          >
            <option value="DHL Express Luxury Garment">DHL Express Luxury Garment</option>
            <option value="Standard International Freight">Standard International Freight</option>
            <option value="Bespoke Courier Delivery">Bespoke Courier Delivery</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8E8A85] uppercase mb-1">
            Package Container Type
          </label>
          <select
            value={formData.packageType || "Atelier Cotton Garment Bag"}
            onChange={(e) => onChange("packageType", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-[10px] px-3.5 py-2.5 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
          >
            <option value="Atelier Cotton Garment Bag">Atelier Cotton Garment Bag</option>
            <option value="Custom Embossed Gift Box">Custom Embossed Gift Box</option>
            <option value="Standard Cardboard Shipper">Standard Cardboard Shipper</option>
          </select>
        </div>
      </div>
    </div>
  );
}
