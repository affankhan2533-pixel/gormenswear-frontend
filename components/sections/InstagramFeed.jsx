"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BlurReveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { EASING, DURATION } from "@/lib/motion";

const CAMPAIGN_GALLERY = [
  {
    id: "camp-1",
    title: "AUTUMN / WINTER 2026",
    label: "HERO CAMPAIGN",
    image: "/images/lookbook/gor-lookbook-1.webp",
    link: "/shop",
    gridClass: "col-span-2 lg:col-span-2 lg:row-span-2 min-h-[360px] sm:min-h-[460px] lg:min-h-[580px]",
  },
  {
    id: "camp-2",
    title: "SIGNATURE LINEN",
    label: "GRANDAD COLLAR EDIT",
    image: "/images/lookbook/image copy 3.png",
    link: "/shop/shirts",
    gridClass: "col-span-1 lg:col-span-1 lg:row-span-1 min-h-[260px] sm:min-h-[280px]",
  },
  {
    id: "camp-3",
    title: "OFF-DUTY POLO",
    label: "KNITWEAR SHOWCASE",
    image: "/images/lookbook/image copy 4.png",
    link: "/shop/polos",
    gridClass: "col-span-1 lg:col-span-1 lg:row-span-1 min-h-[260px] sm:min-h-[280px]",
  },
  {
    id: "camp-4",
    title: "ATELIER OUTERWEAR",
    label: "STATEMENT LAYERS",
    image: "/images/lookbook/image copy 6.png",
    link: "/shop/outerwear",
    gridClass: "col-span-1 lg:col-span-1 lg:row-span-1 min-h-[260px] sm:min-h-[280px]",
  },
  {
    id: "camp-5",
    title: "EVERYDAY ESSENTIALS",
    label: "ORGANIC TEES",
    image: "/images/categories/gor-model-streetwear.webp",
    link: "/shop/t-shirts",
    gridClass: "col-span-1 lg:col-span-1 lg:row-span-1 min-h-[260px] sm:min-h-[280px]",
  },
  {
    id: "camp-6",
    title: "TAILORED TROUSERS",
    label: "PLEATED DENIM & SILKS",
    image: "/images/lookbook/image copy 5.png",
    link: "/shop/trousers",
    gridClass: "col-span-1 lg:col-span-1 lg:row-span-1 min-h-[260px] sm:min-h-[280px]",
  },
  {
    id: "camp-7",
    title: "LATEST DROP",
    label: "NEW SEASON RELEASE",
    image: "/images/lookbook/image copy 7.png",
    link: "/new-arrivals",
    gridClass: "col-span-1 lg:col-span-1 lg:row-span-1 min-h-[260px] sm:min-h-[280px]",
  },
];

export default function InstagramFeed() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="editorial-gallery"
      className="py-16 sm:py-24 bg-[#171B21] text-[#F7F5F2] overflow-hidden relative selection:bg-[#C9A86A] selection:text-[#0E1013]"
    >
      {/* Background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0 opacity-20 blur-[170px]"
        style={{ background: "radial-gradient(circle, rgba(201, 168, 106, 0.04) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <BlurReveal className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C9A86A] font-semibold">
              EDITORIAL CAMPAIGN
            </span>
          </div>
          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F7F5F2] tracking-tight leading-[1.05] mb-4">
            INSPIRED BY MODERN STYLE
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light tracking-[0.18em] leading-relaxed uppercase max-w-lg mx-auto">
            A curated selection of moments, textures and timeless menswear.
          </p>
        </BlurReveal>

        {/* Gallery Grid — staggered masonry */}
        <Stagger staggerDelay={0.05} className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {CAMPAIGN_GALLERY.map((item) => (
            <StaggerItem key={item.id} className={item.gridClass}>
              <div className="group relative overflow-hidden bg-[#111111] border border-[#C9A86A]/15 hover:border-[#C9A86A]/40 rounded-[20px] transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer shadow-lg h-full">
                <Link href={item.link} className="block w-full h-full relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 50vw"
                    className="object-cover object-center filter brightness-[0.95] contrast-[1.04] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/92 via-[#0B0B0B]/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

                  {/* Content */}
                  <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end z-10">
                    <span className="font-sans text-[9px] sm:text-[9.5px] uppercase tracking-[0.25em] text-[#C9A86A] font-semibold block mb-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </span>
                    <h3 className="font-editorial text-xl sm:text-2xl lg:text-3xl font-normal text-[#F7F5F2] group-hover:text-[#C9A86A] transition-colors duration-300 leading-tight mb-3">
                      {item.title}
                    </h3>

                    {/* Explore link — fades in on hover */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#C9A86A] font-semibold inline-flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Explore Edit</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
                      </span>
                    </div>

                    {/* Gold underline reveal */}
                    <div className="mt-2.5 w-0 group-hover:w-full h-[1.5px] bg-[#C9A86A] transition-all duration-500 ease-out" />
                  </div>
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
