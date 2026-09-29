"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function BrandStory() {
  return (
    <section
      id="brand-story"
      className="py-20 sm:py-28 lg:py-36 bg-[#F5F2EC] text-[#111111] relative selection:bg-[#D8D2C8] selection:text-[#111111] border-t border-[#D8D2C8]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Large Typography & Concise Narrative (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#716D66] font-medium block mb-4">
              04 / MANIFESTO
            </span>

            {/* Large Editorial Headline */}
            <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.04] tracking-tight text-[#111111] mb-6 sm:mb-8">
              HONEST SILHOUETTES. <br />
              <span className="italic font-light text-[#716D66]">DEFINED BY DISCIPLINE.</span>
            </h2>

            {/* Concise approved brand copy — Grounded & Authentic */}
            <p className="font-sans text-sm sm:text-base text-[#716D66] font-normal leading-relaxed max-w-lg mb-8">
              GOR Menswear is built around a disciplined approach to everyday dressing: intentional proportions, balanced drape, and garments designed to hold their form through continuous wear.
            </p>

            {/* Atelier Meta & Link */}
            <div className="pt-6 border-t border-[#D8D2C8] flex items-center justify-between">
              <span className="font-mono text-xs text-[#716D66]">
                MUMBAI · GOR MENSWEAR
              </span>
              <Link
                href="/about"
                className="font-sans text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#716D66] transition-colors inline-flex items-center gap-2 font-medium"
              >
                <span>EXPLORE THE ATELIER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Large Cinematic Campaign Photograph (6 Cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full rounded-[2px] overflow-hidden bg-[#E9E5DD] border border-[#D8D2C8] shadow-[0_8px_30px_rgba(17,17,17,0.06)]">
              <Image
                src="/images/categories/image.png"
                alt="GOR Menswear Editorial Campaign"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top filter contrast-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
