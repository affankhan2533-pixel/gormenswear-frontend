"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Sparkles, SlidersHorizontal, ChevronDown } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CartDrawer from "@/components/ui/CartDrawer";
import ProductCard from "@/components/ui/ProductCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { Container } from "@/components/ui/Section";

function NewArrivalsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("featured");

  useEffect(() => {
    async function fetchNewArrivals() {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/products?sort=${sortOption}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch new arrivals", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, [sortOption]);

  return (
    <div className="min-h-screen bg-gor-black bg-noise text-gor-offwhite flex flex-col pt-24">
      {/* Header Banner */}
      <div className="bg-gor-card border-b border-gor-gold/15 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-gor-navy/30 rounded-full blur-[120px] pointer-events-none" />
        <Container>
          <nav className="text-xs text-gor-grey font-sans uppercase tracking-widest mb-3 flex items-center gap-2">
            <Link href="/" className="hover:text-gor-gold">Home</Link>
            <span>/</span>
            <span className="text-gor-gold font-semibold">New Arrivals</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-gor-gold font-medium flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gor-gold" /> Autumn / Winter 2026 Release
              </span>
              <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-bold text-gor-offwhite">
                NEW ARRIVALS
              </h1>
            </div>
            <p className="mt-4 md:mt-0 font-sans text-xs text-gor-grey max-w-sm">
              Discover the latest GOR Menswear store drops, Alo co-ord sets, and statement outerwear.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12 flex-1">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-gor-gold/10">
          <div className="text-xs text-gor-grey">
            Showing <span className="text-gor-gold font-bold">{products.length}</span> newest atelier releases
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gor-grey uppercase tracking-wider hidden sm:inline">
              Sort By:
            </span>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-gor-card text-gor-offwhite text-xs uppercase tracking-wider px-4 py-2.5 pr-8 border border-gor-gold/30 focus:outline-none focus:border-gor-gold cursor-pointer"
              >
                <option value="featured">Newest Atelier Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gor-gold absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <ProductSkeleton count={8} />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="stagger-item">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default function NewArrivalsPage() {
  return (
    <>
      <NoiseOverlay />
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-gor-black pt-32 text-center text-gor-gold">Loading New Arrivals...</div>}>
        <NewArrivalsContent />
      </Suspense>
      <CartDrawer />
      <Footer />
    </>
  );
}
