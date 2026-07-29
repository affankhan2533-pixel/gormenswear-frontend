"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Heart,
  ArrowRight,
  Flame,
  Clock,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

// ── Mega Menu Data Structure ──
const MEGA_MENU_DATA = {
  codset: {
    title: "Co-Ord Sets",
    tagline: "Matching streetwear and tailored lounge ensembles.",
    subcategories: [
      { name: "Burgundy Alo Co-Ord", href: "/shop/codset" },
      { name: "Sand Textured Zip Set", href: "/shop/codset" },
      { name: "Burberry Onyx Zip Set", href: "/shop/codset" },
      { name: "Linen Summer Ensembles", href: "/shop/codset" },
    ],
    image: "/images/lookbook/gor-lookbook-1.webp",
    featuredTitle: "The Summer Streetwear Edit",
    href: "/shop/codset",
  },
  outerwear: {
    title: "Outerwear & Layers",
    tagline: "Structured jackets, shearling coats, and Italian tailoring.",
    subcategories: [
      { name: "Double-Breasted Cashmere Blazers", href: "/shop/outerwear" },
      { name: "Biella Shearling Suede Jackets", href: "/shop/outerwear" },
      { name: "Architectural Wool Trench Coats", href: "/shop/outerwear" },
      { name: "Atelier Puffer Vests", href: "/shop/outerwear" },
    ],
    image: "/images/lookbook/gor-lookbook-4.webp",
    featuredTitle: "Shearling & Leather Atelier",
    href: "/shop/outerwear",
  },
  shirts: {
    title: "Designer Shirts",
    tagline: "High-density mulberry silk and tailored poplin shirting.",
    subcategories: [
      { name: "Heavyweight Raw Silk Shirts", href: "/shop/shirts" },
      { name: "Silk Monogram Camp Shirts", href: "/shop/shirts" },
      { name: "Striped Cotton Poplin Shirts", href: "/shop/shirts" },
      { name: "Bespoke Grandad Shirts", href: "/shop/shirts" },
    ],
    image: "/images/lookbook/gor-lookbook-2.webp",
    featuredTitle: "Noir Mulberry Silk Collection",
    href: "/shop/shirts",
  },
  trousers: {
    title: "Tailored Trousers",
    tagline: "Single-pleated wool, side adjusters, and relaxed cuts.",
    subcategories: [
      { name: "Italian Merino Pleated Trousers", href: "/shop/trousers" },
      { name: "Olive Chino Trousers", href: "/shop/trousers" },
      { name: "Charcoal Slate Trousers", href: "/shop/trousers" },
      { name: "Relaxed Fit Wool Trousers", href: "/shop/trousers" },
    ],
    image: "/images/lookbook/gor-lookbook-3.webp",
    featuredTitle: "Hand-Tailored Pleated Trousers",
    href: "/shop/trousers",
  },
  accessories: {
    title: "Bespoke Accessories",
    tagline: "Italian calfskin leather belts, bags, and leather goods.",
    subcategories: [
      { name: "Full-Grain Calfskin Belts", href: "/shop/accessories" },
      { name: "Brass Buckle Atelier Belts", href: "/shop/accessories" },
      { name: "Leather Holdalls & Tote Bags", href: "/shop/accessories" },
      { name: "Small Leather Wallets", href: "/shop/accessories" },
    ],
    image: "/images/lookbook/gor-lookbook-5.webp",
    featuredTitle: "Italian Calfskin Craftsmanship",
    href: "/shop/accessories",
  },
};

