"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Star, Scissors, Globe } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CartDrawer from "@/components/ui/CartDrawer";
import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

const PILLARS = [
  {
    icon: Scissors,
    title: "Atelier Craftsmanship",
    body: "Every GOR piece begins with a sketch and ends with a hand-finished seam. Our in-house atelier combines traditional tailoring techniques with contemporary silhouettes.",
  },
  {
    icon: Globe,
    title: "Premium Provenance",
    body: "Fabrics sourced from Italian mills, Japanese denim houses, and specialist weavers across the subcontinent — materials chosen for their feel, drape, and longevity.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guarantee",
    body: "Every garment undergoes a 12-point quality inspection before it leaves our atelier. We stand behind our work with a 30-day returns guarantee, no questions asked.",
  },
  {
    icon: Star,
    title: "The GOR Signature",
    body: "Wearable luxury that doesn't announce itself. The GOR monogram is subtle, intentional, and reserved for those who understand that true luxury whispers.",
  },
];

const LOOKBOOK = [
  "/images/lookbook/image copy 2.png",
  "/images/lookbook/image copy 3.png",
  "/images/lookbook/image copy 5.png",
  "/images/lookbook/image.png",
  "/images/lookbook/image copy 4.png",
  "/images/lookbook/image copy 7.png",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay },
});

export default function AboutPage() {
  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="bg-gor-black bg-noise text-gor-offwhite pt-24 overflow-hidden">
        {/* ── Hero Banner ── */}
        <section className="relative min-h-[65vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/lookbook/image copy 2.png"
              alt="GOR Flagship Store"
              className="w-full h-full object-cover object-center luxury-image-filter opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gor-black/60 via-gor-black/40 to-gor-black" />
          </div>
          <Container className="relative z-10 py-24">
            <motion.div {...fadeUp()}>
              <span className="font-sans text-xs uppercase tracking-[0.35em] text-gor-gold font-medium flex items-center gap-2 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Our Story
              </span>
              <h1 className="font-serif text-5xl sm:text-7xl font-bold text-gor-offwhite leading-[1.05] max-w-2xl">
                CRAFTED FOR THE{" "}
                <span className="italic font-normal text-gold-gradient">MODERN MAN</span>
              </h1>
              <p className="mt-6 text-base text-gor-grey font-light leading-relaxed max-w-xl">
                GOR Menswear was born from a singular obsession: to create wearable luxury that belongs to the streets as much as it does to the atelier.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* ── Origin Story ── */}
        <section className="py-24 border-t border-gor-gold/10">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeUp()}>
                <span className="font-sans text-xs uppercase tracking-[0.3em] text-gor-gold font-medium mb-3 block">The Beginning</span>
                <h2 className="font-serif text-4xl font-bold text-gor-offwhite mb-6 leading-tight">
                  FROM CONCEPT TO FLAGSHIP
                </h2>
                <div className="space-y-4 text-sm text-gor-grey font-light leading-relaxed">
                  <p>
                    GOR Menswear began as a single rail of handmade garments in a small studio, built by a craftsman who believed that men deserved the same level of design precision that haute couture offered women.
                  </p>
                  <p>
                    Today, the GOR flagship store stands as a testament to that original conviction — a curated space where heavyweight co-ord sets hang alongside silk monogram camp shirts, distressed denim, and bespoke leather accessories.
                  </p>
                  <p>
                    Every piece tells the same story: deliberate materials, considered construction, and a silhouette that moves with you — whether you&apos;re in a boardroom, a rooftop, or on the street.
                  </p>
                </div>
              </motion.div>

              <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 gap-3">
                {[
                  "/images/lookbook/image copy 6.png",
                  "/images/lookbook/image copy.png",
                  "/images/lookbook/image copy 5.png",
                  "/images/categories/image.png",
                ].map((src, i) => (
                  <div key={i} className={`overflow-hidden border border-gor-gold/15 ${i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}>
                    <img src={src} alt="GOR Atelier" className="w-full h-full object-cover luxury-image-filter hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ── Brand Pillars ── */}
        <section className="py-24 bg-gor-card border-y border-gor-gold/10">
          <Container>
            <motion.div {...fadeUp()} className="text-center mb-16">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-gor-gold font-medium block mb-3">Our Principles</span>
              <h2 className="font-serif text-4xl font-bold text-gor-offwhite">WHAT WE STAND FOR</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PILLARS.map(({ icon: Icon, title, body }, i) => (
                <motion.div key={title} {...fadeUp(i * 0.1)} className="bg-gor-black border border-gor-gold/15 p-6 hover:border-gor-gold/40 transition-colors group">
                  <div className="w-10 h-10 border border-gor-gold/30 bg-gor-gold/5 flex items-center justify-center mb-5 group-hover:bg-gor-gold/15 transition-colors">
                    <Icon className="w-5 h-5 text-gor-gold" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-gor-offwhite mb-3">{title}</h3>
                  <p className="text-xs text-gor-grey leading-relaxed">{body}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Lookbook Grid ── */}
        <section className="py-24">
          <Container>
            <motion.div {...fadeUp()} className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="font-sans text-xs uppercase tracking-[0.3em] text-gor-gold font-medium block mb-2">Archive</span>
                <h2 className="font-serif text-4xl font-bold text-gor-offwhite">FROM THE LOOKBOOK</h2>
              </div>
              <Link href="/new-arrivals">
                <Button variant="outline" icon={ArrowRight} className="mt-4 sm:mt-0">
                  View New Arrivals
                </Button>
              </Link>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {LOOKBOOK.map((src, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.08)}
                  className={`overflow-hidden border border-gor-gold/15 group ${i === 0 ? "col-span-2 sm:col-span-1 row-span-2" : ""}`}
                >
                  <div className={i === 0 ? "aspect-[3/4] sm:aspect-auto sm:h-full" : "aspect-square"}>
                    <img
                      src={src}
                      alt={`GOR Lookbook ${i + 1}`}
                      className="w-full h-full object-cover luxury-image-filter group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Numbers ── */}
        <section className="py-20 bg-gor-card border-y border-gor-gold/10">
          <Container>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                { num: "20+", label: "Exclusive Collections" },
                { num: "4★+", label: "Average Product Rating" },
                { num: "500+", label: "Happy Customers" },
                { num: "100%", label: "Atelier Crafted" },
              ].map(({ num, label }, i) => (
                <motion.div key={label} {...fadeUp(i * 0.1)}>
                  <p className="font-serif text-4xl sm:text-5xl font-bold text-gold-gradient">{num}</p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-gor-grey">{label}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── CTA ── */}
        <section className="py-24">
          <Container>
            <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-gor-gold font-medium flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Join the Atelier
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gor-offwhite mb-5">
                WEAR THE CRAFT
              </h2>
              <p className="text-sm text-gor-grey font-light leading-relaxed mb-8">
                Every piece is made in limited quantities. When it&apos;s gone, it&apos;s gone. Shop the current collection now.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/shop">
                  <Button variant="primary" size="lg" icon={ArrowRight}>Shop the Collection</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">Contact the Atelier</Button>
                </Link>
              </div>
            </motion.div>
          </Container>
        </section>

        <Footer />
      </main>

      <CartDrawer />
    </>
  );
}
