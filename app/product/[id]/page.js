"use client";

import { useState, useEffect, use, useMemo, useRef, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  Plus,
  Minus,
  Sliders,
  Share2,
  Lock,
  Truck,
  RotateCcw,
  Gift,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CartDrawer from "@/components/ui/CartDrawer";
import ProductCard from "@/components/ui/ProductCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { Container } from "@/components/ui/Section";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import ReviewSection from "@/components/reviews/ReviewSection";
import { productService } from "@/lib/productService";
import {
  recommendationEngine,
  addRecentlyViewed,
  getRecentlyViewed,
} from "@/lib/recommendationEngine";
import RecommendationCard from "@/components/ui/RecommendationCard";

// PDP Subcomponents
import ProductGallery from "@/components/pdp/ProductGallery";
import FindMySizeModal from "@/components/pdp/FindMySizeModal";
import SizeGuideModal from "@/components/pdp/SizeGuideModal";
import OutfitBuilder from "@/components/pdp/OutfitBuilder";
import ProductAccordions from "@/components/pdp/ProductAccordions";

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.834 11.834 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.237-6.165-3.483-8.411" />
    </svg>
  );
}

function ProductDetailContent({ idParam }) {
  const { addToCart, wishlist, toggleWishlist, setIsCartOpen } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [completeTheLook, setCompleteTheLook] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [mediaList, setMediaList] = useState([]);

  // Form selection state
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals state
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showFindMySize, setShowFindMySize] = useState(false);

  // Delivery & Pincode state
  const [pincode, setPincode] = useState("");
  const [deliveryResult, setDeliveryResult] = useState(null);

  // Sticky Buy Bar scroll trigger state
  const [showStickyBar, setShowStickyBar] = useState(false);
  const buyButtonRef = useRef(null);

  // Scroll Carousels refs
  const relatedSliderRef = useRef(null);
  const viewedSliderRef = useRef(null);

  // Fetch Product details dynamically by ID/Slug
  useEffect(() => {
    async function fetchProductDetails() {
      if (!idParam) return;
      setLoading(true);
      try {
        let currentProd = await productService.getProduct(idParam);
        let relatedItems = [];

        if (currentProd) {
          setProduct(currentProd);

          // Build gallery media array dynamically from real product images
          const rawImgs =
            Array.isArray(currentProd.images) && currentProd.images.length > 0
              ? currentProd.images
              : currentProd.imageUrl || currentProd.image
              ? [currentProd.imageUrl || currentProd.image]
              : ["/images/lookbook/gor-lookbook-1.webp"];

          const formattedMedia = rawImgs.map((src, idx) => ({
            type: typeof src === "string" && (src.endsWith(".mp4") || src.endsWith(".webm")) ? "video" : "image",
            src,
            label: idx === 0 ? "Main View" : `Detail View ${idx + 1}`,
          }));

          setMediaList(formattedMedia);

          // Bind color options from real product colors
          const colorsList =
            Array.isArray(currentProd.colors) && currentProd.colors.length > 0
              ? currentProd.colors
              : [{ name: "Onyx Black", hex: "#111111" }];
          setSelectedColor(colorsList[0]);

          // Compute Smart Recommendations using recommendationEngine
          const allProducts = await productService.getProducts();
          if (Array.isArray(allProducts) && allProducts.length > 0) {
            const similarItems = recommendationEngine.getYouMayAlsoLike(currentProd, allProducts, 6);
            const lookEnsemble = recommendationEngine.getCompleteTheLook(currentProd, allProducts);
            setRelated(similarItems);
            setCompleteTheLook(lookEnsemble);
          }

          // Persist Recently Viewed in localStorage via recommendationEngine
          addRecentlyViewed(currentProd);
          const history = getRecentlyViewed().filter(
            (item) => (item.id || item.slug || item._id) !== (currentProd.id || currentProd.slug || currentProd._id)
          );
          setRecentlyViewed(history);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic product details", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetails();
  }, [idParam]);

  // Scroll listener for sticky CTA bar
  useEffect(() => {
    const handleScroll = () => {
      if (buyButtonRef.current) {
        const rect = buyButtonRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add to Cart handler
  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  // Buy Now handler (adds to cart & opens cart drawer)
  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsCartOpen(true);
  };

  // Share action
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on GOR Menswear`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Pincode Validator
  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.trim().length < 6) {
      setDeliveryResult({ success: false, msg: "Enter a valid 6-digit Pincode" });
      return;
    }
    setDeliveryResult({
      success: true,
      msg: `Express Delivery available to Pincode ${pincode.trim()} (Standard: 3–5 Days | Express: 1–2 Days)`,
    });
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] pt-28 pb-20">
        <Container className="max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            <div className="lg:col-span-7 aspect-[3/4] bg-[#111111] rounded-2xl animate-pulse" />
            <div className="lg:col-span-5 space-y-6">
              <div className="h-6 w-1/3 bg-[#111111] rounded animate-pulse" />
              <div className="h-12 w-4/5 bg-[#111111] rounded animate-pulse" />
              <div className="h-8 w-2/5 bg-[#111111] rounded animate-pulse" />
              <div className="h-28 w-full bg-[#111111] rounded animate-pulse" />
              <div className="h-14 w-full bg-[#111111] rounded animate-pulse" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Product Not Found state
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] pt-32 text-center text-[#F7F5F2] flex flex-col items-center justify-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-normal">Garment Not Found</h2>
        <p className="font-sans text-xs text-[#B8B6B0] mt-2">
          The requested item does not exist in the GOR catalog.
        </p>
        <Link
          href="/shop"
          className="mt-6 px-8 py-3.5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-xl hover:bg-[#D4B57C] transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id || product._id);
  const availableSizes =
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : ["S", "M", "L", "XL"];

  const productColors =
    Array.isArray(product.colors) && product.colors.length > 0
      ? product.colors
      : [{ name: "Onyx Black", hex: "#111111" }];

  const origPrice = product.originalPrice || product.compareAtPrice;
  const discountPercent =
    origPrice && origPrice > product.price
      ? Math.round(((origPrice - product.price) / origPrice) * 100)
      : null;

  const whatsappMsg = `Hi GOR Menswear,\n\nI am interested in ordering:\n*${product.name}*\nSize: ${
    selectedSize || "Not selected"
  }\nPrice: ${formatPrice(product.price)}\n\nPlease confirm availability and payment options.`;
  const whatsappUrl = `https://wa.me/918691921913?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F7F5F2] flex flex-col pt-20 sm:pt-24 select-none">
      
      {/* ── 55% / 45% DESKTOP TWO-COLUMN LUXURY LAYOUT (max-w-[1600px]) ── */}
      <Container className="max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          
          {/* 1. LEFT COLUMN (55%): EDITORIAL IMAGE GALLERY */}
          <div className="lg:col-span-7">
            <ProductGallery
              mediaList={mediaList}
              productName={product.name}
              badge={product.badge || (product.stock <= 5 && product.stock > 0 ? "LOW STOCK" : null)}
              isWishlisted={isWishlisted}
              onWishlistToggle={() => toggleWishlist(product.id || product._id)}
            />
          </div>

          {/* 2. RIGHT COLUMN (45%): STICKY PURCHASE PANEL */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 self-start bg-[#0B0B0B]">
            
            {/* SEO-FRIENDLY BREADCRUMBS */}
            <nav aria-label="Breadcrumb" className="font-sans text-[11px] text-[#B8B6B0] uppercase tracking-[0.2em] flex items-center gap-2 flex-wrap">
              <Link href="/" className="hover:text-[#C9A86A] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-[#C9A86A] transition-colors">Shop</Link>
              <span>/</span>
              <Link href={`/shop?category=${encodeURIComponent(product.category || "all")}`} className="hover:text-[#C9A86A] transition-colors">
                {product.category || "Collections"}
              </Link>
              <span>/</span>
              <span className="text-[#C9A86A] font-semibold truncate">{product.name}</span>
            </nav>

            {/* Header: Category & Stock Availability */}
            <div>
              <div className="flex items-center justify-between font-sans text-[11px] text-[#C9A86A] uppercase tracking-[0.25em] font-semibold mb-1">
                <span>{product.category || "ATELIER SIGNATURE"}</span>
                {product.stock !== undefined && product.stock <= 0 ? (
                  <span className="text-rose-400 font-sans text-[10px] bg-rose-950/80 px-2.5 py-0.5 rounded-md border border-rose-500/30 font-bold tracking-wider">
                    SOLD OUT
                  </span>
                ) : (
                  <span className="text-emerald-400 font-sans text-[10px] bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-500/30 font-bold tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> IN STOCK & READY TO SHIP
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F7F5F2] leading-[1.08] tracking-tight">
                {product.name}
              </h1>

              {/* Star Rating & Social Proof */}
              <div className="mt-3 flex items-center gap-2 font-sans text-xs text-[#B8B6B0]">
                <div className="flex items-center text-[#C9A86A]" aria-label="5 out of 5 stars">
                  <Star className="w-3.5 h-3.5 fill-[#C9A86A]" />
                  <Star className="w-3.5 h-3.5 fill-[#C9A86A]" />
                  <Star className="w-3.5 h-3.5 fill-[#C9A86A]" />
                  <Star className="w-3.5 h-3.5 fill-[#C9A86A]" />
                  <Star className="w-3.5 h-3.5 fill-[#C9A86A]" />
                </div>
                <span className="font-bold text-[#F7F5F2]">{product.rating || "4.9"}</span>
                <span>•</span>
                <a href="#reviews" className="hover:text-[#C9A86A] hover:underline cursor-pointer">
                  {product.reviewsCount || 48} Verified Customer Reviews
                </a>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-center gap-3.5 pt-2 border-t border-[#2A2A2A]">
              <span className="font-sans text-2xl sm:text-3xl font-bold text-[#F7F5F2] price-display">
                {formatPrice(product.price)}
              </span>
              {origPrice && origPrice > product.price && (
                <span className="font-sans text-base text-[#B8B6B0] line-through price-display">
                  {formatPrice(origPrice)}
                </span>
              )}
              {discountPercent && (
                <span className="font-sans text-[10px] bg-[#D86A32]/15 text-[#D86A32] border border-[#D86A32]/30 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            {/* PRODUCT HIGHLIGHTS BLOCK */}
            <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-2.5 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A86A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> GARMENT HIGHLIGHTS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-[#F7F5F2]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
                  <span>{product.fabric || "100% Premium Cotton Textile"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
                  <span>Custom Hand-Engraved GOR Hardware</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
                  <span>Pre-Shrunk Structured Fit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
                  <span>{product.care || "Machine Wash Cold"}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Product Description */}
            <p className="font-sans text-xs text-[#B8B6B0] font-light leading-relaxed">
              {product.description || "Designed with custom heavyweight textiles, hand-finished detailing, and a structured European relaxed fit."}
            </p>

            {/* Dynamic Color Swatches Selector */}
            {productColors.length > 0 && (
              <div>
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#B8B6B0] font-medium block mb-2.5">
                  Color: <span className="text-[#F7F5F2] font-bold">{selectedColor?.name || productColors[0].name}</span>
                </span>
                <div className="flex items-center gap-3">
                  {productColors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      aria-label={`Select color ${c.name}`}
                      style={{ backgroundColor: c.hex || "#111111" }}
                      className={`w-8 h-8 rounded-full border transition-all duration-300 cursor-pointer ${
                        selectedColor?.name === c.name
                          ? "border-[#C9A86A] scale-110 ring-2 ring-[#C9A86A]/50 shadow-md"
                          : "border-[#2A2A2A] hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Size Selector */}
            <div>
              <div className="flex justify-between items-center font-sans text-[11px] uppercase tracking-[0.2em] text-[#B8B6B0] mb-2.5">
                <span className="font-bold text-[#F7F5F2]">Select Size</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFindMySize(true)}
                    className="text-[#C9A86A] hover:underline cursor-pointer font-bold flex items-center gap-1"
                  >
                    <Sliders className="w-3.5 h-3.5" /> Find My Size
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[#B8B6B0] hover:text-[#F7F5F2] hover:underline cursor-pointer font-medium"
                  >
                    Size Guide
                  </button>
                </div>
              </div>

              {/* Dynamic Size Buttons */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      setSelectedSize(sz);
                      setSizeError(false);
                    }}
                    className={`h-[44px] border font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-xl cursor-pointer flex items-center justify-center ${
                      selectedSize === sz
                        ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A] shadow-lg ring-2 ring-[#C9A86A]/40 scale-[1.02]"
                        : "bg-[#111111] text-[#F7F5F2] border-[#2A2A2A] hover:border-[#C9A86A] hover:text-[#C9A86A]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {sizeError && (
                <p className="mt-2 font-sans text-xs text-[#D86A32] font-semibold animate-pulse flex items-center gap-1">
                  * Please select a size before adding to bag.
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#B8B6B0] font-semibold">Quantity:</span>
              <div className="flex items-center border border-[#2A2A2A] bg-[#111111] h-10 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-full flex items-center justify-center text-[#B8B6B0] hover:text-[#C9A86A] transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-sans text-xs font-bold text-[#F7F5F2] price-display">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-full flex items-center justify-center text-[#B8B6B0] hover:text-[#C9A86A] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTAs: ADD TO CART & BUY NOW */}
            <div className="space-y-3 pt-2" ref={buyButtonRef}>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Primary ADD TO CART */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 h-[52px] rounded-xl bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold shadow-xl active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Bag!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> ADD TO CART — {formatPrice(product.price * quantity)}
                    </>
                  )}
                </button>

                {/* Secondary BUY NOW */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full sm:flex-1 h-[52px] rounded-xl bg-[#15181D] border border-[#C9A86A]/50 hover:bg-[#C9A86A]/10 hover:border-[#C9A86A] text-[#F7F5F2] font-sans text-xs uppercase tracking-widest font-bold active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* WhatsApp Enquiry & Wishlist / Share Toolbar */}
              <div className="flex items-center justify-between gap-3 pt-1 text-xs font-sans text-[#B8B6B0]">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#C9A86A] hover:underline cursor-pointer font-semibold"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Concierge Enquiry</span>
                </a>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-[#C9A86A] transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? "Link Copied!" : "Share Garment"}</span>
                </button>
              </div>
            </div>

            {/* FOUR ELEGANT TRUST ITEMS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-[#2A2A2A] text-[10px] font-sans uppercase tracking-wider text-[#B8B6B0] text-center">
              <div className="p-3 bg-[#111111] rounded-xl border border-[#2A2A2A] flex flex-col items-center justify-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C9A86A]" />
                <span className="font-bold text-[#F7F5F2]">Free Shipping</span>
              </div>
              <div className="p-3 bg-[#111111] rounded-xl border border-[#2A2A2A] flex flex-col items-center justify-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-[#C9A86A]" />
                <span className="font-bold text-[#F7F5F2]">Easy Exchange</span>
              </div>
              <div className="p-3 bg-[#111111] rounded-xl border border-[#2A2A2A] flex flex-col items-center justify-center gap-1.5">
                <Lock className="w-4 h-4 text-[#C9A86A]" />
                <span className="font-bold text-[#F7F5F2]">Secure Checkout</span>
              </div>
              <div className="p-3 bg-[#111111] rounded-xl border border-[#2A2A2A] flex flex-col items-center justify-center gap-1.5">
                <Gift className="w-4 h-4 text-[#C9A86A]" />
                <span className="font-bold text-[#F7F5F2]">Premium Packaging</span>
              </div>
            </div>

            {/* Pincode & Delivery Checker Card */}
            <div className="p-4 sm:p-5 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-3">
              <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-wider text-[#C9A86A] font-bold">
                <Truck className="w-4 h-4" />
                <span>Delivery & Dispatch Calculator</span>
              </div>

              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B6B0]" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] rounded-lg pl-9 pr-3 py-2 text-xs font-sans text-[#F7F5F2] placeholder-[#B8B6B0]/50 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#C9A86A] text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>

              {deliveryResult && (
                <div
                  className={`p-2.5 rounded-md text-xs font-sans ${
                    deliveryResult.success
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-950/60 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {deliveryResult.msg}
                </div>
              )}
            </div>

            {/* PRODUCT ACCORDIONS */}
            <ProductAccordions product={product} />

          </div>
        </div>
      </Container>

      {/* OUTFIT BUILDER */}
      <OutfitBuilder currentProduct={product} />

      {/* DEDICATED CUSTOMER REVIEWS SECTION */}
      <div id="reviews">
        <Container className="max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <ReviewSection productName={product.name} />
        </Container>
      </div>

      {/* ── 1. COMPLETE THE LOOK ── */}
      {completeTheLook.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#0E1013] border-t border-[#C9A86A]/15">
          <Container className="max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mb-8">
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C9A86A] font-bold block mb-1">
                COORDINATED STYLING
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F7F5F2]">
                Complete The Look
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {completeTheLook.map((lookItem) => (
                <RecommendationCard key={lookItem.id || lookItem._id || lookItem.slug} product={lookItem} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── 2. YOU MAY ALSO LIKE ── */}
      {related.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#14171C] border-t border-b border-[#C9A86A]/15">
          <Container className="max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C9A86A] font-bold block mb-1">
                  CURATED SELECTION
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F7F5F2]">
                  You May Also Like
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (relatedSliderRef.current)
                      relatedSliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
                  }}
                  aria-label="Scroll left"
                  className="w-10 h-10 rounded-full border border-[#C9A86A]/30 flex items-center justify-center text-[#B8B6B0] hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (relatedSliderRef.current)
                      relatedSliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
                  }}
                  aria-label="Scroll right"
                  className="w-10 h-10 rounded-full border border-[#C9A86A]/30 flex items-center justify-center text-[#B8B6B0] hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              ref={relatedSliderRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 snap-x"
            >
              {related.map((relItem) => (
                <div key={relItem.id || relItem._id || relItem.slug} className="w-[220px] sm:w-[260px] shrink-0 snap-start">
                  <RecommendationCard product={relItem} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── 3. RECENTLY VIEWED ── */}
      {recentlyViewed.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#0E1013] border-b border-[#C9A86A]/15">
          <Container className="max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C9A86A] font-bold block mb-1">
                  BROWSING HISTORY
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F7F5F2]">
                  Recently Viewed
                </h2>
              </div>
            </div>

            <div
              ref={viewedSliderRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 snap-x"
            >
              {recentlyViewed.slice(0, 12).map((viewedItem) => (
                <div key={viewedItem.id || viewedItem._id || viewedItem.slug} className="w-[200px] sm:w-[240px] shrink-0 snap-start">
                  <RecommendationCard product={viewedItem} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* STICKY MOBILE ADD TO CART BAR */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-[120] md:hidden bg-[#0B0B0B]/95 border-t border-[#2A2A2A] p-3 backdrop-blur-xl flex items-center justify-between gap-3 shadow-2xl"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-12 relative rounded overflow-hidden border border-[#2A2A2A] shrink-0">
                <img
                  src={mediaList[0]?.src || "/images/lookbook/gor-lookbook-1.webp"}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-xs font-normal text-[#F7F5F2] truncate">{product.name}</p>
                <p className="font-sans text-xs font-bold text-[#C9A86A] price-display">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="h-[44px] px-5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-wider font-bold rounded-xl active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" /> {addedSuccess ? "Added!" : "ADD TO CART"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <FindMySizeModal
        isOpen={showFindMySize}
        onClose={() => setShowFindMySize(false)}
        onSelectSize={(sz) => {
          setSelectedSize(sz);
          setSizeError(false);
        }}
      />

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />

    </div>
  );
}

export default function ProductDetailPage({ params }) {
  const { id } = use(params);

  return (
    <>
      <NoiseOverlay />
      <Navbar />
      <Suspense fallback={<ProductSkeleton count={1} />}>
        <ProductDetailContent idParam={id} />
      </Suspense>
      <CartDrawer />
      <Footer />
    </>
  );
}
