"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShieldCheck, Sparkles, X, Heart, ArrowRight } from "lucide-react";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const REVIEWS = [
  {
    id: 1,
    name: "Rohan Malhotra",
    city: "Mumbai",
    rating: 5,
    category: "Co-Ord Sets",
    review: "The fit and fabric quality of the Co-Ord set blew me away. Super breathable for humid weather and looks extremely premium.",
    avatar: "/images/lookbook/gor-lookbook-1.webp",
  },
  {
    id: 2,
    name: "Aman Sharma",
    city: "Delhi",
    rating: 5,
    category: "Oversized Tees",
    review: "Finally a brand that gets oversized streetwear right. Heavyweight cotton that doesn't lose shape after washing.",
    avatar: "/images/lookbook/gor-lookbook-2.webp",
  },
  {
    id: 3,
    name: "Vikram Sengupta",
    city: "Bengaluru",
    rating: 5,
    category: "Cargo Trousers",
    review: "Fast delivery within 3 days! The cargo trousers have custom hardware accents and fit perfectly with my sneaker collection.",
    avatar: "/images/lookbook/gor-lookbook-3.webp",
  },
  {
    id: 4,
    name: "Karan Patel",
    city: "Ahmedabad",
    rating: 5,
    category: "Silk Shirts",
    review: "Bought the silk shirt for a weekend event and received endless compliments. Definitely ordering the rest of the collection.",
    avatar: "/images/lookbook/gor-lookbook-4.webp",
  },
];

const STATS = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "4.9 / 5", label: "Average Rating" },
  { value: "25+", label: "Premium Collections" },
  { value: "Fast", label: "Nationwide Delivery" },
];

const GALLERY = [
  { id: 1, image: "/images/lookbook/gor-lookbook-1.webp", handle: "@rohan_m" },
  { id: 2, image: "/images/lookbook/gor-lookbook-2.webp", handle: "@aman_s" },
  { id: 3, image: "/images/lookbook/gor-lookbook-3.webp", handle: "@vikram_v" },
  { id: 4, image: "/images/lookbook/gor-lookbook-4.webp", handle: "@karan_p" },
];

export default function CustomerStories() {
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-[#090909] text-[#F8F6F3] overflow-hidden border-t border-b border-[#2A2A2A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C8A45D] font-semibold block mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" /> COMMUNITY
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl font-normal text-[#F8F6F3] tracking-wide">
              Trusted by Thousands of Customers
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#8E8A85] font-light max-w-lg mt-2">
              See how our community styles GOR Menswear for everyday confidence.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans text-[#C8A45D] font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#315DA8]" />
            <span>100% Verified Customer Reviews</span>
          </div>
        </div>

        {/* ── Social Proof Stats Bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 bg-[#151515] border border-[#2A2A2A] rounded-[16px] mb-12 sm:mb-16 shadow-xl">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-3 border-r last:border-r-0 border-[#2A2A2A]/50"
            >
              <p className="font-editorial text-3xl sm:text-4xl font-normal text-[#C8A45D] price-display">
                {stat.value}
              </p>
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-[#8E8A85] mt-1 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Two-Column Desktop Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-16 sm:mb-24">
          
          {/* LEFT: Featured Spotlight Customer Image & Quote */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative rounded-[16px] overflow-hidden bg-[#151515] border border-[#2A2A2A] shadow-2xl group min-h-[420px] flex flex-col justify-end p-6 sm:p-8"
          >
            <img
              src="/images/categories/gor-model-streetwear.webp"
              alt="Featured Customer"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/95 via-[#090909]/50 to-transparent" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-1 text-[#C8A45D]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C8A45D]" />
                ))}
              </div>
              <p className="font-editorial text-xl sm:text-2xl text-[#F8F6F3] italic leading-relaxed">
                &ldquo;GOR menswear has completely transformed my daily wardrobe. The fit and quality of the oversized tees and co-ord sets are unmatched.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#2A2A2A]">
                <p className="font-sans text-xs uppercase tracking-wider text-[#F8F6F3] font-bold">Marcus Vance</p>
                <p className="font-sans text-[10px] text-[#8E8A85]">Mumbai, India • Verified Buyer</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Grid of Customer Review Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REVIEWS.map((rev, i) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D]/40 p-5 rounded-[16px] shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#C8A45D]">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-[#C8A45D]" />
                      ))}
                    </div>
                    <span className="font-sans text-[9px] uppercase tracking-wider bg-[#090909] text-[#C8A45D] px-2 py-0.5 rounded border border-[#2A2A2A] font-semibold">
                      {rev.category}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-[#8E8A85] font-light leading-relaxed mb-4">
                    &ldquo;{rev.review}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-[#2A2A2A]/50">
                  <img src={rev.avatar} alt={rev.name} className="w-9 h-9 rounded-full object-cover border border-[#2A2A2A]" />
                  <div>
                    <p className="font-sans text-xs text-[#F8F6F3] font-bold">{rev.name}</p>
                    <p className="font-sans text-[10px] text-[#8E8A85]">{rev.city} • Verified</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* ── Instagram Community Gallery ── */}
        <div className="pt-8 border-t border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-6">
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#C8A45D] font-semibold flex items-center gap-2">
              <InstagramIcon className="w-4 h-4 text-[#C8A45D]" /> @GORMENSWEAR ON INSTAGRAM
            </span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs uppercase tracking-wider text-[#8E8A85] hover:text-[#C8A45D] transition-colors flex items-center gap-1 font-medium"
            >
              <span>Follow Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {GALLERY.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedGalleryImg(item)}
                className="relative aspect-square rounded-[12px] overflow-hidden bg-[#151515] border border-[#2A2A2A] group cursor-pointer"
              >
                <img
                  src={item.image}
                  alt="Community style"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#090909]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-[#F8F6F3]">
                  <InstagramIcon className="w-6 h-6 text-[#C8A45D]" />
                  <span className="font-sans text-xs uppercase tracking-wider font-semibold">{item.handle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedGalleryImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-xl w-full bg-[#151515] border border-[#2A2A2A] rounded-[16px] overflow-hidden p-4">
              <button
                type="button"
                onClick={() => setSelectedGalleryImg(null)}
                className="absolute top-4 right-4 z-10 p-2 text-[#8E8A85] hover:text-[#C8A45D]"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={selectedGalleryImg.image} alt="Enlarged community style" className="w-full aspect-square object-cover rounded-[10px]" />
              <div className="mt-3 flex items-center justify-between font-sans text-xs text-[#8E8A85]">
                <span className="text-[#C8A45D] font-bold">{selectedGalleryImg.handle}</span>
                <span>Styled in GOR Menswear</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
