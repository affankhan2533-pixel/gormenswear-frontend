"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  RotateCcw,
  Eye,
  Tag,
  Grid,
  Command,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import QuickViewModal from "@/components/ui/QuickViewModal";

// Trending search chips
const TRENDING_KEYWORDS = [
  "New Arrivals",
  "Shirts",
  "Trousers",
  "Outerwear",
  "Co-Ord Sets",
];

// Available collections for live categorization
const STORE_COLLECTIONS = [
  { name: "Co-Ord Sets", category: "codset", href: "/shop/codset" },
  { name: "Outerwear & Jackets", category: "outerwear", href: "/shop/outerwear" },
  { name: "Designer Shirts", category: "shirts", href: "/shop/shirts" },
  { name: "Tailored Trousers", category: "trousers", href: "/shop/trousers" },
  { name: "Accessories", category: "accessories", href: "/shop/accessories" },
];

export default function SearchOverlay({ isOpen, onClose, products = [] }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  const inputRef = useRef(null);

  // Debounce search query changes
  useEffect(() => {
    if (!query) {
      setDebouncedQuery("");
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setIsSearching(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle overlay open, focus, and recent search loading
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";

      try {
        const stored = JSON.parse(localStorage.getItem("gor_recent_searches") || "[]");
        setRecentSearches(Array.isArray(stored) ? stored.slice(0, 8) : []);
      } catch (e) {}
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Save Recent Search
  const saveRecentSearch = useCallback(
    (term) => {
      if (!term || !term.trim()) return;
      const cleanTerm = term.trim();
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.toLowerCase() !== cleanTerm.toLowerCase());
        const updated = [cleanTerm, ...filtered].slice(0, 8);
        try {
          localStorage.setItem("gor_recent_searches", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    },
    []
  );

  // Remove Single Recent Search Item
  const removeRecentSearch = (term) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term);
      try {
        localStorage.setItem("gor_recent_searches", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Clear All Recent Searches
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("gor_recent_searches");
    } catch (e) {}
  };

  const handleSelectKeyword = (kw) => {
    setQuery(kw);
    saveRecentSearch(kw);
  };

  // Group Live Search Results into Products, Collections, Categories
  const { matchingProducts, matchingCollections, matchingCategories } = useMemo(() => {
    if (!debouncedQuery) {
      return { matchingProducts: [], matchingCollections: [], matchingCategories: [] };
    }

    const q = debouncedQuery.toLowerCase();

    // 1. Matching Products
    const prods = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );

    // 2. Matching Collections
    const colles = STORE_COLLECTIONS.filter((c) =>
      c.name.toLowerCase().includes(q)
    );

    // 3. Matching Categories
    const cats = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    ).filter((cat) => cat.toLowerCase().includes(q));

    return {
      matchingProducts: prods.slice(0, 6),
      matchingCollections: colles,
      matchingCategories: cats,
    };
  }, [debouncedQuery, products]);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] bg-[#090909]/96 backdrop-blur-2xl flex flex-col p-4 sm:p-8 overflow-y-auto"
          role="search"
          aria-label="Store Search"
        >
          {/* Header Bar */}
          <div className="max-w-[900px] w-full mx-auto flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> SEARCH STORE
            </span>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer group"
            >
              <span>Close</span>
              <div className="w-7 h-7 rounded-full border border-[#2A2A2A] group-hover:border-[#C8A45D] flex items-center justify-center bg-[#151515] transition-colors">
                <X className="w-4 h-4 text-[#F8F6F3]" />
              </div>
            </button>
          </div>

          {/* Search Input Container */}
          <div className="max-w-[900px] w-full mx-auto my-6 sm:my-8">
            <div className="relative flex items-center border-b border-[#2A2A2A] focus-within:border-[#C8A45D] transition-colors pb-2">
              <Search className="w-6 h-6 sm:w-7 sm:h-7 text-[#C8A45D] shrink-0 mr-3" />
              
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    saveRecentSearch(query.trim());
                  }
                }}
                placeholder="Search products, collections..."
                className="w-full bg-transparent font-editorial text-xl sm:text-3xl text-[#F8F6F3] placeholder-[#8E8A85]/40 focus:outline-none"
              />

              <div className="flex items-center gap-2 shrink-0">
                {isSearching && <Loader2 className="w-4 h-4 text-[#C8A45D] animate-spin" />}
                
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="font-sans text-[10px] uppercase tracking-widest text-[#8E8A85] hover:text-[#C8A45D] px-2 py-1 bg-[#151515] rounded border border-[#2A2A2A]"
                  >
                    Clear
                  </button>
                )}

                <div className="hidden sm:flex items-center gap-1 font-sans text-[10px] text-[#8E8A85] bg-[#151515] px-2 py-1 rounded border border-[#2A2A2A]">
                  <Command className="w-3 h-3 text-[#C8A45D]" /> K
                </div>
              </div>
            </div>

            {/* Recent & Trending Searches (When Query Empty) */}
            {!query && (
              <div className="mt-6 space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#8E8A85] font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C8A45D]" /> Recent Searches
                      </span>
                      <button
                        type="button"
                        onClick={clearAllRecentSearches}
                        className="font-sans text-[10px] text-[#8E8A85] hover:text-[#C8A45D] underline"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          className="flex items-center gap-1.5 bg-[#151515] border border-[#2A2A2A] px-3 py-1.5 rounded-full text-xs font-sans text-[#F8F6F3] hover:border-[#C8A45D]/40 transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectKeyword(term)}
                            className="hover:text-[#C8A45D] transition-colors cursor-pointer"
                          >
                            {term}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeRecentSearch(term)}
                            className="text-[#8E8A85] hover:text-rose-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold flex items-center gap-1.5 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-[#C8A45D]" /> Trending Searches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_KEYWORDS.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => handleSelectKeyword(kw)}
                        className="px-3.5 py-1.5 rounded-full bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] font-sans text-xs uppercase tracking-wider text-[#8E8A85] hover:text-[#F8F6F3] transition-all cursor-pointer shadow-sm"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Search Results (Grouped into Sections) */}
          <div className="max-w-[900px] w-full mx-auto flex-1">
            {debouncedQuery && (
              <div className="space-y-8">
                
                {/* 1. MATCHING COLLECTIONS */}
                {matchingCollections.length > 0 && (
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-3">
                      COLLECTIONS
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {matchingCollections.map((col) => (
                        <Link
                          key={col.category}
                          href={col.href}
                          onClick={() => {
                            saveRecentSearch(debouncedQuery);
                            onClose();
                          }}
                          className="p-3 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[10px] flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Grid className="w-4 h-4 text-[#C8A45D]" />
                            <span className="font-sans text-xs font-bold text-[#F8F6F3]">{col.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#8E8A85] group-hover:text-[#C8A45D] group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. MATCHING CATEGORIES */}
                {matchingCategories.length > 0 && (
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block mb-3">
                      CATEGORIES
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {matchingCategories.map((cat) => (
                        <Link
                          key={cat}
                          href={`/shop?category=${encodeURIComponent(cat)}`}
                          onClick={() => {
                            saveRecentSearch(debouncedQuery);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-xs font-sans text-[#F8F6F3] flex items-center gap-1.5"
                        >
                          <Tag className="w-3 h-3 text-[#C8A45D]" />
                          <span>{cat}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. MATCHING PRODUCTS */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold">
                      PRODUCTS ({matchingProducts.length})
                    </span>
                  </div>

                  {matchingProducts.length === 0 && matchingCollections.length === 0 && matchingCategories.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="py-12 px-6 bg-[#151515] border border-[#2A2A2A] rounded-[14px] text-center space-y-4">
                      <div className="w-12 h-12 rounded-full border border-[#2A2A2A] bg-[#090909] text-[#C8A45D] flex items-center justify-center mx-auto shadow-md">
                        <RotateCcw className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-editorial text-2xl font-normal text-[#F8F6F3]">No results found.</p>
                        <p className="font-sans text-xs text-[#8E8A85] font-light mt-1">
                          No garments found matching "{debouncedQuery}". Try exploring our recommended collections.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#2A2A2A]">
                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C8A45D] font-bold block mb-3">
                          RECOMMENDED COLLECTIONS
                        </span>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {STORE_COLLECTIONS.map((c) => (
                            <Link
                              key={c.category}
                              href={c.href}
                              onClick={onClose}
                              className="px-3.5 py-1.5 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-xs font-sans text-[#F8F6F3]"
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                      {matchingProducts.map((prod) => (
                        <div
                          key={prod.id || prod._id}
                          className="group bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D]/50 rounded-[12px] overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg relative"
                        >
                          <Link
                            href={`/product/${prod.id || prod._id}`}
                            onClick={() => {
                              saveRecentSearch(debouncedQuery);
                              onClose();
                            }}
                            className="block relative aspect-[3/4] w-full overflow-hidden bg-[#090909]"
                          >
                            <img
                              src={prod.image || prod.images?.[0]}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Quick View Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuickViewProduct(prod);
                              }}
                              className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#090909]/90 border border-[#2A2A2A] text-[#F8F6F3] hover:text-[#C8A45D] flex items-center justify-center transition-colors cursor-pointer shadow-md"
                              aria-label="Quick View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>

                          <div className="p-3 space-y-1">
                            <span className="font-sans text-[9px] uppercase tracking-wider text-[#C8A45D] font-bold block">
                              {prod.category || "Garment"}
                            </span>
                            <h4 className="font-editorial text-sm text-[#F8F6F3] truncate group-hover:text-[#C8A45D] transition-colors">
                              {prod.name}
                            </h4>
                            <span className="font-sans text-xs font-bold text-[#F8F6F3] block price-display">
                              {formatPrice(prod.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
