"use client";

import ConnectorCard from "@/components/connectivity/ConnectorCard";

export default function TaxServicesView({ taxServices, onConfigure, onTestConnection }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Automated Tax Compliance & Calculation Services
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Manage real-time checkout tax determination and filing automation for Avalara AvaTax, TaxJar, and Regional GST/VAT Providers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {taxServices.map((c) => (
          <ConnectorCard
            key={c.id}
            connector={c}
            onConfigure={onConfigure}
            onTestConnection={onTestConnection}
          />
        ))}
      </div>
    </div>
  );
}
