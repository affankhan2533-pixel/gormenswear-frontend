"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Check, Star, ArrowRight, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function QuickViewDrawer({ product, isOpen, onClose }) {
  const { addToCart, wishlist, toggleWishlist, setIsCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!isOpen || !product) return null;

  const isWishlisted = wishlist.includes(product.id || product._id);
  const images =
    product.images?.length > 0
      ? product.images
      : [product.imageUrl || product.image || product.img1 || "/images/products/gor-codset-burgundy-alo.webp"];

  const currentImg = images[selectedImgIndex] || images[0];
  const availableSizes = product.sizes?.length > 0 ? product.sizes : ["XS", "S", "M", "L", "XL", "XXL"];
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[180] bg-black/85 backdrop-blur-md flex justify-end">
        {/* Backdrop Click to Close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 cursor-pointer"
        />

        {/* Slide-over Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="relative w-full max-w-lg bg-[#111111] border-l border-[#2A2A2A] h-full shadow-2xl flex flex-col justify-between overflow-y-auto font-sans text-[#F7F5F2] select-none z-10"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#2A2A2A] flex items-center justify-between sticky top-0 bg-[#111111]/95 backdrop-blur-md z-20">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A86A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> QUICK GARMENT PREVIEW
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="w-8 h-8 rounded-full bg-[#0B0B0B] border border-[#2A2A2A] text-[#B8B6B0] hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* Main Image Box */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#0B0B0B] border border-[#2A2A2A] shadow-inner">
              <Image
                src={currentImg}
                alt={product.name}
                fill
                unoptimized
                className="object-cover object-top filter brightness-[0.98]"
              />

              {product.badge && (
                <span className="absolute top-3 left-3 z-10 font-sans text-[9px] uppercase tracking-[0.2em] font-extrabold bg-[#D86A32]/95 text-[#F7F5F2] px-3 py-1 border border-[#D86A32]/50 rounded-md backdrop-blur-md shadow-md">
                  {product.badge}
                </span>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id || product._id)}
                aria-label="Toggle Wishlist"
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#0B0B0B]/85 border border-[#2A2A2A] flex items-center justify-center text-[#F7F5F2] hover:text-[#C9A86A] transition-colors backdrop-blur-md cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? "fill-[#C9A86A] text-[#C9A86A]" : ""
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-14 h-16 rounded-lg border overflow-hidden shrink-0 cursor-pointer transition-all ${
                      selectedImgIndex === idx
                        ? "border-[#C9A86A] ring-2 ring-[#C9A86A]/40 scale-105"
                        : "border-[#2A2A2A] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      width={56}
                      height={64}
                      unoptimized
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Category */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86A] font-bold block mb-1">
                {product.category || "ATELIER SELECTION"}
              </span>
              <h2 className="font-serif text-2xl font-normal text-[#F7F5F2] leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs text-[#B8B6B0] mt-2 font-sans">
                <div className="flex text-[#C9A86A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C9A86A]" />
                  ))}
                </div>
                <span className="font-bold text-[#F7F5F2]">4.9</span>
                <span>•</span>
                <span>48 Verified Reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 py-3 border-t border-b border-[#2A2A2A]">
              <span className="font-sans text-2xl font-bold text-[#F7F5F2] price-display">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-sans text-sm text-[#B8B6B0] line-through price-display">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discountPercent && (
                <span className="font-sans text-[9px] bg-[#D86A32]/15 text-[#D86A32] border border-[#D86A32]/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-[#B8B6B0] font-light leading-relaxed">
              {product.description || "Crafted from custom organic cotton with tailored shoulder structure, custom hardware accents, and effortless drape."}
            </p>

            {/* Size Selector */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#B8B6B0] font-bold block mb-2">
                Select Size
              </span>
              <div className="grid grid-cols-6 gap-2">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`h-10 border font-sans text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                      selectedSize === sz
                        ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A] shadow-md"
                        : "bg-[#0B0B0B] text-[#F7F5F2] border-[#2A2A2A] hover:border-[#C9A86A]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-[#2A2A2A] bg-[#0B0B0B] space-y-3 sticky bottom-0 z-20">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> ADD TO CART
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 h-12 bg-[#15181D] border border-[#C9A86A]/50 hover:bg-[#C9A86A]/10 text-[#F7F5F2] font-bold text-xs uppercase tracking-widest rounded-xl transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                BUY NOW
              </button>
            </div>

            <Link
              href={`/product/${product.id || product.slug || product._id}`}
              onClick={onClose}
              className="w-full py-2.5 text-center text-xs text-[#C9A86A] hover:underline font-bold uppercase tracking-wider flex items-center justify-center gap-1 block"
            >
              View Full Product Details Page <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
