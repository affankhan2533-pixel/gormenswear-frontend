"use client";

import { motion } from "framer-motion";

// Helper pulse class
const pulseClass = "bg-[#151515] border border-[#2A2A2A] rounded-[12px] animate-pulse";

export function ProductCardSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-[#151515] border border-[#2A2A2A] rounded-[12px] p-3 space-y-3 animate-pulse">
          <div className="aspect-[3/4] w-full bg-[#090909] rounded-[10px]" />
          <div className="h-3 w-1/3 bg-[#2A2A2A] rounded" />
          <div className="h-4 w-2/3 bg-[#2A2A2A] rounded" />
          <div className="h-4 w-1/4 bg-[#2A2A2A] rounded" />
        </div>
      ))}
    </>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
      <div className="lg:col-span-7 aspect-[3/4] bg-[#151515] border border-[#2A2A2A] rounded-[16px]" />
      <div className="lg:col-span-5 space-y-6">
        <div className="h-4 w-1/4 bg-[#2A2A2A] rounded" />
        <div className="h-8 w-3/4 bg-[#2A2A2A] rounded" />
        <div className="h-6 w-1/3 bg-[#2A2A2A] rounded" />
        <div className="h-12 w-full bg-[#2A2A2A] rounded-[10px]" />
        <div className="h-12 w-full bg-[#2A2A2A] rounded-[10px]" />
      </div>
    </div>
  );
}

export function CollectionGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="aspect-[3/4] bg-[#151515] border border-[#2A2A2A] rounded-[12px] animate-pulse" />
      ))}
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
      <div className="lg:col-span-7 h-96 bg-[#151515] border border-[#2A2A2A] rounded-[14px]" />
      <div className="lg:col-span-5 h-96 bg-[#151515] border border-[#2A2A2A] rounded-[14px]" />
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="h-28 bg-[#151515] border border-[#2A2A2A] rounded-[14px]" />
      ))}
    </div>
  );
}

export function AccountSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
      <div className="lg:col-span-3 h-80 bg-[#151515] border border-[#2A2A2A] rounded-[14px]" />
      <div className="lg:col-span-9 h-80 bg-[#151515] border border-[#2A2A2A] rounded-[14px]" />
    </div>
  );
}
