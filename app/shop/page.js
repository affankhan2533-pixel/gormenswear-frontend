"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Eye,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CartDrawer from "@/components/ui/CartDrawer";
import ProductCard from "@/components/ui/ProductCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import QuickViewModal from "@/components/ui/QuickViewModal";
import SearchOverlay from "@/components/ui/SearchOverlay";
import { Container } from "@/components/ui/Section";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { productService } from "@/lib/productService";

const CATEGORIES_LIST = [
  { id: "all", name: "All Collections" },
  { id: "codset", name: "Co-Ord Sets & Streetwear" },
  { id: "shirts", name: "Designer Shirts" },
  { id: "outerwear", name: "Vests & Jackets" },
  { id: "trousers", name: "Signature Shorts & Trousers" },
  { id: "accessories", name: "Signature Accessories" },
];

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const AVAILABLE_COLORS = [
  { name: "Black", hex: "#141414" },
  { name: "Gold", hex: "#C8A45D" },
  { name: "Navy", hex: "#315DA8" },
  { name: "Slate", hex: "#3A3A3A" },
  { name: "Sand", hex: "#D8C4A4" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Active Filter state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortOption, setSortOption] = useState("featured");
  const [maxPriceFilter, setMaxPriceFilter] = useState(1000);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("all");
  const [selectedColorFilter, setSelectedColorFilter] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  // UI state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Scroll Slider Ref
  const viewedSliderRef = useRef(null);

  // Synchronize state when query params change
  useEffect(() => {
    if (searchParams.get("category")) setSelectedCategory(searchParams.get("category"));
    if (searchParams.get("search")) setSearchQuery(searchParams.get("search"));
  }, [searchParams]);

  // Fetch catalog from API
  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "all") query.set("category", selectedCategory);
        if (searchQuery) query.set("search", searchQuery);
        if (maxPriceFilter) query.set("maxPrice", maxPriceFilter);
        if (sortOption) query.set("sort", sortOption);

        let catalogItems = null;

        try {
          const res = await fetch(`/api/products?${query.toString()}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
              catalogItems = data.data;
            }
          }
        } catch (e) {
          console.warn("Relative catalog API fetch warning:", e);
        }

        if (!catalogItems) {
          catalogItems = await productService.getStorefrontProducts();
        }

        setProducts(catalogItems);
      } catch (err) {
        console.error("Failed to load catalog", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalog();
  }, [selectedCategory, searchQuery, maxPriceFilter, sortOption]);

  // Load Recently Viewed items from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("gor_recently_viewed") || "[]");
      setRecentlyViewed(stored);
    } catch (e) {
      // Safe fallback
    }
  }, []);

  // Client-side filtering for Size, Color, Stock status
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedSizeFilter !== "all") {
        if (!p.sizes || !p.sizes.includes(selectedSizeFilter)) return false;
      }
      if (selectedColorFilter !== "all") {
        const hasColor = p.colors?.some((c) =>
          (typeof c === "string" ? c : c.name).toLowerCase().includes(selectedColorFilter.toLowerCase())
        );
        if (!hasColor) return false;
      }
      if (inStockOnly && p.inStock === false) return false;
      return true;
    });
  }, [products, selectedSizeFilter, selectedColorFilter, inStockOnly]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setMaxPriceFilter(1000);
    setSelectedSizeFilter("all");
    setSelectedColorFilter("all");
    setSortOption("featured");
    setInStockOnly(false);
  };

  // Active filter chips list
  const activeChips = useMemo(() => {
    const chips = [];
    if (selectedCategory !== "all") {
      const catObj = CATEGORIES_LIST.find((c) => c.id === selectedCategory);
      chips.push({ key: "category", label: `Category: ${catObj?.name || selectedCategory}`, remove: () => setSelectedCategory("all") });
    }
    if (searchQuery) {
      chips.push({ key: "search", label: `Search: "${searchQuery}"`, remove: () => setSearchQuery("") });
    }
    if (selectedSizeFilter !== "all") {
      chips.push({ key: "size", label: `Size: ${selectedSizeFilter}`, remove: () => setSelectedSizeFilter("all") });
    }
    if (selectedColorFilter !== "all") {
      chips.push({ key: "color", label: `Color: ${selectedColorFilter}`, remove: () => setSelectedColorFilter("all") });
    }
    if (maxPriceFilter < 1000) {
      chips.push({ key: "price", label: `Under ${formatPrice(maxPriceFilter)}`, remove: () => setMaxPriceFilter(1000) });
    }
    if (inStockOnly) {
      chips.push({ key: "stock", label: "In Stock Only", remove: () => setInStockOnly(false) });
    }
    return chips;
  }, [selectedCategory, searchQuery, selectedSizeFilter, selectedColorFilter, maxPriceFilter, inStockOnly]);

  return (
    <div className="min-h-screen bg-[#090909] text-[#F8F6F3] flex flex-col pt-20 sm:pt-24 select-none">
      
      {/* ── 1. COLLECTION HERO BANNER ── */}
      <section className="relative bg-[#151515] border-b border-[#2A2A2A] overflow-hidden py-14 sm:py-20">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop"
            alt="GOR Collection Hero"
            className="w-full h-full object-cover object-center filter brightness-[0.8]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/80 to-transparent z-0" />

        <Container className="relative z-10">
          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="font-sans text-[11px] text-[#8E8A85] uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
            <Link href="/" className="hover:text-[#C8A45D] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#C8A45D] transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-[#C8A45D] font-semibold">{selectedCategory === "all" ? "All Catalog" : selectedCategory}</span>
          </nav>

          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] bg-[#C8A45D]/15 text-[#C8A45D] border border-[#C8A45D]/30 px-3 py-1 rounded-full font-bold">
                GOR MENSWEAR 2026
              </span>
              <span className="font-sans text-xs text-[#8E8A85] font-semibold">
                {filteredProducts.length} GARMENTS
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F8F6F3] tracking-tight leading-[1.08] mb-3">
              {selectedCategory === "all" ? "Ready To Wear Collections" : CATEGORIES_LIST.find((c) => c.id === selectedCategory)?.name}
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#8E8A85] font-light leading-relaxed">
              Explore heavyweight silhouettes, co-ord sets, designer shirting, and statement outerwear engineered with precision drape and modern luxury aesthetics.
            </p>
          </div>
        </Container>
      </section>

      {/* ── 2. STICKY FILTER & SEARCH TOOLBAR ── */}
      <div className="sticky top-16 sm:top-20 z-40 bg-[#090909]/95 border-b border-[#2A2A2A] backdrop-blur-xl py-3 shadow-xl">
        <Container>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Desktop Filters Group */}
            <div className="hidden lg:flex items-center gap-3 flex-wrap flex-1">
              
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] font-sans text-xs font-semibold px-3 py-2 rounded-[8px] appearance-none pr-8 cursor-pointer transition-colors"
                >
                  {CATEGORIES_LIST.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#151515]">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#C8A45D] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Size Selector Dropdown */}
              <div className="relative">
                <select
                  value={selectedSizeFilter}
                  onChange={(e) => setSelectedSizeFilter(e.target.value)}
                  className="bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] font-sans text-xs font-semibold px-3 py-2 rounded-[8px] appearance-none pr-8 cursor-pointer transition-colors"
                >
                  <option value="all">All Sizes</option>
                  {AVAILABLE_SIZES.map((sz) => (
                    <option key={sz} value={sz} className="bg-[#151515]">Size {sz}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#C8A45D] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Color Selector Dropdown */}
              <div className="relative">
                <select
                  value={selectedColorFilter}
                  onChange={(e) => setSelectedColorFilter(e.target.value)}
                  className="bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] font-sans text-xs font-semibold px-3 py-2 rounded-[8px] appearance-none pr-8 cursor-pointer transition-colors"
                >
                  <option value="all">All Colors</option>
                  {AVAILABLE_COLORS.map((c) => (
                    <option key={c.name} value={c.name} className="bg-[#151515]">{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#C8A45D] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Price Filter Input */}
              <div className="flex items-center gap-2 bg-[#151515] border border-[#2A2A2A] px-3 py-1.5 rounded-[8px]">
                <span className="font-sans text-[11px] text-[#8E8A85] uppercase">Max Price:</span>
                <span className="font-sans text-xs font-bold text-[#C8A45D]">{formatPrice(maxPriceFilter)}</span>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-24 accent-[#C8A45D] bg-[#090909]"
                />
              </div>

              {/* Search input inside toolbar */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-[#8E8A85] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search in collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2A2A2A] focus:border-[#C8A45D] pl-8 pr-3 py-2 rounded-[8px] text-xs font-sans text-[#F8F6F3] placeholder-[#8E8A85]/60 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E8A85] hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filter Drawer Trigger & Sort dropdown */}
            <div className="flex items-center justify-between gap-3 w-full lg:w-auto">
              
              {/* Mobile Filter Trigger */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex-1 h-10 bg-[#151515] border border-[#2A2A2A] text-[#F8F6F3] font-sans text-xs uppercase tracking-wider font-semibold rounded-[8px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#C8A45D]" />
                <span>Filter & Search ({activeChips.length})</span>
              </button>

              {/* Sort Selector */}
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] font-sans text-xs font-semibold px-3 py-2 rounded-[8px] appearance-none pr-8 cursor-pointer transition-colors"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="newest">Sort: Newest Arrivals</option>
                  <option value="bestselling">Sort: Best Selling</option>
                  <option value="price-asc">Sort: Price Low → High</option>
                  <option value="price-desc">Sort: Price High → Low</option>
                  <option value="name-asc">Sort: Alphabetical (A-Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#C8A45D] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* ── 3. ACTIVE FILTER CHIPS ── */}
          {activeChips.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#2A2A2A]/50 flex items-center gap-2 flex-wrap">
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#8E8A85] font-bold">Active Filters:</span>
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A45D]/15 border border-[#C8A45D]/40 text-[#C8A45D] font-sans text-xs font-medium"
                >
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={chip.remove}
                    aria-label={`Remove filter ${chip.label}`}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={resetFilters}
                className="font-sans text-xs uppercase tracking-wider text-[#8E8A85] hover:text-[#C8A45D] underline font-semibold ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </Container>
      </div>

      {/* ── 4. MAIN PRODUCT GRID SECTION ── */}
      <section className="py-8 sm:py-12 flex-1">
        <Container>
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <ProductSkeleton count={8} />
            </div>
          ) : filteredProducts.length === 0 ? (
            /* ── 5. EMPTY STATE ── */
            <div className="py-20 text-center bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-8 space-y-4 max-w-xl mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-[#090909] border border-[#2A2A2A] text-[#C8A45D] flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-3xl text-[#F8F6F3] font-normal">No products match your filters.</h3>
              <p className="font-sans text-xs text-[#8E8A85] font-light">
                Try adjusting your size, color, or price range options to explore more garments from GOR Menswear.
              </p>
              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px] hover:bg-[#D4B77D] transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="px-6 py-2.5 bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3] font-sans text-xs uppercase tracking-wider font-semibold rounded-[8px] hover:border-[#C8A45D] transition-colors cursor-pointer"
                >
                  Browse All Products
                </button>
              </div>
            </div>
          ) : (
            /* ── 6. 4-COLUMN RESPONSIVE PRODUCT GRID ── */
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard
                    key={product.id || product._id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div className="mt-12 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="px-8 py-3.5 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#C8A45D] hover:text-[#F8F6F3] font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-[10px] transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    Load More Garments ({filteredProducts.length - visibleCount} Remaining)
                  </button>
                </div>
              )}
            </>
          )}

        </Container>
      </section>

      {/* ── 7. RECENTLY VIEWED CAROUSEL ── */}
      {recentlyViewed.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#121212] border-t border-[#2A2A2A]">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#315DA8] font-semibold block mb-1">
                  BROWSING HISTORY
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
                  Recently Viewed
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (viewedSliderRef.current) viewedSliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
                  }}
                  aria-label="Scroll left"
                  className="w-9 h-9 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#8E8A85] hover:text-[#C8A45D] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (viewedSliderRef.current) viewedSliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
                  }}
                  aria-label="Scroll right"
                  className="w-9 h-9 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#8E8A85] hover:text-[#C8A45D] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              ref={viewedSliderRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 snap-x"
            >
              {recentlyViewed.map((viewedItem) => (
                <div key={viewedItem.id || viewedItem._id} className="w-[240px] sm:w-[280px] shrink-0 snap-start">
                  <ProductCard product={viewedItem} onQuickView={(p) => setQuickViewProduct(p)} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── QUICK VIEW MODAL ── */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* ── MOBILE BOTTOM SHEET FILTER MODAL ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] bg-black/85 backdrop-blur-md flex flex-col justify-end lg:hidden"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#151515] border-t border-[#2A2A2A] rounded-t-[20px] p-6 space-y-5 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2A]">
                <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Filter Collection</h3>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-[#8E8A85] hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`py-2 px-3 text-xs font-semibold rounded-[8px] border text-left truncate transition-colors ${
                        selectedCategory === cat.id ? "bg-[#C8A45D] text-[#090909] border-[#C8A45D]" : "bg-[#090909] text-[#8E8A85] border-[#2A2A2A]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-2">Size</label>
                <div className="grid grid-cols-6 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSizeFilter("all")}
                    className={`py-2 text-xs font-semibold rounded-[8px] border ${selectedSizeFilter === "all" ? "bg-[#C8A45D] text-[#090909]" : "bg-[#090909] text-[#8E8A85]"}`}
                  >
                    All
                  </button>
                  {AVAILABLE_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSizeFilter(sz)}
                      className={`py-2 text-xs font-semibold rounded-[8px] border ${selectedSizeFilter === sz ? "bg-[#C8A45D] text-[#090909]" : "bg-[#090909] text-[#8E8A85]"}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex justify-between text-xs text-[#8E8A85] mb-1 font-semibold">
                  <span>Max Price</span>
                  <span className="text-[#C8A45D] font-bold">{formatPrice(maxPriceFilter)}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#C8A45D] bg-[#090909]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-1/3 py-3 bg-[#090909] border border-[#2A2A2A] text-[#8E8A85] text-xs uppercase font-bold rounded-[10px]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-2/3 py-3 bg-[#C8A45D] text-[#090909] text-xs uppercase font-bold rounded-[10px]"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <NoiseOverlay />
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-[#090909] pt-32 text-center text-[#C8A45D] font-editorial text-2xl">Loading Collection...</div>}>
        <ShopContent />
      </Suspense>
      <CartDrawer />
      <Footer />
    </>
  );
}
