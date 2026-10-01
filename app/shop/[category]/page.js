"use client";

import { useState, useEffect, use, useMemo, Suspense } from "react";
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
import { categoriesService } from "@/lib/categoriesService";

// PLP Subcomponents
import PlpHero from "@/components/plp/PlpHero";
import PlpSidebarFilters from "@/components/plp/PlpSidebarFilters";
import PlpMobileFilterDrawer from "@/components/plp/PlpMobileFilterDrawer";
import PlpTopToolbar from "@/components/plp/PlpTopToolbar";
import PlpFilterChips from "@/components/plp/PlpFilterChips";
import QuickViewDrawer from "@/components/plp/QuickViewDrawer";

const CATEGORY_EDITORIAL_META = {
  "t-shirts": {
    name: "T-SHIRTS",
    description: "Everyday silhouettes, considered proportions.",
    index: "01 / COLLECTION",
  },
  shirts: {
    name: "SHIRTS",
    description: "Textured weaves, architectural collars, and tailored cuts.",
    index: "02 / COLLECTION",
  },
  polos: {
    name: "POLOS",
    description: "Elevated knitwear, ribbed collars, and refined casualwear.",
    index: "03 / COLLECTION",
  },
  pants: {
    name: "PANTS",
    description: "Utilitarian cargo silhouettes, relaxed twill, and structured trousers.",
    index: "04 / COLLECTION",
  },
  trousers: {
    name: "TROUSERS",
    description: "Sartorial pleats, fluid drape, and clean tapered breaks.",
    index: "05 / COLLECTION",
  },
  jackets: {
    name: "JACKETS",
    description: "Structured bombers, unlined transitional jackets, and outerwear.",
    index: "06 / COLLECTION",
  },
  jerseys: {
    name: "JERSEYS",
    description: "Athletic mesh silhouettes, collegiate graphics, and modern streetwear.",
    index: "07 / COLLECTION",
  },
  uncategorized: {
    name: "UNCATEGORIZED",
    description: "Curated multi-piece ensembles and specialized silhouettes.",
    index: "08 / COLLECTION",
  },
};

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const AVAILABLE_COLORS = [
  { name: "Black", hex: "#151515" },
  { name: "White", hex: "#F5F5F5" },
  { name: "Navy", hex: "#1C2E4A" },
  { name: "Charcoal", hex: "#3A3A3A" },
  { name: "Sand", hex: "#D8C4A4" },
  { name: "Burgundy", hex: "#5C1D24" },
];

