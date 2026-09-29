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
          className="fixed bottom-0 left-0 right-0 z-[120] md:hidden bg-[#F5F2EC]/96 backdrop-blur-xl border-t border-[#D8D2C8] px-2 py-1.5"
        >
          <div className="flex items-center justify-around h-[50px] max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;

              const content = (
                <div className="relative flex flex-col items-center justify-center w-full h-full py-1">
                  <div className="relative">
                    <Icon
                      className={`w-4 h-4 stroke-[1.5] transition-colors ${
                        item.isActive ? "text-[#111111]" : "text-[#716D66]"
                      }`}
                    />
                    {item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-[13px] h-[13px] px-0.5 bg-[#151515] text-[#F5F2EC] font-sans text-[8px] font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-sans text-[9px] uppercase tracking-[0.1em] mt-1 ${
                      item.isActive ? "text-[#111111] font-semibold" : "text-[#716D66]"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              );

              if (item.action === "search") {
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={onOpenSearch}
                    aria-label="Open search"
                    className="flex-1 cursor-pointer"
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
                    aria-label="Open cart"
                    className="flex-1 cursor-pointer"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link key={item.name} href={item.href} className="flex-1">
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
