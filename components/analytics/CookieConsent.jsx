"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cookie } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("gor_cookie_consent");
      if (!consent) {
        setShowBanner(true);
      }
    } catch (e) {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("gor_cookie_consent", "accepted");
      window.dispatchEvent(new Event("storage"));
    } catch (e) {}
    setShowBanner(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("gor_cookie_consent", "declined");
      window.dispatchEvent(new Event("storage"));
    } catch (e) {}
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[240] bg-[#151515]/95 border border-[#2A2A2A] rounded-[16px] p-5 backdrop-blur-xl shadow-2xl space-y-3 font-sans select-none"
        >
          <div className="flex items-center gap-2.5 text-[#C8A45D]">
            <Cookie className="w-5 h-5" />
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#F8F6F3]">
              Cookie & Analytics Privacy
            </h4>
          </div>

          <p className="text-xs text-[#8E8A85] font-light leading-relaxed">
            We use anonymous performance cookies and analytics (GA4, Clarity, Meta Pixel) to improve your browsing experience. No personal identification data is ever collected.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 h-9 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[8px] transition-colors cursor-pointer shadow-md"
            >
              Accept Cookies
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="h-9 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#8E8A85] hover:text-[#F8F6F3] text-xs font-semibold rounded-[8px] transition-colors cursor-pointer"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
