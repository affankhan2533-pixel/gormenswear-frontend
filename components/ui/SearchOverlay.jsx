"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { productService } from "@/lib/productService";

export default function SearchOverlay({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Fetch catalog when overlay opens
  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      try {
        const items = await productService.getStorefrontProducts();
        setProducts(items || []);
      } catch (err) {
        console.error("Failed to load search catalog", err);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      loadCatalog();
    }
  }, [isOpen]);

  // Handle open, focus & ESC listener
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Filter products based on query
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const subcategory = (p.subcategory || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return (
          name.includes(q) ||
          category.includes(q) ||
          subcategory.includes(q) ||
          desc.includes(q)
        );
      })
      .slice(0, 12);
  }, [query, products]);

  const handleSelect = (productId) => {
    onClose();
    router.push(`/product/${productId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] bg-[#F5F2EC]/98 backdrop-blur-xl flex flex-col select-none text-[#111111]"
        >
          {/* Top Bar with Close */}
          <div className="max-w-6xl w-full mx-auto px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#716D66] font-semibold">
              GOR ARCHIVE SEARCH
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search overlay"
              className="p-2 text-[#111111] hover:text-[#716D66] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Search Input Section */}
          <div className="max-w-4xl w-full mx-auto px-6 sm:px-10 pt-10 sm:pt-16 pb-8">
            <div className="relative border-b border-[#D8D2C8] pb-3 focus-within:border-[#111111] transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH GOR"
                aria-label="Search GOR collection"
                className="w-full bg-transparent font-editorial text-3xl sm:text-5xl text-[#111111] placeholder:text-[#D8D2C8] focus:outline-none tracking-tight pr-10"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#716D66] hover:text-[#111111] text-xs font-mono uppercase"
                >
                  CLEAR
                </button>
              ) : (
                <Search className="w-6 h-6 stroke-[1.5] text-[#716D66] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
            </div>

            {/* Suggested Shortcuts when empty */}
            {!query && (
              <div className="pt-6 flex flex-wrap items-center gap-3">
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#716D66]">
                  SUGGESTED:
                </span>
                {["T-Shirts", "Shirts", "Polos", "Pants", "Trousers", "Jackets", "Jerseys"].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 border border-[#D8D2C8] text-[#111111] hover:border-[#111111] text-xs font-sans transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-10 pb-16">
            <div className="max-w-4xl w-full mx-auto">
              {query && searchResults.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C8] mb-6">
                    <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#716D66]">
                      {searchResults.length} {searchResults.length === 1 ? "RESULT" : "RESULTS"} FOR "{query}"
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        router.push(`/shop?search=${encodeURIComponent(query)}`);
                      }}
                      className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#111111] hover:text-[#716D66] font-medium"
                    >
                      VIEW IN CATALOGUE →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {searchResults.map((product) => {
                      const img =
                        product.images?.[0] ||
                        product.imageUrl ||
                        product.image ||
                        "/images/lookbook/gor-lookbook-1.webp";

                      return (
                        <div
                          key={product.id || product._id}
                          onClick={() => handleSelect(product.id || product._id)}
                          className="group cursor-pointer flex flex-col"
                        >
                          <div className="relative aspect-[3/4] w-full bg-[#E9E5DD] overflow-hidden mb-3">
                            <Image
                              src={img}
                              alt={product.name}
                              fill
                              unoptimized
                              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#716D66] mb-1">
                            {product.category || "COLLECTION"}
                          </span>

                          <h4 className="font-editorial text-lg text-[#111111] group-hover:text-[#8C7A6B] transition-colors leading-tight mb-1">
                            {product.name}
                          </h4>

                          <span className="font-sans text-xs text-[#111111] font-medium">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {query && searchResults.length === 0 && !loading && (
                <div className="py-16 text-center space-y-3">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#716D66]">
                    00 / NO MATCHES
                  </span>
                  <h3 className="font-editorial text-3xl text-[#111111] font-normal">
                    NO PIECES FOUND
                  </h3>
                  <p className="font-sans text-xs text-[#716D66] max-w-sm mx-auto">
                    No garments match "{query}". Try checking category names or browse the full collection.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push("/shop");
                    }}
                    className="mt-4 px-6 py-2.5 bg-[#151515] text-[#F5F2EC] font-sans text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#252525] transition-colors cursor-pointer"
                  >
                    EXPLORE ALL PIECES
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
