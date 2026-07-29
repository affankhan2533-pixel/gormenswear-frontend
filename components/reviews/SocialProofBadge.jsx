"use client";

import { Flame, TrendingUp, Star, Package, ShoppingBag, Eye } from "lucide-react";

const CONFIG = {
  trending: {
    icon: TrendingUp,
    text: "Trending Item • 120 people viewed this today",
    badgeColor: "text-amber-400 border-amber-500/30 bg-amber-950/30",
  },
  bestseller: {
    icon: Flame,
    text: "Best Seller • Ranked #1 in Outerwear",
    badgeColor: "text-orange-400 border-orange-500/30 bg-orange-950/30",
  },
  toprated: {
    icon: Star,
    text: "Top Rated • 4.9/5 Average Customer Rating",
    badgeColor: "text-[#C8A45D] border-[#C8A45D]/30 bg-[#C8A45D]/10",
  },
  limitedstock: {
    icon: Package,
    text: "Limited Stock • Only 4 pieces remaining in size M",
    badgeColor: "text-rose-400 border-rose-500/30 bg-rose-950/30",
  },
  recentlypurchased: {
    icon: ShoppingBag,
    text: "Recently Purchased in New York, USA 12m ago",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-950/30",
  },
};

export default function SocialProofBadge({ type = "toprated", customText }) {
  const badge = CONFIG[type] || CONFIG.toprated;
  const IconComp = badge.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] border text-xs font-sans font-semibold tracking-wide shadow-sm backdrop-blur-md select-none ${badge.badgeColor}`}
    >
      <IconComp className="w-3.5 h-3.5 shrink-0" />
      <span>{customText || badge.text}</span>
    </div>
  );
}
