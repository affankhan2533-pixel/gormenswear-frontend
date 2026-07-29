"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, RefreshCw, MessageSquare } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Authentic Premium Quality",
    subtitle: "Artisanal Craftsmanship",
    description: "Direct-to-consumer luxury menswear built with mulberry silks and biella wools.",
    accentColor: "border-[#315DA8]/40 text-[#315DA8]",
  },
  {
    icon: Truck,
    title: "Fast Priority Shipping",
    subtitle: "Express Delivery",
    description: "Insured priority dispatch with real-time tracking straight to your doorstep.",
    accentColor: "border-[#C8A45D]/40 text-[#C8A45D]",
  },
  {
    icon: RefreshCw,
    title: "Hassle-Free Returns",
    subtitle: "7-Day Exchanges",
    description: "Seamless exchanges and guaranteed satisfaction with dedicated care.",
    accentColor: "border-[#D86A32]/40 text-[#D86A32]",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Stylist Concierge",
    subtitle: "24/7 Assistance",
    description: "Direct personal styling, instant sizing guidance, and real-time support.",
    accentColor: "border-[#25D366]/40 text-[#25D366]",
  },
];

export default function WhyGOR() {
  return (
    <section className="py-20 sm:py-28 bg-[#151515] border-t border-b border-[#2A2A2A] text-[#F8F6F3] relative overflow-hidden">
      {/* Gentle Radial Gradient Depth */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40"
           style={{ background: "radial-gradient(circle at 50% 0%, rgba(49, 93, 168, 0.05) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C8A45D] font-medium block mb-2">
            WHY SHOP WITH GOR
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#F8F6F3] tracking-tight">
            The Modern Fashion Experience
          </h2>
        </motion.div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group p-6 sm:p-8 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D]/50 rounded-[12px] transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#151515] border border-[#2A2A2A] group-hover:border-[#C8A45D]/40 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-5 h-5 text-[#C8A45D]" />
                  </div>

                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C8A45D] font-medium block mb-1">
                    {feat.subtitle}
                  </span>

                  <h3 className="font-editorial text-xl font-normal text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors mb-2">
                    {feat.title}
                  </h3>

                  <p className="font-sans text-xs text-[#8E8A85] font-light leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2A2A2A] w-full flex items-center justify-between">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#315DA8]/60 group-hover:bg-[#C8A45D] transition-colors" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D86A32]/60 group-hover:bg-[#D86A32] transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
