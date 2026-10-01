"use client";

import dynamic from "next/dynamic";
import Preloader from "@/components/ui/Preloader";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import { useCart } from "@/context/CartContext";

// Dynamic Code-Splitting for Below-the-Fold Homepage Sections
const NewArrivals = dynamic(() => import("@/components/sections/NewArrivals"), { ssr: true });
const FeaturedCollection = dynamic(() => import("@/components/sections/FeaturedCollection"), { ssr: true });
const BrandStory = dynamic(() => import("@/components/sections/BrandStory"), { ssr: true });
const LifestyleBanner = dynamic(() => import("@/components/sections/LifestyleBanner"), { ssr: true });
const TrendingSlider = dynamic(() => import("@/components/sections/TrendingSlider"), { ssr: true });
const WhyGOR = dynamic(() => import("@/components/sections/WhyGOR"), { ssr: true });
const Newsletter = dynamic(() => import("@/components/sections/Newsletter"), { ssr: true });
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: true });
const CartDrawer = dynamic(() => import("@/components/ui/CartDrawer"), { ssr: false });

export default function Home() {
  const { addToCart } = useCart();

  return (
    <>
      {/* 0. Preloader for smooth luxury page entry */}
      <Preloader />

      {/* 01. NAVBAR */}
      <Navbar />

      {/* Main Editorial Homepage Sequence — 10 Intentional Sections */}
      <main className="flex-1 w-full relative bg-[#F5F2EC] text-[#111111]">
        {/* 02. HERO */}
        <Hero />

        {/* 03. SHOP BY CATEGORY */}
        <Categories />

        {/* 04. NEW ARRIVALS */}
        <NewArrivals onAddToCart={(product) => addToCart(product)} />

        {/* 05. FEATURED PRODUCT / EDITORIAL PRODUCT STORY (The GOR Edit) */}
        <FeaturedCollection />

        {/* 06. GOR BRAND STORY */}
        <BrandStory />

        {/* EDITORIAL CAMPAIGN VIDEO BANNER */}
        <LifestyleBanner />

        {/* 07. TRENDING PRODUCTS */}
        <TrendingSlider />

        {/* 08. BRAND VALUES (The GOR Standard) */}
        <WhyGOR />

        {/* 09. NEWSLETTER */}
        <Newsletter />
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* 10. FOOTER */}
      <Footer />
    </>
  );
}
