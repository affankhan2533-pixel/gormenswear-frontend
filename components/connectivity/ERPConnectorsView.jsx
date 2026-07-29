"use client";

import ConnectorCard from "@/components/connectivity/ConnectorCard";

export default function ERPConnectorsView({ erpConnectors, onConfigure, onTestConnection }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Enterprise Resource Planning (ERP) Connectors
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Manage OData v4, RESTlets, and SOAP RPC integrations with SAP S/4HANA, Oracle NetSuite, Microsoft Dynamics 365, and Odoo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {erpConnectors.map((c) => (
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
