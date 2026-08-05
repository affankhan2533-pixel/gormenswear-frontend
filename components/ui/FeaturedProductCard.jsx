"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.834 11.834 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.237-6.165-3.483-8.411" />
    </svg>
  );
}

export default function FeaturedProductCard({ product, className = "" }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id || product._id);
  const img1 = product.image || product.images?.[0] || product.img1 || "/images/lookbook/gor-lookbook-1.webp";

  const whatsappMsg = `Hi GOR,\n\nI'm interested in:\n${product.name}\n\nCan you please share availability, size options and final price?`;
  const whatsappUrl = `https://wa.me/918691921913?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group flex flex-col lg:flex-row bg-[#1B1F25] border border-[#C9A86A]/15 hover:border-[#C9A86A]/40 rounded-[14px] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 shadow-lg hover:shadow-2xl col-span-2 ${className}`}
    >
      {/* 1. Image Container (Balanced Split) */}
      <Link 
        href={`/product/${product.slug || product.id || product._id}`} 
        className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:w-[54%] lg:max-w-[54%] overflow-hidden bg-[#1B1F25] block shrink-0"
      >
        {/* Primary Image */}
        <img
          src={img1}
          alt={product.name}
          className="w-full h-full object-cover object-top filter brightness-[0.96] group-hover:brightness-[0.88] transition-all duration-300 ease-out group-hover:scale-[1.03]"
        />

        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B1F25]/80 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3.5 left-3.5 font-sans text-[9px] uppercase tracking-[0.2em] bg-[#0E1013]/90 text-[#C9A86A] px-3 py-1.5 border border-[#C9A86A]/30 backdrop-blur-md font-semibold rounded-[4px]">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id || product._id);
          }}
          aria-label="Save to wishlist"
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-[#090909]/70 border border-white/[0.1] flex items-center justify-center text-[#F4F1EA] hover:text-[#C9A96E] hover:scale-110 transition-all duration-300 backdrop-blur-md cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-[#C9A96E] text-[#C9A96E]" : ""
            }`}
          />
        </button>
      </Link>

      {/* 2. Content Area with Adequate Room for Buttons */}
      <div className="lg:w-[46%] p-5 sm:p-6 lg:p-7 flex flex-col justify-between flex-1 bg-[#14171C]">
        <div>
          {/* Category */}
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#C9A86A] font-semibold block mb-1.5">
            {product.category || "Atelier Collection"}
          </span>

          {/* Title: Max 2 lines */}
          <Link href={`/product/${product.id || product._id}`}>
            <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#F7F5F2] group-hover:text-[#C9A86A] transition-colors duration-300 line-clamp-2 leading-[1.25]">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-sans text-xl sm:text-2xl font-bold text-[#F7F5F2] price-display tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-xs text-[#B8B6B0]/60 line-through price-display tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* ── 3. Redesigned Action Buttons ── */}
        <div className="mt-6 pt-4 border-t border-[#C9A86A]/15 flex flex-row items-center gap-2.5">
          {/* Primary Button: Order Now */}
          <Link
            href={`/product/${product.id || product._id}`}
            className="flex-1 h-[44px] rounded-[12px] bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0E1013] font-sans text-[11px] uppercase tracking-wider font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap px-2.5 sm:px-3 cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>Order Now</span>
          </Link>

          {/* Secondary Button: WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 h-[44px] rounded-[12px] bg-transparent border border-[#C9A86A]/40 text-[#F7F5F2] hover:bg-[#25D366]/10 hover:border-[#25D366] hover:text-[#25D366] font-sans text-[11px] uppercase tracking-wider font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap px-2.5 sm:px-3 cursor-pointer group/wa shrink-0"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-[#C9A86A] group-hover/wa:text-[#25D366] transition-colors shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
