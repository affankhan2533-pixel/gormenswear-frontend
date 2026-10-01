"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Globe,
  ArrowUp,
  ChevronDown,
} from "lucide-react";
import Logo from "@/components/ui/Logo";

function SocialIcon({ type }) {
  const className = "w-4 h-4";
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  if (type === "twitter") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    );
  }
  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (type === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    );
  }
  return null;
}

const SHOP_LINKS = [
  { name: "T-Shirts", href: "/category/t-shirts" },
  { name: "Shirts", href: "/category/shirts" },
  { name: "Polos", href: "/category/polos" },
  { name: "Pants", href: "/category/pants" },
  { name: "Trousers", href: "/category/trousers" },
  { name: "Jackets", href: "/category/jackets" },
  { name: "Jerseys", href: "/category/jerseys" },
  { name: "All Collections", href: "/shop" },
];

const COMPANY_LINKS = [
  { name: "Atelier", href: "/about" },
  { name: "Manifesto", href: "/about" },
  { name: "Inquiries", href: "/contact" },
  { name: "Stockists", href: "/contact" },
];

const SUPPORT_LINKS = [
  { name: "Client Care", href: "/contact" },
  { name: "Shopping Bag", href: "/cart" },
  { name: "Member Account", href: "/account" },
  { name: "Saved Wishlist", href: "/wishlist" },
];

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sec) => {
    setOpenSection((prev) => (prev === sec ? null : sec));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#151515] text-[#D8D2C8] pt-12 sm:pt-20 pb-12 sm:pb-16 border-t border-[#262626] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Grid: Brand + Links (Desktop Grid / Mobile Accordion) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 sm:pb-16 border-b border-[#262626]">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col justify-between mb-4 md:mb-0">
            <div>
              <Logo size="lg" invert={true} className="items-start" />
              <p className="mt-4 sm:mt-5 font-sans text-xs text-[#716D66] font-normal max-w-sm leading-relaxed tracking-wide">
                Refined modern menswear defined by form, discipline, and everyday movement.
              </p>
            </div>

            {/* Social Icons */}
            <div className="mt-6 sm:mt-8 flex items-center gap-2.5">
              {[
                { type: "instagram", href: "https://www.instagram.com/gormenswear/", label: "Instagram" },
                { type: "twitter", href: "https://twitter.com/gormenswear", label: "Twitter" },
                { type: "facebook", href: "https://facebook.com/gormenswear", label: "Facebook" },
                { type: "youtube", href: "https://youtube.com/@gormenswear", label: "YouTube" },
              ].map(({ type, href, label }) => (
                <a
                  key={type}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-[2px] border border-[#2A2A2A] flex items-center justify-center text-[#716D66] hover:text-[#F5F2EC] hover:border-[#D8D2C8] transition-colors"
                >
                  <SocialIcon type={type} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Mobile Accordions (< md) / Desktop Columns (>= md) ── */}

          {/* Column 1: SHOP */}
          <div className="border-t border-[#262626] md:border-none pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("shop")}
              className="w-full flex items-center justify-between md:cursor-default focus:outline-none mb-3 md:mb-5"
            >
              <h4 className="font-sans text-[11px] font-medium text-[#F5F2EC] uppercase tracking-[0.25em]">
                SHOP
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#716D66] md:hidden transition-transform duration-200 ${
                  openSection === "shop" ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 sm:space-y-3 text-xs font-sans ${
                openSection === "shop" ? "block" : "hidden md:block"
              }`}
            >
              {SHOP_LINKS.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-[#716D66] hover:text-[#F5F2EC] transition-colors inline-block py-0.5"
                  >
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: COMPANY */}
          <div className="border-t border-[#262626] md:border-none pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("company")}
              className="w-full flex items-center justify-between md:cursor-default focus:outline-none mb-3 md:mb-5"
            >
              <h4 className="font-sans text-[11px] font-medium text-[#F5F2EC] uppercase tracking-[0.25em]">
                COMPANY
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#716D66] md:hidden transition-transform duration-200 ${
                  openSection === "company" ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 sm:space-y-3 text-xs font-sans ${
                openSection === "company" ? "block" : "hidden md:block"
              }`}
            >
              {COMPANY_LINKS.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-[#716D66] hover:text-[#F5F2EC] transition-colors inline-block py-0.5"
                  >
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: SUPPORT */}
          <div className="border-t border-[#262626] md:border-none pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("support")}
              className="w-full flex items-center justify-between md:cursor-default focus:outline-none mb-3 md:mb-5"
            >
              <h4 className="font-sans text-[11px] font-medium text-[#F5F2EC] uppercase tracking-[0.25em]">
                SUPPORT
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#716D66] md:hidden transition-transform duration-200 ${
                  openSection === "support" ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 sm:space-y-3 text-xs font-sans ${
                openSection === "support" ? "block" : "hidden md:block"
              }`}
            >
              {SUPPORT_LINKS.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-[#716D66] hover:text-[#F5F2EC] transition-colors inline-block py-0.5"
                  >
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-[#716D66] font-sans">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#D8D2C8]">
              <Globe className="w-3.5 h-3.5 text-[#716D66]" /> India (INR ₹)
            </span>
            <span className="hidden sm:inline text-[#2A2A2A]">|</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#716D66]" /> Encrypted Checkout
            </span>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-1.5">
            {["UPI", "VISA", "MASTERCARD", "AMEX"].map((pay) => (
              <span
                key={pay}
                className="px-2 py-0.5 text-[9px] font-mono tracking-wider bg-[#1B1B1B] border border-[#2A2A2A] text-[#716D66]"
              >
                {pay}
              </span>
            ))}
          </div>

          {/* Copyright & Scroll Top */}
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} GOR MENSWEAR. ALL RIGHTS RESERVED.</p>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="p-2 bg-[#1B1B1B] border border-[#2A2A2A] hover:border-[#D8D2C8] text-[#D8D2C8] hover:text-[#F5F2EC] transition-colors rounded-[2px] cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