function CategoryContent({ categoryParam }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Filter state
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("all");
  const [selectedColorFilter, setSelectedColorFilter] = useState("all");
  const [selectedFitFilter, setSelectedFitFilter] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Price & Grid Density
  const [priceLimit, setPriceLimit] = useState(50000);
  const [gridCols, setGridCols] = useState(4);

  // UI state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(48);

  // Normalized category slug
  const normalizedCategory = (categoryParam || "t-shirts").toLowerCase().trim();
  const categoryMeta =
    CATEGORY_EDITORIAL_META[normalizedCategory] || {
      name: normalizedCategory.toUpperCase(),
      description: "Everyday silhouettes, considered proportions.",
      index: "01 / COLLECTION",
    };

  // Dynamic Subcategories for this category from categoriesService
  const subcategories = useMemo(() => {
    return categoriesService.getSubcategories(normalizedCategory);
  }, [normalizedCategory]);

  // Fetch catalog from API / Service
  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        let catalogItems = await productService.getProductsByCategory(normalizedCategory);
        if (!catalogItems || !catalogItems.length) {
          catalogItems = await productService.getStorefrontProducts();
        }
        if (!catalogItems || !Array.isArray(catalogItems)) {
          catalogItems = [];
        }
        setProducts(catalogItems);

        if (catalogItems.length > 0) {
          const maxP = Math.max(...catalogItems.map((p) => p.price || 0));
          setPriceLimit(maxP > 0 ? maxP : 1000);
        }
      } catch (err) {
        console.error("Failed to load category catalog", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalog();
  }, [normalizedCategory]);

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

    // Filter strictly to this category
    const catSlugNorm = normalizedCategory.replace(/[^a-z0-9]/g, "");
    result = result.filter((p) => {
      const pCatSlugStr = typeof p.categorySlug === "string" ? p.categorySlug : (p.category?.slug || "");
      const pCatNameStr = typeof p.category === "string" ? p.category : (p.category?.name || "");
      const pCatSlug = pCatSlugStr.toLowerCase().replace(/[^a-z0-9]/g, "");
      const pCatName = pCatNameStr.toLowerCase().replace(/[^a-z0-9]/g, "");
      const pCatId = String(p.categoryId || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      return (
        pCatSlug === catSlugNorm ||
        pCatName === catSlugNorm ||
        pCatId === catSlugNorm ||
        pCatId === `cat${catSlugNorm}`
      );
    });

    // Subcategory Filter
    if (selectedSubcategory !== "all") {
      const subSlugNorm = String(selectedSubcategory).toLowerCase().replace(/[^a-z0-9]/g, "");
      result = result.filter((p) => {
        const pSubSlugStr = typeof p.subcategorySlug === "string" ? p.subcategorySlug : (p.subcategory?.slug || "");
        const pSubNameStr = typeof p.subcategory === "string" ? p.subcategory : (p.subcategory?.name || "");
        const pSubSlug = pSubSlugStr.toLowerCase().replace(/[^a-z0-9]/g, "");
        const pSubName = pSubNameStr.toLowerCase().replace(/[^a-z0-9]/g, "");
        return pSubSlug === subSlugNorm || pSubName === subSlugNorm || pSubName.includes(subSlugNorm);
      });
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const nameStr = typeof p.name === "string" ? p.name : String(p.name || "");
        const subStr = typeof p.subcategory === "string" ? p.subcategory : (p.subcategory?.name || "");
        const descStr = typeof p.description === "string" ? p.description : String(p.description || "");
        return (
          nameStr.toLowerCase().includes(q) ||
          subStr.toLowerCase().includes(q) ||
          descStr.toLowerCase().includes(q)
        );
      });
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
    normalizedCategory,
    selectedSubcategory,
    searchQuery,
    selectedSizeFilter,
    selectedColorFilter,
    priceLimit,
    selectedFitFilter,
    inStockOnly,
    sortOption,
  ]);

  // Reset Filters
  const resetFilters = () => {
    setSelectedSubcategory("all");
    setSearchQuery("");
    setSelectedSizeFilter("all");
    setSelectedColorFilter("all");
    setSelectedFitFilter("all");
    setPriceLimit(maxCatalogPrice);
    setSortOption("featured");
    setInStockOnly(false);
  };

  // Active Chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (selectedSubcategory !== "all") {
      const sub = subcategories.find((s) => s.slug === selectedSubcategory || s.id === selectedSubcategory);
      chips.push({
        key: "subcategory",
        label: `Subcategory: ${sub?.name || selectedSubcategory}`,
        remove: () => setSelectedSubcategory("all"),
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
    selectedSubcategory,
    subcategories,
    searchQuery,
    selectedSizeFilter,
    selectedColorFilter,
    priceLimit,
    maxCatalogPrice,
    selectedFitFilter,
    inStockOnly,
  ]);

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#111111] flex flex-col selection:bg-[#111111] selection:text-[#F5F2EC]">
      {/* ── STICKY NAVBAR ── */}
      <Navbar />

      {/* ── 1. REFINED EDITORIAL COLLECTION HEADER (Section 4) ── */}
      <PlpHero
        title={categoryMeta.name}
        subtitle={categoryMeta.description}
        categoryKey={normalizedCategory}
        productCount={filteredProducts.length}
        silhouetteIndex={categoryMeta.index}
        breadcrumbs={[
          { label: "SHOP", href: "/shop" },
          { label: categoryMeta.name },
        ]}
      />

      {/* ── 2. DYNAMIC SUBCATEGORY SUBNAVIGATION (Section 5) ── */}
      {subcategories.length > 0 && (
        <nav aria-label="Subcategory Navigation" className="border-b border-[#D8D2C8] bg-[#F5F2EC] sticky top-[60px] sm:top-[68px] z-30 overflow-x-auto scrollbar-none">
          <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center gap-2 sm:gap-4 py-3">
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#716D66] shrink-0 mr-2 hidden sm:block">
              SILHOUETTES:
            </span>

            {/* ALL Tab */}
            <button
              type="button"
              onClick={() => setSelectedSubcategory("all")}
              className={`px-3 py-1.5 font-sans text-xs uppercase tracking-[0.15em] shrink-0 transition-colors cursor-pointer border ${
                selectedSubcategory === "all"
                  ? "bg-[#151515] text-[#F5F2EC] border-[#151515] font-medium"
                  : "border-transparent text-[#716D66] hover:text-[#111111] hover:border-[#D8D2C8]"
              }`}
            >
              ALL
            </button>

            {/* Subcategory Dynamic Tabs */}
            {subcategories.map((sub) => {
              const isSelected =
                selectedSubcategory === sub.slug || selectedSubcategory === sub.id;
              return (
                <button
                  key={sub.slug || sub.id}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub.slug || sub.id)}
                  className={`px-3 py-1.5 font-sans text-xs uppercase tracking-[0.15em] shrink-0 transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-[#151515] text-[#F5F2EC] border-[#151515] font-medium"
                      : "border-transparent text-[#716D66] hover:text-[#111111] hover:border-[#D8D2C8]"
                  }`}
                >
                  {sub.name.toUpperCase()}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ── 3. MAIN CATALOGUE CONTAINER ── */}
      <main className="max-w-[1600px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-12 flex-1">
        {/* Top Toolbar */}
        <PlpTopToolbar
          productCount={filteredProducts.length}
          currentCategoryTitle={categoryMeta.name}
          sortOption={sortOption}
          onSortChange={setSortOption}
          gridCols={gridCols}
          onToggleGridCols={setGridCols}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          activeFilterCount={activeChips.length}
        />

        {/* Active Filter Chips */}
        <PlpFilterChips activeChips={activeChips} onResetFilters={resetFilters} />

        {/* Left Filter Panel + Responsive Grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Desktop Left Sidebar Filters */}
          <div className="hidden lg:block">
            <PlpSidebarFilters
              subcategoriesList={subcategories}
              availableSizes={AVAILABLE_SIZES}
              availableColors={AVAILABLE_COLORS}
              minPrice={minCatalogPrice}
              maxPrice={maxCatalogPrice}
              selectedCategory={normalizedCategory}
              onSelectCategory={() => {}}
              selectedSubcategory={selectedSubcategory}
              onSelectSubcategory={setSelectedSubcategory}
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

          {/* Product Grid */}
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
              /* Empty Category (Section 9) */
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

                {/* Load More */}
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
        subcategoriesList={subcategories}
        availableSizes={AVAILABLE_SIZES}
        availableColors={AVAILABLE_COLORS}
        minPrice={minCatalogPrice}
        maxPrice={maxCatalogPrice}
        selectedCategory={normalizedCategory}
        onSelectCategory={() => {}}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={setSelectedSubcategory}
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

export default function CategoryPage({ params }) {
  const unwrappedParams = params && typeof params.then === "function" ? use(params) : (params || {});
  const categoryParam = unwrappedParams?.category || "t-shirts";

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F2EC] pt-32 text-center text-[#716D66] font-editorial text-2xl">
          Loading Collection...
        </div>
      }
    >
      <CategoryContent categoryParam={categoryParam} />
    </Suspense>
  );
}
