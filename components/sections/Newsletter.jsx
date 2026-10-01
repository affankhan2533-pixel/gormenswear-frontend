"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { subscribeNewsletter } from "@/lib/emailService";
import { useToast } from "@/context/ToastContext";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      if (typeof subscribeNewsletter === "function") {
        await subscribeNewsletter(email.trim());
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setSubscribed(true);
      if (success) {
        success("Subscribed", "You have joined the GOR Menswear dispatch list.");
      }
      setEmail("");
    } catch (err) {
      if (error) {
        error("Subscription Issue", err.message || "Failed to subscribe. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="py-10 sm:py-16 bg-[#F5F2EC] text-[#111111] relative selection:bg-[#D8D2C8] selection:text-[#111111] border-t border-[#D8D2C8]"
    >
      <div className="max-w-md mx-auto px-5 sm:px-6 text-center">
        {/* Minimal Typographic Header */}
        <div className="mb-6">
          <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#111111] tracking-tight leading-snug mb-2">
            THE NEXT DROP.
          </h2>
          <p className="font-sans text-xs text-[#716D66] font-normal">
            Early notice on seasonal editions and private archive releases.
          </p>
        </div>

        {/* Minimalist Foot-Adjacent Form */}
        <AnimatePresence mode="wait">
          {subscribed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-[#EFECE6] border border-[#D8D2C8] rounded-[2px] flex items-center justify-center gap-2 text-xs font-sans text-[#111111]"
            >
              <Check className="w-3.5 h-3.5 text-[#111111]" />
              <span>You are confirmed for the next drop.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex items-center border-b border-[#D8D2C8] focus-within:border-[#111111] transition-colors pb-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError("");
                  }}
                  placeholder="Enter email address"
                  required
                  disabled={loading}
                  className="w-full h-11 px-2 bg-transparent text-xs font-sans text-[#111111] placeholder-[#716D66]/60 outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="h-9 px-5 bg-[#151515] hover:bg-[#2A2A2A] text-[#F5F2EC] font-sans text-[11px] uppercase tracking-[0.2em] font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F5F2EC]" />
                  ) : (
                    <span>JOIN.</span>
                  )}
                </button>
              </div>

              {validationError && (
                <p className="font-sans text-[11px] text-red-600 font-medium pt-1">{validationError}</p>
              )}
            </form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
