"use client";

import { useState, useEffect, use, useMemo, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Plus, Minus, MessageCircle } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import ProductCard from "@/components/ui/ProductCard";
import ProductGallery from "@/components/pdp/ProductGallery";
import ProductAccordions from "@/components/pdp/ProductAccordions";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { productService } from "@/lib/productService";

function ProductDetailContent({ idParam }) {
  const { addToCart, wishlist, toggleWishlist, setIsCartOpen } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form selection state
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Fetch product data dynamically
  useEffect(() => {
    async function loadProductData() {
      if (!idParam) return;
      setLoading(true);
      try {
        const currentProd = await productService.getProduct(idParam);
        if (currentProd) {
          setProduct(currentProd);

          // Default selection
          if (Array.isArray(currentProd.sizes) && currentProd.sizes.length > 0) {
            setSelectedSize(currentProd.sizes[0]);
          } else {
            setSelectedSize("M");
          }

          if (Array.isArray(currentProd.colors) && currentProd.colors.length > 0) {
            setSelectedColor(currentProd.colors[0]);
          }

          // Fetch same-category recommendations strictly
          const allProds = await productService.getStorefrontProducts();
          if (Array.isArray(allProds)) {
            const currentCat = (currentProd.categorySlug || currentProd.category || "").toLowerCase();
            const currentId = currentProd.id || currentProd._id || currentProd.slug;

            const sameCategoryItems = allProds.filter((p) => {
              const pId = p.id || p._id || p.slug;
              if (pId === currentId) return false;
              const pCat = (p.categorySlug || p.category || "").toLowerCase();
              return pCat === currentCat || pCat.includes(currentCat) || currentCat.includes(pCat);
            });

            setRelated(sameCategoryItems.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [idParam]);

  // Gallery media list formatting
  const mediaList = useMemo(() => {
    if (!product) return [];
    const imgs =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [product.imageUrl || product.image || "/images/lookbook/gor-lookbook-1.webp"];

    return imgs.map((src) => ({ src }));
  }, [product]);

  // Add to Bag handler
  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, selectedColor || product.colors?.[0] || "Standard", quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
    setIsCartOpen(true);
  };

  // WhatsApp Order Link generator
  const getWhatsAppOrderUrl = () => {
    if (!product) return "#";
    const prodName = product.name;
    const price = formatPrice(product.price);
    const sizeStr = selectedSize ? `Size: ${selectedSize}` : "";
    const colorStr = selectedColor
      ? `Color: ${typeof selectedColor === "object" ? selectedColor.name : selectedColor}`
      : "";
    const text = encodeURIComponent(
      `Hello GOR Menswear, I would like to order: \n• Product: ${prodName} (${price})\n• ${sizeStr} ${colorStr}\n• Quantity: ${quantity}\nLink: ${typeof window !== "undefined" ? window.location.href : ""}`
    );
    return `https://wa.me/919999999999?text=${text}`;
  };

  // Loading skeleton state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EC] pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 aspect-[3/4] bg-[#E9E5DD] animate-pulse" />
            <div className="lg:col-span-5 space-y-6">
              <div className="h-4 w-1/4 bg-[#E9E5DD] animate-pulse" />
              <div className="h-10 w-4/5 bg-[#E9E5DD] animate-pulse" />
              <div className="h-6 w-1/3 bg-[#E9E5DD] animate-pulse" />
              <div className="h-20 w-full bg-[#E9E5DD] animate-pulse" />
              <div className="h-12 w-full bg-[#E9E5DD] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F2EC] flex flex-col justify-center items-center px-6 py-32 text-center text-[#111111]">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#716D66] block mb-2">
          ERROR 404
        </span>
        <h2 className="font-editorial text-4xl font-normal mb-4">PIECE NOT FOUND</h2>
        <p className="font-sans text-xs text-[#716D66] max-w-sm mb-6">
          This piece is not currently in the GOR archive or has been moved.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-[#151515] text-[#F5F2EC] font-sans text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#252525] transition-colors"
        >
          BACK TO SHOP
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id || product._id || product.slug);
  const availableSizes =
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : ["S", "M", "L", "XL", "XXL"];

  const availableColors =
    Array.isArray(product.colors) && product.colors.length > 0
      ? product.colors
      : [{ name: "Standard", hex: "#151515" }];

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#111111] flex flex-col selection:bg-[#111111] selection:text-[#F5F2EC]">
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-5 sm:px-8 lg:px-12 pt-24 sm:pt-32 pb-24">
        {/* Subtle Breadcrumbs (Section 21) */}
        <nav aria-label="Breadcrumb" className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#716D66] mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            HOME
          </Link>
          <span>/</span>
          <Link
            href={`/category/${(product.categorySlug || product.category || "shop").toLowerCase()}`}
            className="hover:text-[#111111] transition-colors"
          >
            {(product.category || "COLLECTION").toUpperCase()}
          </Link>
          {product.subcategory && (
            <>
              <span>/</span>
              <span className="text-[#716D66]">{product.subcategory.toUpperCase()}</span>
            </>
          )}
          <span>/</span>
          <span className="text-[#111111] font-medium truncate max-w-[200px]">
            {product.name.toUpperCase()}
          </span>
        </nav>

        {/* ── 2-COLUMN PDP LAYOUT (Section 11) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT: Large Image Gallery (Section 12) */}
          <div className="lg:col-span-7 w-full">
            <ProductGallery
              mediaList={mediaList}
              productName={product.name}
              selectedColor={selectedColor}
              isWishlisted={isWishlisted}
              onWishlistToggle={() => toggleWishlist(product.id || product._id || product.slug)}
            />
          </div>

          {/* RIGHT: Product Information (Section 13) */}
          <div className="lg:col-span-5 space-y-6 lg:pl-4">
            {/* Category Eyebrow */}
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#716D66] font-medium block">
              {product.category || "THE GOR COLLECTION"}
            </span>

            {/* Product Name (Editorial Serif) */}
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#111111] font-normal tracking-tight leading-[1.08]">
              {product.name}
            </h1>

            {/* Price (Clean Sans) */}
            <div className="flex items-center gap-3 font-sans">
              <span className="text-xl sm:text-2xl font-medium text-[#111111]">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-[#716D66] line-through font-normal">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-sans text-xs sm:text-sm text-[#716D66] font-light leading-relaxed pt-1">
                {product.description}
              </p>
            )}

            {/* ── COLOR SELECTOR (Section 15) ── */}
            {availableColors.length > 0 && (
              <div className="pt-2 space-y-2.5">
                <div className="flex items-center justify-between font-sans text-xs">
                  <span className="uppercase tracking-[0.15em] text-[#716D66]">
                    COLOR:{" "}
                    <span className="text-[#111111] font-medium">
                      {typeof selectedColor === "object" ? selectedColor?.name : selectedColor || "Standard"}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {availableColors.map((col, idx) => {
                    const colName = typeof col === "string" ? col : col.name;
                    const colHex = typeof col === "string" ? "#151515" : col.hex || "#151515";
                    const isSelected =
                      (typeof selectedColor === "object" ? selectedColor?.name : selectedColor) === colName;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        aria-label={`Select color ${colName}`}
                        title={colName}
                        className={`w-7 h-7 rounded-full border transition-all cursor-pointer relative ${
                          isSelected
                            ? "border-[#111111] ring-2 ring-[#111111]/30 scale-110"
                            : "border-[#D8D2C8] hover:scale-105"
                        }`}
                        style={{ backgroundColor: colHex }}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 m-auto w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SIZE SELECTOR (Section 14 Architectural Selectors) ── */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center justify-between font-sans text-xs">
                <span className="uppercase tracking-[0.15em] text-[#716D66]">
                  SIZE:{" "}
                  <span className="text-[#111111] font-medium">
                    {selectedSize || "SELECT"}
                  </span>
                </span>
                {sizeError && (
                  <span className="text-red-600 font-sans text-[11px]">
                    Please select a size
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sz);
                        setSizeError(false);
                      }}
                      className={`w-12 h-12 border font-sans text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? "bg-[#151515] text-[#F5F2EC] border-[#151515] font-medium"
                          : "border-[#D8D2C8] bg-transparent text-[#111111] hover:border-[#111111]"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── QUANTITY STEPPER & ACTION BUTTONS ── */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-4">
                {/* Architectural Stepper */}
                <div className="flex items-center border border-[#D8D2C8] bg-white h-12">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-11 h-full text-[#716D66] hover:text-[#111111] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                  <span className="w-10 text-center font-sans text-xs text-[#111111] font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="w-11 h-full text-[#716D66] hover:text-[#111111] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </div>

                {/* ADD TO BAG Button */}
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="flex-1 h-12 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2]" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <span>ADD TO BAG</span>
                  )}
                </button>
              </div>

              {/* WHATSAPP / ORDER Link (Section 11) */}
              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 border border-[#D8D2C8] hover:border-[#111111] text-[#111111] font-sans text-xs uppercase tracking-[0.18em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 stroke-[1.5]" />
                <span>ORDER VIA WHATSAPP</span>
              </a>
            </div>

            {/* ── ACCORDIONS (PRODUCT DETAILS, SIZING, DELIVERY / RETURNS) ── */}
            <ProductAccordions product={product} />
          </div>
        </div>

        {/* ── RECOMMENDATIONS: MORE FROM THIS CATEGORY (Section 22) ── */}
        {related.length > 0 && (
          <section className="mt-24 sm:mt-32 pt-12 border-t border-[#D8D2C8]">
            <div className="flex items-end justify-between mb-8 sm:mb-12">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#716D66] block mb-1">
                  CURATED SELECTION
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight uppercase">
                  MORE FROM THIS CATEGORY
                </h2>
              </div>
              <Link
                href={`/category/${(product.categorySlug || product.category || "shop").toLowerCase()}`}
                className="font-sans text-xs uppercase tracking-[0.2em] text-[#716D66] hover:text-[#111111] transition-colors hidden sm:block"
              >
                VIEW ALL {(product.category || "").toUpperCase()} →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {related.map((item) => (
                <ProductCard key={item.id || item._id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function ProductDetailPage({ params }) {
  const unwrappedParams = params && typeof params.then === "function" ? use(params) : (params || {});
  const idParam = unwrappedParams?.id;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F2EC] pt-32 text-center text-[#716D66] font-editorial text-2xl">
          Loading Garment...
        </div>
      }
    >
      <ProductDetailContent idParam={idParam} />
    </Suspense>
  );
}
