"use client";

import ConnectorCard from "@/components/connectivity/ConnectorCard";

export default function ShippingConnectorsView({ shippingConnectors, onConfigure, onTestConnection }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Logistics, Courier & Shipping Carriers
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Manage automated shipping label generation and real-time tracking webhooks for DHL Express, FedEx, Shiprocket, Delhivery, and Blue Dart.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shippingConnectors.map((c) => (
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
