"use client";

import Preloader from "@/components/ui/Preloader";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import FeaturedCollection from "@/components/sections/FeaturedCollection";
import CustomerStories from "@/components/sections/CustomerStories";
import NewArrivals from "@/components/sections/NewArrivals";
import LifestyleBanner from "@/components/sections/LifestyleBanner";
import BrandStory from "@/components/sections/BrandStory";
import TrendingSlider from "@/components/sections/TrendingSlider";
import WhyGOR from "@/components/sections/WhyGOR";
import InstagramFeed from "@/components/sections/InstagramFeed";
import Newsletter from "@/components/sections/Newsletter";
import Footer from "@/components/sections/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import { useCart } from "@/context/CartContext";

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
        {/* 1. Hero */}
        <Hero />

        {/* 2. Shop by Category */}
        <Categories />

        {/* 3. Lifestyle Banner */}
        <LifestyleBanner />

        {/* 4. Brand Story */}
        <BrandStory />

        {/* 5. Featured Collection */}
        <FeaturedCollection />

        {/* 6. Customer Stories & Social Proof */}
        <CustomerStories />

        {/* 7. New Arrivals */}
        <NewArrivals onAddToCart={(product) => addToCart(product)} />

        {/* 8. Trending Now */}
        <TrendingSlider />

        {/* 9. Why GOR */}
        <WhyGOR />

        {/* 10. Instagram Gallery */}
        <InstagramFeed />

        {/* 11. Newsletter */}
        <Newsletter />
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* 12. Footer */}
      <Footer />
    </>
  );
}
