"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const INSTA_POSTS = [
  { id: "i1", img: "/images/lookbook/image copy 2.png", likes: "2.4k" },
  { id: "i2", img: "/images/lookbook/image copy 3.png", likes: "1.9k" },
  { id: "i3", img: "/images/lookbook/image copy 5.png", likes: "3.1k" },
  { id: "i4", img: "/images/lookbook/image copy 4.png", likes: "4.2k" },
  { id: "i5", img: "/images/lookbook/image copy 7.png", likes: "1.5k" },
  { id: "i6", img: "/images/lookbook/image copy 6.png", likes: "2.8k" },
];

function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function InstagramFeed() {
  return (
    <section className="py-20 sm:py-28 bg-[#080808] border-t border-b border-white/[0.08] text-[#F4F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C9A96E] font-medium block mb-2 flex items-center gap-2">
              <InstagramIcon className="w-4 h-4 text-[#C9A96E]" />
              INSTAGRAM EDITORIAL
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#F4F1EA] tracking-tight">
              Life In GOR Menswear
            </h2>
          </div>

          <div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-[#C9A96E] hover:text-[#F4F1EA] transition-colors border-b border-[#C9A96E]/50 pb-1"
            >
              <span>Follow @GORMenswear</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Clean 2x3 Mobile Grid (2 Cols on Mobile, 6 Cols on Desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTA_POSTS.map((post, idx) => (
            <motion.a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              className="group relative aspect-square bg-[#121212] overflow-hidden rounded-[10px] border border-white/[0.08] hover:border-[#C9A96E]/50 transition-all duration-300 block"
            >
              <Image
                src={post.img}
                alt={`GOR Menswear Editorial Look ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Dark Overlay & Instagram Heart Badge */}
              <div className="absolute inset-0 bg-[#090909]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5 text-[#F4F1EA] backdrop-blur-[2px]">
                <InstagramIcon className="w-6 h-6 text-[#C9A96E]" />
                <span className="font-sans text-[11px] font-semibold tracking-wider">
                  ♥ {post.likes}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
