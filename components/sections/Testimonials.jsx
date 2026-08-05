"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BlurReveal } from "@/components/ui/Motion";
import { EASING, DURATION } from "@/lib/motion";

const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "The fit of the GOR Cashmere Blazer is perfection. The unlined Italian fabric drapes naturally with an understated elegance I haven't found in standard ready-to-wear.",
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
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const variants = {
    enter: (dir) => ({
      x: shouldReduceMotion ? 0 : dir * 30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: DURATION.normal, ease: EASING.luxury },
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : dir * -30,
      opacity: 0,
      transition: { duration: DURATION.fast, ease: EASING.exit },
    }),
  };

  return (
    <section
      id="testimonials"
      className="py-24 sm:py-36 bg-[#090909] text-[#F4F1EA] overflow-hidden border-b border-white/[0.06]"
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8">

        {/* Header */}
        <BlurReveal className="text-center mb-16">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C9A96E] font-medium block mb-3">
            CLIENT PERSPECTIVES
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#F4F1EA] tracking-tight">
            The Patron Voice
          </h2>
        </BlurReveal>

        {/* Carousel */}
        <BlurReveal delay={0.1} className="relative bg-[#121212] border border-white/[0.07] p-8 sm:p-14 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIdx}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center text-center relative z-10"
            >
              {/* Quote */}
              <motion.p
                className="font-editorial text-xl sm:text-3xl text-[#F4F1EA] font-light italic leading-relaxed max-w-2xl"
              >
                &ldquo;{TESTIMONIALS[activeIdx].quote}&rdquo;
              </motion.p>

              {/* Author */}
              <div className="mt-8 text-center">
                <h4 className="font-editorial text-lg font-normal text-[#F4F1EA]">
                  {TESTIMONIALS[activeIdx].author}
                </h4>
                <p className="mt-1 font-sans text-xs text-[#8E8A85] tracking-widest uppercase font-medium">
                  {TESTIMONIALS[activeIdx].title} —{" "}
                  <span className="text-[#C9A96E]">{TESTIMONIALS[activeIdx].city}</span>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-center justify-between">
            {/* Dots — spring width transition */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeIdx ? 1 : -1);
                    setActiveIdx(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  animate={{
                    width: activeIdx === idx ? 32 : 12,
                    backgroundColor: activeIdx === idx ? "#C9A96E" : "rgba(255,255,255,0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="h-[2px] rounded-full cursor-pointer"
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                whileHover={{ scale: 1.1, borderColor: "#C9A96E" }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="p-2 border border-white/[0.1] text-[#8E8A85] hover:text-[#C9A96E] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                whileHover={{ scale: 1.1, borderColor: "#C9A96E" }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="p-2 border border-white/[0.1] text-[#8E8A85] hover:text-[#C9A96E] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </BlurReveal>

      </div>
    </section>
  );
}
