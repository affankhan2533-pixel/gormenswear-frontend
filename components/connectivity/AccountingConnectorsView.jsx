"use client";

import ConnectorCard from "@/components/connectivity/ConnectorCard";

export default function AccountingConnectorsView({ accountingConnectors, onConfigure, onTestConnection }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Accounting & Financial Ledger Software
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Manage chart of accounts mapping and financial ledger synchronization for QuickBooks Online, Xero, and Tally Prime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accountingConnectors.map((c) => (
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
