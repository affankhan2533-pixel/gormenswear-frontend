"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Eye, Heart, ShoppingBag, Check, X } from "lucide-react";
import { PRODUCTS } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { productService } from "@/lib/productService";
import { BlurReveal } from "@/components/ui/Motion";

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.834 11.834 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.237-6.165-3.483-8.411" />
    </svg>
  );
}

// Memoized Editorial Card Component for Performance
const EditorialProductCard = memo(function EditorialProductCard({ product, onQuickView }) {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id || product._id);
  const img1 = product.image || product.images?.[0] || product.img1 || "/images/products/gor-codset-burgundy-alo.webp";
  const img2 = product.images?.[1] || product.img2 || img1;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col bg-[#111111] border border-[#C9A86A]/15 hover:border-[#C9A86A]/35 rounded-[18px] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 shadow-md hover:shadow-2xl relative"
    >
      {/* 1. Image Stage with 4:5 Aspect Ratio & Hover Image Swap / Zoom */}
      <Link 
        href={`/product/${product.slug || product.id || product._id}`} 
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#111111] block shrink-0"
      >
        <Image
          src={isHovered && img2 !== img1 ? img2 : img1}
          alt={product.name || "GOR Menswear Product"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-top filter brightness-[0.96] contrast-[1.03] group-hover:scale-[1.03] transition-all duration-700 ease-out"
          loading="lazy"
        />

        {/* Dark Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/90 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300" />

        {/* New Arrival Badge */}
        {product.isNew && (
          <span className="absolute top-3 left-3 font-sans text-[9px] uppercase tracking-[0.2em] bg-[#0B0B0B]/85 text-[#C9A86A] px-2.5 py-1 rounded-full border border-[#C9A86A]/30 backdrop-blur-md font-semibold shadow-sm">
            NEW
          </span>
        )}

        {/* Wishlist Touch Target — Desktop Hover Only */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id || product._id);
          }}
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#0B0B0B]/80 border border-[#C9A86A]/25 items-center justify-center text-[#F7F5F2] hover:text-[#C9A86A] transition-all duration-200 backdrop-blur-md cursor-pointer hidden sm:flex shadow-sm"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? "fill-[#C9A86A] text-[#C9A86A]" : ""}`} />
        </button>

        {/* Hover Quick View Trigger — Desktop Only */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250 ease-out px-3.5 py-1.5 bg-[#0B0B0B]/90 border border-[#C9A86A]/40 text-[#F7F5F2] hover:text-[#C9A86A] font-sans text-[10px] uppercase tracking-wider font-semibold rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg cursor-pointer whitespace-nowrap hidden sm:flex"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        )}
      </Link>

      {/* 2. Product Info Section */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 bg-[#111111]">
        <div>
          {/* Category Label */}
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A86A] font-medium block mb-1">
            {product.category || "LATEST DROP"}
          </span>

          {/* Product Name */}
          <Link href={`/product/${product.slug || product.id || product._id}`}>
            <h3 className="font-editorial text-sm sm:text-base font-normal text-[#F7F5F2] group-hover:text-[#C9A86A] transition-colors line-clamp-1 leading-snug mb-1.5">
              {product.name}
            </h3>
          </Link>

          {/* Pricing Row */}
          <div className="flex items-center justify-between gap-1 mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-xs sm:text-sm font-bold text-[#F7F5F2] price-display tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-[11px] text-[#B8B6B0]/60 line-through price-display tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {discountPercent && (
              <span className="font-sans text-[8.5px] bg-[#C9A86A]/15 text-[#C9A86A] border border-[#C9A86A]/30 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider shrink-0">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Order CTA Button */}
        <div className="mt-3 pt-2.5 border-t border-[#C9A86A]/10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => addToCart(product, 1, "M")}
            className="w-full h-[38px] sm:h-[40px] rounded-[10px] bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0B0B0B] font-sans text-xs uppercase tracking-wider font-bold transition-all duration-200 shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default function NewArrivals({ onAddToCart }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProd, setQuickViewProd] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        setIsLoading(true);
        const prods = await productService.getStorefrontProducts();
        if (prods && prods.length > 0) {
          setProductsList(prods.slice(0, 8));
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error("Failed to load new arrivals", err);
      }
      setProductsList(PRODUCTS.slice(0, 8));
      setIsLoading(false);
    }
    fetchNewArrivals();
  }, []);

  const handleQuickViewAdd = (prod) => {
    addToCart(prod, 1, selectedSize);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setQuickViewProd(null);
      setIsCartOpen(true);
    }, 1000);
  };

  return (
    <section id="new-arrivals" className="py-16 sm:py-24 bg-[#171B21] text-[#F7F5F2] overflow-hidden relative selection:bg-[#C9A86A] selection:text-[#0E1013]">
      
      {/* Background Depth Accents */}
      <div 
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-20 blur-[160px]"
        style={{ background: "radial-gradient(circle, rgba(201, 168, 106, 0.04) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. Centered Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C9A86A] font-semibold">
              LATEST DROP
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F7F5F2] tracking-tight leading-[1.05] mb-4">
            NEW ARRIVALS
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light tracking-[0.18em] leading-relaxed uppercase max-w-lg mx-auto">
            Discover the latest additions crafted for the modern wardrobe.
          </p>
        </motion.div>

        {/* ── 2. Responsive Product Grid (Desktop 4-Cols | Mobile/Tablet 2-Cols) ── */}
        {isLoading ? (
          /* Graceful Skeleton Loading Cards */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-[#111111] border border-[#C9A86A]/10 rounded-[18px] p-3 animate-pulse space-y-3">
                <div className="aspect-[4/5] bg-white/5 rounded-[12px] w-full" />
                <div className="h-3 bg-white/10 rounded w-1/3" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : productsList.length === 0 ? (
          /* Empty Fallback State */
          <div className="text-center py-16 bg-[#111111] border border-[#C9A86A]/15 rounded-[18px] max-w-md mx-auto p-8">
            <p className="font-editorial text-xl text-[#F7F5F2] mb-2">New Season Drop Coming Soon</p>
            <p className="font-sans text-xs text-[#B8B6B0]">Our craftsmen are finalizing the latest collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16">
            {productsList.slice(0, 8).map((prod) => (
              <EditorialProductCard 
                key={prod.id || prod._id} 
                product={prod} 
                onQuickView={setQuickViewProd}
              />
            ))}
          </div>
        )}

        {/* ── 3. Centered Bottom CTA ── */}
        <div className="mt-14 text-center">
          <Link href="/new-arrivals" className="inline-block">
            <button
              type="button"
              className="h-[52px] px-8 rounded-[12px] bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 hover:bg-[#D4B57C] hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_20px_rgba(201,168,106,0.25)] hover:shadow-[0_8px_30px_rgba(201,168,106,0.4)] flex items-center justify-center gap-2.5 mx-auto cursor-pointer"
            >
              <span>View All New Arrivals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>

      {/* ── LIGHTWEIGHT COMPACT QUICK VIEW MODAL ── */}
      <AnimatePresence>
        {quickViewProd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[180] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setQuickViewProd(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#111111] border border-[#C9A86A]/25 rounded-[18px] p-5 sm:p-6 relative shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setQuickViewProd(null)}
                className="absolute top-4 right-4 z-10 p-1.5 text-[#B8B6B0] hover:text-[#C9A86A] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Mini Preview Image */}
                <div className="sm:col-span-5 aspect-[4/5] rounded-[12px] overflow-hidden bg-[#0B0B0B] border border-[#C9A86A]/15 relative">
                  <Image
                    src={quickViewProd.image || quickViewProd.images?.[0] || "/images/products/gor-codset-burgundy-alo.webp"}
                    alt={quickViewProd.name}
                    fill
                    sizes="200px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Right Details */}
                <div className="sm:col-span-7 space-y-3 text-left">
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A86A] font-semibold block mb-1">
                      {quickViewProd.category || "LATEST DROP"}
                    </span>
                    <h3 className="font-editorial text-xl font-normal text-[#F7F5F2] leading-snug">
                      {quickViewProd.name}
                    </h3>
                    <p className="font-sans text-base font-bold text-[#F7F5F2] mt-1 price-display tabular-nums">
                      {formatPrice(quickViewProd.price)}
                    </p>
                  </div>

                  {/* Size Selector */}
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#B8B6B0] block mb-1.5 font-medium">
                      Size:
                    </span>
                    <div className="flex gap-1.5">
                      {["S", "M", "L", "XL", "XXL"].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`w-8 h-8 border font-sans text-xs font-semibold rounded-[6px] transition-all ${
                            selectedSize === sz
                              ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A]"
                              : "bg-[#0B0B0B] text-[#F7F5F2] border-[#C9A86A]/20"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickViewAdd(quickViewProd)}
                      className="w-full h-[42px] rounded-[10px] bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-wider font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {addedSuccess ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                      <span>{addedSuccess ? "Added!" : "Order Now"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
