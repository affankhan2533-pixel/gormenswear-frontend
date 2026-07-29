"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function CountUpStat({ end, suffix = "", duration = 1.5 }) {
  const [count, setCount] = useState(end);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const steps = 30;
    const increment = end / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      start += increment;
      if (stepCount >= steps || start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, (duration * 1000) / steps);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="font-editorial text-4xl sm:text-5xl font-normal text-[#F4F1EA]">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Craftsmanship() {
  return (
    <section id="craftsmanship" className="py-24 sm:py-36 bg-[#090909] text-[#F4F1EA] overflow-hidden border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Craft Detail */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] w-full border border-white/[0.08] overflow-hidden bg-[#121212] group">
              <img
                src="/images/brand/gor-store-interior-1.webp"
                alt="GOR Atelier Craftsmanship & Fabric Detail"
                className="w-full h-full object-cover object-[center_25%] editorial-image group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 z-10 bg-[#090909]/85 backdrop-blur-md px-4 py-2 border border-white/[0.08]">
                <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium">
                  Atelier Stitching & Fabric Texture
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative Story & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C9A96E] font-medium block mb-3">
              ATELIER HERITAGE & SAVOIR-FAIRE
            </span>

            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#F4F1EA] leading-[1.15]">
              Architectural Silhouettes, <br />
              <span className="italic text-[#C9A96E]">Uncompromising Precision</span>
            </h2>

            <p className="mt-6 font-sans text-xs sm:text-sm text-[#8E8A85] font-light leading-relaxed tracking-wide">
              At GOR Menswear, every garment represents a dialogue between historical tailoring techniques and modern urban form. We source heavy cotton fleece, structured ribbed corduroys, and custom embossed trims from renowned mills.
            </p>

            <p className="mt-4 font-sans text-xs sm:text-sm text-[#8E8A85] font-light leading-relaxed tracking-wide">
              Engineered for commanding presence without rigidity, our co-ord sets, Cuban shirts, and distressed denim deliver an uncompromised luxury feel.
            </p>

            {/* Stats Counter Grid */}
            <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.06]">
              <div className="flex flex-col">
                <CountUpStat end={8} suffix="+" />
                <span className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-[#8E8A85] font-medium">
                  Years of Craft
                </span>
              </div>

              <div className="flex flex-col">
                <CountUpStat end={2400} suffix="+" />
                <span className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-[#8E8A85] font-medium">
                  Happy Clients
                </span>
              </div>

              <div className="flex flex-col">
                <CountUpStat end={15} suffix="+" />
                <span className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-[#8E8A85] font-medium">
                  Cities Shipped
                </span>
              </div>
            </div>

            <div className="mt-10">
              <Link href="/about">
                <button
                  type="button"
                  className="px-8 py-3.5 bg-transparent text-[#F4F1EA] border border-white/[0.2] font-sans text-[11px] uppercase tracking-[0.25em] font-medium transition-colors duration-300 hover:border-[#C9A96E] hover:text-[#C9A96E] cursor-pointer flex items-center gap-2"
                >
                  Explore Our Heritage
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A96E]" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

