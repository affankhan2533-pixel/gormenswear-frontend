"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "The fit of the GOR Cashmere Blazer is perfection. The unlined Italian fabric drapes naturally with an understated elegance I haven’t found in standard ready-to-wear.",
    author: "Alexander Rothschild",
    title: "Patron",
    city: "London, UK",
  },
  {
    id: "t2",
    quote:
      "GOR Menswear strikes the exact balance between modern relaxed silhouettes and traditional Savile Row tailoring. The silk camp shirts hold a flawless cut all day long.",
    author: "Marcello Vance",
    title: "Connoisseur",
    city: "Milan, Italy",
  },
  {
    id: "t3",
    quote:
      "Visiting the GOR Atelier and selecting tailored pleated trousers was an incredible experience. The craft, stitching, and custom detailing are genuinely top tier.",
    author: "Julian Thorne",
    title: "Fashion Editor",
    city: "Paris, France",
  },
];

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className="py-24 sm:py-36 bg-[#090909] text-[#F4F1EA] overflow-hidden border-b border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C9A96E] font-medium block mb-3">
            CLIENT PERSPECTIVES
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#F4F1EA] tracking-tight">
            The Patron Voice
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative bg-[#121212] border border-white/[0.07] p-8 sm:p-14 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center relative z-10"
            >
              {/* Quote Text */}
              <p className="font-editorial text-xl sm:text-3xl text-[#F4F1EA] font-light italic leading-relaxed max-w-2xl">
                "{TESTIMONIALS[activeIdx].quote}"
              </p>

              {/* Author Details */}
              <div className="mt-8 text-center">
                <h4 className="font-editorial text-lg font-normal text-[#F4F1EA]">
                  {TESTIMONIALS[activeIdx].author}
                </h4>
                <p className="mt-1 font-sans text-xs text-[#8E8A85] tracking-widest uppercase font-medium">
                  {TESTIMONIALS[activeIdx].title} — <span className="text-[#C9A96E]">{TESTIMONIALS[activeIdx].city}</span>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-[1px] transition-all duration-300 ${
                    activeIdx === idx ? "w-8 bg-[#C9A96E]" : "w-3 bg-white/20 hover:bg-[#C9A96E]/50"
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                className="p-2 border border-white/[0.1] hover:border-[#C9A96E] text-[#8E8A85] hover:text-[#C9A96E] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                className="p-2 border border-white/[0.1] hover:border-[#C9A96E] text-[#8E8A85] hover:text-[#C9A96E] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

