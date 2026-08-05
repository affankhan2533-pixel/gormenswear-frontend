"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import SearchOverlay from "@/components/ui/SearchOverlay";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavbarVisibility } from "@/lib/useScrollDirection";

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
  const { totalItemsCount, setIsCartOpen, wishlist } = useCart();
  const { user } = useAuth();
  const isNavbarVisible = useNavbarVisibility();
  const shouldReduceMotion = useReducedMotion();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaKey, setActiveMegaKey] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileAcc, setExpandedMobileAcc] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(totalItemsCount);
  const [cartBounce, setCartBounce] = useState(false);

  // Scroll state for background progression
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cart badge bounce on count change
  useEffect(() => {
    if (totalItemsCount > prevCartCount) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(t);
    }
    setPrevCartCount(totalItemsCount);
  }, [totalItemsCount, prevCartCount]);

  // Global Ctrl+K / Cmd+K
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

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  // Navbar remains permanently visible with zero scroll hiding
  const navY = 0;

  return (
    <>
      {/* ── 1. Fixed Main Glassmorphism Navbar Header ── */}
      <header
        onMouseLeave={() => setActiveMegaKey(null)}
        className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-300 ease-out ${
          isScrolled || activeMegaKey
            ? "bg-[#0E1013]/85 backdrop-blur-2xl border-b border-[rgba(201,168,106,0.25)] shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(201,168,106,0.1)] py-3 sm:py-3.5"
            : "bg-[#0E1013]/60 backdrop-blur-xl border-b border-[rgba(201,168,106,0.15)] shadow-[0_4px_20px_rgba(0,0,0,0.4)] py-4 sm:py-4.5"
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
                  className="relative py-2 group/navitem"
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

                  {/* Animated gold underline — active state */}
                  {(isActive || activeMegaKey === item.key) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 h-[2px] w-full bg-[#C8A76A] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover underline for non-active items */}
                  {!isActive && activeMegaKey !== item.key && (
                    <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-[#C8A76A]/50 rounded-full transition-all duration-300 group-hover/navitem:w-full" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Icons Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSearchOpen(true)}
              aria-label="Search Catalog"
              className="p-2 text-[#F8F6F3]/80 hover:text-[#C8A45D] transition-colors duration-300 flex items-center justify-center cursor-pointer rounded-full hover:bg-white/[0.05]"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
            </motion.button>

            {/* Wishlist */}
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

            {/* Account */}
            <Link
              href={user ? "/account" : "/login"}
              aria-label={user ? "My Account" : "Sign In"}
              className="p-2 text-[#F8F6F3]/80 hover:text-[#C8A45D] transition-colors duration-300 hidden sm:flex items-center justify-center relative rounded-full hover:bg-white/[0.05]"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
            </Link>

            {/* Shopping Cart */}
            <motion.button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="p-2 text-[#F8F6F3]/80 hover:text-[#C8A45D] transition-colors duration-300 relative flex items-center justify-center cursor-pointer rounded-full hover:bg-white/[0.05]"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.15 }}
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              <AnimatePresence>
                {totalItemsCount > 0 && (
                  <motion.span
                    key={totalItemsCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{
                      scale: cartBounce ? [1.4, 0.9, 1] : 1,
                      opacity: 1,
                    }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#C8A45D] text-[#090909] font-sans text-[9px] font-semibold rounded-full flex items-center justify-center price-display"
                  >
                    {totalItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

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

        {/* ── 2. Desktop Mega Menu Panel Dropdown ── */}
        <AnimatePresence>
          {activeMegaKey && MEGA_MENU_DATA[activeMegaKey] && (
            <motion.div
              initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
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

                      <div className="grid grid-cols-2 gap-4">
                        {MEGA_MENU_DATA[activeMegaKey].subcategories.map((sub, si) => (
                          <motion.div
                            key={sub.name}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.22, delay: si * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <Link
                              href={sub.href}
                              onClick={() => setActiveMegaKey(null)}
                              className="group flex items-center justify-between p-3 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D]/50 rounded-[8px] transition-all duration-300"
                            >
                              <span className="font-sans text-xs text-[#F8F6F3] group-hover:text-[#C8A45D] font-medium transition-colors">
                                {sub.name}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#8E8A85] group-hover:text-[#C8A45D] group-hover:translate-x-1 transition-all duration-300" />
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>

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
                        className="shrink-0 w-8 h-8 rounded-full bg-[#C8A45D]/10 border border-[#C8A45D]/40 flex items-center justify-center text-[#C8A45D] hover:bg-[#C8A45D] hover:text-[#090909] transition-all duration-300"
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

      {/* ── 3. Mobile Full-Screen Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-[9998] md:hidden"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[380px] bg-[#0D0D0D] border-l border-[#2A2A2A] z-[9999] md:hidden flex flex-col overflow-y-auto"
            >
              {/* Close */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-[#1E1E1E]">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 text-[#F8F6F3]/70 hover:text-[#C8A45D] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 py-4 px-4">
                {NAV_ITEMS.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-4 border-b border-[#1E1E1E] font-sans text-xs uppercase tracking-[0.2em] transition-colors ${
                        pathname === item.href ? "text-[#C8A45D] font-semibold" : "text-[#F5F3EF]/80 hover:text-[#C8A45D]"
                      }`}
                    >
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="text-[8.5px] bg-[#C8A76A]/15 text-[#C8A76A] px-1.5 py-0.5 rounded border border-[#C8A76A]/40 font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="mt-6 px-3 space-y-3"
                >
                  <Link
                    href={user ? "/account" : "/login"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 border-b border-[#1E1E1E] text-[#F5F3EF]/60 hover:text-[#C8A45D] transition-colors font-sans text-xs uppercase tracking-[0.2em]"
                  >
                    <User className="w-4 h-4" />
                    {user ? "My Account" : "Sign In"}
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 border-b border-[#1E1E1E] text-[#F5F3EF]/60 hover:text-[#C8A45D] transition-colors font-sans text-xs uppercase tracking-[0.2em]"
                  >
                    <Heart className="w-4 h-4" />
                    Wishlist
                    {wishlist.length > 0 && (
                      <span className="ml-auto text-[10px] bg-[#D86A32]/20 text-[#D86A32] px-2 py-0.5 rounded-full font-semibold">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </>
  );
}
