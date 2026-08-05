"use client";

import React, { useState, memo } from "react";
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

function ProductCardComponent({ product, onQuickView, className = "" }) {
  const { wishlist, toggleWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id || product._id);
  const img1 = product.image || product.images?.[0] || product.img1 || "/images/products/gor-codset-burgundy-alo.webp";

  const whatsappMsg = `Hi GOR Menswear,\n\nI'm interested in:\n${product.name}\n\nCan you please share availability and final price?`;
  const whatsappUrl = `https://wa.me/918691921913?text=${encodeURIComponent(whatsappMsg)}`;

  const displayBadge = product.badge || (product.isNew ? "NEW" : null);
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group flex flex-col bg-[#1B1F25] border border-[rgba(200,167,106,0.15)] hover:border-[#C8A76A]/45 rounded-[14px] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 shadow-lg hover:shadow-2xl relative ${className}`}
    >
      {/* 1. Image Stage */}
      <Link
        href={`/product/${product.slug || product.id || product._id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#1B1F25] block shrink-0"
      >
        <Image
          src={img1}
          alt={product.name || "GOR Menswear Product"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Subtle Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/80 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300" />

        {/* Badge */}
        {displayBadge && (
          <span className="absolute top-2.5 left-2.5 font-sans text-[8.5px] uppercase tracking-[0.18em] bg-[#090909]/90 text-[#D86A32] px-2 py-0.5 border border-[#D86A32]/40 font-semibold rounded-[3px]">
            {displayBadge}
          </span>
        )}

        {/* Wishlist */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id || product._id);
          }}
          aria-label="Save to wishlist"
          whileTap={{ scale: 0.85 }}
          className="absolute top-2 right-2 z-10 w-[36px] h-[36px] sm:w-8 sm:h-8 rounded-full bg-[#090909]/80 border border-[#2A2A2A] flex items-center justify-center text-[#F8F6F3] hover:text-[#C8A45D] transition-colors duration-150 cursor-pointer"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted ? "fill-[#C8A45D] text-[#C8A45D]" : ""
            }`}
          />
        </motion.button>

        {/* Quick View Button on Hover */}
        {onQuickView && isHovered && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3.5 py-1.5 bg-[#090909]/90 border border-[#C8A45D]/40 text-[#F8F6F3] hover:text-[#C8A45D] font-sans text-[10px] uppercase tracking-wider font-semibold rounded-full flex items-center gap-1.5 shadow-lg cursor-pointer whitespace-nowrap transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        )}
      </Link>

      {/* 2. Content & Pricing */}
      <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 bg-[#14171C]">
        <div>
          <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#C9A86A] font-semibold block mb-0.5">
            {product.category || "SIGNATURE COLLECTION"}
          </span>

          <Link href={`/product/${product.slug || product.id || product._id}`}>
            <h3 className="font-editorial text-xs sm:text-sm md:text-base font-normal text-[#F7F5F2] group-hover:text-[#C9A86A] transition-colors line-clamp-2 leading-[1.22] mb-1">
              {product.name}
            </h3>
          </Link>

          <div className="my-1 flex items-center justify-between gap-1">
            <div className="flex items-baseline gap-1">
              <span className="font-sans text-xs sm:text-sm md:text-base font-bold text-[#F7F5F2] price-display tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-[10px] sm:text-[11px] text-[#B8B6B0]/60 line-through price-display tabular-nums">
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
        <div className="mt-2.5 pt-2 border-t border-[#C9A86A]/15 flex flex-row items-center gap-2">
          <div className="flex-1 min-w-0">
            <Link
              href={`/product/${product.slug || product.id || product._id}`}
              className="w-full h-[40px] rounded-[12px] bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0E1013] font-sans text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-colors duration-150 flex items-center justify-center gap-1 px-1 sm:px-2 cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Order</span>
            </Link>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-0 h-[40px] rounded-[12px] bg-transparent border border-[#C9A86A]/40 text-[#F7F5F2] hover:bg-[#25D366]/10 hover:border-[#25D366] hover:text-[#25D366] font-sans text-[9.5px] sm:text-[11px] uppercase tracking-wider font-semibold transition-all duration-150 flex items-center justify-center gap-1 px-1 sm:px-2 cursor-pointer group/wa shrink-0"
          >
            <WhatsAppIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C9A86A] group-hover/wa:text-[#25D366] transition-colors shrink-0" />
            <span className="truncate">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

const ProductCard = memo(ProductCardComponent);
export default ProductCard;
