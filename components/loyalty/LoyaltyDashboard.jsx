"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Gift,
  Crown,
  Sparkles,
  Copy,
  Check,
  Share2,
  Send,
  MessageSquare,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Percent,
  Truck,
  Star,
  Users,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

const TIERS = [
  {
    id: "silver",
    name: "Silver Tier",
    badge: "SILVER",
    minPoints: 0,
    maxPoints: 1000,
    color: "from-zinc-400 to-zinc-600",
    benefits: ["1x Points on every purchase", "Standard Express Shipping", "Birthday Reward ($15)"],
  },
  {
    id: "gold",
    name: "Gold Tier",
    badge: "GOLD",
    minPoints: 1001,
    maxPoints: 3000,
    color: "from-[#C8A45D] to-[#D4B77D]",
    benefits: ["1.5x Points on every purchase", "Free Express Shipping on all orders", "Private Drop Early Access", "Birthday Gift ($30)"],
  },
  {
    id: "platinum",
    name: "Platinum Tier",
    badge: "PLATINUM",
    minPoints: 3001,
    maxPoints: 10000,
    color: "from-[#E5E5E5] to-[#999999]",
    benefits: ["2x Points on every purchase", "Free Global Priority Shipping", "Dedicated Priority Support", "Birthday Gift ($50)", "Exclusive Collection Invitations"],
  },
];

const REWARDS_CATALOG = [
  {
    id: "r-ship",
    title: "Free Express Shipping Voucher",
    category: "Shipping",
    pointsRequired: 300,
    icon: Truck,
    description: "Complimentary express delivery on your next purchase.",
  },
  {
    id: "r-15",
    title: "15% Off Entire Order",
    category: "Percentage Discount",
    pointsRequired: 750,
    icon: Percent,
    description: "Enjoy 15% discount applied automatically at checkout.",
  },
  {
    id: "r-30",
    title: "$30 Store Credit Voucher",
    category: "Fixed Discount",
    pointsRequired: 1000,
    icon: Gift,
    description: "Instant $30 deduction on orders over $150.",
  },
  {
    id: "r-pass",
    title: "Private Early Access Drop Pass",
    category: "Exclusive Access",
    pointsRequired: 1500,
    icon: Crown,
    description: "24-hour early access window to new seasonal releases.",
  },
];

const INITIAL_HISTORY = [
  { id: "h1", type: "earned", title: "Purchased Burgundy Alo Co-Ord", points: "+380", date: "Jan 22, 2026" },
  { id: "h2", type: "referral", title: "Referral Bonus (Friend Joined)", points: "+250", date: "Jan 15, 2026" },
  { id: "h3", type: "redeemed", title: "Redeemed $30 Store Credit", points: "-1,000", date: "Jan 05, 2026" },
  { id: "h4", type: "bonus", title: "Member Birthday Bonus", points: "+500", date: "Dec 18, 2025" },
];

