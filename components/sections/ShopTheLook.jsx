"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Shirt, Sparkles, Check, ShoppingBag, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { BlurReveal } from "@/components/ui/Motion";
import { EASING, DURATION } from "@/lib/motion";

const LOOKS = [
  {
    id: "business-essentials",
    name: "Business Essentials",
    eyebrow: "SIGNATURE TAILORING",
    description: "A refined grandad collar linen shirt paired with single-pleated trousers for effortless authority.",
    image: "/images/lookbook/image copy 3.png",
    link: "/shop/shirts",
    items: [
      { id: "gor-shirt-1", category: "Shirt", name: "GOR Grandad Collar Linen Shirt", price: 320, image: "/images/lookbook/image copy 3.png" },
      { id: "gor-trousers-1", category: "Trouser", name: "GOR Single-Pleated Tailored Trousers", price: 380, image: "/images/lookbook/gor-lookbook-3.webp" },
    ],
    hotspots: [
      { id: "hs-1", top: "42%", left: "48%", label: "Grandad Collar Linen Shirt", price: 320, itemId: "gor-shirt-1" },
      { id: "hs-2", top: "72%", left: "52%", label: "Single-Pleated Trousers", price: 380, itemId: "gor-trousers-1" },
    ],
  },
  {
    id: "weekend-casual",
    name: "Weekend Casual",
    eyebrow: "OFF-DUTY LUXURY",
    description: "A high-density knit polo combined with fluid relaxed trousers for effortless Saturdays.",
    image: "/images/lookbook/image copy 4.png",
    link: "/shop/polos",
    items: [
      { id: "gor-outerwear-2", category: "Polo", name: "GOR High-Density Knit Polo", price: 280, image: "/images/lookbook/image copy 4.png" },
      { id: "gor-trousers-2", category: "Trouser", name: "GOR Relaxed Off-Duty Trousers", price: 340, image: "/images/lookbook/gor-lookbook-2.webp" },
    ],
    hotspots: [
      { id: "hs-3", top: "40%", left: "50%", label: "Knit Polo", price: 280, itemId: "gor-outerwear-2" },
      { id: "hs-4", top: "70%", left: "50%", label: "Relaxed Trousers", price: 340, itemId: "gor-trousers-2" },
    ],
  },
  {
    id: "urban-minimal",
    name: "Urban Minimal",
    eyebrow: "EVERYDAY CONFIDENCE",
    description: "Heavyweight organic cotton tee paired with clean minimalist trousers for modern street elegance.",
    image: "/images/categories/gor-model-streetwear.webp",
    link: "/shop/t-shirts",
    items: [
      { id: "gor-shirt-2", category: "T-Shirt", name: "GOR Heavyweight Organic Cotton Tee", price: 220, image: "/images/categories/gor-model-streetwear.webp" },
      { id: "gor-trousers-3", category: "Trouser", name: "GOR Urban Tailored Trousers", price: 360, image: "/images/lookbook/gor-lookbook-5.webp" },
    ],
    hotspots: [
      { id: "hs-5", top: "38%", left: "46%", label: "Heavyweight Organic Tee", price: 220, itemId: "gor-shirt-2" },
      { id: "hs-6", top: "68%", left: "52%", label: "Urban Tailored Trousers", price: 360, itemId: "gor-trousers-3" },
    ],
  },
  {
    id: "evening-edit",
    name: "Evening Edit",
    eyebrow: "ATELIER SHOWCASE",
    description: "An architectural jacket paired with matching statement trousers for evening occasions.",
    image: "/images/lookbook/image copy 6.png",
    link: "/shop/outerwear",
    items: [
      { id: "gor-outerwear-3", category: "Outerwear", name: "GOR Atelier Statement Jacket", price: 650, image: "/images/lookbook/image copy 6.png" },
      { id: "gor-trousers-4", category: "Trouser", name: "GOR Atelier Pleated Trousers", price: 420, image: "/images/lookbook/gor-lookbook-1.webp" },
    ],
    hotspots: [
      { id: "hs-7", top: "42%", left: "48%", label: "Atelier Statement Jacket", price: 650, itemId: "gor-outerwear-3" },
      { id: "hs-8", top: "72%", left: "52%", label: "Atelier Pleated Trousers", price: 420, itemId: "gor-trousers-4" },
    ],
  },
];

