"use client";

import ConnectorCard from "@/components/connectivity/ConnectorCard";

export default function PaymentGatewayView({ paymentGateways, onConfigure, onTestConnection }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Payment Gateways & Webhook Validation
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Manage Stripe Connect, Razorpay Enterprise, and PayPal Express environment toggles (Live/Test) and webhook delivery health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentGateways.map((c) => (
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
