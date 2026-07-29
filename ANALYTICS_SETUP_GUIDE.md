# ANALYTICS & BUSINESS INSIGHTS SETUP GUIDE

Comprehensive documentation for GOR Menswear analytics tracking architecture, including **Google Analytics 4 (GA4)**, **Microsoft Clarity**, and **Meta Pixel (Facebook Pixel)**.

---

## 🔑 Environment Variables Configuration

Create or update `.env.local` in your root `frontend/` directory:

```env
# Production Domain
NEXT_PUBLIC_SITE_URL=https://gormenswear.com

# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Microsoft Clarity Project ID
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx

# Meta (Facebook) Pixel ID
NEXT_PUBLIC_META_PIXEL_ID=1234567890
```

> [!NOTE]
> If any environment variable ID is omitted or left blank, the system automatically skips script initialization without throwing runtime errors.

---

## 🍪 Consent Management & Privacy Architecture

GOR Menswear enforces a strict **Consent-First Privacy Architecture**:

1. Analytics scripts (`AnalyticsScripts.jsx`) are **NOT** loaded until the user explicitly accepts cookies via the `<CookieConsent />` banner.
2. User preferences are stored in `localStorage` as `gor_cookie_consent = "accepted" | "declined"`.
3. **Zero Personally Identifiable Information (PII)**: Passwords, email addresses, phone numbers, full street addresses, and payment credentials are never captured or sent to tracking providers.

---

## 📊 Standardized Event Catalog

All analytics events follow a standardized payload schema and fail silently (`try-catch`) to ensure zero disruption to the user shopping experience.

| Event Name | Function Signature | Trigger Location | Analytics Providers |
| :--- | :--- | :--- | :--- |
| **`page_view`** | `trackPageView(url)` | Automatic on route change | GA4, Meta Pixel |
| **`view_item`** | `trackViewItem(product)` | Product Detail Page load | GA4, Meta Pixel |
| **`add_to_cart`** | `trackAddToCart(product, qty, size)` | Add to Cart / Quick Add | GA4, Meta Pixel |
| **`add_to_wishlist`** | `trackAddToWishlist(product)` | Heart icon click | GA4, Meta Pixel |
| **`begin_checkout`** | `trackBeginCheckout(items, total)` | Checkout page mount | GA4, Meta Pixel |
| **`purchase`** | `trackPurchase(orderId, total, items)` | Order Confirmation mount | GA4, Meta Pixel |
| **`search`** | `trackSearch(query, resultsCount)` | Search overlay query | GA4 |

---

## 🧪 Developer Verification & Debugging

### 1. Development Console Mode
When `NODE_ENV=development`, all dispatched analytics events print detailed logs to the browser console:
```text
[Analytics Event] add_to_cart: {
  currency: "USD",
  value: 380,
  items: [{ item_id: "gor-codset-1", item_name: "Burgundy Alo Co-Ord", price: 380, quantity: 1 }],
  timestamp: "2026-07-27T16:09:00.000Z"
}
```

### 2. Browser Extensions Verification
- **GA4**: Install **Google Tag Assistant** extension to inspect `gtag` dataLayer events.
- **Meta Pixel**: Install **Meta Pixel Helper** extension to verify `fbq('track')` events.
- **Microsoft Clarity**: Verify recording session status in the Microsoft Clarity Dashboard.

---

## 🔧 Troubleshooting Guide

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **No analytics firing** | Cookie consent not accepted | Click "Accept Cookies" in the banner or clear `localStorage` |
| **GA4 missing data** | `NEXT_PUBLIC_GA_ID` not defined | Add valid `G-XXXXXXXXXX` to `.env.local` and restart server |
| **Duplicate PageViews** | Router listener firing twice | Single automatic listener attached in `AnalyticsScripts.jsx` |

---

© 2026 GOR Menswear Inc. All Rights Reserved.
