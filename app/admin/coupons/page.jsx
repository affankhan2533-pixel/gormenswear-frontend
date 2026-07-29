"use client";
import AdminShell from "@/components/admin/shell/AdminShell";
import { Ticket } from "lucide-react";
export default function CouponsPage() {
  return (
    <AdminShell>
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-[18px] bg-[#111] border border-[#1E1E1E] flex items-center justify-center">
          <Ticket className="w-7 h-7 text-[#444]" />
        </div>
        <h1 className="text-xl font-bold text-[#E8E4DF]">Coupons</h1>
        <p className="text-sm text-[#555] text-center max-w-sm">
          Coupon & discount management is coming soon. Create percentage, flat, and free-shipping discount codes.
        </p>
        <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">Coming Soon</span>
      </div>
    </AdminShell>
  );
}
