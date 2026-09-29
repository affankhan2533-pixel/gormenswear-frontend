"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import ProductCard from "@/components/ui/ProductCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils";
import { productService } from "@/lib/productService";

// PLP Subcomponents
import PlpHero from "@/components/plp/PlpHero";
import PlpSidebarFilters from "@/components/plp/PlpSidebarFilters";
import PlpMobileFilterDrawer from "@/components/plp/PlpMobileFilterDrawer";
import PlpTopToolbar from "@/components/plp/PlpTopToolbar";
import PlpFilterChips from "@/components/plp/PlpFilterChips";
import QuickViewDrawer from "@/components/plp/QuickViewDrawer";

const DIRECTORY_CATEGORIES = [
  { id: "all", name: "All Releases", slug: "all" },
  { id: "t-shirts", name: "T-Shirts", slug: "t-shirts" },
  { id: "shirts", name: "Shirts", slug: "shirts" },
  { id: "polos", name: "Polos", slug: "polos" },
  { id: "pants", name: "Pants", slug: "pants" },
  { id: "trousers", name: "Trousers", slug: "trousers" },
  { id: "jackets", name: "Jackets", slug: "jackets" },
  { id: "jerseys", name: "Jerseys", slug: "jerseys" },
];

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const AVAILABLE_COLORS = [
  { name: "Black", hex: "#151515" },
  { name: "White", hex: "#F5F5F5" },
  { name: "Navy", hex: "#1C2E4A" },
  { name: "Charcoal", hex: "#3A3A3A" },
  { name: "Sand", hex: "#D8C4A4" },
  { name: "Burgundy", hex: "#5C1D24" },
];

function NewArrivalsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Filter state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("all");
  const [selectedColorFilter, setSelectedColorFilter] = useState("all");
  const [selectedFitFilter, setSelectedFitFilter] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Price Limit & Grid Columns
  const [priceLimit, setPriceLimit] = useState(1000);
  const [gridCols, setGridCols] = useState(4);

  // UI state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Fetch catalog from API / Service
  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        let catalogItems = await productService.getStorefrontProducts();
        if (!catalogItems || !Array.isArray(catalogItems)) {
          catalogItems = [];
        }
        setProducts(catalogItems);

        if (catalogItems.length > 0) {
          const maxP = Math.max(...catalogItems.map((p) => p.price || 0));
          setPriceLimit(maxP > 0 ? maxP : 1000);
        }
      } catch (err) {
        console.error("Failed to load new arrivals catalog", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalog();
  }, []);

  // Dynamic Min & Max Price
  const { minCatalogPrice, maxCatalogPrice } = useMemo(() => {
    if (!products || products.length === 0) return { minCatalogPrice: 0, maxCatalogPrice: 1000 };
    const prices = products.map((p) => p.price || 0);
    return {
      minCatalogPrice: Math.min(...prices),
      maxCatalogPrice: Math.max(...prices),
    };
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== "all") {
      const normalizedCat = selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, "");
      result = result.filter((p) => {
        const catSlug = (p.categorySlug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const catName = (p.category || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        return (
          catSlug === normalizedCat ||
          catName === normalizedCat ||
          catName.includes(normalizedCat) ||
          normalizedCat.includes(catName)
        );
      });
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
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

    // Price Filter
    result = result.filter((p) => (p.price || 0) <= priceLimit);

    // Fit Filter
    if (selectedFitFilter !== "all") {
      result = result.filter((p) =>
        (p.fit || p.description || "").toLowerCase().includes(selectedFitFilter.toLowerCase())
      );
    }

    // Availability Filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock !== false && p.stock !== 0);
    }

    // Sorting
    if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortOption === "price-asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
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
    setPriceLimit(maxCatalogPrice);
    setSortOption("newest");
    setInStockOnly(false);
  };

  // Active Filter Chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (selectedCategory !== "all") {
      const catObj = DIRECTORY_CATEGORIES.find((c) => c.id === selectedCategory);
      chips.push({
        key: "category",
        label: `Category: ${catObj?.name || selectedCategory}`,
        remove: () => setSelectedCategory("all"),
      });
    }
    if (searchQuery.trim()) {
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
    inStockOnly,
  ]);

  const currentCategoryObj = DIRECTORY_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#111111] flex flex-col selection:bg-[#111111] selection:text-[#F5F2EC]">
      {/* ── 1. EDITORIAL HEADER ── */}
      <PlpHero
        title="NEW ARRIVALS"
        subtitle="Latest additions to the GOR archive — considered silhouettes and modern menswear."
        categoryKey="new-arrivals"
        productCount={filteredProducts.length}
        silhouetteIndex="SEASON / NEW DROPS"
        breadcrumbs={[
          { label: "SHOP", href: "/shop" },
          { label: "NEW ARRIVALS" },
        ]}
      />

      {/* ── 2. CATEGORY DIRECTORY NAVIGATION BAR ── */}
      <nav aria-label="Category Directory" className="border-b border-[#D8D2C8] bg-[#F5F2EC] sticky top-16 z-30 overflow-x-auto scrollbar-none">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center gap-2 sm:gap-4 py-3">
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#716D66] shrink-0 mr-2 hidden sm:block">
            FILTER BY:
          </span>
          {DIRECTORY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 font-sans text-xs uppercase tracking-[0.15em] shrink-0 transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-[#151515] text-[#F5F2EC] border-[#151515] font-medium"
                    : "border-transparent text-[#716D66] hover:text-[#111111] hover:border-[#D8D2C8]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── 3. MAIN CATALOGUE CONTAINER ── */}
      <main className="max-w-[1600px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-12 flex-1">
        {/* Top Toolbar */}
        <PlpTopToolbar
          productCount={filteredProducts.length}
          currentCategoryTitle={currentCategoryObj?.name || "New Arrivals"}
          sortOption={sortOption}
          onSortChange={setSortOption}
          gridCols={gridCols}
          onToggleGridCols={setGridCols}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          activeFilterCount={activeChips.length}
        />

        {/* Active Filter Chips */}
        <PlpFilterChips activeChips={activeChips} onResetFilters={resetFilters} />

        {/* Content Layout: Sticky Left Filter Panel + Grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Desktop Left Sidebar Filters */}
          <div className="hidden lg:block">
            <PlpSidebarFilters
              categoriesList={DIRECTORY_CATEGORIES.filter((c) => c.id !== "all")}
              availableSizes={AVAILABLE_SIZES}
              availableColors={AVAILABLE_COLORS}
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
              inStockOnly={inStockOnly}
              onToggleInStock={setInStockOnly}
              onResetFilters={resetFilters}
            />
          </div>

          {/* Product Grid Area */}
          <div className="flex-1 w-full min-w-0">
            {loading ? (
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 ${
                  gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
                } gap-4 sm:gap-6 lg:gap-8`}
              >
                <ProductSkeleton count={8} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                type="category"
                customTitle="NO PIECES YET"
                customDesc="This collection is being prepared."
                onAction={resetFilters}
                actionLabel="RESET ALL FILTERS"
              />
            ) : (
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
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: (idx % 6) * 0.03 }}
                      >
                        <ProductCard
                          product={product}
                          onQuickView={(p) => setQuickViewProduct(p)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Load More Button */}
                {visibleCount < filteredProducts.length && (
                  <div className="mt-14 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 12)}
                      className="px-8 py-3.5 bg-transparent border border-[#111111] text-[#111111] hover:bg-[#151515] hover:text-[#F5F2EC] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                    >
                      LOAD MORE ({filteredProducts.length - visibleCount} REMAINING)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Quick View Drawer */}
      <QuickViewDrawer
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Mobile Filter Drawer */}
      <PlpMobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        categoriesList={DIRECTORY_CATEGORIES.filter((c) => c.id !== "all")}
        availableSizes={AVAILABLE_SIZES}
        availableColors={AVAILABLE_COLORS}
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
        inStockOnly={inStockOnly}
        onToggleInStock={setInStockOnly}
        onResetFilters={resetFilters}
      />

      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function NewArrivalsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F2EC] pt-32 text-center text-[#716D66] font-editorial text-2xl">
          Loading New Arrivals...
        </div>
      }
    >
      <NewArrivalsContent />
    </Suspense>
  );
}
