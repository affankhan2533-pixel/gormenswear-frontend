"use client";

import React, { useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";
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

const COLOR_HEX_MAP = {
  black: "#151515",
  white: "#F5F2EC",
  green: "#263E2E",
  navy: "#18233C",
  burgundy: "#4A121A",
  "desert sand": "#C2B299",
  charcoal: "#2C2F36",
  onyx: "#19191B",
  grey: "#6B7280",
};

function ProductCardComponent({ product, className = "" }) {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    Array.isArray(product?.colors) && product.colors.length > 0 ? product.colors[0] : null
  );
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id || product._id);

  // Image resolution with smooth alternate on hover (300-500ms)
  const defaultImg =
    product?.imageUrl || product?.image || (Array.isArray(product?.images) ? product.images[0] : "/images/categories/t-shirts/image.png");
  const alternateImg =
    Array.isArray(product?.images) && product.images.length > 1 ? product.images[1] : defaultImg;

  // Variant matching
  const colorName = typeof selectedColor === "string" ? selectedColor : (selectedColor?.name || String(selectedColor || ""));
  let activeImage = defaultImg;
  if (colorName && Array.isArray(product.images)) {
    const matched = product.images.find((img) =>
      typeof img === "string" && img.toLowerCase().includes(colorName.toLowerCase())
    );
    if (matched) activeImage = matched;
  }

  const primarySrc = selectedColor ? activeImage : defaultImg;
  const secondarySrc = selectedColor ? activeImage : alternateImg;

  const handleColorSelect = (e, color) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(color);
  };

  const whatsappMsg = `Hi GOR Menswear, I would like to inquire about: ${product.name}${
    selectedColor ? ` (Color: ${selectedColor})` : ""
  } - ${formatPrice(product.price)}.`;
  const whatsappUrl = `https://wa.me/918691921913?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group flex flex-col bg-transparent relative ${className}`}
    >
      {/* ── 1. Image Canvas (Architectural 3:4 Crop — Image Dominates) ── */}
      <Link
        href={`/product/${product.slug || product.id || product._id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#E9E5DD] block"
      >
        {/* Base Primary Image */}
        <Image
          src={primarySrc}
          alt={product.name || "GOR Menswear"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover object-top filter contrast-[1.02] transition-opacity duration-500 ease-out ${
            isHovered && secondarySrc !== primarySrc ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />

        {/* Alternate Image Cross-Fade on Hover (300-500ms) */}
        {secondarySrc !== primarySrc && (
          <Image
            src={secondarySrc}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-top filter contrast-[1.02] transition-opacity duration-500 ease-out ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        )}

        {/* Quick Add Overlay on Desktop Hover — Architectural & Restrained */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#151515]/70 via-[#151515]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, "M", selectedColor ? { name: selectedColor } : null, 1);
            }}
            className="flex-1 h-9 bg-[#F5F2EC] hover:bg-[#FFFFFF] text-[#111111] font-sans text-[10px] uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Add to Bag</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 bg-[#F5F2EC]/90 hover:bg-[#FFFFFF] text-[#111111] hover:text-[#25D366] flex items-center justify-center transition-colors shrink-0"
            title="Inquire on WhatsApp"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </Link>

      {/* ── 2. Clean Editorial Catalog System Below Image ── */}
      <div className="pt-3 pb-1 flex flex-col justify-between flex-1">
        {/* Category & Wishlist Row */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#716D66] font-medium truncate">
            {typeof product.category === "string" ? product.category : (product.category?.name || "COLLECTION")}
          </span>

          {/* Minimal Wishlist Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id || product._id);
            }}
            aria-label="Wishlist"
            className="w-5 h-5 flex items-center justify-center text-[#716D66] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors stroke-[1.7] ${
                isWishlisted ? "fill-[#111111] text-[#111111]" : ""
              }`}
            />
          </button>
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.slug || product.id || product._id}`}>
          <h3 className="font-editorial text-base sm:text-[17px] font-normal text-[#111111] group-hover:text-[#8C7A6B] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price & Color Swatches Row */}
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-xs sm:text-sm font-semibold text-[#111111] tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="font-sans text-[11px] text-[#716D66] line-through tabular-nums">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Subtle Color Swatches */}
          {Array.isArray(product.colors) && product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 shrink-0">
              {product.colors.map((colorObj, idx) => {
                const colorStr = typeof colorObj === "string" ? colorObj : (colorObj?.name || String(colorObj || ""));
                const hex = (typeof colorObj === "object" && colorObj?.hex) || COLOR_HEX_MAP[colorStr.toLowerCase()] || "#333333";
                const isSelected = selectedColor === colorObj || colorName === colorStr;
                return (
                  <button
                    key={colorStr + idx}
                    type="button"
                    onClick={(e) => handleColorSelect(e, colorStr)}
                    className={`w-2.5 h-2.5 rounded-full transition-transform cursor-pointer border ${
                      isSelected
                        ? "scale-125 border-[#111111] ring-1 ring-[#111111]"
                        : "border-[#D8D2C8] hover:scale-110"
                    }`}
                    style={{ backgroundColor: hex }}
                    aria-label={`Color ${colorStr}`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Action Bar */}
        <div className="sm:hidden mt-2.5 pt-2 border-t border-[#D8D2C8] flex items-center justify-between text-[11px] font-sans">
          <button
            type="button"
            onClick={() => addToCart(product, "M", selectedColor ? { name: selectedColor } : null, 1)}
            className="text-[#111111] uppercase tracking-wider font-semibold cursor-pointer"
          >
            + Add To Bag
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#716D66] hover:text-[#25D366] uppercase tracking-wider text-[10px]"
          >
            WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
}

const ProductCard = memo(ProductCardComponent);
export default ProductCard;