export default function LoyaltyDashboard() {
  const [points, setPoints] = useState(1450);
  const [lifetimePoints, setLifetimePoints] = useState(3200);
  const [redeemedPoints, setRedeemedPoints] = useState(1750);
  const [expiringPoints] = useState(150);
  const [referralCode] = useState("GOR-GOLD-8492");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(INITIAL_HISTORY);

  const { success, error } = useToast();

  // Current Active Tier
  const activeTier = useMemo(() => {
    if (points >= 3001) return TIERS[2]; // Platinum
    if (points >= 1001) return TIERS[1]; // Gold
    return TIERS[0]; // Silver
  }, [points]);

  // Next Tier Progress percentage
  const nextTierProgress = useMemo(() => {
    if (activeTier.id === "platinum") return 100;
    const range = activeTier.maxPoints - activeTier.minPoints;
    const current = points - activeTier.minPoints;
    return Math.min(Math.round((current / range) * 100), 100);
  }, [activeTier, points]);

  // Handle Copy Referral Code
  const handleCopyReferral = () => {
    if (typeof navigator !== "undefined") {
      const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      success("Referral Link Copied", "Share with friends to earn 250 bonus points.");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle WhatsApp Share
  const handleWhatsAppShare = () => {
    const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`;
    const text = `Join GOR Menswear using my referral code ${referralCode} and get 250 bonus reward points! ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Handle Redeem Reward
  const handleRedeem = (reward) => {
    if (points < reward.pointsRequired) {
      error("Insufficient Points", `You need ${reward.pointsRequired - points} more points to redeem this reward.`);
      return;
    }

    setPoints((prev) => prev - reward.pointsRequired);
    setRedeemedPoints((prev) => prev + reward.pointsRequired);

    const newHistoryObj = {
      id: `h-${Date.now()}`,
      type: "redeemed",
      title: `Redeemed ${reward.title}`,
      points: `-${reward.pointsRequired}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setHistory((prev) => [newHistoryObj, ...prev]);
    success("Reward Unlocked!", `Voucher code generated: GOR-REWARD-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  return (
    <div className="space-[#151515] space-y-10 select-none font-sans">
      
      {/* ── 1. WALLET DASHBOARD HERO CARD ── */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A45D]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-1.5 mb-1">
              <Crown className="w-4 h-4 fill-[#C8A45D]" /> REWARDS WALLET
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
              Membership & Rewards
            </h2>
          </div>

          {/* Tier Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#090909] border border-[#C8A45D]/40 text-[#C8A45D] text-xs font-bold uppercase tracking-wider shadow-inner w-fit">
            <Award className="w-4 h-4" />
            <span>{activeTier.name}</span>
          </div>
        </div>

        {/* 4 Wallet Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px]">
            <span className="text-[10px] uppercase tracking-wider text-[#8E8A85] block mb-1">Available Points</span>
            <span className="font-editorial text-3xl sm:text-4xl font-normal text-[#C8A45D]">{points.toLocaleString()}</span>
            <span className="text-[9.5px] text-[#8E8A85] block mt-1">Ready to redeem</span>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px]">
            <span className="text-[10px] uppercase tracking-wider text-[#8E8A85] block mb-1">Lifetime Earned</span>
            <span className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">{lifetimePoints.toLocaleString()}</span>
            <span className="text-[9.5px] text-emerald-400 block mt-1">Total points accumulated</span>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px]">
            <span className="text-[10px] uppercase tracking-wider text-[#8E8A85] block mb-1">Redeemed Points</span>
            <span className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">{redeemedPoints.toLocaleString()}</span>
            <span className="text-[9.5px] text-[#8E8A85] block mt-1">Vouchers unlocked</span>
          </div>

          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px]">
            <span className="text-[10px] uppercase tracking-wider text-[#8E8A85] block mb-1">Expiring Points</span>
            <span className="font-editorial text-3xl sm:text-4xl font-normal text-amber-400">{expiringPoints}</span>
            <span className="text-[9.5px] text-amber-400/80 block mt-1">Expires in 30 days</span>
          </div>
        </div>

        {/* Tier Progress Bar */}
        {activeTier.id !== "platinum" && (
          <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#8E8A85]">
                Progress to <strong className="text-[#F8F6F3]">Platinum Tier</strong>
              </span>
              <span className="font-bold text-[#C8A45D] font-mono">{nextTierProgress}%</span>
            </div>
            <div className="h-2 w-full bg-[#151515] rounded-full overflow-hidden border border-[#2A2A2A]">
              <div
                className="h-full bg-gradient-to-r from-[#C8A45D] to-[#D4B77D] rounded-full transition-all duration-500"
                style={{ width: `${nextTierProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-[#8E8A85] block">
              Earn {3001 - points} more points to unlock Platinum Tier priority benefits.
            </span>
          </div>
        )}
      </div>

      {/* ── 2. MEMBERSHIP TIERS COMPARISON ── */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold block">
          MEMBERSHIP TIERS & BENEFITS
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((tier) => {
            const isActive = activeTier.id === tier.id;
            return (
              <div
                key={tier.id}
                className={`bg-[#151515] border rounded-[16px] p-6 space-y-4 relative transition-all ${
                  isActive
                    ? "border-[#C8A45D] shadow-xl ring-1 ring-[#C8A45D]/30"
                    : "border-[#2A2A2A] opacity-80"
                }`}
              >
                {isActive && (
                  <span className="absolute top-4 right-4 text-[9px] uppercase tracking-wider bg-[#C8A45D] text-[#090909] font-extrabold px-2.5 py-0.5 rounded shadow">
                    Active Tier
                  </span>
                )}

                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#8E8A85] block mb-1">
                    {tier.minPoints === 0 ? "Tier 1" : tier.minPoints === 1001 ? "Tier 2" : "Tier 3"}
                  </span>
                  <h3 className="font-editorial text-2xl text-[#F8F6F3]">{tier.name}</h3>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#2A2A2A]">
                  {tier.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#8E8A85]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C8A45D] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. REWARDS CATALOG (POINT REDEMPTION) ── */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold block">
          REWARDS CATALOG
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REWARDS_CATALOG.map((rew) => {
            const canRedeem = points >= rew.pointsRequired;
            const IconComp = rew.icon;
            return (
              <div
                key={rew.id}
                className="bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D]/40 rounded-[16px] p-5 flex flex-col justify-between space-y-4 transition-all shadow-md"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-[10px] bg-[#090909] border border-[#2A2A2A] text-[#C8A45D] flex items-center justify-center shadow-inner">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-[#C8A45D] font-bold block">
                    {rew.category}
                  </span>
                  <h4 className="font-editorial text-lg text-[#F8F6F3] leading-snug">{rew.title}</h4>
                  <p className="text-xs text-[#8E8A85] font-light leading-relaxed">{rew.description}</p>
                </div>

                <div className="pt-3 border-t border-[#2A2A2A] space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#8E8A85]">Cost:</span>
                    <span className="font-bold text-[#C8A45D]">{rew.pointsRequired} pts</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRedeem(rew)}
                    disabled={!canRedeem}
                    className={`w-full h-9 rounded-[8px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                      canRedeem
                        ? "bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909]"
                        : "bg-[#090909] text-[#8E8A85]/50 border border-[#2A2A2A] cursor-not-allowed"
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>{canRedeem ? "Redeem Reward" : "Need More Points"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. REFERRAL PROGRAM BOX ── */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-1.5 mb-1">
              <Users className="w-4 h-4" /> REFERRAL PROGRAM
            </span>
            <h3 className="font-editorial text-2xl text-[#F8F6F3]">
              Give 250 Points, Get 250 Points
            </h3>
          </div>
          <span className="text-xs text-[#8E8A85]">Earn points whenever a friend completes their first order.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Link Generator Input */}
          <div className="lg:col-span-7 space-y-2">
            <label className="text-xs text-[#8E8A85] block font-medium">Your Exclusive Referral Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${referralCode}`}
                className="flex-1 h-11 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px] text-xs font-mono text-[#8E8A85] outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyReferral}
                className="h-11 px-5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="h-11 w-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[10px] transition-colors flex items-center justify-center cursor-pointer shrink-0 shadow-md"
                title="Share via WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Referral Stats Placeholders */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-3 text-center border-t lg:border-t-0 lg:border-l border-[#2A2A2A] pt-4 lg:pt-0 lg:pl-6">
            <div>
              <span className="text-[10px] uppercase text-[#8E8A85] block">Invited</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">6</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#8E8A85] block">Successful</span>
              <span className="font-editorial text-2xl text-[#C8A45D]">4</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#8E8A85] block">Bonus Earned</span>
              <span className="font-editorial text-2xl text-[#F8F6F3]">1,000 pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. POINTS HISTORY TIMELINE ── */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
          <h3 className="font-editorial text-2xl text-[#F8F6F3]">Points Activity History</h3>
          <span className="text-xs text-[#8E8A85] font-mono">{history.length} Recent Transactions</span>
        </div>

        <div className="divide-y divide-[#2A2A2A]">
          {history.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs font-sans">
              <div>
                <h4 className="font-semibold text-[#F8F6F3]">{item.title}</h4>
                <span className="text-[10px] text-[#8E8A85]">{item.date}</span>
              </div>
              <span
                className={`font-mono text-sm font-bold ${
                  item.points.startsWith("+") ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {item.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
