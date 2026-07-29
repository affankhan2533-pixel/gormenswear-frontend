"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { subscribeNewsletter } from "@/lib/emailService";
import { useToast } from "@/context/ToastContext";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      error("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
      success("Subscription Confirmed", "Thank you for subscribing to GOR Menswear.");
      setEmail("");
    } catch (err) {
      error("Subscription Issue", err.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-[#15181D] border-t border-[rgba(200,167,106,0.15)] relative overflow-hidden select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C8A76A]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
        <div>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C8A76A] font-semibold flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> STAY INFORMED
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#F5F3EF]">
            Join the GOR Community
          </h2>
        </div>

        <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light leading-relaxed max-w-md mx-auto">
          Subscribe to receive private collection previews, exclusive member offers, and seasonal releases directly to your inbox.
        </p>

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 bg-[#1B1F25] border border-[rgba(200,167,106,0.3)] rounded-[14px] max-w-md mx-auto flex items-center justify-center gap-3 text-[#C8A76A]"
          >
            <Check className="w-5 h-5 text-[#C8A76A]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-wider">
              You are subscribed to GOR updates.
            </span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B6B0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  disabled={loading}
                  className="w-full h-[48px] pl-11 pr-4 bg-[#1B1F25] border border-[rgba(200,167,106,0.2)] focus:border-[#C8A76A] rounded-[8px] text-xs font-sans text-[#F5F3EF] placeholder-[#B8B6B0]/50 outline-none transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full sm:w-auto h-[48px] shrink-0 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="font-sans text-[10px] text-[#B8B6B0]/70 font-light">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