const NAV_ITEMS = [
  { name: "Shop", href: "/shop" },
  { name: "New Arrivals", href: "/new-arrivals", badge: "NEW" },
  { name: "Co-Ord Sets", href: "/shop/codset", key: "codset" },
  { name: "Outerwear", href: "/shop/outerwear", key: "outerwear" },
  { name: "Shirts", href: "/shop/shirts", key: "shirts" },
  { name: "Trousers", href: "/shop/trousers", key: "trousers" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItemsCount, setIsCartOpen, wishlist } = useCart();
  const { user } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaKey, setActiveMegaKey] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileAcc, setExpandedMobileAcc] = useState(null);
  
  // Search Overlay state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "Cashmere Blazer",
    "Silk Shirt",
    "Co-Ord Set",
  ]);
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Fetch product catalog for search suggestions
  useEffect(() => {
    async function fetchProducts() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/products`);
        const data = await res.json();
        if (data.success) {
          setAllProducts(data.data);
        }
      } catch (err) {
        // Fallback search suggestions if server offline
      }
    }
    fetchProducts();
  }, []);

  // Handle live search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
    setSearchResults(filtered.slice(0, 4));
  }, [searchQuery, allProducts]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation for search modal & Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setActiveMegaKey(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu or search open
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen, searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      if (!recentSearches.includes(q)) {
        setRecentSearches([q, ...recentSearches.slice(0, 4)]);
      }
      setSearchOpen(false);
      router.push(`/shop?search=${encodeURIComponent(q)}`);
      setSearchQuery("");
    }
  };

  const handleRecentClick = (term) => {
    setSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(term)}`);
    setSearchQuery("");
  };

  return (
    <>
      {/* ── 1. Fixed Main Navbar Header ── */}
      <header
        onMouseLeave={() => setActiveMegaKey(null)}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out ${
          isScrolled || activeMegaKey
            ? "bg-[#0F1115]/92 backdrop-blur-xl border-b border-[rgba(200,167,106,0.15)] py-3.5 sm:py-4 shadow-2xl"
            : "bg-transparent border-b border-transparent py-5 lg:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          
          {/* Logo Left */}
          <div className="flex items-center">
            <Logo size="md" />
          </div>

          {/* Desktop Nav Items Center */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const hasMega = !!item.key;

              return (
                <div
                  key={item.name}
                  onMouseEnter={() => hasMega && setActiveMegaKey(item.key)}
                  className="relative py-2"
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1 font-sans text-[11px] lg:text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-[#C8A76A] font-semibold"
                        : activeMegaKey === item.key
                        ? "text-[#C8A76A]"
                        : "text-[#F5F3EF]/80 hover:text-[#C8A76A]"
                    }`}
                  >
                    <span>{item.name}</span>
                    {hasMega && (
                      <ChevronDown
                        className={`w-3 h-3 text-[#C8A76A]/70 transition-transform duration-300 ${
                          activeMegaKey === item.key ? "rotate-180 text-[#C8A76A]" : ""
                        }`}
                      />
                    )}
                    {item.badge && (
                      <span className="text-[8.5px] bg-[#C8A76A]/15 text-[#C8A76A] px-1.5 py-0.5 rounded border border-[#C8A76A]/40 font-semibold ml-1">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                  {/* Underline Indicator */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${
                      isActive
                        ? "w-full bg-[#C8A76A]"
                        : activeMegaKey === item.key
                        ? "w-full bg-[#C8A76A]"
                        : "w-0 bg-[#C8A76A]"
                    }`}
                  />
                </div>
              );
            })}
          </nav>

          {/* Action Icons Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Fullscreen Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search Catalog"
              className="p-2 text-[#F8F6F3]/80 hover:text-[#C8A45D] transition-colors duration-300 flex items-center justify-center cursor-pointer rounded-full hover:bg-white/[0.05]"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Wishlist Shortcut Badge with Logo Orange Dot */}
            <Link
              href="/wishlist"
              aria-label="Saved Wishlist"
              className="p-2 text-[#F8F6F3]/80 hover:text-[#C8A45D] transition-colors duration-300 hidden sm:flex items-center justify-center relative rounded-full hover:bg-white/[0.05]"
            >
              <Heart className="w-4 h-4 stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D86A32] rounded-full animate-pulse" />
              )}
            </Link>

            {/* Account / Login Link */}
            <Link
              href={user ? "/account" : "/login"}
              aria-label={user ? "My Account" : "Sign In"}
              className="p-2 text-[#F8F6F3]/80 hover:text-[#C8A45D] transition-colors duration-300 hidden sm:flex items-center justify-center relative rounded-full hover:bg-white/[0.05]"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="p-2 text-[#F8F6F3]/80 hover:text-[#C8A45D] transition-colors duration-300 relative flex items-center justify-center cursor-pointer rounded-full hover:bg-white/[0.05]"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#C8A45D] text-[#090909] font-sans text-[9px] font-semibold rounded-full flex items-center justify-center price-display">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="md:hidden p-2 text-[#F8F6F3] hover:text-[#C8A45D] transition-colors ml-1 cursor-pointer"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

        </div>

        {/* ── 2. Desktop Mega Menu Panel Dropdown (#151515 Surface) ── */}
        <AnimatePresence>
          {activeMegaKey && MEGA_MENU_DATA[activeMegaKey] && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseEnter={() => setActiveMegaKey(activeMegaKey)}
              onMouseLeave={() => setActiveMegaKey(null)}
              className="hidden md:block absolute top-full left-0 right-0 bg-[#151515]/98 border-b border-[#2A2A2A] backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
                <div className="grid grid-cols-12 gap-8 items-stretch">
                  
                  {/* Left 7 Columns */}
                  <div className="col-span-7 flex flex-col justify-between pr-8 border-r border-[#2A2A2A]">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
                        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-medium">
                          ATELIER CATEGORY
                        </span>
                      </div>

                      <h3 className="font-editorial text-3xl font-normal text-[#F8F6F3] mb-2">
                        {MEGA_MENU_DATA[activeMegaKey].title}
                      </h3>
                      <p className="font-sans text-xs text-[#8E8A85] font-light mb-8 max-w-md">
                        {MEGA_MENU_DATA[activeMegaKey].tagline}
                      </p>

                      {/* Subcategories Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {MEGA_MENU_DATA[activeMegaKey].subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setActiveMegaKey(null)}
                            className="group flex items-center justify-between p-3 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D]/50 rounded-[8px] transition-all duration-300"
                          >
                            <span className="font-sans text-xs text-[#F8F6F3] group-hover:text-[#C8A45D] font-medium transition-colors">
                              {sub.name}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#8E8A85] group-hover:text-[#C8A45D] group-hover:translate-x-1 transition-all duration-300" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA Link */}
                    <div className="mt-8 pt-6 border-t border-[#2A2A2A]">
                      <Link
                        href={MEGA_MENU_DATA[activeMegaKey].href}
                        onClick={() => setActiveMegaKey(null)}
                        className="inline-flex items-center gap-2.5 font-sans text-xs uppercase tracking-[0.25em] text-[#C8A45D] hover:text-[#315DA8] font-medium transition-colors group"
                      >
                        <span>Shop All {MEGA_MENU_DATA[activeMegaKey].title}</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>

                  {/* Right 5 Columns */}
                  <div className="col-span-5 relative group rounded-[10px] overflow-hidden bg-[#090909] border border-[#2A2A2A] flex flex-col justify-between">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={MEGA_MENU_DATA[activeMegaKey].image}
                        alt={MEGA_MENU_DATA[activeMegaKey].featuredTitle}
                        className="w-full h-full object-cover object-top filter brightness-[0.9] group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent opacity-80" />
                      <span className="absolute top-3 left-3 font-sans text-[9px] uppercase tracking-[0.2em] bg-[#090909]/90 text-[#D86A32] px-2.5 py-1 border border-[#D86A32]/30 backdrop-blur-md font-semibold rounded-sm">
                        SPOTLIGHT
                      </span>
                    </div>

                    <div className="p-5 flex items-center justify-between bg-[#151515]">
                      <div>
                        <h4 className="font-editorial text-lg text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors">
                          {MEGA_MENU_DATA[activeMegaKey].featuredTitle}
                        </h4>
                        <p className="font-sans text-[11px] text-[#8E8A85] mt-0.5">Exclusive Atelier Release</p>
                      </div>
                      <Link
                        href={MEGA_MENU_DATA[activeMegaKey].href}
                        onClick={() => setActiveMegaKey(null)}
                        className="p-2.5 rounded-full bg-[#090909] border border-[#2A2A2A] text-[#C8A45D] hover:bg-[#C8A45D] hover:text-[#090909] transition-all duration-300 shrink-0"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* ── 3. Fullscreen Search Overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[150] bg-[#090909]/98 backdrop-blur-2xl overflow-y-auto px-4 sm:px-6 lg:px-12 py-10"
          >
            <div className="max-w-4xl mx-auto relative pt-12 sm:pt-16">
              
              {/* Close Button & ESC Badge */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                  <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#C8A45D] font-medium">
                    ATELIER CATALOG SEARCH
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline-block font-sans text-[10px] uppercase tracking-widest text-[#8E8A85] border border-[#2A2A2A] px-2.5 py-1 rounded">
                    Press ESC to close
                  </span>
                  <button
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search overlay"
                    className="p-2 rounded-full bg-[#151515] border border-[#2A2A2A] text-[#F8F6F3] hover:text-[#C8A45D] hover:border-[#C8A45D] transition-all duration-300 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Prominent Search Input with Active Focus Accent */}
              <form onSubmit={handleSearchSubmit} className="relative mb-12">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-[#C8A45D]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search silk shirts, cashmere blazers, trousers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent pl-12 pr-12 py-4 text-2xl sm:text-4xl font-editorial font-normal text-[#F8F6F3] placeholder-[#8E8A85]/50 focus:outline-none border-b border-[#2A2A2A] focus:border-[#315DA8] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#8E8A85] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </form>

              {/* Live Search Suggestions (When typing) */}
              {searchQuery.trim() ? (
                <div className="mb-12">
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#C8A45D] font-medium mb-4">
                    Matching Products ({searchResults.length})
                  </p>

                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id || product._id}
                          href={`/product/${product.id || product._id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-4 p-3 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D]/50 rounded-[8px] transition-all duration-300 group"
                        >
                          <div className="w-14 h-18 shrink-0 bg-[#090909] overflow-hidden rounded-[4px]">
                            <img
                              src={product.image || product.images?.[0]}
                              alt={product.name}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <span className="font-sans text-[10px] uppercase tracking-wider text-[#C8A45D] block">
                              {product.category || "Atelier"}
                            </span>
                            <h4 className="font-editorial text-base text-[#F8F6F3] group-hover:text-[#C8A45D] transition-colors line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="font-sans text-xs font-semibold text-[#F8F6F3] mt-1">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="font-sans text-sm text-[#8E8A85] font-light">
                      No exact matches found for &quot;{searchQuery}&quot;. Press Enter to explore all items.
                    </p>
                  )}
                </div>
              ) : null}

              {/* Recent & Trending Searches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-3.5 h-3.5 text-[#315DA8]" />
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#315DA8] font-medium">
                      RECENT SEARCHES
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleRecentClick(term)}
                        className="font-sans text-xs bg-[#151515] hover:bg-[#1C1C1C] text-[#F8F6F3] px-3.5 py-2 border border-[#2A2A2A] hover:border-[#315DA8] rounded-full transition-all duration-300 cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="w-3.5 h-3.5 text-[#D86A32]" />
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#D86A32] font-medium">
                      TRENDING NOW
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Co-Ord Sets", "Silk Camp Shirt", "Shearling Jacket", "Leather Belts", "Pleated Trousers"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleRecentClick(term)}
                        className="font-sans text-xs bg-[#151515] hover:bg-[#1C1C1C] text-[#C8A45D] px-3.5 py-2 border border-[#D86A32]/30 hover:border-[#D86A32] rounded-full transition-all duration-300 cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 4. Mobile Slide-In Navigation Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md md:hidden"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[140] w-full max-w-sm bg-[#090909] border-l border-[#2A2A2A] p-6 flex flex-col justify-between overflow-y-auto md:hidden shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-[#2A2A2A]">
                  <Logo size="sm" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-2 text-[#8E8A85] hover:text-[#C8A45D] transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSearchOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-3.5 bg-[#151515] border border-[#2A2A2A] rounded-[8px] text-[#8E8A85] font-sans text-xs"
                  >
                    <span className="flex items-center gap-2.5">
                      <Search className="w-4 h-4 text-[#C8A45D]" />
                      <span>Search catalog...</span>
                    </span>
                    <span className="font-sans text-[10px] uppercase tracking-wider bg-[#090909] px-2 py-0.5 border border-[#2A2A2A]">
                      Search
                    </span>
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 bg-[#151515] border border-[#2A2A2A] rounded-[8px] text-[#F8F6F3] hover:border-[#C8A45D]/40"
                  >
                    <span className="flex items-center gap-2 text-xs font-sans">
                      <Heart className="w-3.5 h-3.5 text-[#C8A45D]" /> Wishlist
                    </span>
                    <span className="font-sans text-[10px] bg-[#D86A32]/20 text-[#D86A32] px-2 py-0.5 rounded font-semibold">
                      {wishlist.length}
                    </span>
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="flex items-center justify-between p-3 bg-[#151515] border border-[#2A2A2A] rounded-[8px] text-[#F8F6F3] hover:border-[#C8A45D]/40"
                  >
                    <span className="flex items-center gap-2 text-xs font-sans">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" /> Cart
                    </span>
                    <span className="font-sans text-[10px] bg-[#C8A45D] text-[#090909] px-2 py-0.5 rounded font-semibold">
                      {totalItemsCount}
                    </span>
                  </button>
                </div>

                <nav className="mt-6 flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => {
                    const hasSub = !!item.key && MEGA_MENU_DATA[item.key];
                    const isExpanded = expandedMobileAcc === item.key;
                    const isActive = pathname === item.href;

                    return (
                      <div key={item.name} className="border-b border-[#2A2A2A]/60 pb-1">
                        <div className="flex items-center justify-between">
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`font-editorial text-lg py-2.5 transition-colors block flex-1 ${
                              isActive ? "text-[#315DA8] font-medium" : "text-[#F8F6F3] hover:text-[#C8A45D]"
                            }`}
                          >
                            {item.name}
                          </Link>

                          {hasSub && (
                            <button
                              type="button"
                              onClick={() => setExpandedMobileAcc(isExpanded ? null : item.key)}
                              className="p-2 text-[#C8A45D]"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {hasSub && isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 pb-3 flex flex-col gap-2 border-l border-[#315DA8]/40 my-1"
                          >
                            {MEGA_MENU_DATA[item.key].subcategories.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="font-sans text-xs text-[#8E8A85] hover:text-[#C8A45D] py-1 transition-colors flex items-center justify-between"
                              >
                                <span>{sub.name}</span>
                                <ChevronRight className="w-3 h-3 text-[#C8A45D]/50" />
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-8 pt-6 border-t border-[#2A2A2A]">
                <div className="relative rounded-[8px] overflow-hidden bg-[#151515] border border-[#2A2A2A] p-4">
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#D86A32] block mb-1">
                    SEASONAL PREVIEW
                  </span>
                  <h4 className="font-editorial text-base text-[#F8F6F3]">Atelier Silk & Wool Edit</h4>
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-widest text-[#C8A45D] mt-3 font-semibold"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── 5. Floating Mobile Bottom Navigation ── */}
      <MobileBottomNav onOpenSearch={() => setSearchOpen(true)} />
    </>
  );
}
