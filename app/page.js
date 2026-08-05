"use client";

import dynamic from "next/dynamic";
import Preloader from "@/components/ui/Preloader";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import { useCart } from "@/context/CartContext";

// Dynamic Code-Splitting for Below-the-Fold Homepage Sections
const LifestyleBanner = dynamic(() => import("@/components/sections/LifestyleBanner"), { ssr: true });
const NewArrivals = dynamic(() => import("@/components/sections/NewArrivals"), { ssr: true });
const FeaturedCollection = dynamic(() => import("@/components/sections/FeaturedCollection"), { ssr: true });
const BrandStory = dynamic(() => import("@/components/sections/BrandStory"), { ssr: true });
const CustomerStories = dynamic(() => import("@/components/sections/CustomerStories"), { ssr: true });
const TrendingSlider = dynamic(() => import("@/components/sections/TrendingSlider"), { ssr: true });
const WhyGOR = dynamic(() => import("@/components/sections/WhyGOR"), { ssr: true });
const ShopTheLook = dynamic(() => import("@/components/sections/ShopTheLook"), { ssr: true });
const InstagramFeed = dynamic(() => import("@/components/sections/InstagramFeed"), { ssr: true });
const Newsletter = dynamic(() => import("@/components/sections/Newsletter"), { ssr: true });
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: true });
const CartDrawer = dynamic(() => import("@/components/ui/CartDrawer"), { ssr: false });

export default function Home() {
  const { addToCart } = useCart();

  return (
    <>
      {/* 1. Preloader */}
      <Preloader />

      {/* 2. Fixed Public Navigation */}
      <Navbar />

      {/* Main Editorial Homepage Sequence */}
      <main className="flex-1 w-full relative bg-[#080808]">
        {/* 1. Hero (Video 1) */}
        <Hero />

        {/* 2. Shop by Category */}
        <Categories />

        {/* 3. Editorial Brand Story (Video 2) */}
        <LifestyleBanner />

        {/* 4. New Arrivals */}
        <NewArrivals onAddToCart={(product) => addToCart(product)} />

        {/* 5. Featured Collections */}
        <FeaturedCollection />

        {/* 6. Brand Story & Craftsmanship */}
        <BrandStory />

        {/* 7. Customer Stories & Social Proof */}
        <CustomerStories />

        {/* 8. Trending Now */}
        <TrendingSlider />

        {/* 9. Why GOR */}
        <WhyGOR />

        {/* 10. Shop the Look (Placed right after Why GOR) */}
        <ShopTheLook />

        {/* 11. Instagram Gallery */}
        <InstagramFeed />

        {/* 12. Newsletter */}
        <Newsletter />
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* 13. Footer */}
      <Footer />
    </>
  );
}
