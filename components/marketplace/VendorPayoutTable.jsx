"use client";

import { motion } from "framer-motion";
import { DollarSign, CheckCircle2, Clock, CreditCard, Download, FileSpreadsheet } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function VendorPayoutTable({ payouts, onMarkPayoutPaid }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] flex items-center justify-between">
        <div>
          <h3 className="font-editorial text-xl text-[#F8F6F3]">
            Vendor Settlement & Payout Reports
          </h3>
          <p className="text-xs text-[#8E8A85]">
            Gross sales settlements, platform commission deductions, and net payouts.
          </p>
        </div>
      </div>

      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8E8A85] border-collapse">
            <thead className="bg-[#090909] text-[#F8F6F3] font-bold uppercase tracking-wider text-[10px] border-b border-[#2A2A2A]">
              <tr>
                <th className="py-4 px-4">Payout ID & Period</th>
                <th className="py-4 px-4">Marketplace Vendor</th>
                <th className="py-4 px-4 text-center">Gross Revenue</th>
                <th className="py-4 px-4 text-center">Commission Deducted</th>
                <th className="py-4 px-4 text-center">Net Payout Amount</th>
                <th className="py-4 px-4">Payment Method</th>
                <th className="py-4 px-4 text-center">Settlement Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-[#090909]/60 transition-colors font-sans">
                  <td className="py-4 px-4">
                    <span className="font-mono text-[#C8A45D] font-bold text-sm block">
                      {p.payoutCode}
                    </span>
                    <span className="text-[10px] text-[#8E8A85]">{p.period}</span>
                  </td>

                  <td className="py-4 px-4 font-semibold text-[#F8F6F3]">
                    {p.vendorName}
                  </td>

                  <td className="py-4 px-4 text-center font-editorial text-base font-bold text-[#F8F6F3]">
                    ${p.grossRevenue.toLocaleString()}
                  </td>

                  <td className="py-4 px-4 text-center font-mono text-xs text-rose-400">
                    -${p.commissionDeducted.toLocaleString()}
                  </td>

                  <td className="py-4 px-4 text-center font-editorial text-base font-bold text-emerald-400">
                    ${p.netPayoutAmount.toLocaleString()}
                  </td>

                  <td className="py-4 px-4 text-[#8E8A85]">
                    {p.paymentMethod}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        p.status === "Paid"
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                          : p.status === "Processing"
                          ? "bg-blue-950/80 text-blue-400 border-blue-500/30"
                          : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    {p.status !== "Paid" && (
                      <button
                        type="button"
                        onClick={() => onMarkPayoutPaid(p.id)}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#090909] text-[11px] font-bold rounded-[8px] transition-colors cursor-pointer"
                      >
                        Release Payout
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