export default function ShopTheLook() {
  const { addToCart } = useCart();
  const shouldReduceMotion = useReducedMotion();
  const [activeLookIdx, setActiveLookIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [addedBundleSuccess, setAddedBundleSuccess] = useState(false);
  const [addedItemSuccess, setAddedItemSuccess] = useState({});

  const currentLook = LOOKS[activeLookIdx];
  const lookTotal = currentLook.items.reduce((sum, i) => sum + i.price, 0);

  const handleAddBundleToBag = () => {
    currentLook.items.forEach((item) => {
      addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          images: [item.image],
        },
        "M",
        { name: "Onyx Black", hex: "#111111" },
        1
      );
    });
    setAddedBundleSuccess(true);
    setTimeout(() => setAddedBundleSuccess(false), 2500);
  };

  const handleAddItemToBag = (item) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        images: [item.image],
      },
      "M",
      { name: "Onyx Black", hex: "#111111" },
      1
    );
    setAddedItemSuccess((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemSuccess((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <section 
      id="shop-the-look" 
      className="py-16 sm:py-24 bg-[#14171C] text-[#F7F5F2] overflow-hidden relative selection:bg-[#C9A86A] selection:text-[#0E1013]"
    >
      {/* Soft Ambient Gold Lighting */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0 opacity-25 blur-[160px]"
        style={{ background: "radial-gradient(circle, rgba(201, 168, 106, 0.05) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Centered Section Header ── */}
        <BlurReveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <Sparkles className="w-4 h-4 text-[#C9A86A]" />
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#C9A86A] font-bold">
              EDITORIAL CURATION
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#F7F5F2] tracking-tight leading-[1.08] mb-3">
            SHOP THE LOOK
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light tracking-[0.15em] leading-relaxed uppercase max-w-lg mx-auto">
            Interactive outfit lookbook styled by GOR fashion directors.
          </p>
        </BlurReveal>

        {/* ── Look Switcher Tabs ── */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-4 mb-10">
          {LOOKS.map((lk, idx) => (
            <button
              key={lk.id}
              type="button"
              onClick={() => {
                setActiveLookIdx(idx);
                setActiveHotspot(null);
              }}
              className={`px-5 py-2.5 rounded-full font-sans text-xs uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer whitespace-nowrap ${
                activeLookIdx === idx
                  ? "bg-[#C9A86A] text-[#0E1013] font-bold shadow-lg ring-2 ring-[#C9A86A]/40"
                  : "bg-[#1B1F25] text-[#B8B6B0] border border-[#C9A86A]/12 hover:text-[#F7F5F2] hover:border-[#C9A86A]/30"
              }`}
            >
              {lk.name}
            </button>
          ))}
        </div>

        {/* ── Desktop 60/40 Split | Mobile Stacked Centerpiece Container ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT 60%: Large Editorial Campaign Image with Interactive Hotspots & Floating Tags */}
          <motion.div
            key={currentLook.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 relative rounded-3xl overflow-hidden bg-[#1B1F25] border border-[#C9A86A]/15 shadow-2xl group min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] aspect-[4/5]"
          >
            <Image
              src={currentLook.image}
              alt={currentLook.name}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center filter brightness-[0.96] contrast-[1.03] group-hover:scale-[1.015] transition-transform duration-700 ease-out"
              priority
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1013]/90 via-transparent to-black/30 pointer-events-none z-10" />

            {/* Eyebrow Floating Tag */}
            <div className="absolute top-5 left-5 z-20">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-bold bg-[#0E1013]/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#C9A86A]/20 shadow-md">
                {currentLook.eyebrow}
              </span>
            </div>

            {/* Interactive Desktop Hotspot Pins */}
            {currentLook.hotspots.map((hs) => (
              <div
                key={hs.id}
                style={{ top: hs.top, left: hs.left }}
                onMouseEnter={() => setActiveHotspot(hs.id)}
                onMouseLeave={() => setActiveHotspot(null)}
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/hs"
              >
                {/* Luxury ring pulse — Framer Motion infinite ring expand */}
                <div className="relative w-7 h-7 flex items-center justify-center">
                  {/* Pulsing outer ring */}
                  {!shouldReduceMotion && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-[#C9A86A]/60"
                      animate={{ scale: [1, 2.2, 2.2], opacity: [0.7, 0.1, 0] }}
                      transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity, repeatDelay: 0.6 }}
                    />
                  )}
                  {/* Inner gold dot */}
                  <div className="w-7 h-7 rounded-full bg-[#C9A86A]/30 border-2 border-[#C9A86A] flex items-center justify-center shadow-xl backdrop-blur-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C9A86A]" />
                  </div>
                </div>

                {/* Floating Product Tag Tooltip */}
                <AnimatePresence>
                  {activeHotspot === hs.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-[#0E1013]/95 border border-[#C9A86A]/40 backdrop-blur-xl text-[#F7F5F2] p-3 rounded-xl shadow-2xl pointer-events-none min-w-[180px] font-sans"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-[#C9A86A] font-bold">{hs.label}</p>
                      <p className="text-xs font-bold text-[#F7F5F2] mt-0.5 price-display">{formatPrice(hs.price)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Floating Look Price Badge */}
            <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between bg-[#0E1013]/85 backdrop-blur-xl p-4 rounded-2xl border border-[#C9A86A]/20">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#B8B6B0] block">LOOK TOTAL</span>
                <span className="font-serif text-xl font-bold text-[#F7F5F2] price-display">{formatPrice(lookTotal)}</span>
              </div>
              <button
                type="button"
                onClick={handleAddBundleToBag}
                className="px-5 py-2.5 bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0E1013] font-sans text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                {addedBundleSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added Look!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add Look to Bag
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* RIGHT 40%: Outfit Information & Quick Item Buy Panel */}
          <motion.div
            key={`panel-${currentLook.id}`}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col justify-between bg-[#1B1F25] border border-[#C9A86A]/15 rounded-3xl p-6 sm:p-8 shadow-2xl"
          >
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-bold block mb-1">
                {currentLook.eyebrow}
              </span>

              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#F7F5F2] mb-2">
                {currentLook.name}
              </h3>

              <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light leading-relaxed mb-6">
                {currentLook.description}
              </p>

              {/* Garment Items Included in Look with Quick Add */}
              <div className="space-y-3 mb-6">
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A86A] font-bold block">
                  ITEMS IN THIS LOOK
                </span>

                {currentLook.items.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#14171C] border border-[#C9A86A]/12 flex items-center justify-between group/item hover:border-[#C9A86A]/35 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#0E1013] border border-[#C9A86A]/20 flex items-center justify-center shrink-0">
                        <Shirt className="w-4 h-4 text-[#C9A86A]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-sans text-[9px] uppercase tracking-wider text-[#C9A86A] block font-semibold">
                          {item.category}
                        </span>
                        <h4 className="font-serif text-sm text-[#F7F5F2] truncate group-hover/item:text-[#C9A86A] transition-colors">
                          {item.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-sans text-xs font-bold text-[#F7F5F2] price-display">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddItemToBag(item)}
                        className="w-8 h-8 rounded-lg bg-[#0E1013] border border-[#20252C] hover:border-[#C9A86A] text-[#C9A86A] flex items-center justify-center cursor-pointer transition-colors"
                        aria-label={`Add ${item.name} to bag`}
                      >
                        {addedItemSuccess[item.id] ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-[#C9A86A]/15">
              <button
                type="button"
                onClick={handleAddBundleToBag}
                className="w-full h-12 rounded-xl bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0E1013] font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-250 active:scale-98 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                {addedBundleSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> COMPLETE LOOK ADDED TO BAG!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> ADD COMPLETE LOOK — {formatPrice(lookTotal)}
                  </>
                )}
              </button>

              <Link href={currentLook.link} className="block w-full text-center">
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#B8B6B0] hover:text-[#C9A86A] transition-colors font-bold cursor-pointer inline-block py-1">
                  Explore Full Collection →
                </span>
              </Link>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
