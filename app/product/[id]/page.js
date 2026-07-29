"use client";

import { useState, useEffect, use, useMemo, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Plus,
  Minus,
  Check,
  ArrowRight,
  X,
  MapPin,
  Maximize2,
  Share2,
  Lock,
  Award,
  Ruler,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Play,
  VolumeX,
  HelpCircle,
  ThumbsUp,
  Filter,
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
import SocialProofBadge from "@/components/reviews/SocialProofBadge";
import ReviewSection from "@/components/reviews/ReviewSection";
import { addRecentlyViewed } from "@/lib/recentlyViewed";
import { trackViewItem } from "@/lib/analytics";
import { productService } from "@/lib/productService";


// WhatsApp Icon helper component
function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.834 11.834 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.237-6.165-3.483-8.411" />
    </svg>
  );
}

// Sample Reviews Data (Social Proof)
const SAMPLE_REVIEWS = [
  {
    id: "r1",
    author: "Marcus V.",
    rating: 5,
    date: "July 14, 2026",
    title: "Unmatched Silhouette & Heavyweight Feel",
    comment: "The drape on this garment is incredible. The fabric GSM feels extremely solid without being too stiff. Fits exactly as described on the size guide.",
    verified: true,
    hasPhoto: true,
    fit: "True to size",
    photoUrl: "/images/lookbook/image copy 2.png",
  },
  {
    id: "r2",
    author: "Devon K.",
    rating: 5,
    date: "July 02, 2026",
    title: "Modern Premium Retail Quality",
    comment: "Stitching and custom hardware details are pristine. Easily matches high-end European labels. Delivery was swift and discreetly packaged.",
    verified: true,
    hasPhoto: true,
    fit: "Slightly relaxed",
    photoUrl: "/images/lookbook/gor-lookbook-2.webp",
  },
  {
    id: "r3",
    author: "Siddharth R.",
    rating: 4,
    date: "June 28, 2026",
    title: "Exceptional Fabric & Deep Color",
    comment: "Deep rich tone that looks even better in natural lighting. High quality finish. Highly recommend following the wash instructions.",
    verified: true,
    hasPhoto: false,
    fit: "True to size",
    photoUrl: null,
  },
];

// Sample Coordinated Look Outfit Items
const SAMPLE_OUTFIT_ITEMS = [
  {
    id: "gor-codset-1",
    name: "GOR Heavyweight Oversized Tee",
    price: 180,
    category: "Streetwear",
    image: "/images/products/gor-codset-burgundy-alo.webp",
  },
  {
    id: "gor-trouser-1",
    name: "GOR Relaxed Pleated Trousers",
    price: 240,
    category: "Bottoms",
    image: "/images/products/gor-codset-beige-prada.webp",
  },
  {
    id: "gor-acc-1",
    name: "GOR Signature Leather Belt",
    price: 95,
    category: "Accessories",
    image: "/images/products/gor-codset-burgundy-alo.webp",
  },
];

