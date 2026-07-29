"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function MobileBottomNav({ onOpenSearch }) {
  const pathname = usePathname();
  const { totalItemsCount, setIsCartOpen, wishlist } = useCart();
  const { user } = useAuth();
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll direction detection: Hide on scroll down, Show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "Search",
      action: "search",
      icon: Search,
      isActive: false,
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      badge: wishlist.length,
      isActive: pathname === "/wishlist",
    },
    {
      name: "Cart",
      action: "cart",
      icon: ShoppingBag,
      badge: totalItemsCount,
      isActive: false,
    },
    {
      name: "Profile",
      href: user ? "/account" : "/login",
      icon: User,
      isActive: pathname === "/account" || pathname === "/login",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[120] md:hidden bg-[#080808]/92 backdrop-blur-xl border-t border-white/[0.1] rounded-t-[20px] shadow-2xl px-2 py-2"
        >
          <div className="flex items-center justify-around h-[54px] max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;

              const content = (
                <div className="relative flex flex-col items-center justify-center w-full h-full py-1 group">
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-colors duration-300 ${
                        item.isActive
                          ? "text-[#C9A96E]"
                          : "text-[#8E8A85] group-hover:text-[#F4F1EA]"
                      }`}
                    />
                    {item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 bg-[#C9A96E] text-[#090909] font-sans text-[9px] font-bold rounded-full flex items-center justify-center price-display">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-sans text-[10px] uppercase tracking-wider mt-1 font-medium transition-colors duration-300 ${
                      item.isActive
                        ? "text-[#C9A96E]"
                        : "text-[#8E8A85] group-hover:text-[#F4F1EA]"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Active Gold Indicator Dot */}
                  {item.isActive && (
                    <motion.span
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-1 w-1 h-1 bg-[#C9A96E] rounded-full"
                    />
                  )}
                </div>
              );

              if (item.action === "search") {
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={onOpenSearch}
                    aria-label="Open Search"
                    className="flex-1 flex justify-center cursor-pointer min-h-[48px] items-center"
                  >
                    {content}
                  </button>
                );
              }

              if (item.action === "cart") {
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    aria-label="Open Cart"
                    className="flex-1 flex justify-center cursor-pointer min-h-[48px] items-center"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex-1 flex justify-center min-h-[48px] items-center"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
