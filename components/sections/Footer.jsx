"use client";

import Link from "next/link";
import {
  CreditCard,
  Lock,
  Globe,
  ArrowUp,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Container } from "@/components/ui/Section";

function SocialIcon({ type }) {
  const className = "w-4 h-4";
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  if (type === "twitter") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    );
  }
  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (type === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    );
  }
  return null;
}

const SHOP_LINKS = [
  { name: "All Collections", href: "/shop" },
  { name: "New Arrivals", href: "/new-arrivals" },
  { name: "Co-Ord Sets", href: "/shop/codset" },
  { name: "Outerwear", href: "/shop/outerwear" },
  { name: "Shirts", href: "/shop/shirts" },
  { name: "Trousers", href: "/shop/trousers" },
  { name: "Accessories", href: "/shop/accessories" },
];

const COMPANY_LINKS = [
  { name: "Our Story", href: "/about" },
  { name: "Quality Standards", href: "/about" },
  { name: "Biella Wool Mills", href: "/about" },
  { name: "Flagship Store", href: "/contact" },
  { name: "Contact Us", href: "/contact" },
];

const CUSTOMER_CARE_LINKS = [
  { name: "Shopping Bag", href: "/cart" },
  { name: "Express Checkout", href: "/checkout" },
  { name: "Member Account", href: "/account" },
  { name: "Saved Wishlist", href: "/wishlist" },
  { name: "Customer Support", href: "/contact" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#090909] text-[#8E8A85] pt-24 pb-16 relative overflow-hidden border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10 pb-20 border-b border-white/[0.06]">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Logo size="lg" className="items-start" />
              <p className="mt-6 font-sans text-xs text-[#8E8A85] font-light max-w-sm leading-relaxed tracking-wide">
                Elevated men's fashion engineered with precision standards. Fine Italian wools, raw silks, and architectural silhouettes for the modern connoisseur.
              </p>
            </div>

            {/* Social Icons */}
            <div className="mt-8 flex items-center gap-3">
              {[
                { type: "instagram", href: "https://www.instagram.com/gormenswear/", label: "GOR Menswear on Instagram" },
                { type: "twitter", href: "https://twitter.com/gormenswear", label: "GOR Menswear on Twitter" },
                { type: "facebook", href: "https://facebook.com/gormenswear", label: "GOR Menswear on Facebook" },
                { type: "youtube", href: "https://youtube.com/@gormenswear", label: "GOR Menswear on YouTube" },
              ].map(({ type, href, label }) => (
                <a
                  key={type}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-white/[0.1] flex items-center justify-center text-[#8E8A85] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all duration-300"
                >
                  <SocialIcon type={type} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Column 1: Shop */}
          <div>
            <h4 className="font-sans text-xs font-semibold text-[#F4F1EA] uppercase tracking-[0.25em] mb-6">
              Shop Collections
            </h4>
            <ul className="space-y-3.5 text-xs font-sans">
              {SHOP_LINKS.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="hover:text-[#C9A96E] transition-colors duration-300 relative inline-block group"
                  >
                    <span>{name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C9A96E] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column 2: Company */}
          <div>
            <h4 className="font-sans text-xs font-semibold text-[#F4F1EA] uppercase tracking-[0.25em] mb-6">
              Company
            </h4>
            <ul className="space-y-3.5 text-xs font-sans">
              {COMPANY_LINKS.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="hover:text-[#C9A96E] transition-colors duration-300 relative inline-block group"
                  >
                    <span>{name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C9A96E] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column 3: Customer Support */}
          <div>
            <h4 className="font-sans text-xs font-semibold text-[#F4F1EA] uppercase tracking-[0.25em] mb-6">
              Customer Support
            </h4>
            <ul className="space-y-3.5 text-xs font-sans">
              {CUSTOMER_CARE_LINKS.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="hover:text-[#C9A96E] transition-colors duration-300 relative inline-block group"
                  >
                    <span>{name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C9A96E] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-[#8E8A85] font-sans">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#F4F1EA] font-medium">
              <Globe className="w-3.5 h-3.5 text-[#C9A96E]" /> United States (USD $)
            </span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#C9A96E]" /> 256-bit Encrypted Checkout
            </span>
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2">
            {["VISA", "MASTERCARD", "AMEX", "APPLE PAY"].map((pay) => (
              <span
                key={pay}
                className="px-2.5 py-1 text-[9px] font-semibold tracking-wider bg-[#121212] border border-white/[0.08] text-[#8E8A85] price-display"
              >
                {pay}
              </span>
            ))}
          </div>

          {/* Copyright & Scroll Top */}
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} GOR MENSWEAR Inc. All Rights Reserved.</p>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="p-2.5 bg-[#121212] border border-white/[0.1] hover:border-[#C9A96E] text-[#C9A96E] transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

