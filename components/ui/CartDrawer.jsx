"use client";

import { useState, useEffect, useMemo, useRef, memo } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

// Mini Recommended Products for Cart Upsell
const RECOMMENDED_ITEMS = [
  {
    id: "rec-1",
    name: "Full-Grain Calfskin Belt",
    price: 120,
    image: "/images/lookbook/gor-lookbook-5.webp",
    size: "M",
  },
  {
    id: "rec-2",
    name: "Noir Mulberry Silk Camp Shirt",
    price: 280,
    image: "/images/lookbook/gor-lookbook-2.webp",
    size: "L",
  },
];

// Memoized Cart Item Component for Performance
const CartItemCard = memo(function CartItemCard({ item, onUpdateQty, onRemove, onWishlist, isWishlisted }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
      transition={{ duration: 0.2 }}
      className="flex gap-3.5 bg-[#151515] p-3.5 border border-[#2A2A2A] rounded-[12px] relative group"
    >
      {/* Product Image */}
      <img
        src={item.image || "/images/products/gor-codset-burgundy-alo.webp"}
        alt={item.name}
        className="w-16 sm:w-20 aspect-[3/4] object-cover object-top rounded-[8px] border border-[#2A2A2A] shrink-0"
      />

      {/* Info & Controls */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-editorial text-sm sm:text-base text-[#F8F6F3] truncate pr-2">
              {item.name}
            </h4>
            <button
              type="button"
              onClick={() => onRemove(item.id, item.selectedSize, item.selectedColor?.name)}
              className="text-[#8E8A85] hover:text-[#D86A32] transition-colors shrink-0 cursor-pointer p-1"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1 font-sans text-[10px] text-[#8E8A85]">
            <span className="bg-[#090909] px-2 py-0.5 border border-[#2A2A2A] rounded font-medium">
              Size: {item.selectedSize || "M"}
            </span>
            {item.selectedColor && (
              <span className="bg-[#090909] px-2 py-0.5 border border-[#2A2A2A] rounded flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: typeof item.selectedColor === "object" ? item.selectedColor.hex : "#141414" }}
                />
                {typeof item.selectedColor === "object" ? item.selectedColor.name : item.selectedColor}
              </span>
            )}
          </div>
        </div>

        {/* Stepper & Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-[#2A2A2A] bg-[#090909] rounded-[6px] h-8">
            <button
              type="button"
              onClick={() => onUpdateQty(item.id, item.selectedSize, item.selectedColor?.name, -1)}
              aria-label="Decrease item quantity"
              className="px-2 h-full text-[#8E8A85] hover:text-[#C8A45D] flex items-center justify-center cursor-pointer transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2.5 text-xs text-[#F8F6F3] font-bold price-display">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQty(item.id, item.selectedSize, item.selectedColor?.name, 1)}
              aria-label="Increase item quantity"
              className="px-2 h-full text-[#8E8A85] hover:text-[#C8A45D] flex items-center justify-center cursor-pointer transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onWishlist(item.id)}
              className="text-[#8E8A85] hover:text-[#C8A45D] text-[10px] uppercase tracking-wider font-sans font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Heart className={`w-3 h-3 ${isWishlisted ? "fill-[#C8A45D] text-[#C8A45D]" : ""}`} />
              <span>{isWishlisted ? "Saved" : "Save"}</span>
            </button>
            <span className="font-sans text-sm font-bold text-[#F8F6F3] price-display">
              {formatPrice(item.price * item.quantity)}
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
  const [addedRecId, setAddedRecId] = useState(null);

  const drawerRef = useRef(null);
  const triggerRef = useRef(null);

  const freeShippingThreshold = 500;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // 1. Body Scroll Lock
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

  // 2. Keyboard Focus Trap & Escape Key Close Handler
  useEffect(() => {
    if (!isCartOpen) return;

    // Save active element trigger to restore focus when closed
    triggerRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
      }

      // Focus trap tab navigation
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
    addToCart(item, 1, item.size);
    setAddedRecId(item.id);
    setTimeout(() => setAddedRecId(null), 1500);
  };

  // Memoized Item Cards list
  const memoizedItemList = useMemo(() => {
    return cartItems.map((item) => (
      <CartItemCard
        key={`${item.id}-${item.selectedSize}-${typeof item.selectedColor === "object" ? item.selectedColor.name : item.selectedColor || ""}`}
        item={item}
        onUpdateQty={updateQuantity}
        onRemove={removeFromCart}
        onWishlist={toggleWishlist}
        isWishlisted={wishlist.includes(item.id)}
      />
    ));
  }, [cartItems, updateQuantity, removeFromCart, toggleWishlist, wishlist]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-md"
          />

          {/* ── DESKTOP SLIDE-IN RIGHT DRAWER (Width: 460px) ── */}
          <motion.aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="hidden md:flex fixed top-0 right-0 bottom-0 z-[150] w-full max-w-[460px] bg-[#090909] border-l border-[#2A2A2A] flex-col justify-between overflow-hidden shadow-2xl font-sans"
          >
            {/* Fixed Header */}
            <div className="p-5 border-b border-[#2A2A2A] flex items-center justify-between bg-[#151515] shrink-0">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#C8A45D]" />
                <h3 id="cart-drawer-title" className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                  Shopping Bag ({cartItems.length})
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#8E8A85] hover:text-[#C8A45D] transition-colors cursor-pointer rounded-full hover:bg-[#090909]"
                aria-label="Close shopping bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator Bar */}
            <div className="bg-[#151515] px-5 py-3 border-b border-[#2A2A2A] shrink-0">
              <div className="flex items-center justify-between text-xs font-sans mb-1.5">
                <span className="flex items-center gap-1.5 text-[#F8F6F3] font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#C8A45D]" />
                  {amountNeededForFreeShipping === 0
                    ? "Free Express Shipping Unlocked!"
                    : `Add ${formatPrice(amountNeededForFreeShipping)} for Free Shipping`}
                </span>
                <span className="text-[#C8A45D] font-semibold">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#090909] rounded-full overflow-hidden border border-[#2A2A2A]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-[#C8A45D] rounded-full"
                />
              </div>
            </div>

            {/* Independently Scrollable Items List Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                /* Empty Cart State */
                <div className="h-full flex flex-col items-center justify-center text-center text-[#8E8A85] py-12">
                  <div className="w-16 h-16 rounded-full border border-[#2A2A2A] flex items-center justify-center mb-4 bg-[#151515] text-[#C8A45D] shadow-lg">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className="font-editorial text-2xl text-[#F8F6F3] font-normal">Your shopping bag is empty.</h4>
                  <p className="font-sans text-xs mt-2 max-w-xs text-[#8E8A85] font-light">
                    Explore our latest streetwear collections, designer shirting, and signature accessories.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 px-7 py-3 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px] hover:bg-[#D4B77D] transition-colors cursor-pointer shadow-md active:scale-95"
                  >
                    Explore Collections
                  </button>
                </div>
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {memoizedItemList}
                  </AnimatePresence>

                  {/* Recommended Add-ons Upsell Carousel */}
                  <div className="pt-4 border-t border-[#2A2A2A]">
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C8A45D] font-bold block mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" /> Recommended Add-ons
                    </span>
                    <div className="space-y-2">
                      {RECOMMENDED_ITEMS.map((rec) => (
                        <div
                          key={rec.id}
                          className="flex items-center justify-between p-2.5 bg-[#151515] border border-[#2A2A2A] rounded-[8px]"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={rec.image} alt={rec.name} className="w-10 h-12 object-cover object-top rounded border border-[#2A2A2A]" />
                            <div>
                              <p className="font-editorial text-xs text-[#F8F6F3] line-clamp-1">{rec.name}</p>
                              <p className="font-sans text-xs font-bold text-[#C8A45D] price-display">{formatPrice(rec.price)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddRecommended(rec)}
                            className="px-3 py-1.5 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#C8A45D] text-[10px] uppercase font-sans font-bold rounded cursor-pointer transition-colors"
                          >
                            {addedRecId === rec.id ? <Check className="w-3 h-3" /> : "+ Add"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sticky Fixed Bottom Summary & Order Actions */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-[#2A2A2A] bg-[#151515] space-y-3.5 shrink-0">
                
                {/* Coupon Code Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#C8A45D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. GOR15)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="w-full bg-[#090909] border border-[#2A2A2A] pl-8 pr-3 py-2 text-xs text-[#F8F6F3] placeholder-[#8E8A85]/60 focus:outline-none focus:border-[#C8A45D] rounded-[6px] font-sans uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#090909] text-[#C8A45D] text-xs uppercase font-sans font-bold border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[6px] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {promoMessage && (
                  <p className="text-[11px] text-[#C8A45D] italic">{promoMessage}</p>
                )}

                {/* Subtotal & Totals */}
                <div className="space-y-1.5 text-xs text-[#8E8A85] font-sans pt-1 border-t border-[#2A2A2A]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#F8F6F3] font-semibold price-display">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#D86A32]">
                      <span>VIP Discount</span>
                      <span className="price-display">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#F8F6F3]">
                      {amountNeededForFreeShipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-[#F8F6F3] pt-2 border-t border-[#2A2A2A]">
                    <span>Estimated Total</span>
                    <span className="text-[#C8A45D] price-display">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Minimalist Trust Strip */}
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[9.5px] font-sans uppercase tracking-wider text-[#8E8A85] border-t border-[#2A2A2A]/50">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-[#C8A45D]" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3 h-3 text-[#C8A45D]" />
                    <span>Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3 h-3 text-[#C8A45D]" />
                    <span>Fast Shipping</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3 h-3 text-[#C8A45D]" />
                    <span>100% Original</span>
                  </div>
                </div>

                {/* Actions: Primary & Secondary */}
                <div className="space-y-2 pt-1">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full h-[48px] rounded-[10px] bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Proceed to Checkout — {formatPrice(grandTotal)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center font-sans text-[11px] uppercase tracking-wider text-[#8E8A85] hover:text-[#F8F6F3] transition-colors py-1 cursor-pointer font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.aside>

          {/* ── MOBILE BOTTOM SHEET DRAWER (< 768px) WITH SAFE AREA INSETS ── */}
          <motion.aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title-mobile"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="md:hidden fixed inset-x-0 bottom-0 z-[150] max-h-[90vh] rounded-t-[24px] bg-[#090909] border-t border-[#2A2A2A] flex flex-col justify-between overflow-hidden shadow-2xl font-sans pb-[env(safe-area-inset-bottom)]"
          >
            {/* Sheet Handle Bar & Header */}
            <div className="shrink-0 bg-[#151515] border-b border-[#2A2A2A]">
              <div className="w-12 h-1 bg-[#2A2A2A] rounded-full mx-auto my-2.5" />

              <div className="px-5 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#C8A45D]" />
                  <h3 id="cart-drawer-title-mobile" className="font-editorial text-xl font-normal text-[#F8F6F3]">
                    Shopping Bag ({cartItems.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-[#8E8A85] hover:text-[#C8A45D]"
                  aria-label="Close shopping bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Scrollable Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="py-12 text-center text-[#8E8A85]">
                  <ShoppingBag className="w-10 h-10 text-[#C8A45D]/40 mx-auto mb-3" />
                  <h4 className="font-editorial text-xl text-[#F8F6F3]">Your shopping bag is empty.</h4>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-2.5 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px]"
                  >
                    Explore Collections
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
              <div className="p-4 border-t border-[#2A2A2A] bg-[#151515] space-y-2 shrink-0">
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-[#8E8A85]">Estimated Total</span>
                  <span className="text-[#C8A45D] font-bold price-display">{formatPrice(grandTotal)}</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full h-[48px] rounded-[12px] bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <span>Proceed to Checkout — {formatPrice(grandTotal)}</span>
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
