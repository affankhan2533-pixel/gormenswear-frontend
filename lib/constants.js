/**
 * GOR Menswear Enterprise Design System Constants
 */

export const BRAND_NAME = "GOR Menswear";
export const BRAND_TAGLINE = "Everyday Confidence & Modern Streetwear";
export const SUPPORT_EMAIL = "concierge@gormenswear.com";
export const SUPPORT_PHONE = "+91 86919 21913";

export const CURRENCY = {
  code: "INR",
  symbol: "₹",
  format: (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`,
};

export const FREE_SHIPPING_THRESHOLD = 2000;

export const CATEGORIES = [
  { id: "codset", label: "Co-Ord Sets", href: "/shop/codset" },
  { id: "outerwear", label: "Outerwear & Jackets", href: "/shop/outerwear" },
  { id: "shirts", label: "Designer Shirts", href: "/shop/shirts" },
  { id: "trousers", label: "Tailored Trousers", href: "/shop/trousers" },
  { id: "accessories", label: "Accessories", href: "/shop/accessories" },
];

export const NAV_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
];

export const DELAY_DEBOUNCE_MS = 200;
