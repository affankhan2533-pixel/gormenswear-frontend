"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Package,
  Search,
  MapPin,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const PRESETS = {
  products: {
    icon: ShoppingBag,
    eyebrow: "NO PRODUCTS FOUND",
    title: "No Garments Available",
    description: "There are currently no garments matching your selected criteria. Try adjusting your filters or browse our full catalog.",
    ctaText: "Explore All Collections",
    ctaHref: "/shop",
  },
  wishlist: {
    icon: Heart,
    eyebrow: "EMPTY WISHLIST",
    title: "Your Wishlist is Empty",
    description: "Save your favorite pieces and access them anytime while browsing our catalog.",
    ctaText: "Explore Collections",
    ctaHref: "/shop",
  },
  orders: {
    icon: Package,
    eyebrow: "NO ORDERS YET",
    title: "No Orders Found",
    description: "Your order history will appear here once you complete your first purchase.",
    ctaText: "Start Shopping",
    ctaHref: "/shop",
  },
  search: {
    icon: Search,
    eyebrow: "NO RESULTS FOUND",
    title: "No Search Results",
    description: "We couldn't find any garments matching your search. Try searching for shirts, co-ord sets, trousers, or outerwear.",
    ctaText: "Browse All Products",
    ctaHref: "/shop",
  },
  addresses: {
    icon: MapPin,
    eyebrow: "NO SAVED ADDRESSES",
    title: "No Saved Addresses",
    description: "Add a delivery address to speed up your checkout process for future orders.",
    ctaText: "Add New Address",
    ctaHref: "#",
  },
  cart: {
    icon: ShoppingBag,
    eyebrow: "EMPTY SHOPPING BAG",
    title: "Your Shopping Bag is Empty",
    description: "Discover our latest arrivals and add your favorite garments to your bag.",
    ctaText: "Explore New Arrivals",
    ctaHref: "/new-arrivals",
  },
};

export default function EmptyState({ type = "products", customTitle, customDesc, onAction }) {
  const preset = PRESETS[type] || PRESETS.products;
  const IconComp = preset.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center py-16 px-6 max-w-md mx-auto bg-[#151515] border border-[#2A2A2A] rounded-[18px] shadow-2xl space-y-4 my-6"
    >
      <div className="w-20 h-20 rounded-full border border-[#C8A45D]/30 bg-[#090909] flex items-center justify-center mx-auto shadow-inner text-[#C8A45D]">
        <IconComp className="w-9 h-9" />
      </div>

      <div>
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold flex items-center justify-center gap-1.5 mb-1">
          <Sparkles className="w-3 h-3" /> {preset.eyebrow}
        </span>
        <h3 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          {customTitle || preset.title}
        </h3>
      </div>

      <p className="font-sans text-xs text-[#8E8A85] font-light leading-relaxed max-w-xs mx-auto">
        {customDesc || preset.description}
      </p>

      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] transition-colors cursor-pointer shadow-lg active:scale-95"
        >
          <span>{preset.ctaText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <Link href={preset.ctaHref} className="inline-block pt-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] transition-colors cursor-pointer shadow-lg active:scale-95"
          >
            <span>{preset.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      )}
    </motion.div>
  );
}