function ProductDetailContent({ idParam }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [mediaList, setMediaList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Form selection state
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [wishlistBurst, setWishlistBurst] = useState(false);

  // Modals state
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showFindMySize, setShowFindMySize] = useState(false);
  const [unitCm, setUnitCm] = useState(false); // Size guide inches/cm toggle

  // Find My Size form state
  const [userHeight, setUserHeight] = useState(178); // cm
  const [userWeight, setUserWeight] = useState(74); // kg
  const [userFitPreference, setUserFitPreference] = useState("relaxed"); // slim, regular, relaxed
  const [recommendedSizeResult, setRecommendedSizeResult] = useState(null);

  // Delivery & Pincode state
  const [pincode, setPincode] = useState("");
  const [deliveryResult, setDeliveryResult] = useState(null);

  // Accordion state (Strictly single tab open at a time)
  const [openAccordion, setOpenAccordion] = useState("description");
  const [copiedLink, setCopiedLink] = useState(false);

  // Reviews Filter State
  const [reviewFilter, setReviewFilter] = useState("all");

  // Sticky Buy Bar scroll trigger state
  const [showStickyBar, setShowStickyBar] = useState(false);
  const buyButtonRef = useRef(null);

  // Scroll Carousels refs
  const relatedSliderRef = useRef(null);
  const viewedSliderRef = useRef(null);

  // Fetch Product details
  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      try {
        let currentProd = null;
        let relatedItems = [];

        // 1. Try relative API route (/api/products/[id])
        try {
          const res = await fetch(`/api/products/${encodeURIComponent(idParam)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.product) {
              currentProd = data.product;
              relatedItems = data.related || [];
            }
          }
        } catch (e) {
          console.warn("Relative API fetch warning:", e);
        }

        // 2. Direct fallback to productService if API fetch failed
        if (!currentProd) {
          currentProd = await productService.getProduct(idParam);
        }

        if (currentProd) {
          setProduct(currentProd);

          // Build mixed media gallery list
          const rawImgs = currentProd.images?.length > 0
            ? currentProd.images
            : [currentProd.imageUrl || currentProd.img1 || currentProd.image || "/images/products/gor-codset-burgundy-alo.webp"];
          
          const formattedMedia = rawImgs.map((src, idx) => ({
            type: src.endsWith(".mp4") || src.endsWith(".webm") ? "video" : "image",
            src,
            label: idx === 0 ? "Main Look" : idx === 1 ? "Craftsmanship & Stitching" : idx === 2 ? "Fabric Texture Close-Up" : "Detail View",
          }));

          setMediaList(formattedMedia);
          setSelectedIndex(0);
          setSelectedColor(currentProd.colors?.[0] || { name: "Obsidian Black", hex: "#141414" });
          setRelated(relatedItems);

          // Save to & read from localStorage recently viewed
          try {
            const stored = JSON.parse(localStorage.getItem("gor_recently_viewed") || "[]");
            const filtered = stored.filter((item) => (item.id || item.slug) !== (currentProd.id || currentProd.slug));
            const updated = [currentProd, ...filtered].slice(0, 6);
            localStorage.setItem("gor_recently_viewed", JSON.stringify(updated));
            setRecentlyViewed(filtered.slice(0, 4));
          } catch (e) {
            // Safe fallback
          }
        }
      } catch (err) {
        console.error("Failed to fetch product details", err);
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

  // Keyboard navigation for Fullscreen Lightbox
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
      }
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, mediaList.length]);

  // Touch Swipe Handlers for Mobile Gallery
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe && selectedIndex < mediaList.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    }
    if (isRightSwipe && selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse move handler for Desktop Hover Zoom
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  // Wishlist toggle with burst micro-interaction
  const handleWishlistToggle = () => {
    if (!product) return;
    toggleWishlist(product.id || product._id);
    setWishlistBurst(true);
    setTimeout(() => setWishlistBurst(false), 600);
  };

  // Add to Cart / Order Now handler
  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, quantity, selectedSize, selectedColor?.name || selectedColor);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  // Share action
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on GOR Menswear`,
        url: window.location.href,
      }).catch(() => {});
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

  // Client-side "Find My Size" Calculator Logic
  const calculateRecommendedSize = () => {
    const height = Number(userHeight);
    const weight = Number(userWeight);

    let size = "M";
    if (weight < 60) size = "S";
    else if (weight < 72) size = "M";
    else if (weight < 84) size = "L";
    else if (weight < 95) size = "XL";
    else size = "XXL";

    if (userFitPreference === "slim" && size !== "XS") {
      if (size === "M") size = "S";
      else if (size === "L") size = "M";
      else if (size === "XL") size = "L";
    } else if (userFitPreference === "relaxed" && size !== "XXL") {
      if (size === "M") size = "L";
      else if (size === "L") size = "XL";
    }

    setRecommendedSizeResult({
      size,
      confidence: "94%",
      note: `Based on height ${height}cm, weight ${weight}kg and ${userFitPreference} fit preference.`,
    });
    setSelectedSize(size);
    setSizeError(false);
  };

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    if (reviewFilter === "5star") return SAMPLE_REVIEWS.filter((r) => r.rating === 5);
    if (reviewFilter === "4star") return SAMPLE_REVIEWS.filter((r) => r.rating === 4);
    if (reviewFilter === "photos") return SAMPLE_REVIEWS.filter((r) => r.hasPhoto);
    if (reviewFilter === "verified") return SAMPLE_REVIEWS.filter((r) => r.verified);
    return SAMPLE_REVIEWS;
  }, [reviewFilter]);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909] pt-28 pb-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            <div className="lg:col-span-7 aspect-[3/4] bg-[#151515] rounded-[14px] animate-pulse" />
            <div className="lg:col-span-5 space-y-6">
              <div className="h-6 w-1/3 bg-[#151515] rounded animate-pulse" />
              <div className="h-10 w-4/5 bg-[#151515] rounded animate-pulse" />
              <div className="h-8 w-2/5 bg-[#151515] rounded animate-pulse" />
              <div className="h-24 w-full bg-[#151515] rounded animate-pulse" />
              <div className="h-12 w-full bg-[#151515] rounded animate-pulse" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Garment Not Found state
  if (!product) {
    return (
      <div className="min-h-screen bg-[#090909] pt-32 text-center text-[#F8F6F3] flex flex-col items-center justify-center">
        <h2 className="font-editorial text-3xl font-normal">Garment Not Found</h2>
        <p className="font-sans text-xs text-[#8E8A85] mt-2">The requested item does not exist in the GOR catalog.</p>
        <Link href="/shop" className="mt-6 px-7 py-3 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-[0.2em] font-semibold rounded-[8px]">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id || product._id);
  const currentMedia = mediaList[selectedIndex] || { type: "image", src: "/images/products/gor-codset-burgundy-alo.webp", label: "Main Look" };
  const availableSizes = product.sizes?.length > 0 ? product.sizes : ["XS", "S", "M", "L", "XL", "XXL"];
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const whatsappMsg = `Hi GOR Menswear,\n\nI am interested in ordering:\n*${product.name}*\nSize: ${selectedSize || "Not selected"}\nPrice: ${formatPrice(product.price)}\n\nPlease confirm availability and payment options.`;
  const whatsappUrl = `https://wa.me/918691921913?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="min-h-screen bg-[#090909] text-[#F8F6F3] flex flex-col pt-20 sm:pt-24 select-none">
      
      {/* ── Breadcrumb Navigation ── */}
      <div className="border-b border-[#2A2A2A] py-3 bg-[#090909]">
        <Container>
          <nav aria-label="Breadcrumb" className="font-sans text-[11px] text-[#8E8A85] uppercase tracking-[0.2em] flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#C8A45D] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#C8A45D] transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-[#C8A45D] transition-colors">{product.category || "Collections"}</Link>
            <span>/</span>
            <span className="text-[#C8A45D] font-medium truncate">{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* ── Main Showcase Grid (60% Gallery / 40% Product Details & Action Panel) ── */}
      <Container className="py-8 sm:py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* 1. LEFT COLUMN (60%): MIXED MEDIA GALLERY WITH ZOOM & GESTURES */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6">
            
            {/* Gallery Thumbnail Rail */}
            {mediaList.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[660px] scrollbar-none pb-2 sm:pb-0 shrink-0">
                {mediaList.map((mediaItem, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(idx);
                      setIsZoomed(false);
                    }}
                    aria-label={`View ${mediaItem.label || `Gallery image ${idx + 1}`}`}
                    className={`relative w-16 sm:w-20 aspect-[3/4] rounded-[8px] border transition-all duration-300 overflow-hidden shrink-0 cursor-pointer ${
                      selectedIndex === idx
                        ? "border-[#C8A45D] scale-105 opacity-100 shadow-md ring-2 ring-[#C8A45D]/40"
                        : "border-[#2A2A2A] opacity-60 hover:opacity-100 hover:border-white/40"
                    }`}
                  >
                    {mediaItem.type === "video" ? (
                      <div className="w-full h-full bg-[#151515] flex items-center justify-center text-[#C8A45D] relative">
                        <Play className="w-5 h-5 fill-[#C8A45D]" />
                        <span className="absolute bottom-1 right-1 font-sans text-[8px] bg-black/80 px-1 rounded text-white">VID</span>
                      </div>
                    ) : (
                      <img src={mediaItem.src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-top" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main Interactive Stage Box */}
            <div
              className="relative aspect-[3/4] w-full bg-[#151515] border border-[#2A2A2A] rounded-[14px] overflow-hidden group flex-1"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onDoubleClick={() => setIsFullscreen(true)}
            >
              {/* Media Content Stage */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.8 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full relative"
                >
                  {currentMedia.type === "video" ? (
                    <video
                      src={currentMedia.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full overflow-hidden cursor-zoom-in relative">
                      <img
                        src={currentMedia.src}
                        alt={product.name}
                        style={{
                          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                        }}
                        className={`w-full h-full object-cover object-top filter brightness-[0.97] contrast-[1.04] transition-transform duration-300 ease-out ${
                          isZoomed ? "scale-150 sm:scale-175" : "scale-100"
                        }`}
                        onClick={() => setIsFullscreen(true)}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Counter Badge (1/N) */}
              <div className="absolute top-4 left-4 z-10 font-sans text-[10px] font-bold uppercase tracking-widest bg-[#090909]/90 text-[#F8F6F3] px-3 py-1.5 rounded-[6px] border border-[#2A2A2A] backdrop-blur-md">
                {selectedIndex + 1} / {mediaList.length}
              </div>

              {/* Dynamic Badge (NEW, BESTSELLER, LIMITED EDITION, LOW STOCK, EXCLUSIVE) */}
              {(product.badge || product.stockStatus === "low") && (
                <div className="absolute top-4 right-16 z-10 font-sans text-[9px] uppercase tracking-[0.2em] font-extrabold bg-[#D86A32]/95 text-[#F8F6F3] px-3 py-1.5 border border-[#D86A32]/50 rounded-[6px] backdrop-blur-md">
                  {product.badge || "LIMITED EDITION"}
                </div>
              )}

              {/* Fullscreen Trigger */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                aria-label="Open Fullscreen Lightbox"
                className="absolute bottom-4 right-4 z-10 p-2.5 rounded-full bg-[#090909]/85 border border-[#2A2A2A] text-[#F8F6F3] hover:text-[#C8A45D] transition-colors backdrop-blur-md cursor-pointer flex items-center justify-center shadow-lg"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Wishlist Burst Button */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                aria-label="Add to Wishlist"
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#090909]/85 border border-[#2A2A2A] flex items-center justify-center text-[#F8F6F3] hover:text-[#C8A45D] active:scale-95 transition-all duration-200 backdrop-blur-md cursor-pointer ${
                  wishlistBurst ? "scale-125 ring-4 ring-[#C8A45D]/30" : ""
                }`}
              >
                <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-[#C8A45D] text-[#C8A45D]" : ""}`} />
              </button>

              {/* Craftsmanship / Detail Tag overlay */}
              {currentMedia.label && (
                <div className="absolute bottom-4 left-4 z-10 font-sans text-[10px] uppercase tracking-wider text-[#C8A45D] bg-[#090909]/90 px-3 py-1 rounded-full border border-[#C8A45D]/30 backdrop-blur-md hidden sm:block">
                  {currentMedia.label}
                </div>
              )}
            </div>
          </div>

          {/* 2. RIGHT COLUMN (40%): DETAILS, SELECTION & CTAs */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Category & Stock Indicator */}
            <div>
              <div className="flex items-center justify-between font-sans text-[11px] text-[#C8A45D] uppercase tracking-[0.25em] font-semibold mb-1">
                <span>{product.category || "SIGNATURE COLLECTION"}</span>
                <span className="text-emerald-400 font-sans text-[10px] bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/30 font-semibold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> IN STOCK & READY TO SHIP
                </span>
              </div>

              {/* Garment Title */}
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F8F6F3] leading-[1.08]">
                {product.name}
              </h1>

              {/* Rating & Social Proof */}
              <div className="mt-2.5 flex items-center gap-2 font-sans text-xs text-[#8E8A85]">
                <div className="flex items-center text-[#C8A45D]" aria-label="5 out of 5 stars">
                  <Star className="w-3.5 h-3.5 fill-[#C8A45D]" />
                  <Star className="w-3.5 h-3.5 fill-[#C8A45D]" />
                  <Star className="w-3.5 h-3.5 fill-[#C8A45D]" />
                  <Star className="w-3.5 h-3.5 fill-[#C8A45D]" />
                  <Star className="w-3.5 h-3.5 fill-[#C8A45D]" />
                </div>
                <span className="font-semibold text-[#F8F6F3]">4.9</span>
                <span>•</span>
                <a href="#reviews" className="hover:text-[#C8A45D] hover:underline cursor-pointer">
                  48 Verified Reviews
                </a>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-center gap-3 pt-1 border-t border-[#2A2A2A] pt-4">
              <span className="font-sans text-2xl font-bold text-[#F8F6F3] price-display">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-base text-[#8E8A85] line-through price-display">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discountPercent && (
                <span className="font-sans text-[10px] bg-[#D86A32]/15 text-[#D86A32] border border-[#D86A32]/30 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            {/* Color Selector */}
            <div>
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#8E8A85] font-medium block mb-2.5">
                Color: <span className="text-[#F8F6F3] font-semibold">{selectedColor?.name || "Obsidian Black"}</span>
              </span>
              <div className="flex items-center gap-3">
                {[
                  { name: "Obsidian Black", hex: "#141414" },
                  { name: "Champagne Gold", hex: "#C8A45D" },
                  { name: "Midnight Navy", hex: "#315DA8" },
                  { name: "Charcoal Slate", hex: "#3A3A3A" },
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    aria-label={`Select color ${c.name}`}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full border transition-all duration-300 cursor-pointer ${
                      selectedColor?.name === c.name
                        ? "border-[#C8A45D] scale-110 ring-2 ring-[#C8A45D]/50 shadow-md"
                        : "border-[#2A2A2A] hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector with "Find My Size" Trigger */}
            <div>
              <div className="flex justify-between items-center font-sans text-[11px] uppercase tracking-[0.2em] text-[#8E8A85] mb-2.5">
                <span className="font-semibold text-[#F8F6F3]">Select Size</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFindMySize(true)}
                    className="text-[#C8A45D] hover:underline cursor-pointer font-semibold flex items-center gap-1"
                  >
                    <Sliders className="w-3.5 h-3.5" /> Find My Size
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[#8E8A85] hover:text-[#F8F6F3] hover:underline cursor-pointer font-medium"
                  >
                    Size Guide
                  </button>
                </div>
              </div>

              {/* Chips Grid */}
              <div className="grid grid-cols-6 gap-2">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      setSelectedSize(sz);
                      setSizeError(false);
                    }}
                    className={`h-[44px] border font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-[10px] cursor-pointer flex items-center justify-center ${
                      selectedSize === sz
                        ? "bg-[#C8A45D] text-[#090909] border-[#C8A45D] shadow-lg ring-2 ring-[#C8A45D]/40"
                        : "bg-[#151515] text-[#F8F6F3] border-[#2A2A2A] hover:border-[#C8A45D] hover:text-[#C8A45D]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Error highlight if no size selected */}
              {sizeError && (
                <p className="mt-2 font-sans text-xs text-[#D86A32] font-medium animate-pulse flex items-center gap-1">
                  * Please select a size to proceed with your order.
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#8E8A85] font-semibold">Quantity:</span>
              <div className="flex items-center border border-[#2A2A2A] bg-[#151515] h-10 rounded-[8px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-full flex items-center justify-center text-[#8E8A85] hover:text-[#C8A45D] transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-sans text-xs font-bold text-[#F8F6F3] price-display">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-full flex items-center justify-center text-[#8E8A85] hover:text-[#C8A45D] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action CTAs (Order Now & WhatsApp) + Wishlist / Share */}
            <div className="space-y-3 pt-2" ref={buyButtonRef}>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Order Now CTA */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 h-[50px] rounded-[12px] bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold shadow-lg active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Order Now — {formatPrice(product.price * quantity)}
                    </>
                  )}
                </button>

                {/* WhatsApp Order Enquiry */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 h-[50px] rounded-[12px] bg-transparent border border-[#C8A45D]/50 text-[#F8F6F3] hover:bg-[#25D366]/10 hover:border-[#25D366] hover:text-[#25D366] font-sans text-xs uppercase tracking-wider font-semibold active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer group/wa"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#C8A45D] group-hover/wa:text-[#25D366] transition-colors" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>

              {/* Wishlist & Share Toolbar */}
              <div className="flex items-center justify-between gap-3 pt-1 text-xs font-sans text-[#8E8A85]">
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className="flex items-center gap-1.5 hover:text-[#C8A45D] transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#C8A45D] text-[#C8A45D]" : ""}`} />
                  <span>{isWishlisted ? "Saved in Wishlist" : "Add to Wishlist"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-[#C8A45D] transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? "Link Copied!" : "Share Garment"}</span>
                </button>
              </div>
            </div>

            {/* TRUST STRIP (Minimalist Icons) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#2A2A2A] text-[10px] font-sans uppercase tracking-wider text-[#8E8A85] text-center">
              <div className="p-2 bg-[#151515] rounded-[8px] border border-[#2A2A2A] flex flex-col items-center justify-center gap-1">
                <Award className="w-4 h-4 text-[#C8A45D]" />
                <span>100% Original</span>
              </div>
              <div className="p-2 bg-[#151515] rounded-[8px] border border-[#2A2A2A] flex flex-col items-center justify-center gap-1">
                <Lock className="w-4 h-4 text-[#C8A45D]" />
                <span>Secure Checkout</span>
              </div>
              <div className="p-2 bg-[#151515] rounded-[8px] border border-[#2A2A2A] flex flex-col items-center justify-center gap-1">
                <RotateCcw className="w-4 h-4 text-[#C8A45D]" />
                <span>Easy Returns</span>
              </div>
              <div className="p-2 bg-[#151515] rounded-[8px] border border-[#2A2A2A] flex flex-col items-center justify-center gap-1">
                <Truck className="w-4 h-4 text-[#C8A45D]" />
                <span>Fast Shipping</span>
              </div>
            </div>

            {/* HONEST DELIVERY CARD (Pincode & Shipping Options) */}
            <div className="p-4 sm:p-5 bg-[#151515] border border-[#2A2A2A] rounded-[12px] space-y-4">
              <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-wider text-[#C8A45D] font-semibold">
                <Truck className="w-4 h-4" />
                <span>Delivery & Logistics</span>
              </div>

              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] pl-9 pr-3 py-2 text-xs font-sans text-[#F8F6F3] placeholder-[#8E8A85]/60 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#C8A45D] text-xs font-sans font-semibold uppercase tracking-wider rounded-[8px] transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>

              {deliveryResult && (
                <div className={`p-2.5 rounded-[6px] text-xs font-sans ${deliveryResult.success ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30" : "bg-rose-950/60 text-rose-300 border border-rose-500/30"}`}>
                  {deliveryResult.msg}
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-[#2A2A2A] font-sans text-xs text-[#8E8A85]">
                <div className="flex justify-between items-center">
                  <span>• Standard Shipping</span>
                  <span className="text-[#F8F6F3] font-medium">3–5 Business Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>• Express Air Shipping</span>
                  <span className="text-[#C8A45D] font-semibold">1–2 Business Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>• 7-Day Exchange Guarantee</span>
                  <span className="text-[#F8F6F3]">Hassle-Free Pickup</span>
                </div>
              </div>
            </div>

            {/* EXCLUSIVE ACCORDION SECTIONS (Only One Open at a Time) */}
            <div className="border border-[#2A2A2A] rounded-[12px] divide-y divide-[#2A2A2A] bg-[#151515] overflow-hidden">
              
              {/* Description */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === "description" ? "" : "description")}
                  aria-expanded={openAccordion === "description"}
                  className="w-full p-4 flex items-center justify-between font-sans text-xs uppercase tracking-wider font-semibold text-[#F8F6F3] hover:text-[#C8A45D] transition-colors cursor-pointer"
                >
                  <span>Description</span>
                  <ChevronDown className={`w-4 h-4 text-[#C8A45D] transition-transform duration-300 ${openAccordion === "description" ? "rotate-180" : ""}`} />
                </button>
                {openAccordion === "description" && (
                  <div className="p-4 pt-0 font-sans text-xs text-[#8E8A85] font-light leading-relaxed space-y-2 border-t border-[#2A2A2A]/40">
                    <p>• {product.description || "Designed with premium cotton blends, custom hardware accents, and a modern relaxed fit."}</p>
                    <p>• Engineered for structured drape and high breathability.</p>
                    <p>• Signature GOR logo emblem and precision stitching throughout.</p>
                  </div>
                )}
              </div>

              {/* Material & Fabric */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === "material" ? "" : "material")}
                  aria-expanded={openAccordion === "material"}
                  className="w-full p-4 flex items-center justify-between font-sans text-xs uppercase tracking-wider font-semibold text-[#F8F6F3] hover:text-[#C8A45D] transition-colors cursor-pointer"
                >
                  <span>Material & Fabric</span>
                  <ChevronDown className={`w-4 h-4 text-[#C8A45D] transition-transform duration-300 ${openAccordion === "material" ? "rotate-180" : ""}`} />
                </button>
                {openAccordion === "material" && (
                  <div className="p-4 pt-0 font-sans text-xs text-[#8E8A85] font-light leading-relaxed space-y-2 border-t border-[#2A2A2A]/40">
                    <p>• {product.fabric || "100% Heavyweight Organic Cotton Fleece (380 GSM)."}</p>
                    <p>• Pre-shrunk weave to prevent shrinkage after home laundering.</p>
                    <p>• Soft brushed interior for max skin-touch comfort.</p>
                  </div>
                )}
              </div>

              {/* Wash Care */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === "wash" ? "" : "wash")}
                  aria-expanded={openAccordion === "wash"}
                  className="w-full p-4 flex items-center justify-between font-sans text-xs uppercase tracking-wider font-semibold text-[#F8F6F3] hover:text-[#C8A45D] transition-colors cursor-pointer"
                >
                  <span>Wash Care</span>
                  <ChevronDown className={`w-4 h-4 text-[#C8A45D] transition-transform duration-300 ${openAccordion === "wash" ? "rotate-180" : ""}`} />
                </button>
                {openAccordion === "wash" && (
                  <div className="p-4 pt-0 font-sans text-xs text-[#8E8A85] font-light leading-relaxed space-y-2 border-t border-[#2A2A2A]/40">
                    <p>• {product.care || "Machine wash cold inside out with like dark colors."}</p>
                    <p>• Do not bleach. Line dry in shade.</p>
                    <p>• Cool iron on reverse side avoiding print/embroidery.</p>
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === "shipping" ? "" : "shipping")}
                  aria-expanded={openAccordion === "shipping"}
                  className="w-full p-4 flex items-center justify-between font-sans text-xs uppercase tracking-wider font-semibold text-[#F8F6F3] hover:text-[#C8A45D] transition-colors cursor-pointer"
                >
                  <span>Shipping</span>
                  <ChevronDown className={`w-4 h-4 text-[#C8A45D] transition-transform duration-300 ${openAccordion === "shipping" ? "rotate-180" : ""}`} />
                </button>
                {openAccordion === "shipping" && (
                  <div className="p-4 pt-0 font-sans text-xs text-[#8E8A85] font-light leading-relaxed space-y-2 border-t border-[#2A2A2A]/40">
                    <p>• Free express dispatch within 24 hours of order placement.</p>
                    <p>• Real-time SMS & email tracking dispatch notifications.</p>
                    <p>• Tamper-proof, recyclable luxury packaging.</p>
                  </div>
                )}
              </div>

              {/* Returns & Exchange */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === "returns" ? "" : "returns")}
                  aria-expanded={openAccordion === "returns"}
                  className="w-full p-4 flex items-center justify-between font-sans text-xs uppercase tracking-wider font-semibold text-[#F8F6F3] hover:text-[#C8A45D] transition-colors cursor-pointer"
                >
                  <span>Returns & Exchange</span>
                  <ChevronDown className={`w-4 h-4 text-[#C8A45D] transition-transform duration-300 ${openAccordion === "returns" ? "rotate-180" : ""}`} />
                </button>
                {openAccordion === "returns" && (
                  <div className="p-4 pt-0 font-sans text-xs text-[#8E8A85] font-light leading-relaxed space-y-2 border-t border-[#2A2A2A]/40">
                    <p>• 7-day hassle-free exchange for size or color swaps.</p>
                    <p>• Doorstep pickup arranged at no extra cost.</p>
                    <p>• Items must be unworn with original tags attached.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </Container>

      {/* ── COMPLETE THE LOOK (COORDINATED OUTFITS) ── */}
      <section className="py-14 sm:py-20 bg-[#121212] border-t border-b border-[#2A2A2A]">
        <Container>
          <div className="mb-8 flex justify-between items-end">
            <div>
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C8A45D] font-semibold block mb-1">
                COORDINATED OUTFIT
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                Complete The Look
              </h2>
            </div>
            <span className="font-sans text-xs text-[#8E8A85] hidden sm:block">
              Pair with curated GOR Menswear essentials
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_OUTFIT_ITEMS.map((item, idx) => (
              <div key={item.id + idx} className="bg-[#151515] border border-[#2A2A2A] rounded-[12px] p-4 flex gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover object-top rounded-[8px] border border-[#2A2A2A]" />
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="font-sans text-[9px] uppercase tracking-widest text-[#C8A45D] font-semibold">{item.category}</span>
                  <h4 className="font-editorial text-base text-[#F8F6F3] truncate">{item.name}</h4>
                  <p className="font-sans text-xs font-bold text-[#F8F6F3]">{formatPrice(item.price)}</p>
                  <button
                    type="button"
                    onClick={() => addToCart(item, 1, "M")}
                    className="mt-2 text-[10px] uppercase font-sans tracking-wider text-[#C8A45D] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── REVIEWS & SOCIAL PROOF ── */}
      <Container>
        <ReviewSection productName={product.name} />
      </Container>


      {/* ── YOU MAY ALSO LIKE (RECOMMENDATIONS SLIDER) ── */}
      {related.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#151515] border-b border-[#2A2A2A]">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C8A45D] font-semibold block mb-1">
                  CURATED SELECTION
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                  You May Also Like
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (relatedSliderRef.current) relatedSliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
                  }}
                  aria-label="Scroll left"
                  className="w-9 h-9 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#8E8A85] hover:text-[#C8A45D] hover:border-[#C8A45D] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (relatedSliderRef.current) relatedSliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
                  }}
                  aria-label="Scroll right"
                  className="w-9 h-9 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#8E8A85] hover:text-[#C8A45D] hover:border-[#C8A45D] transition-colors"
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
                <div key={relItem.id || relItem._id} className="w-[240px] sm:w-[280px] shrink-0 snap-start">
                  <ProductCard product={relItem} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── RECENTLY VIEWED SLIDER ── */}
      {recentlyViewed.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#090909] border-b border-[#2A2A2A]">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#315DA8] font-semibold block mb-1">
                  BROWSING HISTORY
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                  Recently Viewed
                </h2>
              </div>
            </div>

            <div
              ref={viewedSliderRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 snap-x"
            >
              {recentlyViewed.map((viewedItem) => (
                <div key={viewedItem.id || viewedItem._id} className="w-[240px] sm:w-[280px] shrink-0 snap-start">
                  <ProductCard product={viewedItem} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── STICKY BUY BAR (DESKTOP TOP SLIDE-IN & MOBILE BOTTOM FIXED) ── */}
      <AnimatePresence>
        {showStickyBar && (
          <>
            {/* Desktop Top Slide-in Sticky Bar */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="hidden md:flex fixed top-0 left-0 right-0 z-[120] bg-[#090909]/95 border-b border-[#2A2A2A] py-3 shadow-2xl backdrop-blur-xl"
            >
              <Container className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={currentMedia.src} alt={product.name} className="w-10 h-12 object-cover rounded border border-[#2A2A2A]" />
                  <div>
                    <h4 className="font-editorial text-base text-[#F8F6F3]">{product.name}</h4>
                    <p className="font-sans text-xs font-bold text-[#C8A45D]">{formatPrice(product.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-sans text-xs text-[#8E8A85]">
                    Size: <strong className="text-[#F8F6F3]">{selectedSize || "Select Size"}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="h-10 px-6 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px] hover:bg-[#D4B77D] transition-colors cursor-pointer"
                  >
                    {addedSuccess ? "Added!" : "Order Now"}
                  </button>
                </div>
              </Container>
            </motion.div>

            {/* Mobile Bottom Fixed Sticky Buy Bar */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed bottom-0 left-0 right-0 z-[120] md:hidden bg-[#090909]/95 border-t border-[#2A2A2A] p-3 backdrop-blur-xl flex items-center justify-between gap-3 shadow-2xl"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <img src={currentMedia.src} alt={product.name} className="w-10 h-12 object-cover object-top rounded-[4px] shrink-0 border border-[#2A2A2A]" />
                <div className="min-w-0 flex-1">
                  <p className="font-editorial text-xs font-normal text-[#F8F6F3] truncate">{product.name}</p>
                  <p className="font-sans text-xs font-bold text-[#C8A45D] price-display">{formatPrice(product.price)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="h-[44px] px-5 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" /> {addedSuccess ? "Added!" : "Order Now"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FULLSCREEN LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close Lightbox"
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-[#151515] border border-[#2A2A2A] text-[#F8F6F3] hover:text-[#C8A45D] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))}
              aria-label="Previous image"
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#151515] border border-[#2A2A2A] text-[#F8F6F3] hover:text-[#C8A45D] transition-colors cursor-pointer hidden sm:flex"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))}
              aria-label="Next image"
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#151515] border border-[#2A2A2A] text-[#F8F6F3] hover:text-[#C8A45D] transition-colors cursor-pointer hidden sm:flex"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[85vh] relative flex items-center justify-center">
              {currentMedia.type === "video" ? (
                <video src={currentMedia.src} controls autoPlay className="max-w-full max-h-[85vh] rounded-[8px]" />
              ) : (
                <img
                  src={currentMedia.src}
                  alt={product.name}
                  className="max-w-full max-h-[85vh] object-contain rounded-[8px]"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SIZE GUIDE MODAL (SPRINT 15.1 LUXURY POLISH) ── */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="w-full max-w-2xl bg-[#151515] border border-[#2A2A2A] p-6 sm:p-8 rounded-[16px] relative font-sans max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Circular Animated Close Button */}
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                aria-label="Close Size Guide"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-[#8E8A85] hover:text-[#C8A45D] hover:border-[#C8A45D] hover:rotate-90 transition-all duration-300 cursor-pointer shadow-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-[#2A2A2A]">
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-1">
                    SIZE GUIDE
                  </span>
                  <h3 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                    Find Your Perfect Fit
                  </h3>
                  <p className="text-xs text-[#8E8A85] font-light mt-1">
                    Use the measurements below to choose the correct size for your silhouette.
                  </p>
                </div>

                {/* Modern Sliding Unit Toggle */}
                <div className="relative flex items-center bg-[#090909] border border-[#2A2A2A] rounded-full p-1 text-xs shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setUnitCm(false)}
                    className={`relative z-10 px-4 py-1.5 rounded-full font-bold transition-colors duration-200 cursor-pointer ${
                      !unitCm ? "text-[#090909]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                    }`}
                  >
                    {!unitCm && (
                      <motion.div
                        layoutId="unitPill"
                        className="absolute inset-0 bg-[#C8A45D] rounded-full z-[-1]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    INCHES
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitCm(true)}
                    className={`relative z-10 px-4 py-1.5 rounded-full font-bold transition-colors duration-200 cursor-pointer ${
                      unitCm ? "text-[#090909]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                    }`}
                  >
                    {unitCm && (
                      <motion.div
                        layoutId="unitPill"
                        className="absolute inset-0 bg-[#C8A45D] rounded-full z-[-1]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    CM
                  </button>
                </div>
              </div>

              {/* Fit Profile Selector: Three Equal Segments */}
              <div className="mb-6 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A45D] font-bold block">
                  FIT PROFILE: RELAXED MODERN FIT
                </span>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#090909] border border-[#2A2A2A] rounded-[12px]">
                  <div className="py-2.5 text-center text-xs font-semibold text-[#8E8A85] rounded-[8px] bg-transparent">
                    Slim Fit
                  </div>
                  <div className="py-2.5 text-center text-xs font-semibold text-[#8E8A85] rounded-[8px] bg-transparent">
                    Regular Fit
                  </div>
                  <div className="py-2.5 text-center text-xs font-bold text-[#090909] bg-[#C8A45D] rounded-[8px] shadow-sm">
                    Relaxed Fit
                  </div>
                </div>
              </div>

              {/* Improved Measurement Table */}
              <div className="border border-[#2A2A2A] rounded-[12px] overflow-hidden mb-6 shadow-md">
                <div className="overflow-x-auto max-h-[280px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-[#090909] border-b border-[#2A2A2A] z-10">
                      <tr className="text-[#C8A45D] uppercase tracking-wider text-[11px]">
                        <th className="px-4 py-3 font-bold">Size</th>
                        <th className="px-4 py-3 font-bold">Chest</th>
                        <th className="px-4 py-3 font-bold">Waist</th>
                        <th className="px-4 py-3 font-bold">Shoulder</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]/50">
                      {[
                        { sz: "XS", chest: unitCm ? "86 - 89 cm" : '34 - 35"', waist: unitCm ? "71 - 74 cm" : '28 - 29"', sh: unitCm ? "43 cm" : '17.0"' },
                        { sz: "S", chest: unitCm ? "91 - 96 cm" : '36 - 38"', waist: unitCm ? "76 - 79 cm" : '30 - 31"', sh: unitCm ? "44 cm" : '17.5"' },
                        { sz: "M", chest: unitCm ? "99 - 104 cm" : '39 - 41"', waist: unitCm ? "81 - 84 cm" : '32 - 33"', sh: unitCm ? "46 cm" : '18.0"' },
                        { sz: "L", chest: unitCm ? "107 - 112 cm" : '42 - 44"', waist: unitCm ? "86 - 89 cm" : '34 - 35"', sh: unitCm ? "47 cm" : '18.5"' },
                        { sz: "XL", chest: unitCm ? "114 - 119 cm" : '45 - 47"', waist: unitCm ? "91 - 96 cm" : '36 - 38"', sh: unitCm ? "48 cm" : '19.0"' },
                        { sz: "XXL", chest: unitCm ? "122 - 127 cm" : '48 - 50"', waist: unitCm ? "99 - 104 cm" : '39 - 41"', sh: unitCm ? "49 cm" : '19.5"' },
                      ].map((row, idx) => (
                        <tr key={row.sz} className={`transition-colors hover:bg-[#C8A45D]/10 ${idx % 2 === 0 ? "bg-[#151515]" : "bg-[#090909]"}`}>
                          <td className="px-4 py-3 font-bold text-[#C8A45D] text-sm">{row.sz}</td>
                          <td className="px-4 py-3 text-[#F8F6F3]">{row.chest}</td>
                          <td className="px-4 py-3 text-[#F8F6F3]">{row.waist}</td>
                          <td className="px-4 py-3 text-[#F8F6F3]">{row.sh}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3-Column Model Specifications Card */}
              <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[12px] mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A45D] font-bold block mb-3 text-center sm:text-left">
                  MODEL SPECIFICATIONS
                </span>
                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-[#2A2A2A]">
                  <div>
                    <span className="text-[10px] uppercase text-[#8E8A85] block mb-0.5 font-medium">Height</span>
                    <span className="text-xs sm:text-sm font-bold text-[#F8F6F3]">6'1" (185 cm)</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#8E8A85] block mb-0.5 font-medium">Chest</span>
                    <span className="text-xs sm:text-sm font-bold text-[#F8F6F3]">40" (101 cm)</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#8E8A85] block mb-0.5 font-medium">Size Worn</span>
                    <span className="text-xs sm:text-sm font-bold text-[#C8A45D]">Size L</span>
                  </div>
                </div>
              </div>

              {/* "How to Measure" Visual Guide Section */}
              <div className="pt-2 border-t border-[#2A2A2A]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A45D] font-bold block mb-3">
                  HOW TO MEASURE
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px]">
                    <span className="font-bold text-[#F8F6F3] block mb-1">1. Chest</span>
                    <p className="text-[10px] text-[#8E8A85] leading-relaxed font-light">Measure around the fullest part of your chest, keeping tape horizontal.</p>
                  </div>
                  <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px]">
                    <span className="font-bold text-[#F8F6F3] block mb-1">2. Shoulder</span>
                    <p className="text-[10px] text-[#8E8A85] leading-relaxed font-light">Measure across the back from shoulder seam to shoulder seam.</p>
                  </div>
                  <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px]">
                    <span className="font-bold text-[#F8F6F3] block mb-1">3. Waist</span>
                    <p className="text-[10px] text-[#8E8A85] leading-relaxed font-light">Measure around your natural waistline, keeping tape comfortable.</p>
                  </div>
                  <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[10px]">
                    <span className="font-bold text-[#F8F6F3] block mb-1">4. Sleeve</span>
                    <p className="text-[10px] text-[#8E8A85] leading-relaxed font-light">Measure from the shoulder seam down to your wrist bone.</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FIND MY SIZE MODAL ── */}
      <AnimatePresence>
        {showFindMySize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#151515] border border-[#2A2A2A] p-6 sm:p-8 rounded-[14px] relative font-sans"
            >
              <button
                type="button"
                onClick={() => {
                  setShowFindMySize(false);
                  setRecommendedSizeResult(null);
                }}
                className="absolute top-4 right-4 text-[#8E8A85] hover:text-[#C8A45D] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="font-editorial text-3xl font-normal text-[#F8F6F3] mb-1">Find My Size</h3>
              <p className="text-xs text-[#8E8A85] mb-6 font-light">Input your details for an instant tailored size recommendation.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1">
                    Height: <span className="text-[#F8F6F3]">{userHeight} cm</span>
                  </label>
                  <input
                    type="range"
                    min="150"
                    max="210"
                    value={userHeight}
                    onChange={(e) => setUserHeight(e.target.value)}
                    className="w-full accent-[#C8A45D] bg-[#090909]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1">
                    Weight: <span className="text-[#F8F6F3]">{userWeight} kg</span>
                  </label>
                  <input
                    type="range"
                    min="45"
                    max="120"
                    value={userWeight}
                    onChange={(e) => setUserWeight(e.target.value)}
                    className="w-full accent-[#C8A45D] bg-[#090909]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-2">
                    Fit Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["slim", "regular", "relaxed"].map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setUserFitPreference(pref)}
                        className={`py-2 text-xs uppercase font-semibold rounded-[8px] border transition-colors cursor-pointer ${
                          userFitPreference === pref
                            ? "bg-[#C8A45D] text-[#090909] border-[#C8A45D]"
                            : "bg-[#090909] text-[#8E8A85] border-[#2A2A2A]"
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={calculateRecommendedSize}
                  className="w-full py-3 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] transition-colors cursor-pointer mt-2"
                >
                  Calculate Recommended Size
                </button>

                {recommendedSizeResult && (
                  <div className="p-4 bg-[#090909] border border-[#C8A45D]/40 rounded-[10px] text-center space-y-1">
                    <span className="text-xs uppercase tracking-widest text-[#8E8A85]">RECOMMENDED SIZE</span>
                    <p className="font-editorial text-4xl font-bold text-[#C8A45D]">{recommendedSizeResult.size}</p>
                    <p className="text-xs text-[#8E8A85] font-light">{recommendedSizeResult.note}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
