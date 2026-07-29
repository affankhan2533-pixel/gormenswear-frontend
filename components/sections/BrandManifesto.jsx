"use client";

import { motion } from "framer-motion";

export default function BrandManifesto() {
  return (
    <section className="py-24 sm:py-36 lg:py-44 bg-[#090909] text-[#F4F1EA] border-b border-white/[0.06] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Editorial Philosophy Statement Left/Top Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C9A96E] font-medium block mb-4">
              ATELIER PHILOSOPHY & MANIFESTO
            </span>
            
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] text-[#F4F1EA] tracking-tight">
              Quiet Elegance. <br />
              <span className="italic text-[#C9A96E]">Uncompromising Craft.</span>
            </h2>

            <p className="mt-8 font-editorial text-xl sm:text-2xl text-[#F4F1EA]/85 font-light leading-relaxed italic border-l border-[#C9A96E]/40 pl-6 my-4">
              "True luxury is silent. It speaks not in visible logos, but in the effortless fall of Biella wool, the soft structure of hand-stitched shoulders, and the permanence of timeless design."
            </p>

            <p className="mt-4 font-sans text-xs sm:text-sm text-[#8E8A85] font-light leading-relaxed tracking-wide max-w-xl">
              Founded on the principles of Italian atelier precision and contemporary urban proportion, GOR Menswear creates garments engineered for longevity, commanding presence, and tactile pleasure.
            </p>

            {/* Atelier Pillars */}
            <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.06]">
              <div>
                <span className="font-editorial text-2xl sm:text-3xl text-[#F4F1EA] block font-light">01</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] font-medium mt-1 block">Noble Yarns</span>
              </div>
              <div>
                <span className="font-editorial text-2xl sm:text-3xl text-[#F4F1EA] block font-light">02</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] font-medium mt-1 block">Hand Cut</span>
              </div>
              <div>
                <span className="font-editorial text-2xl sm:text-3xl text-[#F4F1EA] block font-light">03</span>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] font-medium mt-1 block">Bespoke Fit</span>
              </div>
            </div>
          </motion.div>

          {/* High-Fashion Atelier Imagery Right Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#121212] border border-white/[0.08]">
              <img
                src="/images/lookbook/gor-lookbook-5.webp"
                alt="GOR Menswear Bespoke Atelier Tailoring"
                className="w-full h-full object-cover object-center editorial-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#090909]/85 backdrop-blur-md border border-white/[0.08]">
                <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium">
                  ATELIER BIELLA, ITALY
                </p>
                <p className="font-editorial text-sm text-[#F4F1EA] mt-1 font-light italic">
                  Precision chalking & pattern drafting
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
