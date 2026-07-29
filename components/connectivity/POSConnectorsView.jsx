"use client";

import ConnectorCard from "@/components/connectivity/ConnectorCard";

export default function POSConnectorsView({ posConnectors, onConfigure, onTestConnection }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Point of Sale (POS) Solutions & Terminals
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Manage store location mapping and real-time terminal synchronization with Shopify POS Pro, Square, Clover, and Custom GOR Atelier POS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posConnectors.map((c) => (
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
