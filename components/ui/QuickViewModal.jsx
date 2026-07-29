"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Check, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!isOpen || !product) return null;

  const isWishlisted = wishlist.includes(product.id || product._id);
  const images = product.images?.length > 0
    ? product.images
    : [product.image || product.img1 || "/images/products/gor-codset-burgundy-alo.webp"];
  
  const currentImg = images[selectedImgIndex] || images[0];
  const availableSizes = product.sizes?.length > 0 ? product.sizes : ["XS", "S", "M", "L", "XL", "XXL"];
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor?.name || selectedColor || "Default");
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[180] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl bg-[#151515] border border-[#2A2A2A] rounded-[16px] overflow-hidden relative font-sans shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#090909]/80 border border-[#2A2A2A] text-[#F8F6F3] hover:text-[#C8A45D] transition-colors backdrop-blur-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image Preview Gallery */}
          <div className="md:w-1/2 relative bg-[#090909] aspect-[3/4] md:aspect-auto flex flex-col">
            <div className="relative flex-1 overflow-hidden">
              <img
                src={currentImg}
                alt={product.name}
                className="w-full h-full object-cover object-top filter brightness-[0.97]"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 font-sans text-[9px] uppercase tracking-[0.2em] bg-[#090909]/95 text-[#D86A32] px-3 py-1 border border-[#D86A32]/40 backdrop-blur-md font-semibold rounded-[4px]">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="p-3 bg-[#090909] border-t border-[#2A2A2A] flex items-center gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-12 h-14 rounded-[6px] border overflow-hidden shrink-0 cursor-pointer ${
                      selectedImgIndex === idx ? "border-[#C8A45D] ring-1 ring-[#C8A45D]" : "border-[#2A2A2A] opacity-60"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Garment Info & Actions */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-5">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-1">
                {product.category || "SIGNATURE COLLECTION"}
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#F8F6F3] leading-tight mb-2">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 font-sans text-xs text-[#8E8A85] mb-3">
                <div className="flex text-[#C8A45D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C8A45D]" />
                  ))}
                </div>
                <span className="font-semibold text-[#F8F6F3]">4.9</span>
                <span>•</span>
                <span>Verified Garment</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 border-t border-b border-[#2A2A2A] py-3 my-3">
                <span className="font-sans text-xl font-bold text-[#F8F6F3] price-display">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-sans text-sm text-[#8E8A85] line-through price-display">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discountPercent && (
                  <span className="font-sans text-[9px] bg-[#D86A32]/15 text-[#D86A32] border border-[#D86A32]/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="font-sans text-xs text-[#8E8A85] font-light leading-relaxed mb-4">
                {product.description || "Crafted from premium heavyweight cotton with precision stitching and modern relaxed fit silhouette."}
              </p>

              {/* Size Selector */}
              <div className="mb-4">
                <span className="font-sans text-[11px] uppercase tracking-wider text-[#8E8A85] font-semibold block mb-2">
                  Select Size
                </span>
                <div className="grid grid-cols-6 gap-1.5">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`h-9 border font-sans text-xs font-bold uppercase rounded-[8px] transition-all cursor-pointer ${
                        selectedSize === sz
                          ? "bg-[#C8A45D] text-[#090909] border-[#C8A45D]"
                          : "bg-[#090909] text-[#F8F6F3] border-[#2A2A2A] hover:border-[#C8A45D]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full h-12 rounded-[10px] bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Order Now — {formatPrice(product.price)}
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs font-sans text-[#8E8A85] pt-1">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id || product._id)}
                  className="flex items-center gap-1.5 hover:text-[#C8A45D] transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#C8A45D] text-[#C8A45D]" : ""}`} />
                  <span>{isWishlisted ? "In Wishlist" : "Add to Wishlist"}</span>
                </button>

                <a
                  href={`/product/${product.id || product._id}`}
                  className="text-[#C8A45D] hover:underline font-medium"
                >
                  View Full Details →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
