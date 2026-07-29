"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RotateCcw, Home, AlertOctagon } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090909] text-[#F8F6F3] flex flex-col items-center justify-center px-4 relative overflow-hidden select-none">
      {/* Glow Backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose-950/20 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-lg bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-8 sm:p-12 shadow-2xl space-y-6"
      >
        <div className="w-20 h-20 rounded-full border border-rose-500/30 bg-[#090909] text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <AlertOctagon className="w-10 h-10" />
        </div>

        <div>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-rose-400 font-bold block mb-1">
            500 • SYSTEM ERROR
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
            Something Went Wrong
          </h1>
        </div>

        <p className="font-sans text-xs text-[#8E8A85] font-light leading-relaxed max-w-xs mx-auto">
          An unexpected server error occurred while processing your request. Please try refreshing or return home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto h-[46px] px-6 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link href="/" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full h-[46px] px-6 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] font-sans text-xs uppercase tracking-wider font-semibold rounded-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#C8A45D]" />
              <span>Return Home</span>
            </button>
          </Link>
        </div>

        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#8E8A85]/50 pt-4 border-t border-[#2A2A2A]">
          GOR MENSWEAR • SYSTEM FEEDBACK
        </p>
      </motion.div>
    </div>
  );
}
