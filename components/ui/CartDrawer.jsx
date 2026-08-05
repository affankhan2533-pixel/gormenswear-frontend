"use client";

import { useState, useEffect, useMemo, useRef, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Heart,
  Truck,
  Sparkles,
  Check,
  Award,
  Lock,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { productService } from "@/lib/productService";

// Memoized Cart Item Component for Performance & Smooth Animation
const CartItemCard = memo(function CartItemCard({ item, onUpdateQty, onRemove, onWishlist, isWishlisted }) {
  const colorName = typeof item.selectedColor === "object" ? item.selectedColor?.name : item.selectedColor;
  const colorHex = typeof item.selectedColor === "object" ? item.selectedColor?.hex : "#111111";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3.5 bg-[#111111] p-3.5 border border-[#2A2A2A] rounded-2xl relative group select-none shadow-md"
    >
      {/* Product Image */}
      <div className="relative w-20 aspect-[3/4] rounded-xl overflow-hidden border border-[#2A2A2A] shrink-0 bg-[#0B0B0B]">
        <Image
          src={item.image || "/images/lookbook/gor-lookbook-1.webp"}
          alt={item.name}
          fill
          unoptimized
          className="object-cover object-top filter brightness-[0.98]"
        />
      </div>

      {/* Info & Controls */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-serif text-sm text-[#F7F5F2] truncate pr-1">
              {item.name}
            </h4>
            <button
              type="button"
              onClick={() => onRemove(item.id || item._id, item.selectedSize, colorName)}
              className="text-[#B8B6B0] hover:text-[#D86A32] transition-colors shrink-0 cursor-pointer p-1"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1.5 font-sans text-[10px] text-[#B8B6B0]">
            <span className="bg-[#0B0B0B] px-2 py-0.5 border border-[#2A2A2A] rounded-md font-semibold uppercase">
              Size: {item.selectedSize || "M"}
            </span>
            {colorName && (
              <span className="bg-[#0B0B0B] px-2 py-0.5 border border-[#2A2A2A] rounded-md flex items-center gap-1.5 font-semibold">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: colorHex || "#111111" }}
                />
                {colorName}
              </span>
            )}
          </div>
        </div>

        {/* Luxury Stepper & Actions Row */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#2A2A2A]/50">
          <div className="flex items-center border border-[#2A2A2A] bg-[#0B0B0B] rounded-lg h-8">
            <button
              type="button"
              onClick={() => onUpdateQty(item.id || item._id, item.selectedSize, colorName, -1)}
              aria-label="Decrease item quantity"
              className="px-2.5 h-full text-[#B8B6B0] hover:text-[#C9A86A] flex items-center justify-center cursor-pointer transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs text-[#F7F5F2] font-bold price-display min-w-[20px] text-center">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQty(item.id || item._id, item.selectedSize, colorName, 1)}
              aria-label="Increase item quantity"
              className="px-2.5 h-full text-[#B8B6B0] hover:text-[#C9A86A] flex items-center justify-center cursor-pointer transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onWishlist(item.id || item._id)}
              className="text-[#B8B6B0] hover:text-[#C9A86A] text-[10px] uppercase tracking-wider font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-[#C9A86A] text-[#C9A86A]" : ""}`} />
              <span>{isWishlisted ? "Saved" : "Save"}</span>
            </button>
            <span className="font-sans text-sm font-bold text-[#F7F5F2] price-display">
              {formatPrice((item.price || 0) * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    addToCart,
    toggleWishlist,
    wishlist,
    subtotal,
    discountAmount,
    shipping,
    grandTotal,
    applyPromoCode,
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [addedRecId, setAddedRecId] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const drawerRef = useRef(null);
  const triggerRef = useRef(null);

  const freeShippingThreshold = 500;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Fetch real recommended products for upsell
  useEffect(() => {
    if (!isCartOpen) return;
    productService.getProducts().then((prods) => {
      if (Array.isArray(prods) && prods.length > 0) {
        setRecommendedProducts(prods.slice(0, 4));
      }
    });
  }, [isCartOpen]);

  // 1. Lock Body Scroll on open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // 2. Keyboard & ESC Navigation
  useEffect(() => {
    if (!isCartOpen) return;

    triggerRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (triggerRef.current && typeof triggerRef.current.focus === "function") {
        triggerRef.current.focus();
      }
    };
  }, [isCartOpen, setIsCartOpen]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode.trim());
    setPromoMessage(res.message);
  };

  const handleAddRecommended = (item) => {
    addToCart(item, "M", item.colors?.[0] || { name: "Onyx Black", hex: "#111111" }, 1);
    setAddedRecId(item.id || item._id);
    setTimeout(() => setAddedRecId(null), 1500);
  };

  // Memoized Item Cards list
  const memoizedItemList = useMemo(() => {
    return cartItems.map((item, idx) => {
      const colorName = typeof item.selectedColor === "object" ? item.selectedColor?.name : item.selectedColor;
      return (
        <CartItemCard
          key={`${item.id || item._id || idx}-${item.selectedSize}-${colorName || ""}`}
          item={item}
          onUpdateQty={updateQuantity}
          onRemove={removeFromCart}
          onWishlist={toggleWishlist}
          isWishlisted={wishlist.includes(item.id || item._id)}
        />
      );
    });
  }, [cartItems, updateQuantity, removeFromCart, toggleWishlist, wishlist]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* DESKTOP RIGHT SLIDE-OVER DRAWER */}
          <motion.aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="hidden md:flex fixed top-0 right-0 bottom-0 z-[150] w-full max-w-[480px] sm:w-[480px] bg-[#0B0B0B] border-l border-[#2A2A2A] flex-col justify-between overflow-hidden shadow-2xl font-sans text-[#F7F5F2] select-none"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#2A2A2A] flex items-center justify-between bg-[#111111] shrink-0 sticky top-0 z-20">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#C9A86A]" />
                <h3 id="cart-drawer-title" className="font-serif text-2xl font-normal text-[#F7F5F2]">
                  Shopping Bag ({cartItems.length})
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#0B0B0B] border border-[#2A2A2A] text-[#B8B6B0] hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Close shopping bag"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dynamic Free Shipping Progress Bar */}
            <div className="bg-[#111111] px-5 py-3 border-b border-[#2A2A2A] shrink-0">
              <div className="flex items-center justify-between text-xs font-sans mb-1.5">
                <span className="flex items-center gap-1.5 text-[#F7F5F2] font-semibold">
                  <Truck className="w-3.5 h-3.5 text-[#C9A86A]" />
                  {amountNeededForFreeShipping === 0
                    ? "Free Express Shipping Unlocked!"
                    : `You're ${formatPrice(amountNeededForFreeShipping)} away from Free Shipping.`}
                </span>
                <span className="text-[#C9A86A] font-bold font-mono">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#0B0B0B] rounded-full overflow-hidden border border-[#2A2A2A]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#C9A86A] to-[#D4B57C] rounded-full"
                />
              </div>
            </div>

            {/* Scrollable Items List Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                /* LUXURY EMPTY STATE */
                <div className="h-full flex flex-col items-center justify-center text-center text-[#B8B6B0] py-16">
                  <div className="w-16 h-16 rounded-full border border-[#2A2A2A] flex items-center justify-center mb-4 bg-[#111111] text-[#C9A86A] shadow-inner">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-3xl text-[#F7F5F2] font-normal">Your shopping bag is empty.</h4>
                  <p className="font-sans text-xs mt-2 max-w-xs text-[#B8B6B0] font-light leading-relaxed">
                    Explore our latest streetwear collections, designer shirting, and signature accessories.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 px-8 py-3.5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#D4B57C] transition-colors cursor-pointer shadow-lg active:scale-95"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {memoizedItemList}
                  </AnimatePresence>

                  {/* Horizontal Scroll Real Product Recommendations */}
                  {recommendedProducts.length > 0 && (
                    <div className="pt-5 border-t border-[#2A2A2A]">
                      <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-bold block mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" /> Complete Your Look
                      </span>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                        {recommendedProducts.map((rec) => {
                          const recId = rec.id || rec._id;
                          const recImg = rec.image || rec.imageUrl || (Array.isArray(rec.images) && rec.images[0]) || "/images/lookbook/gor-lookbook-1.webp";
                          return (
                            <div
                              key={recId}
                              className="w-[180px] shrink-0 bg-[#111111] border border-[#2A2A2A] rounded-xl p-2.5 flex flex-col justify-between snap-start"
                            >
                              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#0B0B0B] mb-2">
                                <Image src={recImg} alt={rec.name} fill unoptimized className="object-cover object-top" />
                              </div>
                              <div>
                                <p className="font-serif text-xs text-[#F7F5F2] line-clamp-1 mb-0.5">{rec.name}</p>
                                <p className="font-sans text-xs font-bold text-[#C9A86A] price-display">{formatPrice(rec.price)}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddRecommended(rec)}
                                className="mt-2 w-full py-1.5 bg-[#0B0B0B] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#C9A86A] text-[10px] uppercase font-sans font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1"
                              >
                                {addedRecId === recId ? <Check className="w-3 h-3 text-[#C9A86A]" /> : "+ Add to Bag"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sticky Fixed Bottom Summary & Order Actions */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-[#2A2A2A] bg-[#111111] space-y-3.5 shrink-0 sticky bottom-0 z-20">
                
                {/* Minimal Expandable Promo Code Section */}
                <div className="border-b border-[#2A2A2A] pb-3">
                  <button
                    type="button"
                    onClick={() => setPromoExpanded(!promoExpanded)}
                    className="w-full flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider text-[#B8B6B0] hover:text-[#C9A86A] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#C9A86A]" /> Have a Promo Code?
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${promoExpanded ? "rotate-180 text-[#C9A86A]" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {promoExpanded && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleApplyPromo}
                        className="mt-3 flex gap-2 overflow-hidden"
                      >
                        <input
                          type="text"
                          placeholder="PROMO CODE"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value)}
                          className="flex-1 bg-[#0B0B0B] border border-[#2A2A2A] px-3 py-2 text-xs text-[#F7F5F2] placeholder-[#B8B6B0]/50 focus:outline-none focus:border-[#C9A86A] rounded-xl font-sans uppercase font-bold"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#0B0B0B] text-[#C9A86A] text-xs uppercase font-sans font-bold border border-[#2A2A2A] hover:border-[#C9A86A] rounded-xl transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {promoMessage && (
                    <p className="text-[11px] text-[#C9A86A] font-semibold mt-1.5">{promoMessage}</p>
                  )}
                </div>

                {/* Subtotal, Discounts & Totals */}
                <div className="space-y-1.5 text-xs text-[#B8B6B0] font-sans">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#F7F5F2] font-bold price-display">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#D86A32]">
                      <span>VIP Discount</span>
                      <span className="price-display">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#F7F5F2] font-semibold">
                      {amountNeededForFreeShipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="text-[#F7F5F2] font-semibold">Calculated at Checkout</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-[#F7F5F2] pt-2 border-t border-[#2A2A2A]">
                    <span>Estimated Total</span>
                    <span className="text-[#C9A86A] price-display">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Minimalist Trust Strip */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-sans uppercase tracking-wider text-[#B8B6B0] pt-2 border-t border-[#2A2A2A]/50">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>Easy Exchange</span>
                  </div>
                </div>

                {/* Actions: Primary & Secondary */}
                <div className="space-y-2 pt-1">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full h-12 bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>PROCEED TO CHECKOUT — {formatPrice(grandTotal)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center font-sans text-[11px] uppercase tracking-wider text-[#B8B6B0] hover:text-[#F7F5F2] transition-colors py-1 cursor-pointer font-bold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.aside>

          {/* MOBILE FULL-WIDTH BOTTOM SHEET DRAWER */}
          <motion.aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title-mobile"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="md:hidden fixed inset-x-0 bottom-0 z-[150] max-h-[92vh] rounded-t-3xl bg-[#0B0B0B] border-t border-[#2A2A2A] flex flex-col justify-between overflow-hidden shadow-2xl font-sans text-[#F7F5F2] pb-[env(safe-area-inset-bottom)]"
          >
            {/* Handle & Header */}
            <div className="shrink-0 bg-[#111111] border-b border-[#2A2A2A]">
              <div className="w-12 h-1 bg-[#2A2A2A] rounded-full mx-auto my-2.5" />
              <div className="px-5 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#C9A86A]" />
                  <h3 id="cart-drawer-title-mobile" className="font-serif text-xl font-normal text-[#F7F5F2]">
                    Shopping Bag ({cartItems.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#0B0B0B] border border-[#2A2A2A] text-[#B8B6B0] flex items-center justify-center"
                  aria-label="Close shopping bag"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Scrollable Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="py-12 text-center text-[#B8B6B0]">
                  <ShoppingBag className="w-10 h-10 text-[#C9A86A]/40 mx-auto mb-3" />
                  <h4 className="font-serif text-2xl text-[#F7F5F2]">Your shopping bag is empty.</h4>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-3 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {memoizedItemList}
                </AnimatePresence>
              )}
            </div>

            {/* Mobile Fixed Bottom Checkout Bar */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-[#2A2A2A] bg-[#111111] space-y-3 shrink-0">
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-[#B8B6B0]">Estimated Total</span>
                  <span className="text-[#C9A86A] font-bold price-display">{formatPrice(grandTotal)}</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full h-12 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-98"
                >
                  <span>PROCEED TO CHECKOUT — {formatPrice(grandTotal)}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
