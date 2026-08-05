"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Crown, Truck, RefreshCw } from "lucide-react";
import { BlurReveal, Stagger, ScaleStaggerItem } from "@/components/ui/Motion";
import { EASING, DURATION } from "@/lib/motion";

const FEATURES = [
  {
    id: "premium-fabrics",
    icon: ShieldCheck,
    title: "Premium Fabrics",
    description: "Thoughtfully selected cottons, linen blends, and high-density knits built for daily wear.",
  },
  {
    id: "modern-fit",
    icon: Crown,
    title: "Modern Fit",
    description: "Tailored for confidence. Fluid drapes, grandad collars, and effortless silhouettes.",
  },
  {
    id: "fast-delivery",
    icon: Truck,
    title: "Fast Delivery",
    description: "Reliable nationwide shipping with real-time tracking and luxury packaging.",
  },
  {
    id: "easy-returns",
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Hassle-free returns and exchange options with convenient doorstep support.",
  },
];

export default function WhyGOR() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="why-gor"
      className="py-16 sm:py-24 bg-[#1B1F25] text-[#F7F5F2] overflow-hidden relative selection:bg-[#C9A86A] selection:text-[#0E1013]"
    >
      {/* Ambient Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-20"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(201, 168, 106, 0.04) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-10 blur-[160px]"
        style={{ background: "radial-gradient(circle, #C9A86A 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <BlurReveal className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C9A86A] font-semibold">
              WHY GOR
            </span>
          </div>
          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F7F5F2] tracking-tight leading-[1.05] mb-4">
            CRAFTED FOR MODERN LIVING
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light tracking-[0.18em] leading-relaxed uppercase max-w-lg mx-auto">
            Every garment is designed to combine premium quality, refined style and everyday comfort.
          </p>
        </BlurReveal>

        {/* Feature Cards — staggered */}
        <Stagger staggerDelay={0.09} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <ScaleStaggerItem key={feat.id}>
                <div className="group p-6 sm:p-8 bg-[#111111] border border-[#C9A86A]/15 hover:border-[#C9A86A]/40 rounded-[20px] transition-all duration-300 ease-out hover:-translate-y-1 shadow-md flex flex-col justify-between h-full">
                  <div>
                    <div className="mb-6 flex items-center justify-start">
                      <Icon className="w-6 h-6 text-[#C9A86A] transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="font-editorial text-xl sm:text-2xl font-normal text-[#F7F5F2] group-hover:text-[#C9A86A] transition-colors duration-300 leading-tight mb-2.5">
                      {feat.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light leading-relaxed mb-6">
                      {feat.description}
                    </p>
                  </div>
                  {/* Gold divider — expands on hover */}
                  <div className="w-8 h-[1.5px] bg-[#C9A86A]/30 group-hover:w-full group-hover:bg-[#C9A86A] transition-all duration-500 ease-out" />
                </div>
              </ScaleStaggerItem>
            );
          })}
        </Stagger>

        {/* Manifesto Quote */}
        <BlurReveal delay={0.3} className="mt-20 sm:mt-24 text-center border-t border-[#C9A86A]/15 pt-12 max-w-xl mx-auto">
          <p className="font-editorial italic text-2xl sm:text-3xl text-[#C9A86A] font-normal tracking-tight">
            &ldquo;Style that speaks before you do.&rdquo;
          </p>
        </BlurReveal>

      </div>
    </section>
  );
}
