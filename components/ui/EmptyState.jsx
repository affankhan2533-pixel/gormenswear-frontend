"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PRESETS = {
  products: {
    eyebrow: "00 / ARCHIVE",
    title: "NO PIECES YET",
    description: "This collection is being prepared.",
    ctaText: "EXPLORE SHOP",
    ctaHref: "/shop",
  },
  category: {
    eyebrow: "00 / ARCHIVE",
    title: "NO PIECES YET",
    description: "This collection is being prepared.",
    ctaText: "BACK TO SHOP",
    ctaHref: "/shop",
  },
  wishlist: {
    eyebrow: "SAVED PIECES",
    title: "YOUR SAVED PIECES",
    description: "No saved products yet.",
    ctaText: "EXPLORE SHOP",
    ctaHref: "/shop",
  },
  cart: {
    eyebrow: "BAG",
    title: "YOUR BAG IS EMPTY",
    description: "Your shopping bag currently has no items.",
    ctaText: "EXPLORE COLLECTION",
    ctaHref: "/shop",
  },
  search: {
    eyebrow: "SEARCH",
    title: "NO RESULTS FOUND",
    description: "No pieces match your search terms.",
    ctaText: "VIEW ALL PIECES",
    ctaHref: "/shop",
  },
};

export default function EmptyState({ type = "products", customTitle, customDesc, onAction, actionLabel, actionHref }) {
  const preset = PRESETS[type] || PRESETS.products;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="text-center py-20 px-6 max-w-md mx-auto space-y-4 my-8"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#716D66] block">
        {preset.eyebrow}
      </span>

      <h3 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
        {customTitle || preset.title}
      </h3>

      <p className="font-sans text-xs text-[#716D66] font-light leading-relaxed max-w-xs mx-auto">
        {customDesc || preset.description}
      </p>

      <div className="pt-2">
        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center px-7 py-3 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
          >
            <span>{actionLabel || preset.ctaText}</span>
          </button>
        ) : (
          <Link
            href={actionHref || preset.ctaHref}
            className="inline-flex items-center justify-center px-7 py-3 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors"
          >
            <span>{actionLabel || preset.ctaText}</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
