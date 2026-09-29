"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function QuickViewDrawer({ product, isOpen, onClose }) {
  const { addToCart, wishlist, toggleWishlist, setIsCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!isOpen || !product) return null;

  const isWishlisted = wishlist.includes(product.id || product._id || product.slug);
  const images =
    product.images?.length > 0
      ? product.images
      : [product.imageUrl || product.image || "/images/lookbook/gor-lookbook-1.webp"];

  const currentImg = images[selectedImgIndex] || images[0];
  const availableSizes = product.sizes?.length > 0 ? product.sizes : ["S", "M", "L", "XL"];
  const activeSize = selectedSize || availableSizes[0];

  const handleAddToBag = () => {
    addToCart(product, activeSize, selectedColor || product.colors?.[0] || "Standard", 1);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#111111]/40 backdrop-blur-sm cursor-pointer"
        />

        {/* Slide-over Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#F5F2EC] border-l border-[#D8D2C8] h-full shadow-2xl flex flex-col justify-between overflow-y-auto font-sans text-[#111111] z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#D8D2C8] flex items-center justify-between sticky top-0 bg-[#F5F2EC]/95 backdrop-blur-md z-20">
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#716D66] font-semibold">
              PREVIEW
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="p-1 text-[#111111] hover:text-[#716D66] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 flex-1">
            {/* Image Box */}
            <div className="relative aspect-[3/4] w-full bg-[#E9E5DD] overflow-hidden border border-[#D8D2C8]">
              <Image
                src={currentImg}
                alt={product.name}
                fill
                unoptimized
                className="object-cover object-top"
              />
              <button
                type="button"
                onClick={() => toggleWishlist(product.id || product._id || product.slug)}
                aria-label="Toggle wishlist"
                className="absolute top-3 right-3 p-2 bg-[#F5F2EC]/90 text-[#111111] border border-[#D8D2C8] cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 stroke-[1.5] ${
                    isWishlisted ? "fill-[#111111] text-[#111111]" : ""
                  }`}
                />
              </button>
            </div>

            {/* Thumbnails if multiple */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`relative w-14 aspect-[3/4] border shrink-0 bg-[#E9E5DD] overflow-hidden cursor-pointer ${
                      selectedImgIndex === idx
                        ? "border-[#111111]"
                        : "border-[#D8D2C8] opacity-60"
                    }`}
                  >
                    <Image src={img} alt="" fill unoptimized className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}

            {/* Product Meta */}
            <div className="space-y-2">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#716D66] block">
                {product.category || "COLLECTION"}
              </span>
              <h2 className="font-editorial text-2xl text-[#111111] font-normal leading-snug">
                {product.name}
              </h2>
              <div className="font-sans text-sm font-semibold text-[#111111]">
                {formatPrice(product.price)}
              </div>
              {product.description && (
                <p className="font-sans text-xs text-[#716D66] font-light leading-relaxed pt-1">
                  {product.description}
                </p>
              )}
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#716D66] block">
                SELECT SIZE
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`w-10 h-10 border text-xs font-sans uppercase transition-colors cursor-pointer flex items-center justify-center ${
                      activeSize === sz
                        ? "bg-[#151515] text-[#F5F2EC] border-[#151515]"
                        : "border-[#D8D2C8] text-[#111111] hover:border-[#111111]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-[#D8D2C8] bg-[#EFECE6]/50 space-y-2">
            <button
              type="button"
              onClick={handleAddToBag}
              className="w-full py-3.5 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
            >
              ADD TO BAG
            </button>
            <Link
              href={`/product/${product.id || product._id || product.slug}`}
              onClick={onClose}
              className="block w-full py-2.5 text-center font-sans text-[11px] uppercase tracking-[0.15em] text-[#716D66] hover:text-[#111111] transition-colors"
            >
              VIEW FULL PRODUCT DETAILS →
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
