"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.834 11.834 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.237-6.165-3.483-8.411" />
    </svg>
  );
}

export default function ProductCard({ product, onQuickView, className = "" }) {
  const { wishlist, toggleWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id || product._id);
  const img1 = product.image || product.images?.[0] || product.img1 || "/images/products/gor-codset-burgundy-alo.webp";
  const img2 = product.images?.[1] || product.img2 || img1;

  const whatsappMsg = `Hi GOR Menswear,\n\nI'm interested in:\n${product.name}\n\nCan you please share availability and final price?`;
  const whatsappUrl = `https://wa.me/918691921913?text=${encodeURIComponent(whatsappMsg)}`;

  // Priority Single Badge: NEW > BEST SELLER > EXCLUSIVE > LIMITED
  const displayBadge = product.badge || (product.isNew ? "NEW" : null);

  // Discount percentage calculation
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group flex flex-col bg-[#1B1F25] border border-[rgba(200,167,106,0.15)] hover:border-[#C8A76A]/50 rounded-[14px] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-[#C8A76A]/5 relative ${className}`}
    >
      {/* 1. Image Stage Container */}
      <Link 
        href={`/product/${product.slug || product.id || product._id}`} 
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#1B1F25] block shrink-0"
      >
        <Image
          src={img1}
          alt={product.name || "GOR Menswear Product"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top filter brightness-[0.96] group-hover:brightness-[0.9] transition-all duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Priority Single Badge */}
        {displayBadge && (
          <span className="absolute top-2.5 left-2.5 font-sans text-[8.5px] uppercase tracking-[0.18em] bg-[#090909]/95 text-[#D86A32] px-2 py-0.5 border border-[#D86A32]/40 backdrop-blur-md font-semibold rounded-[3px]">
            {displayBadge}
          </span>
        )}

        {/* Wishlist Touch Target */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id || product._id);
          }}
          aria-label="Save to wishlist"
          className="absolute top-2 right-2 z-10 w-[44px] h-[44px] sm:w-8 sm:h-8 rounded-full bg-[#090909]/80 border border-[#2A2A2A] flex items-center justify-center text-[#F8F6F3] hover:text-[#C8A45D] active:scale-90 transition-all duration-150 backdrop-blur-md cursor-pointer"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted ? "fill-[#C8A45D] text-[#C8A45D]" : ""
            }`}
          />
        </button>

        {/* Hover Quick View Trigger */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 px-3.5 py-1.5 bg-[#090909]/90 border border-[#C8A45D]/40 text-[#F8F6F3] hover:text-[#C8A45D] font-sans text-[10px] uppercase tracking-wider font-semibold rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        )}
      </Link>

      {/* 2. Content & Pricing Row */}
      <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 bg-[#151515]">
        <div>
          {/* Category Tag */}
          <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#C8A45D] font-medium block mb-0.5">
            {product.category || "SIGNATURE COLLECTION"}
          </span>

          {/* Product Name */}
          <Link href={`/product/${product.id || product._id}`}>
            <h3 className="font-editorial text-xs sm:text-sm md:text-base font-normal text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors line-clamp-2 leading-[1.22] mb-1">
              {product.name}
            </h3>
          </Link>

          {/* Inline Pricing Row */}
          <div className="my-1 flex items-center justify-between gap-1">
            <div className="flex items-baseline gap-1">
              <span className="font-sans text-xs sm:text-sm md:text-base font-bold text-[#F8F6F3] price-display">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-[10px] sm:text-[11px] text-[#8E8A85] line-through price-display">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {discountPercent && (
              <span className="font-sans text-[8px] sm:text-[8.5px] bg-[#D86A32]/15 text-[#D86A32] border border-[#D86A32]/30 px-1 py-0.5 rounded font-semibold uppercase tracking-wider shrink-0">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="mt-2 pt-2 border-t border-[#2A2A2A] flex flex-row items-center gap-[6px]">
          <Link
            href={`/product/${product.id || product._id}`}
            className="flex-1 min-w-0 h-[44px] rounded-[10px] sm:rounded-[12px] bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-[10px] sm:text-[11px] uppercase tracking-normal sm:tracking-wider font-bold shadow-sm active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1 px-1 sm:px-2 cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Order</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-0 h-[44px] rounded-[10px] sm:rounded-[12px] bg-transparent border border-[#C8A45D]/50 text-[#F8F6F3] hover:bg-[#25D366]/10 hover:border-[#25D366] hover:text-[#25D366] font-sans text-[9.5px] sm:text-[11px] uppercase tracking-normal sm:tracking-wider font-semibold active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1 px-1 sm:px-2 cursor-pointer group/wa shrink-0"
          >
            <WhatsAppIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C8A45D] group-hover/wa:text-[#25D366] transition-colors shrink-0" />
            <span className="truncate">WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
