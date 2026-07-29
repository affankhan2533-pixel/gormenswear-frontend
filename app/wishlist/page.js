"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ArrowRight,
  Sparkles,
  Trash2,
  Share2,
  ShoppingBag,
  Eye,
  Check,
  RotateCcw,
  Tag,
  Grid,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CartDrawer from "@/components/ui/CartDrawer";
import ProductCard from "@/components/ui/ProductCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import QuickViewModal from "@/components/ui/QuickViewModal";
import { Container } from "@/components/ui/Section";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

// Featured Collections for Empty State
const FEATURED_COLLECTIONS = [
  { name: "Co-Ord Sets", href: "/shop/codset" },
  { name: "Outerwear & Jackets", href: "/shop/outerwear" },
  { name: "Designer Shirts", href: "/shop/shirts" },
  { name: "Tailored Trousers", href: "/shop/trousers" },
];

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, setIsCartOpen } = useCart();

  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch product catalog
  useEffect(() => {
    async function loadWishlistData() {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/products`);
        const data = await res.json();

        if (data.success) {
          const allProds = data.data || [];
          setProducts(allProds.filter((p) => wishlist.includes(p.id || p._id)));
          
          // Set 4 recommended items not currently in wishlist
          const unSaved = allProds.filter((p) => !wishlist.includes(p.id || p._id));
          setRecommendedProducts(unSaved.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load wishlist data", err);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistData();
  }, [wishlist]);

  // Show Toast Message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Move Single Item to Cart
  const handleMoveToCart = (prod) => {
    addToCart(prod, 1, "M");
    toggleWishlist(prod.id || prod._id); // Remove from wishlist after moving
    setIsCartOpen(true);
    showToast(`"${prod.name}" moved to shopping bag.`);
  };

  // Handle Move All Saved Items to Cart
  const handleMoveAllToCart = () => {
    products.forEach((prod) => {
      addToCart(prod, 1, "M");
    });
    wishlist.forEach((id) => toggleWishlist(id));
    setIsCartOpen(true);
    showToast("All saved garments moved to shopping bag.");
  };

  // Handle Share Wishlist
  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: "My GOR Wishlist",
        text: "Check out my saved garments on GOR Menswear",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      showToast("Wishlist link copied to clipboard!");
    }
  };

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 select-none relative">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-[160] bg-[#C8A45D] text-[#090909] px-5 py-3 rounded-[10px] font-sans text-xs font-bold shadow-2xl flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 1. WISHLIST HERO HEADER ── */}
        <div className="bg-[#151515] border-b border-[#2A2A2A] py-10 sm:py-14 relative overflow-hidden mb-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8A45D]/5 rounded-full blur-[140px] pointer-events-none" />

          <Container>
            <nav className="text-[11px] text-[#8E8A85] font-sans uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <Link href="/" className="hover:text-[#C8A45D] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#C8A45D] font-medium">My Wishlist</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-2 mb-1">
                  <Heart className="w-3.5 h-3.5 fill-[#C8A45D] text-[#C8A45D]" /> SAVED PIECES
                </span>
                <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F8F6F3]">
                  My Wishlist
                </h1>
                <p className="font-sans text-xs sm:text-sm text-[#8E8A85] font-light mt-1 max-w-md">
                  Save your favorite pieces and access them anytime.
                </p>
              </div>

              {products.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-sans text-xs text-[#8E8A85] bg-[#090909] border border-[#2A2A2A] px-3.5 py-2 rounded-[8px] font-semibold">
                    {products.length} {products.length === 1 ? "Saved Item" : "Saved Items"}
                  </span>

                  {/* Share Link Button */}
                  <button
                    type="button"
                    onClick={handleShareWishlist}
                    className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#F8F6F3] bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] px-3.5 py-2 rounded-[8px] transition-all cursor-pointer font-semibold shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>{copiedLink ? "Link Copied!" : "Share Wishlist"}</span>
                  </button>

                  {/* Clear All Button */}
                  <button
                    type="button"
                    onClick={() => {
                      wishlist.forEach((id) => toggleWishlist(id));
                      showToast("Wishlist cleared.");
                    }}
                    className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#8E8A85] hover:text-rose-400 border border-[#2A2A2A] hover:border-rose-500/40 px-3.5 py-2 rounded-[8px] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                </div>
              )}
            </div>
          </Container>
        </div>

        <Container>
          
          {/* ── 2. PREMIUM EMPTY STATE ── */}
          {!loading && products.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Empty Illustration Card */}
              <div className="text-center py-16 px-6 max-w-md mx-auto bg-[#151515] border border-[#2A2A2A] rounded-[18px] shadow-2xl space-y-4">
                <div className="w-20 h-20 rounded-full border border-[#C8A45D]/30 bg-[#090909] flex items-center justify-center mx-auto shadow-inner">
                  <Heart className="w-9 h-9 text-[#C8A45D]/60" />
                </div>
                
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-1">
                    EMPTY WISHLIST
                  </span>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    Your Wishlist is Empty
                  </h2>
                </div>

                <p className="font-sans text-xs text-[#8E8A85] font-light leading-relaxed max-w-xs mx-auto">
                  Save your favorite pieces and access them anytime while browsing our catalog.
                </p>

                <Link href="/shop" className="inline-block pt-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-7 py-3 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] transition-colors cursor-pointer shadow-lg active:scale-95"
                  >
                    <span>Explore Collections</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* Featured Collections Grid */}
              <div className="max-w-4xl mx-auto pt-6 border-t border-[#2A2A2A]">
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-4 text-center sm:text-left">
                  FEATURED COLLECTIONS
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {FEATURED_COLLECTIONS.map((col) => (
                    <Link
                      key={col.name}
                      href={col.href}
                      className="p-4 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[12px] flex items-center justify-between text-xs font-sans font-bold text-[#F8F6F3] group transition-all"
                    >
                      <span>{col.name}</span>
                      <ChevronRight className="w-4 h-4 text-[#8E8A85] group-hover:text-[#C8A45D] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* ── 3. LOADING SKELETON ── */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <ProductSkeleton count={4} />
            </div>
          )}

          {/* ── 4. WISHLIST PRODUCT CARDS GRID ── */}
          {!loading && products.length > 0 && (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((prod) => (
                  <motion.div
                    layout
                    key={prod.id || prod._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="relative group bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D]/40 rounded-[14px] p-3 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl"
                  >
                    {/* Top Action Overlay (Heart Remove & Quick View) */}
                    <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          toggleWishlist(prod.id || prod._id);
                          showToast(`Removed from wishlist.`);
                        }}
                        className="w-8 h-8 rounded-full bg-[#090909]/90 border border-[#2A2A2A] text-rose-400 hover:text-rose-300 flex items-center justify-center transition-colors cursor-pointer shadow-md"
                        aria-label="Remove from Wishlist"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(prod)}
                        className="w-8 h-8 rounded-full bg-[#090909]/90 border border-[#2A2A2A] text-[#F8F6F3] hover:text-[#C8A45D] flex items-center justify-center transition-colors cursor-pointer shadow-md"
                        aria-label="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Container */}
                    <Link
                      href={`/product/${prod.id || prod._id}`}
                      className="block relative aspect-[3/4] w-full overflow-hidden bg-[#090909] rounded-[10px] mb-3"
                    >
                      <img
                        src={prod.image || prod.images?.[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Stock Badge */}
                      <span className="absolute top-2.5 left-2.5 font-sans text-[8.5px] uppercase tracking-wider bg-[#090909]/90 text-emerald-400 px-2 py-0.5 border border-emerald-500/30 font-bold rounded">
                        In Stock
                      </span>
                    </Link>

                    {/* Garment Information */}
                    <div className="space-y-1">
                      <span className="font-sans text-[9px] uppercase tracking-wider text-[#C8A45D] font-bold block">
                        {prod.category || "Garment"}
                      </span>
                      <h3 className="font-editorial text-sm text-[#F8F6F3] truncate group-hover:text-[#C8A45D] transition-colors">
                        {prod.name}
                      </h3>
                      
                      {/* Size Options Pills */}
                      <div className="flex items-center gap-1 font-sans text-[9px] text-[#8E8A85] pt-0.5">
                        <span>Sizes:</span>
                        <span className="font-bold text-[#F8F6F3]">XS, S, M, L, XL</span>
                      </div>

                      <span className="font-sans text-xs font-bold text-[#C8A45D] block pt-1 price-display">
                        {formatPrice(prod.price)}
                      </span>
                    </div>

                    {/* Move to Cart Action Button */}
                    <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(prod)}
                        className="w-full h-9 rounded-[8px] bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-[11px] uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>

                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

          {/* ── 5. RECOMMENDED PRODUCTS ("YOU MAY ALSO LIKE") ── */}
          {!loading && recommendedProducts.length > 0 && (
            <section className="mt-20 pt-12 border-t border-[#2A2A2A]">
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold block mb-1">
                    CURATED SELECTION
                  </span>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    You May Also Like
                  </h2>
                </div>
                <Link href="/shop" className="font-sans text-xs uppercase tracking-wider text-[#C8A45D] hover:underline font-semibold">
                  View Catalog →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto pb-2">
                {recommendedProducts.map((recProd) => (
                  <ProductCard key={recProd.id || recProd._id} product={recProd} />
                ))}
              </div>
            </section>
          )}

        </Container>

        {/* ── 6. MOBILE STICKY ACTION BAR (< 768px) ── */}
        {!loading && products.length > 0 && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090909]/95 border-t border-[#2A2A2A] p-3 backdrop-blur-xl flex items-center justify-between gap-3 shadow-2xl pb-[env(safe-area-inset-bottom)]">
            <div>
              <span className="font-sans text-[10px] text-[#8E8A85] uppercase block">Saved Pieces</span>
              <span className="font-sans text-xs font-bold text-[#C8A45D]">{products.length} Garments</span>
            </div>
            <button
              type="button"
              onClick={handleMoveAllToCart}
              className="h-[44px] px-5 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
            >
              <ShoppingBag className="w-4 h-4" /> Move All to Cart
            </button>
          </div>
        )}

      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      <CartDrawer />
      <Footer />
    </>
  );
}
