"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck } from "lucide-react";

const REVIEWS = [
  {
    id: "review-1",
    name: "Rohan M.",
    location: "Mumbai",
    category: "SHIRTS & SILKS",
    rating: 5,
    initials: "RM",
    quote: "The grandad linen shirt fits flawlessly. The fabric texture, collar silhouette, and tailored comfort make it an essential piece.",
  },
  {
    id: "review-2",
    name: "Aman S.",
    location: "Delhi",
    category: "EVERYDAY ESSENTIALS",
    rating: 5,
    initials: "AS",
    quote: "Finally a brand that gets everyday menswear fits right. High-density cotton tees that maintain their shape and fit wash after wash.",
  },
  {
    id: "review-3",
    name: "Vikram S.",
    location: "Bengaluru",
    category: "TROUSERS",
    rating: 5,
    initials: "VS",
    quote: "The pleated trousers have an incredible fluid drape. Super comfortable for all-day wear whether dressing up or down.",
  },
];

export default function CustomerStories() {
  return (
    <section 
      id="customer-stories" 
      className="py-16 sm:py-24 bg-[#14171C] text-[#F7F5F2] overflow-hidden relative selection:bg-[#C9A86A] selection:text-[#0E1013]"
    >
      {/* Background Depth Accents */}
      <div 
        className="absolute bottom-0 left-0 w-[550px] h-[550px] rounded-full pointer-events-none z-0 opacity-20 blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(201, 168, 106, 0.035) 0%, transparent 70%)" }}
      />
      {/* Background Depth Accents */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none z-0" />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-10 blur-[160px]"
        style={{ background: "radial-gradient(circle, #C9A86A 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* ── Centered Editorial Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C9A86A] font-semibold">
              CLIENT EXPERIENCES
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F7F5F2] tracking-tight leading-[1.05] mb-4">
            WHAT OUR CUSTOMERS SAY
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light tracking-[0.18em] leading-relaxed uppercase max-w-lg mx-auto mb-6">
            Real experiences from customers who wear GOR.
          </p>

          {/* Dynamic-Ready Verified Customer Rating Sub-Header */}
          <div className="inline-flex items-center gap-2.5 bg-[#111111] border border-[#C9A86A]/20 px-4 py-1.5 rounded-full shadow-sm">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-3.5 h-3.5 fill-[#C9A86A] text-[#C9A86A]" />
              ))}
            </div>
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#F7F5F2] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A86A]" />
              Verified Customer Feedback
            </span>
          </div>
        </motion.div>

        {/* ── 3 Editorial Cards (Desktop: 3-Cols | Tablet: 2-Cols | Mobile: Touch Swipe Carousel) ── */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible scrollbar-none snap-x snap-mandatory pb-4 lg:pb-0">
          {REVIEWS.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: idx * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group min-w-[280px] sm:min-w-[340px] lg:min-w-0 flex-1 shrink-0 snap-start bg-[#111111] border border-[#C9A86A]/15 hover:border-[#C9A86A]/40 rounded-[24px] p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Category & Star Rating Header */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-sans text-[9.5px] uppercase tracking-[0.2em] text-[#C9A86A] font-semibold bg-[#0B0B0B] px-2.5 py-1 rounded-full border border-[#C9A86A]/20">
                    {rev.category}
                  </span>

                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#C9A86A] text-[#C9A86A]" />
                    ))}
                  </div>
                </div>

                {/* Editorial Quote */}
                <p className="font-editorial italic text-base sm:text-lg text-[#F7F5F2] font-normal leading-relaxed mb-6">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              {/* Customer Avatar Initials & Details */}
              <div className="flex items-center gap-3.5 pt-5 border-t border-[#C9A86A]/15">
                {/* Neutral Initials Placeholder Circle */}
                <div className="w-10 h-10 rounded-full bg-[#0B0B0B] border border-[#C9A86A]/30 text-[#C9A86A] font-sans font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {rev.initials}
                </div>

                <div>
                  <h4 className="font-sans text-xs font-bold text-[#F7F5F2]">
                    {rev.name}
                  </h4>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-[#C9A86A] font-medium">
                    {rev.location} • Verified Buyer
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
