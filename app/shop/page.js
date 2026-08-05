"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CartDrawer from "@/components/ui/CartDrawer";
import ProductCard from "@/components/ui/ProductCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { Container } from "@/components/ui/Section";
import { formatPrice } from "@/lib/utils";
import { productService } from "@/lib/productService";

// PLP Subcomponents
import PlpHero from "@/components/plp/PlpHero";
import PlpSidebarFilters from "@/components/plp/PlpSidebarFilters";
import PlpMobileFilterDrawer from "@/components/plp/PlpMobileFilterDrawer";
import PlpTopToolbar from "@/components/plp/PlpTopToolbar";
import PlpFilterChips from "@/components/plp/PlpFilterChips";
import QuickViewDrawer from "@/components/plp/QuickViewDrawer";

const CATEGORIES_LIST = [
  { id: "all", name: "All Collections" },
  { id: "codset", name: "Co-Ord Sets & Streetwear" },
  { id: "shirts", name: "Designer Shirts" },
  { id: "outerwear", name: "Vests & Outerwear" },
  { id: "trousers", name: "Signature Trousers" },
  { id: "accessories", name: "Leather Accessories" },
];

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const AVAILABLE_COLORS = [
  { name: "Black", hex: "#141414" },
  { name: "Gold", hex: "#C9A86A" },
  { name: "Navy", hex: "#1C2E4A" },
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
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("all");
  const [selectedColorFilter, setSelectedColorFilter] = useState("all");
  const [selectedFitFilter, setSelectedFitFilter] = useState("all");
  const [selectedFabricFilter, setSelectedFabricFilter] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Dynamic Price Limit & Grid Density
  const [priceLimit, setPriceLimit] = useState(1000);
  const [gridCols, setGridCols] = useState(4); // Refinement #4: 3 vs 4 desktop columns

  // UI state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null); // Refinement #5: QuickView Drawer
  const [visibleCount, setVisibleCount] = useState(12);

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
        let catalogItems = await productService.getStorefrontProducts();
        if (!catalogItems || catalogItems.length === 0) {
          catalogItems = [];
        }
        setProducts(catalogItems);

        // Dynamically compute maximum price in catalog (Refinement #2)
        if (catalogItems.length > 0) {
          const maxP = Math.max(...catalogItems.map((p) => p.price || 0));
          setPriceLimit(maxP > 0 ? maxP : 1000);
        }
      } catch (err) {
        console.error("Failed to load catalog", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalog();
  }, []);

  // Load Recently Viewed items from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("gor_recently_viewed") || "[]");
      setRecentlyViewed(stored.slice(0, 8));
    } catch (e) {}
  }, []);

  // REFINEMENT #1: DYNAMIC FABRICS FROM ACTUAL PRODUCT CATALOG
  const dynamicFabrics = useMemo(() => {
    const fabrics = products
      .map((p) => p.fabric || (p.description?.includes("Silk") ? "Silk Blend" : p.description?.includes("Cotton") ? "Organic Cotton" : null))
      .filter(Boolean);
    return Array.from(new Set(fabrics));
  }, [products]);

  // REFINEMENT #2: DYNAMIC MIN & MAX PRICE FROM PRODUCT CATALOG
  const { minCatalogPrice, maxCatalogPrice } = useMemo(() => {
    if (!products || products.length === 0) return { minCatalogPrice: 0, maxCatalogPrice: 1000 };
    const prices = products.map((p) => p.price || 0);
    return {
      minCatalogPrice: Math.min(...prices),
      maxCatalogPrice: Math.max(...prices),
    };
  }, [products]);

  // Filter & Sort Logic with Performance Memoization
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== "all") {
      result = result.filter((p) =>
        (p.category || "").toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Search Query Filter (Refinement #7)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // Size Filter
    if (selectedSizeFilter !== "all") {
      result = result.filter((p) => p.sizes && p.sizes.includes(selectedSizeFilter));
    }

    // Color Filter
    if (selectedColorFilter !== "all") {
      result = result.filter((p) =>
        p.colors?.some((c) =>
          (typeof c === "string" ? c : c.name).toLowerCase().includes(selectedColorFilter.toLowerCase())
        )
      );
    }

    // Dynamic Price Filter (Refinement #2)
    result = result.filter((p) => p.price <= priceLimit);

    // Fit Filter
    if (selectedFitFilter !== "all") {
      result = result.filter((p) =>
        (p.fit || p.description || "").toLowerCase().includes(selectedFitFilter.toLowerCase())
      );
    }

    // Fabric Filter (Refinement #1)
    if (selectedFabricFilter !== "all") {
      result = result.filter((p) =>
        (p.fabric || p.description || "").toLowerCase().includes(selectedFabricFilter.toLowerCase())
      );
    }

    // Availability Filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock !== false && p.stock !== 0);
    }

    // Sorting Engine
    if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortOption === "bestselling") {
      result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    } else if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [
    products,
    selectedCategory,
    searchQuery,
    selectedSizeFilter,
    selectedColorFilter,
    priceLimit,
    selectedFitFilter,
    selectedFabricFilter,
    inStockOnly,
    sortOption,
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedSizeFilter("all");
    setSelectedColorFilter("all");
    setSelectedFitFilter("all");
    setSelectedFabricFilter("all");
    setPriceLimit(maxCatalogPrice);
    setSortOption("featured");
    setInStockOnly(false);
  };

  // REFINEMENT #8: ACTIVE FILTER CHIPS WITH INDIVIDUAL REMOVE ACTIONS & CLEAR ALL
  const activeChips = useMemo(() => {
    const chips = [];
    if (selectedCategory !== "all") {
      const catObj = CATEGORIES_LIST.find((c) => c.id === selectedCategory);
      chips.push({
        key: "category",
        label: `Category: ${catObj?.name || selectedCategory}`,
        remove: () => setSelectedCategory("all"),
      });
    }
    if (searchQuery) {
      chips.push({
        key: "search",
        label: `Search: "${searchQuery}"`,
        remove: () => setSearchQuery(""),
      });
    }
    if (selectedSizeFilter !== "all") {
      chips.push({
        key: "size",
        label: `Size: ${selectedSizeFilter}`,
        remove: () => setSelectedSizeFilter("all"),
      });
    }
    if (selectedColorFilter !== "all") {
      chips.push({
        key: "color",
        label: `Color: ${selectedColorFilter}`,
        remove: () => setSelectedColorFilter("all"),
      });
    }
    if (priceLimit < maxCatalogPrice) {
      chips.push({
        key: "price",
        label: `Under ${formatPrice(priceLimit)}`,
        remove: () => setPriceLimit(maxCatalogPrice),
      });
    }
    if (selectedFitFilter !== "all") {
      chips.push({
        key: "fit",
        label: `Fit: ${selectedFitFilter}`,
        remove: () => setSelectedFitFilter("all"),
      });
    }
    if (selectedFabricFilter !== "all") {
      chips.push({
        key: "fabric",
        label: `Fabric: ${selectedFabricFilter}`,
        remove: () => setSelectedFabricFilter("all"),
      });
    }
    if (inStockOnly) {
      chips.push({
        key: "stock",
        label: "In Stock Only",
        remove: () => setInStockOnly(false),
      });
    }
    return chips;
  }, [
    selectedCategory,
    searchQuery,
    selectedSizeFilter,
    selectedColorFilter,
    priceLimit,
    maxCatalogPrice,
    selectedFitFilter,
    selectedFabricFilter,
    inStockOnly,
  ]);

  const categoryObj = CATEGORIES_LIST.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F7F5F2] flex flex-col pt-20 sm:pt-24 select-none">
      
      {/* ── 1. HERO CATEGORY BANNER (Desktop: 55vh, Mobile: 35vh) ── */}
      <PlpHero
        title={categoryObj?.name || "Ready To Wear Collections"}
        subtitle="Designed for everyday confidence and timeless style."
        categoryKey={selectedCategory}
        productCount={filteredProducts.length}
      />

      {/* ── MAIN CONTENT CONTAINER (PLP LAYOUT) ── */}
      <Container className="max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12 py-8 flex-1">
        
        {/* Top Toolbar (Refinement #4 Grid toggle, #7 Search field, Count & Sort) */}
        <PlpTopToolbar
          productCount={filteredProducts.length}
          currentCategoryTitle={categoryObj?.name || "All Collections"}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          gridCols={gridCols}
          onToggleGridCols={setGridCols}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          activeFilterCount={activeChips.length}
        />

        {/* Active Filter Chips Bar (Refinement #8) */}
        <PlpFilterChips activeChips={activeChips} onResetFilters={resetFilters} />

        {/* ── DESKTOP STICKY SIDEBAR + RESPONSIVE GRID ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Sticky Left Sidebar Filters (Refinement #6 Accordions) */}
          <div className="hidden lg:block">
            <PlpSidebarFilters
              categoriesList={CATEGORIES_LIST}
              availableSizes={AVAILABLE_SIZES}
              availableColors={AVAILABLE_COLORS}
              dynamicFabrics={dynamicFabrics}
              minPrice={minCatalogPrice}
              maxPrice={maxCatalogPrice}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedSize={selectedSizeFilter}
              onSelectSize={setSelectedSizeFilter}
              selectedColor={selectedColorFilter}
              onSelectColor={setSelectedColorFilter}
              priceLimit={priceLimit}
              onChangePriceLimit={setPriceLimit}
              selectedFit={selectedFitFilter}
              onSelectFit={setSelectedFitFilter}
              selectedFabric={selectedFabricFilter}
              onSelectFabric={setSelectedFabricFilter}
              inStockOnly={inStockOnly}
              onToggleInStock={setInStockOnly}
              onResetFilters={resetFilters}
            />
          </div>

          {/* Product Grid Container */}
          <div className="flex-1 w-full min-w-0">
            {loading ? (
              /* REFINEMENT #9: LOADING SKELETONS */
              <div className={`grid grid-cols-2 sm:grid-cols-2 ${gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-4 sm:gap-6 lg:gap-8`}>
                <ProductSkeleton count={8} />
              </div>
            ) : filteredProducts.length === 0 ? (
              /* LUXURY EMPTY STATE */
              <div className="py-20 text-center bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 space-y-4 max-w-xl mx-auto my-8 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-[#0B0B0B] border border-[#2A2A2A] text-[#C9A86A] flex items-center justify-center mx-auto shadow-inner">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-3xl font-normal text-[#F7F5F2]">No garments found.</h3>
                <p className="font-sans text-xs text-[#B8B6B0] font-light">
                  No items match your selected filter criteria. Try adjusting size, color, or price range.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-8 py-3.5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#D4B57C] transition-colors cursor-pointer shadow-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* PRODUCT GRID — blur-stagger reveal */
              <>
                <div
                  className={`grid grid-cols-2 sm:grid-cols-2 ${
                    gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
                  } gap-4 sm:gap-6 lg:gap-8`}
                >
                  <AnimatePresence>
                    {filteredProducts.slice(0, visibleCount).map((product, idx) => (
                      <motion.div
                        key={product.id || product._id || idx}
                        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(4px)" }}
                        transition={{ duration: 0.42, delay: (idx % 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <ProductCard
                          product={product}
                          onQuickView={(p) => setQuickViewProduct(p)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Load More */}
                {visibleCount < filteredProducts.length && (
                  <div className="mt-12 text-center">
                    <motion.button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 12)}
                      whileHover={{ scale: 1.03, borderColor: "#C9A86A" }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="px-8 py-4 bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#C9A86A] hover:text-[#F7F5F2] font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-xl transition-colors cursor-pointer shadow-lg"
                    >
                      Load More Garments ({filteredProducts.length - visibleCount} Remaining)
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </Container>

      {/* ── RECENTLY VIEWED CAROUSEL ── */}
      {recentlyViewed.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#111111] border-t border-[#2A2A2A]">
          <Container className="max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#315DA8] font-bold block mb-1">
                  BROWSING HISTORY
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F7F5F2]">
                  Recently Viewed
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (viewedSliderRef.current)
                      viewedSliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
                  }}
                  aria-label="Scroll left"
                  className="w-10 h-10 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#B8B6B0] hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (viewedSliderRef.current)
                      viewedSliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
                  }}
                  aria-label="Scroll right"
                  className="w-10 h-10 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#B8B6B0] hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors cursor-pointer"
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

      {/* REFINEMENT #5: QUICK VIEW SLIDE-OVER DRAWER */}
      <QuickViewDrawer
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* MOBILE BOTTOM SHEET FILTER DRAWER */}
      <PlpMobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        categoriesList={CATEGORIES_LIST}
        availableSizes={AVAILABLE_SIZES}
        availableColors={AVAILABLE_COLORS}
        dynamicFabrics={dynamicFabrics}
        minPrice={minCatalogPrice}
        maxPrice={maxCatalogPrice}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSize={selectedSizeFilter}
        onSelectSize={setSelectedSizeFilter}
        selectedColor={selectedColorFilter}
        onSelectColor={setSelectedColorFilter}
        priceLimit={priceLimit}
        onChangePriceLimit={setPriceLimit}
        selectedFit={selectedFitFilter}
        onSelectFit={setSelectedFitFilter}
        selectedFabric={selectedFabricFilter}
        onSelectFabric={setSelectedFabricFilter}
        inStockOnly={inStockOnly}
        onToggleInStock={setInStockOnly}
        onResetFilters={resetFilters}
      />

    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <NoiseOverlay />
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-[#0B0B0B] pt-32 text-center text-[#C9A86A] font-serif text-2xl">Loading Collection...</div>}>
        <ShopContent />
      </Suspense>
      <CartDrawer />
      <Footer />
    </>
  );
}
