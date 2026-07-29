"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Calendar, CreditCard, Truck, History, CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CustomerSubscriptionModal({
  isOpen,
  onClose,
  onUpdateStatus,
  subscriber,
}) {
  if (!isOpen || !subscriber) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscriber-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#C8A45D]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h2 id="subscriber-modal-title" className="font-editorial text-2xl font-normal">
                  Subscriber Profile ({subscriber.subscriberCode})
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Manage billing history, shipping schedule, and subscription state.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Customer Context */}
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-lg text-[#F8F6F3] block">
                  {subscriber.customerName}
                </span>
                <span className="text-xs text-[#8E8A85]">{subscriber.customerEmail}</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#151515] text-[#C8A45D] border border-[#2A2A2A] rounded-full">
                {subscriber.tier} Member
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2A2A2A] text-xs">
              <div>
                <span className="text-[#8E8A85] block">Subscription Plan</span>
                <strong className="text-[#F8F6F3]">{subscriber.planName}</strong>
              </div>
              <div>
                <span className="text-[#8E8A85] block">Monthly Recurring Value</span>
                <strong className="text-emerald-400">${subscriber.mrrValue} / mo</strong>
              </div>
            </div>
          </div>

          {/* Shipping Schedule & Payment Method */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
              <span className="text-[#8E8A85] uppercase tracking-wider font-bold block mb-1">
                Shipping Schedule
              </span>
              <span className="text-[#F8F6F3] font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#C8A45D]" /> {subscriber.shippingSchedule}
              </span>
            </div>

            <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
              <span className="text-[#8E8A85] uppercase tracking-wider font-bold block mb-1">
                Payment Instrument
              </span>
              <span className="text-[#F8F6F3] font-semibold flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[#C8A45D]" /> {subscriber.paymentMethod}
              </span>
            </div>
          </div>

          {/* Billing History Log */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D] flex items-center gap-1.5">
              <History className="w-4 h-4" /> Billing History Audit Log
            </h3>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {subscriber.billingHistory?.map((hist, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-[#090909] border border-[#2A2A2A] rounded-[10px] flex items-center justify-between text-xs"
                >
                  <span className="font-mono text-[#8E8A85]">{hist.date}</span>
                  <span className="font-mono text-[#F8F6F3]">{hist.invoiceNo}</span>
                  <span className="font-bold text-emerald-400">${hist.amount}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-full">
                    {hist.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status State Control Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-2">
              {subscriber.status === "Active" ? (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(subscriber.id, "Paused")}
                  className="px-4 py-2 bg-amber-950/80 hover:bg-amber-900 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider rounded-[8px] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <PauseCircle className="w-4 h-4" /> Pause Subscription
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(subscriber.id, "Active")}
                  className="px-4 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider rounded-[8px] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Resume Subscription
                </button>
              )}

              {subscriber.status !== "Cancelled" && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(subscriber.id, "Cancelled")}
                  className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider rounded-[8px] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Cancel Plan
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#090909] hover:bg-[#2A2A2A] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[8px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
