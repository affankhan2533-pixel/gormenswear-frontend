"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
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
  { id: "all", name: "All Drops" },
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

function NewArrivalsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("all");
  const [selectedColorFilter, setSelectedColorFilter] = useState("all");
  const [selectedFitFilter, setSelectedFitFilter] = useState("all");
  const [selectedFabricFilter, setSelectedFabricFilter] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  const [priceLimit, setPriceLimit] = useState(1000);
  const [gridCols, setGridCols] = useState(4);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const viewedSliderRef = useRef(null);

  useEffect(() => {
    async function fetchNewArrivals() {
      setLoading(true);
      try {
        let catalogItems = await productService.getStorefrontProducts();
        if (!catalogItems || catalogItems.length === 0) catalogItems = [];
        setProducts(catalogItems);

        if (catalogItems.length > 0) {
          const maxP = Math.max(...catalogItems.map((p) => p.price || 0));
          setPriceLimit(maxP > 0 ? maxP : 1000);
        }
      } catch (err) {
        console.error("Failed to fetch new arrivals", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("gor_recently_viewed") || "[]");
      setRecentlyViewed(stored.slice(0, 8));
    } catch (e) {}
  }, []);

  const dynamicFabrics = useMemo(() => {
    const fabrics = products
      .map((p) => p.fabric || (p.description?.includes("Silk") ? "Silk Blend" : p.description?.includes("Cotton") ? "Organic Cotton" : null))
      .filter(Boolean);
    return Array.from(new Set(fabrics));
  }, [products]);

  const { minCatalogPrice, maxCatalogPrice } = useMemo(() => {
    if (!products || products.length === 0) return { minCatalogPrice: 0, maxCatalogPrice: 1000 };
    const prices = products.map((p) => p.price || 0);
    return {
      minCatalogPrice: Math.min(...prices),
      maxCatalogPrice: Math.max(...prices),
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter((p) =>
        (p.category || "").toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    if (selectedSizeFilter !== "all") {
      result = result.filter((p) => p.sizes && p.sizes.includes(selectedSizeFilter));
    }

    if (selectedColorFilter !== "all") {
      result = result.filter((p) =>
        p.colors?.some((c) =>
          (typeof c === "string" ? c : c.name).toLowerCase().includes(selectedColorFilter.toLowerCase())
        )
      );
    }

    result = result.filter((p) => p.price <= priceLimit);

    if (selectedFitFilter !== "all") {
      result = result.filter((p) =>
        (p.fit || p.description || "").toLowerCase().includes(selectedFitFilter.toLowerCase())
      );
    }

    if (selectedFabricFilter !== "all") {
      result = result.filter((p) =>
        (p.fabric || p.description || "").toLowerCase().includes(selectedFabricFilter.toLowerCase())
      );
    }

    if (inStockOnly) {
      result = result.filter((p) => p.inStock !== false && p.stock !== 0);
    }

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

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedSizeFilter("all");
    setSelectedColorFilter("all");
    setSelectedFitFilter("all");
    setSelectedFabricFilter("all");
    setPriceLimit(maxCatalogPrice);
    setSortOption("newest");
    setInStockOnly(false);
  };

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

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F7F5F2] flex flex-col pt-20 sm:pt-24 select-none">
      <PlpHero
        title="New Arrivals Release"
        subtitle="Discover the latest GOR Menswear storefront drops, Alo co-ord sets, and statement outerwear."
        categoryKey="new-arrivals"
        productCount={filteredProducts.length}
        heroImage="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop"
      />

      <Container className="max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12 py-8 flex-1">
        <PlpTopToolbar
          productCount={filteredProducts.length}
          currentCategoryTitle="New Arrivals"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          gridCols={gridCols}
          onToggleGridCols={setGridCols}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          activeFilterCount={activeChips.length}
        />

        <PlpFilterChips activeChips={activeChips} onResetFilters={resetFilters} />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
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

          <div className="flex-1 w-full min-w-0">
            {loading ? (
              <div className={`grid grid-cols-2 sm:grid-cols-2 ${gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-4 sm:gap-6 lg:gap-8`}>
                <ProductSkeleton count={8} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 space-y-4 max-w-xl mx-auto my-8 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-[#0B0B0B] border border-[#2A2A2A] text-[#C9A86A] flex items-center justify-center mx-auto shadow-inner">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-3xl font-normal text-[#F7F5F2]">No new arrivals found.</h3>
                <p className="font-sans text-xs text-[#B8B6B0] font-light">
                  No items match your selected filter criteria. Try resetting options.
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
              <>
                <motion.div
                  layout
                  className={`grid grid-cols-2 sm:grid-cols-2 ${
                    gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
                  } gap-4 sm:gap-6 lg:gap-8`}
                >
                  <AnimatePresence>
                    {filteredProducts.slice(0, visibleCount).map((product, idx) => (
                      <motion.div
                        key={product.id || product._id || idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, delay: (idx % 8) * 0.03 }}
                      >
                        <ProductCard product={product} onQuickView={(p) => setQuickViewProduct(p)} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {visibleCount < filteredProducts.length && (
                  <div className="mt-12 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 12)}
                      className="px-8 py-4 bg-[#111111] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#C9A86A] hover:text-[#F7F5F2] font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
                    >
                      Load More Releases ({filteredProducts.length - visibleCount} Remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>

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
                    if (viewedSliderRef.current) viewedSliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
                  }}
                  aria-label="Scroll left"
                  className="w-10 h-10 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#B8B6B0] hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (viewedSliderRef.current) viewedSliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
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

      <QuickViewDrawer
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

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

export default function NewArrivalsPage() {
  return (
    <>
      <NoiseOverlay />
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-[#0B0B0B] pt-32 text-center text-[#C9A86A] font-serif text-2xl">Loading New Arrivals...</div>}>
        <NewArrivalsContent />
      </Suspense>
      <CartDrawer />
      <Footer />
    </>
  );
}
