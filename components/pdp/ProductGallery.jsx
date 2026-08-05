"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  Heart,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

export default function ProductGallery({
  mediaList = [],
  productName = "Luxury Garment",
  badge = null,
  isWishlisted = false,
  onWishlistToggle = () => {},
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [wishlistBurst, setWishlistBurst] = useState(false);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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

  // Touch handlers for swipe
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

  // Mouse move handler for Desktop Hover Zoom
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleWishlistClick = () => {
    onWishlistToggle();
    setWishlistBurst(true);
    setTimeout(() => setWishlistBurst(false), 500);
  };

  const currentMedia = mediaList[selectedIndex] || {
    type: "image",
    src: "/images/products/gor-codset-burgundy-alo.webp",
    label: "Main View",
  };

  const totalCount = mediaList.length || 1;
  const counterText = `${String(selectedIndex + 1).padStart(2, "0")} / ${String(totalCount).padStart(2, "0")}`;

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 w-full select-none">
      {/* ── VERTICAL THUMBNAIL RAIL (Desktop Vertical Left / Mobile Horizontal Scroll) ── */}
      {mediaList.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[720px] scrollbar-none pb-2 lg:pb-0 shrink-0">
          {mediaList.map((mediaItem, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedIndex(idx);
                setIsZoomed(false);
              }}
              aria-label={`Select product image ${idx + 1}`}
              className={`relative w-16 lg:w-20 aspect-[3/4] rounded-lg border transition-all duration-300 overflow-hidden shrink-0 cursor-pointer ${
                selectedIndex === idx
                  ? "border-[#C9A86A] scale-105 opacity-100 ring-2 ring-[#C9A86A]/40 shadow-lg"
                  : "border-[#2A2A2A] opacity-60 hover:opacity-100 hover:border-white/40"
              }`}
            >
              {mediaItem.type === "video" ? (
                <div className="w-full h-full bg-[#111111] flex items-center justify-center text-[#C9A86A] relative">
                  <Play className="w-5 h-5 fill-[#C9A86A]" />
                  <span className="absolute bottom-1 right-1 font-mono text-[8px] bg-black/80 px-1 rounded text-white">
                    VID
                  </span>
                </div>
              ) : (
                <Image
                  src={mediaItem.src}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover object-top"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── HERO IMAGE STAGE ── */}
      <div
        className="relative aspect-[3/4] w-full bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden group flex-1 shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {/* Animated Image Swap */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.85 }}
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
              <div
                className="w-full h-full overflow-hidden cursor-zoom-in relative"
                onClick={() => setIsFullscreen(true)}
              >
                <div
                  className="w-full h-full transition-transform duration-300 ease-out"
                  style={{
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: isZoomed ? "scale(1.75)" : "scale(1)",
                  }}
                >
                  <Image
                    src={currentMedia.src}
                    alt={productName}
                    fill
                    priority={selectedIndex === 0}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    unoptimized
                    className="object-cover object-top filter brightness-[0.98] contrast-[1.02]"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── REFINEMENT #4: IMAGE COUNTER ── */}
        <div className="absolute top-4 left-4 z-10 font-mono text-[10px] font-bold uppercase tracking-widest bg-[#0B0B0B]/85 text-[#F7F5F2] px-3 py-1.5 rounded-md border border-[#2A2A2A] backdrop-blur-md shadow-md">
          {counterText}
        </div>

        {/* Dynamic Badge */}
        {badge && (
          <div className="absolute top-4 left-24 z-10 font-sans text-[9px] uppercase tracking-[0.2em] font-extrabold bg-[#D86A32]/95 text-[#F7F5F2] px-3 py-1.5 border border-[#D86A32]/50 rounded-md backdrop-blur-md shadow-md">
            {badge}
          </div>
        )}

        {/* Wishlist Toggle with Burst */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label="Toggle Wishlist"
          className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0B0B0B]/85 border border-[#2A2A2A] flex items-center justify-center text-[#F7F5F2] hover:text-[#C9A86A] transition-all duration-200 backdrop-blur-md cursor-pointer shadow-lg ${
            wishlistBurst ? "scale-125 ring-4 ring-[#C9A86A]/40" : "active:scale-95"
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-[#C9A86A] text-[#C9A86A]" : ""
            }`}
          />
        </button>

        {/* ── REFINEMENT #4: ZOOM INDICATOR ── */}
        <div className="absolute bottom-4 left-4 z-10 font-sans text-[10px] uppercase tracking-wider text-[#B8B6B0] bg-[#0B0B0B]/85 px-3 py-1.5 rounded-full border border-[#2A2A2A] backdrop-blur-md hidden sm:flex items-center gap-1.5">
          <Search className="w-3 h-3 text-[#C9A86A]" />
          <span>{isZoomed ? "Zoom Active" : "Hover to Zoom"}</span>
        </div>

        {/* ── REFINEMENT #4: FULLSCREEN ICON ── */}
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          aria-label="Open Fullscreen Gallery"
          className="absolute bottom-4 right-4 z-10 p-2.5 rounded-full bg-[#0B0B0B]/85 border border-[#2A2A2A] text-[#F7F5F2] hover:text-[#C9A86A] transition-colors backdrop-blur-md cursor-pointer flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* ── FULLSCREEN LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close Lightbox"
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-[#111111] border border-[#2A2A2A] text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Counter Header */}
            <div className="absolute top-6 left-6 z-10 font-mono text-xs text-[#C9A86A] font-bold uppercase tracking-widest bg-[#111111] border border-[#2A2A2A] px-4 py-2 rounded-lg">
              {productName} • {counterText}
            </div>

            {/* Navigation Controls */}
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))
              }
              aria-label="Previous image"
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-[#111111] border border-[#2A2A2A] text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer hidden sm:flex shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() =>
                setSelectedIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))
              }
              aria-label="Next image"
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-[#111111] border border-[#2A2A2A] text-[#F7F5F2] hover:text-[#C9A86A] transition-colors cursor-pointer hidden sm:flex shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Image Box */}
            <div className="max-w-4xl max-h-[85vh] w-full h-full relative flex items-center justify-center">
              {currentMedia.type === "video" ? (
                <video src={currentMedia.src} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg" />
              ) : (
                <div className="relative w-full h-full max-h-[85vh]">
                  <Image
                    src={currentMedia.src}
                    alt={productName}
                    fill
                    unoptimized
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
