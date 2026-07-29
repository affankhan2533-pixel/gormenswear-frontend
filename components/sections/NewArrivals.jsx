"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Eye, Heart, ShoppingBag, Check, X } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

import { productService } from "@/lib/productService";

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.834 11.834 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.237-6.165-3.483-8.411" />
    </svg>
  );
}

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "shirt", label: "Shirts & Silks" },
  { id: "trouser", label: "Trousers" },
  { id: "outerwear", label: "Outerwear" },
  { id: "codset", label: "Co-Ord Sets" },
];

export default function NewArrivals({ onAddToCart }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [productsList, setProductsList] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [quickViewProd, setQuickViewProd] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const prods = await productService.getStorefrontProducts();
        if (prods && prods.length > 0) {
          setProductsList(prods.slice(0, 8));
          return;
        }
      } catch (err) {
        console.error("Failed to load new arrivals", err);
      }
      setProductsList(PRODUCTS.slice(0, 8));
    }
    fetchNewArrivals();
  }, []);

  const filteredProducts = activeTab === "all"
    ? productsList
    : productsList.filter((p) => (p.category || "").toLowerCase().includes(activeTab.toLowerCase()));

  const handleQuickViewAdd = (prod) => {
    addToCart(prod, 1, selectedSize);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setQuickViewProd(null);
      setIsCartOpen(true);
    }, 1200);
  };

  return (
    <section id="new-arrivals" className="py-20 sm:py-28 lg:py-36 bg-[#090909] text-[#F8F6F3] overflow-hidden border-t border-b border-[#2A2A2A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* ── 1. Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6"
        >
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C8A45D] font-semibold block mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" /> NEW ARRIVALS
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl font-normal text-[#F8F6F3] tracking-wide">
              Just Landed.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#8E8A85] font-light max-w-lg mt-2">
              Explore the newest additions to GOR Menswear.
            </p>
          </div>

          <Link
            href="/new-arrivals"
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-[#C8A45D] hover:text-[#F8F6F3] font-semibold transition-colors group self-start md:self-auto"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>

        {/* ── 2. Category Filter Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-8">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-sans text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#C8A45D] text-[#090909] font-bold shadow-md"
                  : "bg-[#151515] text-[#8E8A85] border border-[#2A2A2A] hover:text-[#F8F6F3]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── 3. Desktop 4-Column Responsive Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {(filteredProducts.length > 0 ? filteredProducts : productsList).slice(0, 8).map((prod) => (
            <div key={prod.id || prod._id} className="relative group">
              <ProductCard product={prod} />
              
              {/* Quick View Trigger Button overlay on card */}
              <button
                type="button"
                onClick={() => setQuickViewProd(prod)}
                className="absolute top-2.5 left-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-[#090909]/90 border border-[#2A2A2A] text-[#F8F6F3] hover:text-[#C8A45D] backdrop-blur-md cursor-pointer hidden sm:flex items-center justify-center"
                aria-label="Quick View"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* ── Mobile Sticky View All Button (< 768px) ── */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/new-arrivals" className="block w-full">
            <button
              type="button"
              className="w-full h-[48px] rounded-[12px] bg-[#151515] border border-[#C8A45D]/40 text-[#C8A45D] font-sans text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>View All New Arrivals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>

      {/* ── QUICK VIEW MODAL ── */}
      <AnimatePresence>
        {quickViewProd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[180] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-6 relative overflow-hidden shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setQuickViewProd(null)}
                className="absolute top-4 right-4 z-10 p-2 text-[#8E8A85] hover:text-[#C8A45D] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="aspect-[3/4] rounded-[10px] overflow-hidden bg-[#090909] border border-[#2A2A2A]">
                  <img
                    src={quickViewProd.image || quickViewProd.images?.[0]}
                    alt={quickViewProd.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C8A45D] font-semibold block mb-1">
                      {quickViewProd.category || "New Arrival"}
                    </span>
                    <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                      {quickViewProd.name}
                    </h3>
                    <p className="font-sans text-lg font-bold text-[#F8F6F3] mt-2 price-display">
                      {formatPrice(quickViewProd.price)}
                    </p>
                  </div>

                  {/* Size Selector */}
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#8E8A85] block mb-2 font-medium">
                      Select Size:
                    </span>
                    <div className="flex gap-2">
                      {["S", "M", "L", "XL", "XXL"].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`w-9 h-9 border font-sans text-xs font-semibold rounded-[6px] ${
                            selectedSize === sz
                              ? "bg-[#C8A45D] text-[#090909] border-[#C8A45D]"
                              : "bg-[#090909] text-[#F8F6F3] border-[#2A2A2A]"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleQuickViewAdd(quickViewProd)}
                      className="w-full h-[44px] rounded-[10px] bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {addedSuccess ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                      <span>{addedSuccess ? "Added to Cart!" : "Order Now"}</span>
                    </button>

                    <a
                      href={`https://wa.me/918691921913?text=${encodeURIComponent(`Hi GOR, I'm interested in ${quickViewProd.name} (Size: ${selectedSize})`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-[44px] rounded-[10px] border border-[#2A2A2A] hover:border-[#25D366] text-[#F8F6F3] font-sans text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                      <span>WhatsApp Enquiry</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
