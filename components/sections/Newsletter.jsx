"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { subscribeNewsletter } from "@/lib/emailService";
import { useToast } from "@/context/ToastContext";
import { BlurReveal } from "@/components/ui/Motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Email format validation
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
        // Fallback mock success response for backend integration
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setSubscribed(true);
      if (success) {
        success("Welcome to GOR", "Thank you for joining our community.");
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
      className="py-16 sm:py-24 bg-[#20252C] text-[#F7F5F2] overflow-hidden relative selection:bg-[#C9A86A] selection:text-[#0E1013]"
    >
      {/* Soft Center Ambient Gold Lighting */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-20 blur-[160px]"
        style={{ background: "radial-gradient(circle, rgba(201, 168, 106, 0.05) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[720px] mx-auto px-5 sm:px-8 text-center">
        
        {/* ── Centered Section Header ── */}
        <BlurReveal className="mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C9A86A] font-semibold">
              JOIN THE COMMUNITY
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F7F5F2] tracking-tight leading-[1.05] mb-4">
            STAY AHEAD OF THE SEASON
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light tracking-[0.18em] leading-relaxed uppercase max-w-lg mx-auto">
            Receive exclusive collection launches, styling inspiration and early access to new arrivals.
          </p>
        </BlurReveal>

        {/* ── Form / Success State Transition Container ── */}
        <AnimatePresence mode="wait">
          {subscribed ? (
            /* Luxury Success State */
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 sm:p-10 bg-[#111111] border border-[#C9A86A]/30 rounded-[20px] shadow-xl text-center space-y-3 max-w-lg mx-auto"
            >
              <div className="w-12 h-12 rounded-full bg-[#0B0B0B] border border-[#C9A86A]/40 flex items-center justify-center mx-auto text-[#C9A86A]">
                <Check className="w-6 h-6 text-[#C9A86A]" />
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#C9A86A]">
                Thank you for joining GOR.
              </h3>

              <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light">
                You&apos;ll be the first to know about upcoming collections.
              </p>
            </motion.div>
          ) : (
            /* Newsletter Email Subscription Form */
            <motion.form
              key="signup-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleSubmit}
              className="space-y-4 max-w-xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row items-center gap-3">
                
                {/* Email Input Field */}
                <div className="relative w-full flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationError) setValidationError("");
                    }}
                    placeholder="Enter your email address"
                    required
                    disabled={loading}
                    className="w-full h-[52px] px-5 bg-[#14171C] border border-[#C9A86A]/20 focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-[12px] text-xs sm:text-sm font-sans text-[#F7F5F2] placeholder-[#B8B6B0]/50 outline-none transition-all duration-300"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto h-[52px] px-8 rounded-[12px] bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0E1013] font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B0B0B]" />
                  ) : (
                    <>
                      <span>JOIN GOR</span>
                      <ArrowRight className="w-4 h-4 text-[#0B0B0B]" />
                    </>
                  )}
                </button>
              </div>

              {/* Inline Validation Error */}
              {validationError && (
                <p className="font-sans text-xs text-red-400 font-medium text-left px-2">
                  {validationError}
                </p>
              )}

              {/* Privacy Notice */}
              <p className="font-sans text-[11px] text-[#B8B6B0]/70 font-light">
                We respect your privacy. No spam. Unsubscribe anytime.
              </p>
            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
