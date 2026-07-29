"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default function PromoNotificationBanner({
  id = "promo-campaign-v1",
  title = "COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER $250",
  ctaText = "SHOP NOW",
  ctaHref = "/shop",
  showTimer = false,
}) {
  const [isDismissed, setIsDismissed] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(`gor_promo_dismissed_${id}`);
      if (!dismissed) {
        setIsDismissed(false);
      }
    } catch (e) {
      setIsDismissed(false);
    }
  }, [id]);

  // Countdown timer effect
  useEffect(() => {
    if (!showTimer) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showTimer]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(`gor_promo_dismissed_${id}`, "true");
    } catch (e) {}
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-[#C8A45D] text-[#090909] py-2 px-4 relative z-[150] text-[11px] font-sans uppercase tracking-[0.2em] font-bold shadow-md select-none"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 flex flex-wrap items-center justify-center gap-2 text-center">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{title}</span>

            {showTimer && (
              <div className="inline-flex items-center gap-1 bg-[#090909]/10 px-2 py-0.5 rounded font-mono text-[10px]">
                <Clock className="w-3 h-3" />
                <span>
                  {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            )}

            <Link
              href={ctaHref}
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80 transition-opacity ml-1"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 hover:opacity-75 transition-opacity cursor-pointer shrink-0"
            aria-label="Dismiss Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
