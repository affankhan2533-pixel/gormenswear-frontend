"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import Logo from "@/components/ui/Logo";
import SearchOverlay from "@/components/ui/SearchOverlay";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES_MENU = [
  { name: "T-Shirts", href: "/category/t-shirts", image: "/images/categories/gor-model-streetwear.webp", count: "01" },
  { name: "Shirts", href: "/category/shirts", image: "/images/lookbook/gor-lookbook-2.webp", count: "02" },
  { name: "Polos", href: "/category/polos", image: "/images/lookbook/image copy 4.png", count: "03" },
  { name: "Pants", href: "/category/pants", image: "/images/products/gor-codset-beige-prada.webp", count: "04" },
  { name: "Trousers", href: "/category/trousers", image: "/images/lookbook/image copy 5.png", count: "05" },
  { name: "Jackets", href: "/category/jackets", image: "/images/lookbook/image copy 6.png", count: "06" },
  { name: "Jerseys", href: "/category/jerseys", image: "/images/lookbook/image.png", count: "07" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemsCount, setIsCartOpen, wishlist } = useCart();
  const { user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(CATEGORIES_MENU[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setShopMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        onMouseLeave={() => setShopMenuOpen(false)}
        className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-300 ${
          isScrolled || shopMenuOpen
            ? "bg-[#F5F2EC]/96 backdrop-blur-xl border-b border-[#D8D2C8] py-3.5 shadow-[0_2px_16px_rgba(17,17,17,0.03)]"
            : "bg-[#F5F2EC]/85 backdrop-blur-md border-b border-[#D8D2C8]/70 py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Logo — Dark Architectural Identity */}
          <div className="flex items-center">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links — Editorial Restraint & Generous Spacing */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-11">
            {/* SHOP — reveals 7 category directory */}
            <div
              onMouseEnter={() => setShopMenuOpen(true)}
              className="relative py-1"
            >
              <button
                type="button"
                onClick={() => setShopMenuOpen((prev) => !prev)}
                className={`font-sans text-[11px] uppercase tracking-[0.25em] font-medium transition-colors cursor-pointer relative py-1 ${
                  shopMenuOpen || pathname.startsWith("/category")
                    ? "text-[#111111]"
                    : "text-[#111111]/75 hover:text-[#111111]"
                }`}
              >
                <span>SHOP</span>
                {(shopMenuOpen || pathname.startsWith("/category")) && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#111111]" />
                )}
              </button>
            </div>

            {/* NEW ARRIVALS */}
            <Link
              href="/new-arrivals"
              onMouseEnter={() => setShopMenuOpen(false)}
              className={`font-sans text-[11px] uppercase tracking-[0.25em] font-medium transition-colors relative py-1 ${
                pathname === "/new-arrivals"
                  ? "text-[#111111]"
                  : "text-[#111111]/75 hover:text-[#111111]"
              }`}
            >
              <span>NEW ARRIVALS</span>
              {pathname === "/new-arrivals" && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#111111]" />
              )}
            </Link>

            {/* CO-ORD SETS */}
            <Link
              href="/category/pants"
              onMouseEnter={() => setShopMenuOpen(false)}
              className={`font-sans text-[11px] uppercase tracking-[0.25em] font-medium transition-colors relative py-1 ${
                pathname === "/category/pants"
                  ? "text-[#111111]"
                  : "text-[#111111]/75 hover:text-[#111111]"
              }`}
            >
              <span>CO-ORD SETS</span>
            </Link>

            {/* OUTERWEAR */}
            <Link
              href="/category/jackets"
              onMouseEnter={() => setShopMenuOpen(false)}
              className={`font-sans text-[11px] uppercase tracking-[0.25em] font-medium transition-colors relative py-1 ${
                pathname === "/category/jackets"
                  ? "text-[#111111]"
                  : "text-[#111111]/75 hover:text-[#111111]"
              }`}
            >
              <span>OUTERWEAR</span>
            </Link>

            {/* JOURNAL */}
            <Link
              href="/about"
              onMouseEnter={() => setShopMenuOpen(false)}
              className={`font-sans text-[11px] uppercase tracking-[0.25em] font-medium transition-colors relative py-1 ${
                pathname === "/about"
                  ? "text-[#111111]"
                  : "text-[#111111]/75 hover:text-[#111111]"
              }`}
            >
              <span>JOURNAL</span>
            </Link>
          </nav>

          {/* Action Icons Right */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-1.5 text-[#111111]/80 hover:text-[#111111] transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="p-1.5 text-[#111111]/80 hover:text-[#111111] transition-colors relative hidden sm:block"
            >
              <Heart className="w-4 h-4 stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#151515] rounded-full" />
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Bag"
              className="p-1.5 text-[#111111]/80 hover:text-[#111111] transition-colors relative cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#151515] text-[#F5F2EC] font-sans text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
              className="md:hidden p-1.5 text-[#111111] hover:text-[#716D66] transition-colors cursor-pointer ml-1"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* ── Desktop Category Dropdown (Reveals on SHOP hover) ── */}
        <AnimatePresence>
          {shopMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onMouseEnter={() => setShopMenuOpen(true)}
              onMouseLeave={() => setShopMenuOpen(false)}
              className="hidden md:block absolute top-full left-0 right-0 bg-[#F5F2EC] border-b border-[#D8D2C8] shadow-[0_16px_36px_rgba(21,21,21,0.06)] py-8"
            >
              <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-12 gap-8 items-center">
                {/* Left: 7 Category Links */}
                <div className="col-span-7 pr-8 border-r border-[#D8D2C8]">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#716D66] font-semibold block mb-4">
                    SHOP BY SILHOUETTE
                  </span>
                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-6">
                    {CATEGORIES_MENU.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onMouseEnter={() => setHoveredCat(cat)}
                        className="group flex items-center justify-between py-1 transition-colors"
                      >
                        <span className="font-editorial text-xl sm:text-2xl text-[#111111] group-hover:text-[#8C7A6B] transition-colors tracking-tight">
                          {cat.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#716D66] group-hover:text-[#111111] tracking-widest">
                          {cat.count} →
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D8D2C8] flex items-center justify-between">
                    <Link
                      href="/shop"
                      className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#111111] hover:text-[#716D66] font-semibold flex items-center gap-1.5"
                    >
                      <span>VIEW COMPLETE ARCHIVE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right: Category Image Preview */}
                <div className="col-span-5 relative aspect-[16/10] rounded-[2px] overflow-hidden bg-[#E9E5DD]">
                  {hoveredCat && (
                    <>
                      <Image
                        src={hoveredCat.image}
                        alt={hoveredCat.name}
                        fill
                        className="object-cover filter contrast-[1.02] transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/70 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="font-editorial text-xl text-[#F5F2EC] block">
                          {hoveredCat.name}
                        </span>
                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#D8D2C8]">
                          EXPLORE SILHOUETTE
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Menu Slide Drawer (Editorial Warm Ivory) ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] bg-[#F5F2EC] text-[#111111] flex flex-col justify-between p-6 sm:p-8 overflow-y-auto"
          >
            {/* Top Bar with Close */}
            <div className="flex items-center justify-between pb-6 border-b border-[#D8D2C8]">
              <Logo size="md" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 text-[#111111] hover:text-[#716D66] cursor-pointer"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Mobile Categories Navigation List */}
            <div className="py-6 space-y-6 flex-1">
              {/* 1. SHOP SECTION WITH SUB-CATEGORIES ACCORDION */}
              <div className="border-b border-[#D8D2C8] pb-6">
                <div className="flex items-center justify-between mb-4">
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-editorial text-3xl sm:text-4xl text-[#111111] hover:text-[#8C7A6B] transition-colors"
                  >
                    SHOP
                  </Link>
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#716D66]"
                  >
                    VIEW ALL →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pl-3 border-l-2 border-[#D8D2C8]">
                  {CATEGORIES_MENU.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1 group"
                    >
                      <span className="font-sans text-sm tracking-wide text-[#111111] group-hover:text-[#8C7A6B] transition-colors">
                        {cat.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#716D66]">
                        {cat.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 2. PRIMARY NAV LINKS */}
              <div className="space-y-4">
                <Link
                  href="/new-arrivals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-editorial text-2xl sm:text-3xl text-[#111111] hover:text-[#8C7A6B] transition-colors"
                >
                  NEW ARRIVALS
                </Link>
                <Link
                  href="/category/pants"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-editorial text-2xl sm:text-3xl text-[#111111] hover:text-[#8C7A6B] transition-colors"
                >
                  CO-ORD SETS
                </Link>
                <Link
                  href="/category/jackets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-editorial text-2xl sm:text-3xl text-[#111111] hover:text-[#8C7A6B] transition-colors"
                >
                  OUTERWEAR
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-editorial text-2xl sm:text-3xl text-[#111111] hover:text-[#8C7A6B] transition-colors"
                >
                  JOURNAL
                </Link>
              </div>
            </div>

            {/* Mobile Footer Area */}
            <div className="pt-6 border-t border-[#D8D2C8] flex items-center justify-between text-xs font-sans text-[#716D66]">
              <span>GOR MENSWEAR</span>
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-[#111111] font-medium flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Wishlist ({wishlist.length})</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
