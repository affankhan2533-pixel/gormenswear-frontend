"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItemsCount,
  } = useCart();

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#111111] flex flex-col selection:bg-[#111111] selection:text-[#F5F2EC]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 pt-28 sm:pt-36 pb-24">
        {/* Subtle Breadcrumbs */}
        <nav className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#716D66] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-[#111111]">SHOPPING BAG</span>
        </nav>

        {/* Editorial Page Title */}
        <div className="border-b border-[#D8D2C8] pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#716D66] block mb-1">
              CURRENT SELECTION
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-[#111111] font-normal tracking-tight">
              SHOPPING BAG ({totalItemsCount})
            </h1>
          </div>
          <Link
            href="/shop"
            className="font-sans text-xs uppercase tracking-[0.2em] text-[#716D66] hover:text-[#111111] transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <span>CONTINUE BROWSING</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#716D66] block">
              00 / EMPTY
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#111111]">
              YOUR BAG IS EMPTY
            </h2>
            <p className="font-sans text-xs text-[#716D66] font-light leading-relaxed">
              Explore our considered silhouettes, refined fabrics, and signature menswear collections.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors"
              >
                EXPLORE SHOP
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left: Product List */}
            <div className="lg:col-span-8 divide-y divide-[#D8D2C8]">
              <AnimatePresence>
                {cartItems.map((item) => {
                  const colorName =
                    typeof item.selectedColor === "object"
                      ? item.selectedColor?.name
                      : item.selectedColor;

                  return (
                    <motion.div
                      key={`${item.id || item._id}-${item.selectedSize}-${colorName}`}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      className="py-6 first:pt-0 flex gap-5 sm:gap-6"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        href={`/product/${item.id || item._id}`}
                        className="relative w-24 sm:w-28 aspect-[3/4] bg-[#E9E5DD] overflow-hidden shrink-0 border border-[#D8D2C8]"
                      >
                        <Image
                          src={item.image || "/images/lookbook/gor-lookbook-1.webp"}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover object-top"
                        />
                      </Link>

                      {/* Item Details & Stepper */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <Link href={`/product/${item.id || item._id}`}>
                              <h3 className="font-editorial text-xl sm:text-2xl text-[#111111] hover:text-[#8C7A6B] transition-colors leading-tight">
                                {item.name}
                              </h3>
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(item.id || item._id, item.selectedSize, colorName)
                              }
                              className="text-[#716D66] hover:text-[#111111] transition-colors p-1 cursor-pointer"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="w-4 h-4 stroke-[1.5]" />
                            </button>
                          </div>

                          <div className="font-sans text-xs text-[#716D66] mt-2 space-x-3">
                            {colorName && <span>Color: {colorName}</span>}
                            {colorName && item.selectedSize && <span>/</span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </div>
                        </div>

                        {/* Bottom Row: Stepper & Price */}
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center border border-[#D8D2C8] bg-white h-8">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id || item._id, item.selectedSize, colorName, -1)
                              }
                              aria-label="Decrease quantity"
                              className="w-8 h-full text-[#716D66] hover:text-[#111111] flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
                            </button>
                            <span className="w-8 text-center font-sans text-xs text-[#111111] font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id || item._id, item.selectedSize, colorName, 1)
                              }
                              aria-label="Increase quantity"
                              className="w-8 h-full text-[#716D66] hover:text-[#111111] flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                            </button>
                          </div>

                          <span className="font-sans text-sm font-semibold text-[#111111]">
                            {formatPrice((item.price || 0) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-[#EFECE6] border border-[#D8D2C8] p-6 sm:p-8 space-y-6 sticky top-28">
              <h2 className="font-editorial text-2xl font-normal text-[#111111]">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3 font-sans text-xs text-[#716D66] border-b border-[#D8D2C8] pb-4">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#111111] font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Standard Shipping</span>
                  <span className="text-[#111111] font-medium uppercase text-[11px]">
                    Complimentary
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between font-sans text-sm text-[#111111]">
                <span className="font-semibold uppercase tracking-wider">Total</span>
                <span className="font-bold text-base">{formatPrice(subtotal)}</span>
              </div>

              <div className="pt-2 space-y-3">
                <Link
                  href="/checkout"
                  className="block w-full py-4 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-xs uppercase tracking-[0.2em] font-medium text-center transition-colors shadow-sm"
                >
                  CHECKOUT / ORDER
                </Link>

                <p className="font-sans text-[11px] text-[#716D66] text-center leading-relaxed">
                  Complimentary 7-day exchanges & secure express delivery across India.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
