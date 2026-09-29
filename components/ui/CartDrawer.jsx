"use client";

import { useEffect, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

// Memoized Cart Item Card
const CartItemCard = memo(function CartItemCard({ item, onUpdateQty, onRemove }) {
  const colorName =
    typeof item.selectedColor === "object"
      ? item.selectedColor?.name
      : item.selectedColor;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex gap-4 py-4 border-b border-[#D8D2C8]"
    >
      {/* Product Thumbnail */}
      <div className="relative w-20 aspect-[3/4] bg-[#E9E5DD] overflow-hidden shrink-0 border border-[#D8D2C8]">
        <Image
          src={item.image || "/images/lookbook/gor-lookbook-1.webp"}
          alt={item.name}
          fill
          unoptimized
          className="object-cover object-top"
        />
      </div>

      {/* Info & Quantity */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-editorial text-lg text-[#111111] leading-snug truncate">
              {item.name}
            </h4>
            <button
              type="button"
              onClick={() => onRemove(item.id || item._id, item.selectedSize, colorName)}
              className="text-[#716D66] hover:text-[#111111] transition-colors p-0.5 cursor-pointer"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>

          {/* Color & Size Specs */}
          <div className="font-sans text-[11px] text-[#716D66] mt-1 space-x-2">
            {colorName && <span>Color: {colorName}</span>}
            {colorName && item.selectedSize && <span>/</span>}
            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
          </div>
        </div>

        {/* Stepper & Price Row */}
        <div className="flex items-center justify-between pt-2">
          {/* Architectural Quantity Stepper */}
          <div className="flex items-center border border-[#D8D2C8] bg-white h-7">
            <button
              type="button"
              onClick={() => onUpdateQty(item.id || item._id, item.selectedSize, colorName, -1)}
              aria-label="Decrease quantity"
              className="w-7 h-full text-[#716D66] hover:text-[#111111] flex items-center justify-center cursor-pointer transition-colors"
            >
              <Minus className="w-3 h-3 stroke-[1.5]" />
            </button>
            <span className="w-7 text-center font-sans text-xs text-[#111111] font-medium">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQty(item.id || item._id, item.selectedSize, colorName, 1)}
              aria-label="Increase quantity"
              className="w-7 h-full text-[#716D66] hover:text-[#111111] flex items-center justify-center cursor-pointer transition-colors"
            >
              <Plus className="w-3 h-3 stroke-[1.5]" />
            </button>
          </div>

          {/* Price */}
          <span className="font-sans text-xs font-semibold text-[#111111]">
            {formatPrice((item.price || 0) * item.quantity)}
          </span>
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
    subtotal,
    totalItemsCount,
  } = useCart();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) setIsCartOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll when drawer is open
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

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[99999] select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[#111111]/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#F5F2EC] text-[#111111] shadow-2xl flex flex-col z-10 border-l border-[#D8D2C8]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#D8D2C8] flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#716D66] font-semibold block">
                  BAG ({totalItemsCount})
                </span>
                <h3 className="font-editorial text-2xl font-normal text-[#111111]">
                  Shopping Bag
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart drawer"
                className="p-1.5 text-[#111111] hover:text-[#716D66] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Content / Items List */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#716D66]">
                    00 / EMPTY
                  </span>
                  <h4 className="font-editorial text-3xl font-normal text-[#111111]">
                    YOUR BAG IS EMPTY
                  </h4>
                  <p className="font-sans text-xs text-[#716D66] font-light max-w-xs leading-relaxed">
                    Explore the GOR collection and add refined silhouettes to your wardrobe.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-6 py-3 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                  >
                    EXPLORE SHOP
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <CartItemCard
                        key={`${item.id || item._id}-${item.selectedSize}-${
                          typeof item.selectedColor === "object"
                            ? item.selectedColor?.name
                            : item.selectedColor
                        }`}
                        item={item}
                        onUpdateQty={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer / Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#D8D2C8] bg-[#EFECE6]/50 space-y-4">
                <div className="flex items-center justify-between font-sans text-xs text-[#716D66]">
                  <span className="uppercase tracking-[0.2em]">Subtotal</span>
                  <span className="text-[#111111] font-semibold text-sm">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="font-sans text-[11px] text-[#716D66] font-light leading-relaxed">
                  Complimentary express shipping & taxes calculated at checkout.
                </p>

                <div className="pt-1 space-y-2">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full py-4 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-xs uppercase tracking-[0.2em] font-medium text-center transition-colors"
                  >
                    CHECKOUT / ORDER
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full py-2.5 text-center font-sans text-[11px] uppercase tracking-[0.15em] text-[#716D66] hover:text-[#111111] transition-colors"
                  >
                    VIEW FULL BAG
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
