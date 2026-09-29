"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

export default function ProductGallery({
  mediaList = [],
  productName = "Garment",
  selectedColor = null,
  isWishlisted = false,
  onWishlistToggle = () => {},
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // When color changes, check if any image filename or label matches the color name
  useEffect(() => {
    if (!selectedColor || !mediaList.length) return;
    const colorStr = (
      typeof selectedColor === "string" ? selectedColor : selectedColor.name || ""
    ).toLowerCase().trim();

    if (!colorStr) return;

    const matchedIdx = mediaList.findIndex((m) => {
      const src = (m.src || "").toLowerCase();
      return src.includes(colorStr);
    });

    if (matchedIdx !== -1) {
      setSelectedIndex(matchedIdx);
    }
  }, [selectedColor, mediaList]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40 && selectedIndex < mediaList.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    }
    if (distance < -40 && selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const currentMedia = mediaList[selectedIndex] || {
    src: "/images/lookbook/gor-lookbook-1.webp",
  };

  const totalCount = mediaList.length || 1;

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 w-full select-none">
      {/* ── VERTICAL THUMBNAIL RAIL (Desktop Vertical Left / Mobile Horizontal) ── */}
      {mediaList.length > 1 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto lg:max-h-[640px] scrollbar-none pb-1 lg:pb-0 shrink-0">
          {mediaList.map((mediaItem, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View image ${idx + 1} of ${productName}`}
                className={`relative w-16 lg:w-20 aspect-[3/4] bg-[#E9E5DD] overflow-hidden border transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? "border-[#111111] opacity-100 ring-1 ring-[#111111]"
                    : "border-[#D8D2C8] opacity-60 hover:opacity-100 hover:border-[#111111]"
                }`}
              >
                <Image
                  src={mediaItem.src}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover object-top"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* ── LARGE PRIMARY IMAGE STAGE (3:4 Ratio) ── */}
      <div
        className="relative aspect-[3/4] w-full bg-[#E9E5DD] border border-[#D8D2C8] overflow-hidden flex-1 group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.85 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full relative"
          >
            <Image
              src={currentMedia.src}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              fill
              priority
              unoptimized
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        {/* Wishlist Button top-right */}
        <button
          type="button"
          onClick={onWishlistToggle}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-4 right-4 z-20 p-2.5 bg-[#F5F2EC]/90 border border-[#D8D2C8] text-[#111111] hover:bg-[#F5F2EC] transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 stroke-[1.5] ${
              isWishlisted ? "fill-[#111111] text-[#111111]" : ""
            }`}
          />
        </button>

        {/* Counter bottom-left */}
        {totalCount > 1 && (
          <div className="absolute bottom-4 left-4 z-20 bg-[#F5F2EC]/90 border border-[#D8D2C8] px-2.5 py-1 font-mono text-[10px] text-[#111111] tracking-widest uppercase">
            {String(selectedIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
          </div>
        )}

        {/* Mobile Navigation Arrows */}
        {totalCount > 1 && (
          <div className="lg:hidden absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1))
              }
              aria-label="Previous image"
              className="p-1.5 bg-[#F5F2EC]/80 border border-[#D8D2C8] pointer-events-auto text-[#111111]"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0))
              }
              aria-label="Next image"
              className="p-1.5 bg-[#F5F2EC]/80 border border-[#D8D2C8] pointer-events-auto text-[#111111]"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
