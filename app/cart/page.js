"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CartDrawer from "@/components/ui/CartDrawer";
import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shipping,
    tax,
    grandTotal,
    promoCode,
    applyPromoCode,
    totalItemsCount,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState(null); // { type: 'success'|'error', text }

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    const result = applyPromoCode(promoInput.trim());
    setPromoMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
  };

  /* ─── Empty State ─── */
  if (cartItems.length === 0) {
    return (
      <>
        <NoiseOverlay />
        <Navbar />
        <main className="min-h-screen bg-gor-black bg-noise text-gor-offwhite flex flex-col items-center justify-center pt-24 pb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-md"
          >
            <div className="w-24 h-24 rounded-full border-2 border-gor-gold/30 bg-gor-card flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-10 h-10 text-gor-gold/50" />
            </div>
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-gor-gold font-medium flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Your Atelier Bag
            </span>
            <h1 className="font-serif text-4xl font-bold text-gor-offwhite mb-4">
              YOUR BAG IS EMPTY
            </h1>
            <p className="text-sm text-gor-grey font-light leading-relaxed mb-8">
              Explore our handcrafted co-ord sets, designer shirting, and statement outerwear to begin building your wardrobe.
            </p>
            <Link href="/shop">
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Browse Collections
              </Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gor-black bg-noise text-gor-offwhite pt-28 pb-20"
      >
        <Container>
          {/* Header */}
          <div className="mb-10">
            <nav className="text-xs text-gor-grey font-sans uppercase tracking-widest mb-4 flex items-center gap-2">
              <Link href="/" className="hover:text-gor-gold">Home</Link>
              <span>/</span>
              <span className="text-gor-gold font-semibold">Shopping Bag</span>
            </nav>
            <div className="flex items-end justify-between">
              <div>
                <span className="font-sans text-xs uppercase tracking-[0.3em] text-gor-gold font-medium">
                  GOR Atelier
                </span>
                <h1 className="mt-1 font-serif text-4xl sm:text-5xl font-bold text-gor-offwhite">
                  YOUR BAG ({totalItemsCount})
                </h1>
              </div>
              <Link
                href="/shop"
                className="text-xs uppercase tracking-[0.2em] text-gor-gold hover:text-gor-gold-light border-b border-gor-gold pb-0.5 transition-colors hidden sm:block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* ─── Left: Cart Items ─── */}
            <div className="lg:col-span-7 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor?.name}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className="flex gap-4 sm:gap-6 bg-gor-card border border-gor-gold/15 p-4 sm:p-5 group"
                  >
                    {/* Product image */}
                    <Link href={`/product/${item.id}`} className="flex-shrink-0">
                      <div className="w-20 sm:w-28 aspect-[4/5] overflow-hidden border border-gor-gold/10">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-top luxury-image-filter group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/product/${item.id}`}>
                            <h3 className="font-serif text-sm sm:text-base font-semibold text-gor-offwhite hover:text-gor-gold transition-colors line-clamp-2 leading-snug">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] uppercase tracking-widest text-gor-grey">
                            <span>Size: <span className="text-gor-offwhite font-medium">{item.selectedSize}</span></span>
                            {item.selectedColor && (
                              <span className="flex items-center gap-1.5">
                                Colour:
                                <span
                                  className="w-3 h-3 rounded-full border border-gor-gold/30 inline-block"
                                  style={{ backgroundColor: item.selectedColor.hex }}
                                />
                                <span className="text-gor-offwhite font-medium">{item.selectedColor.name}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor?.name ?? "default")}
                          aria-label="Remove item"
                          className="p-1.5 text-gor-grey hover:text-gor-rust transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity stepper */}
                        <div className="flex items-center border border-gor-gold/25 bg-gor-black h-9">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor?.name ?? "default", -1)}
                            className="w-8 h-full flex items-center justify-center text-gor-grey hover:text-gor-gold transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-sans text-xs font-bold text-gor-offwhite select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor?.name ?? "default", 1)}
                            className="w-8 h-full flex items-center justify-center text-gor-grey hover:text-gor-gold transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Line total */}
                        <div className="text-right">
                          <p className="font-sans text-base font-bold text-gor-gold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] text-gor-grey">
                              {formatPrice(item.price)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Guarantees bar */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gor-gold/10 bg-gor-card p-5">
                {[
                  { icon: Truck, text: "Complimentary express shipping on orders over $1,000" },
                  { icon: RotateCcw, text: "30-day hassle-free returns & exchanges" },
                  { icon: ShieldCheck, text: "Delivered in GOR signature gift packaging" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3 text-xs text-gor-grey">
                    <Icon className="w-4 h-4 text-gor-gold flex-shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Right: Order Summary ─── */}
            <div className="lg:col-span-5">
              <div className="bg-gor-card border-2 border-gor-gold/30 p-6 sm:p-8 space-y-6 sticky top-28 gold-glow">
                <h2 className="font-serif text-xl font-bold text-gor-offwhite border-b border-gor-gold/20 pb-5">
                  ORDER SUMMARY
                </h2>

                {/* Promo code */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gor-grey mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-gor-gold" /> Promo Code
                  </p>
                  {promoCode ? (
                    <div className="flex items-center justify-between bg-gor-gold/10 border border-gor-gold/40 px-4 py-3">
                      <span className="text-xs font-mono font-bold text-gor-gold">{promoCode} — 15% OFF</span>
                      <X className="w-4 h-4 text-gor-gold" />
                    </div>
                  ) : (
                    <form onSubmit={handlePromoSubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="GORVIP or ATELIER15"
                        className="flex-1 bg-gor-black border border-gor-gold/20 px-3 py-2.5 text-xs text-gor-offwhite placeholder-gor-grey/50 focus:outline-none focus:border-gor-gold font-mono uppercase tracking-widest"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-gor-gold text-gor-navy text-xs font-bold uppercase tracking-wider hover:bg-gor-gold-light transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoMessage && (
                    <p className={`text-[11px] mt-2 font-medium ${promoMessage.type === "success" ? "text-gor-gold" : "text-gor-rust"}`}>
                      {promoMessage.text}
                    </p>
                  )}
                </div>

                {/* Cost breakdown */}
                <div className="space-y-3 text-xs text-gor-grey pt-2 border-t border-gor-gold/10">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItemsCount} items)</span>
                    <span className="text-gor-offwhite font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-gor-gold">
                      <span>VIP Atelier Discount (15%)</span>
                      <span>−{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Express Shipping</span>
                    <span className="text-gor-offwhite font-medium">
                      {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-gor-offwhite font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gor-gold pt-3 border-t border-gor-gold/20">
                    <span>Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link href="/checkout" className="block">
                  <Button variant="primary" size="lg" icon={ArrowRight} className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>

                <p className="text-[10px] text-center text-gor-grey/60 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gor-gold" /> 256-bit SSL Encrypted &amp; Secure
                </p>
              </div>
            </div>
          </div>
        </Container>
      </motion.main>

      <CartDrawer />
      <Footer />
    </>
  );
}
