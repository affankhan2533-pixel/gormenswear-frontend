"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
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
  Mic,
  MicOff,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { productService } from "@/lib/productService";
import QuickViewDrawer from "@/components/plp/QuickViewDrawer";

const POPULAR_SEARCHES = [
  "Shirts",
  "Polos",
  "New Arrivals",
  "Best Sellers",
  "Cotton Shirts",
  "Oversized Tees",
];

const STORE_COLLECTIONS = [
  { name: "Co-Ord Sets & Streetwear", category: "codset", href: "/shop/codset" },
  { name: "Outerwear & Layers", category: "outerwear", href: "/shop/outerwear" },
  { name: "Designer Shirts", category: "shirts", href: "/shop/shirts" },
  { name: "Signature Trousers", category: "trousers", href: "/shop/trousers" },
  { name: "Bespoke Accessories", category: "accessories", href: "/shop/accessories" },
];

export default function SearchOverlay({ isOpen, onClose }) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Keyboard Arrow Selection Index (-1 means input field)
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Voice Search State
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  const inputRef = useRef(null);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Fetch catalog for search index
  useEffect(() => {
    async function loadCatalog() {
      try {
        const items = await productService.getStorefrontProducts();
        setProducts(items || []);
      } catch (err) {
        console.error("Failed to load search catalog", err);
      }
    }
    if (isOpen) loadCatalog();
  }, [isOpen]);

  // Debounce input changes (200ms)
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
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle open, focus & ESC listener
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
      setQuery("");
      setFocusedIndex(-1);
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
  const saveRecentSearch = useCallback((term) => {
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
  }, []);

  // Remove single recent search
  const removeRecentSearch = (term) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term);
      try {
        localStorage.setItem("gor_recent_searches", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Clear all recent searches
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

  // Voice Search Toggle
  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Grouped Search Filtering
  const { matchingProducts, matchingCollections, matchingCategories, suggestions } = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      return { matchingProducts: [], matchingCollections: [], matchingCategories: [], suggestions: [] };
    }

    const q = debouncedQuery.toLowerCase();

    // 1. Matching Products
    const prods = products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );

    // 2. Matching Collections
    const colles = STORE_COLLECTIONS.filter((c) =>
      c.name.toLowerCase().includes(q)
    );

    // 3. Matching Categories
    const cats = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    ).filter((cat) => cat.toLowerCase().includes(q));

    // 4. AI Search Suggestions
    const suggs = POPULAR_SEARCHES.filter((kw) => kw.toLowerCase().includes(q));

    return {
      matchingProducts: prods.slice(0, 6),
      matchingCollections: colles,
      matchingCategories: cats,
      suggestions: suggs,
    };
  }, [debouncedQuery, products]);

  // Combined Results List for Keyboard Navigation
  const flatResults = useMemo(() => {
    return [
      ...matchingProducts.map((p) => ({ type: "product", item: p, url: `/product/${p.id || p._id}` })),
      ...matchingCollections.map((c) => ({ type: "collection", item: c, url: c.href })),
    ];
  }, [matchingProducts, matchingCollections]);

  // Keyboard navigation handler (ArrowUp, ArrowDown, Enter)
  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1));
    } else if (e.key === "Enter") {
      if (focusedIndex >= 0 && flatResults[focusedIndex]) {
        e.preventDefault();
        saveRecentSearch(debouncedQuery);
        router.push(flatResults[focusedIndex].url);
        onClose();
      } else if (query.trim()) {
        e.preventDefault();
        saveRecentSearch(query.trim());
        router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-[#0B0B0B]/95 backdrop-blur-2xl flex flex-col p-4 sm:p-8 overflow-y-auto select-none text-[#F7F5F2]"
          role="search"
          aria-label="Global Store Search"
        >
          {/* Top Bar Header */}
          <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C9A86A] font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> GOR ATELIER INTELLIGENT SEARCH
            </span>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-[#B8B6B0] hover:text-[#C9A86A] transition-colors cursor-pointer group"
            >
              <span>Close</span>
              <div className="w-8 h-8 rounded-full border border-[#2A2A2A] group-hover:border-[#C9A86A] flex items-center justify-center bg-[#111111] transition-colors shadow-md">
                <X className="w-4 h-4 text-[#F7F5F2]" />
              </div>
            </button>
          </div>

          {/* Main Search Input Container */}
          <div className="max-w-[1200px] w-full mx-auto my-6 sm:my-8">
            <div className="relative flex items-center border-b border-[#2A2A2A] focus-within:border-[#C9A86A] transition-colors pb-3">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-[#C9A86A] shrink-0 mr-3" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFocusedIndex(-1);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search shirts, polos, trousers..."
                className="w-full bg-transparent font-serif text-2xl sm:text-4xl text-[#F7F5F2] placeholder-[#B8B6B0]/40 focus:outline-none"
              />

              <div className="flex items-center gap-2 shrink-0">
                {/* Voice Search Button */}
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceSearch}
                    title={isListening ? "Listening... Click to stop" : "Voice Search"}
                    className={`p-2 rounded-full border transition-all cursor-pointer ${
                      isListening
                        ? "bg-[#D86A32]/20 border-[#D86A32] text-[#D86A32] animate-pulse"
                        : "bg-[#111111] border-[#2A2A2A] text-[#B8B6B0] hover:text-[#C9A86A] hover:border-[#C9A86A]"
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}

                {isSearching && <Loader2 className="w-4 h-4 text-[#C9A86A] animate-spin" />}

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setFocusedIndex(-1);
                    }}
                    className="font-sans text-[10px] uppercase tracking-widest text-[#B8B6B0] hover:text-[#C9A86A] px-2.5 py-1 bg-[#111111] rounded border border-[#2A2A2A]"
                  >
                    Clear
                  </button>
                )}

                <div className="hidden sm:flex items-center gap-1 font-sans text-[10px] text-[#B8B6B0] bg-[#111111] px-2.5 py-1 rounded border border-[#2A2A2A]">
                  <Command className="w-3 h-3 text-[#C9A86A]" /> K
                </div>
              </div>
            </div>

            {/* Default State: Recent & Popular Searches when query empty */}
            {!query && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#B8B6B0] font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C9A86A]" /> Recent Searches
                      </span>
                      <button
                        type="button"
                        onClick={clearAllRecentSearches}
                        className="font-sans text-[10px] text-[#B8B6B0] hover:text-[#C9A86A] underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          className="flex items-center gap-1.5 bg-[#111111] border border-[#2A2A2A] px-3.5 py-1.5 rounded-full text-xs font-sans text-[#F7F5F2] hover:border-[#C9A86A]/50 transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectKeyword(term)}
                            className="hover:text-[#C9A86A] transition-colors cursor-pointer"
                          >
                            {term}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeRecentSearch(term)}
                            className="text-[#B8B6B0] hover:text-rose-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div className="space-y-3">
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-bold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#C9A86A]" /> Popular Searches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => handleSelectKeyword(kw)}
                        className="px-3.5 py-1.5 rounded-full bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A] font-sans text-xs uppercase tracking-wider text-[#B8B6B0] hover:text-[#F7F5F2] transition-all cursor-pointer shadow-sm"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Search Results (Split Layout: Left 60% Products, Right 40% Collections & Categories) */}
          <div className="max-w-[1200px] w-full mx-auto flex-1">
            {debouncedQuery && (
              <div>
                {matchingProducts.length === 0 && matchingCollections.length === 0 && matchingCategories.length === 0 ? (
                  /* LUXURY NO RESULTS EMPTY STATE */
                  <div className="py-16 px-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl text-center space-y-4 shadow-xl">
                    <div className="w-12 h-12 rounded-full border border-[#2A2A2A] bg-[#0B0B0B] text-[#C9A86A] flex items-center justify-center mx-auto shadow-inner">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl font-normal text-[#F7F5F2]">No matching products.</h3>
                      <p className="font-sans text-xs text-[#B8B6B0] font-light mt-1">
                        No garments found matching &quot;{debouncedQuery}&quot;. Explore our signature collections below.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#2A2A2A]">
                      <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-bold block mb-4">
                        SUGGESTED COLLECTIONS
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-2.5">
                        {STORE_COLLECTIONS.map((c) => (
                          <Link
                            key={c.category}
                            href={c.href}
                            onClick={onClose}
                            className="px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] hover:border-[#C9A86A] rounded-full text-xs font-sans text-[#F7F5F2] transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN (7/12 = 60%): PRODUCTS */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-[#2A2A2A]">
                        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-bold">
                          GARMENTS ({matchingProducts.length})
                        </span>
                        {matchingProducts.length > 0 && (
                          <Link
                            href={`/shop?search=${encodeURIComponent(debouncedQuery)}`}
                            onClick={() => {
                              saveRecentSearch(debouncedQuery);
                              onClose();
                            }}
                            className="font-sans text-xs text-[#C9A86A] hover:underline font-semibold uppercase tracking-wider flex items-center gap-1"
                          >
                            View All Results <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {matchingProducts.map((prod, idx) => {
                          const isFocused = focusedIndex === idx;
                          const displayBadge = prod.badge || (prod.isNew ? "NEW" : null);

                          return (
                            <motion.div
                              key={prod.id || prod._id || idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: idx * 0.03 }}
                              className={`group bg-[#111111] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 relative ${
                                isFocused
                                  ? "border-[#C9A86A] ring-2 ring-[#C9A86A]/40 scale-[1.02]"
                                  : "border-[#2A2A2A] hover:border-[#C9A86A]/50"
                              }`}
                            >
                              <Link
                                href={`/product/${prod.id || prod.slug || prod._id}`}
                                onClick={() => {
                                  saveRecentSearch(debouncedQuery);
                                  onClose();
                                }}
                                className="block relative aspect-[3/4] w-full overflow-hidden bg-[#0B0B0B]"
                              >
                                <Image
                                  src={prod.image || prod.images?.[0] || "/images/products/gor-codset-burgundy-alo.webp"}
                                  alt={prod.name}
                                  fill
                                  unoptimized
                                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />

                                {displayBadge && (
                                  <span className="absolute top-2.5 left-2.5 z-10 font-sans text-[8.5px] uppercase tracking-[0.18em] bg-[#0B0B0B]/95 text-[#D86A32] px-2 py-0.5 border border-[#D86A32]/40 backdrop-blur-md font-semibold rounded-md">
                                    {displayBadge}
                                  </span>
                                )}

                                {/* Hover Preview / Quick View Trigger */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setQuickViewProduct(prod);
                                  }}
                                  className="absolute bottom-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-[#0B0B0B]/90 border border-[#2A2A2A] text-[#F7F5F2] hover:text-[#C9A86A] flex items-center justify-center transition-colors cursor-pointer shadow-lg backdrop-blur-md"
                                  aria-label="Quick View"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Link>

                              <div className="p-3.5 space-y-1 bg-[#111111]">
                                <span className="font-sans text-[9px] uppercase tracking-wider text-[#C9A86A] font-bold block">
                                  {prod.category || "Atelier Selection"}
                                </span>
                                <h4 className="font-serif text-sm text-[#F7F5F2] truncate group-hover:text-[#C9A86A] transition-colors">
                                  {prod.name}
                                </h4>
                                <span className="font-sans text-xs font-bold text-[#F7F5F2] block price-display">
                                  {formatPrice(prod.price)}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* RIGHT COLUMN (5/12 = 40%): COLLECTIONS & CATEGORIES */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Collections */}
                      {matchingCollections.length > 0 && (
                        <div>
                          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-bold block mb-3 pb-1 border-b border-[#2A2A2A]">
                            COLLECTIONS ({matchingCollections.length})
                          </span>
                          <div className="space-y-2">
                            {matchingCollections.map((col, idx) => {
                              const itemIndex = matchingProducts.length + idx;
                              const isFocused = focusedIndex === itemIndex;

                              return (
                                <Link
                                  key={col.category}
                                  href={col.href}
                                  onClick={() => {
                                    saveRecentSearch(debouncedQuery);
                                    onClose();
                                  }}
                                  className={`p-3.5 bg-[#111111] border rounded-xl flex items-center justify-between transition-all group ${
                                    isFocused
                                      ? "border-[#C9A86A] ring-2 ring-[#C9A86A]/40"
                                      : "border-[#2A2A2A] hover:border-[#C9A86A]"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <Grid className="w-4 h-4 text-[#C9A86A]" />
                                    <span className="font-sans text-xs font-bold text-[#F7F5F2]">{col.name}</span>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-[#B8B6B0] group-hover:text-[#C9A86A] group-hover:translate-x-1 transition-all" />
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Categories */}
                      {matchingCategories.length > 0 && (
                        <div>
                          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-bold block mb-3 pb-1 border-b border-[#2A2A2A]">
                            CATEGORIES ({matchingCategories.length})
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
                                className="px-3.5 py-2 bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A] rounded-full text-xs font-sans text-[#F7F5F2] flex items-center gap-1.5 transition-colors"
                              >
                                <Tag className="w-3.5 h-3.5 text-[#C9A86A]" />
                                <span>{cat}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {suggestions.length > 0 && (
                        <div>
                          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-bold block mb-3 pb-1 border-b border-[#2A2A2A]">
                            SUGGESTED TERMS
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {suggestions.map((sug) => (
                              <button
                                key={sug}
                                type="button"
                                onClick={() => handleSelectKeyword(sug)}
                                className="px-3 py-1.5 bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A] text-xs font-sans text-[#B8B6B0] hover:text-[#F7F5F2] rounded-lg transition-colors cursor-pointer"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide-over Quick View Drawer for result preview */}
      <QuickViewDrawer
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
