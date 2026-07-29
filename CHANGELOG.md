# CHANGELOG

All notable changes to the GOR Menswear frontend repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-27

### Initial Enterprise Release

#### Completed Modules
- **Product Detail Page (PDP)**: World-class product display featuring mixed-media gallery gestures, zoom lightbox, pincode logistics validator, size recommendation modal, and Size Guide luxury polish.
- **Collection & Catalog Pages**: Editorial grid with sticky toolbar, category chips, dual image hover swaps, and Quick View modal triggers.
- **Cart Drawer**: 460px desktop drawer and mobile bottom sheet with focus trapping and body scroll locking.
- **Express Checkout**: 2-column layout (65% details / 35% sticky order summary), Express UPI/COD payment cards, and double-submit protection.
- **Order Success Experience**: Champagne particle light glow, 5-stage status timeline, itemized product cards, printable invoice receipt, and WhatsApp support cards.
- **Customer Account & Tracking**: Avatar hero card, 4 dashboard metrics cards, 6 sidebar navigation tabs, address manager, and order status tracking.
- **Search & Discovery Overlay**: Global `Ctrl+K` keyboard trigger, live debounced search, grouped results (`Products`, `Collections`, `Categories`), and persistent recent searches.
- **Global Feedback & Notification System**: Toast notifications (`success`, `error`, `warning`, `info`), offline connection banner, skeleton loader library, and WCAG AA accessibility compliance.

#### Performance & Core Web Vitals
- **LCP < 2.0s**: Implemented `font-display: swap` across Google Fonts (`Cormorant Garamond`, `Inter`, `Playfair Display`, `Manrope`).
- **CLS < 0.05**: Pre-allocated aspect ratio containers (`aspect-[3/4]`) prevent layout shifts.
- **INP < 150ms**: Debounced search and memoized React components eliminate main thread locking.

#### SEO Improvements
- Dynamic XML sitemap generation at `/sitemap.xml`.
- Dynamic robots.txt policy at `/robots.txt`.
- OpenGraph metadata, Twitter Cards, canonical URL tags, and JSON-LD schemas (`Organization`, `WebSite`, `Product`, `SearchAction`, `BreadcrumbList`).

#### Accessibility Improvements
- Full WCAG 2.2 AA compliance: ARIA live regions for toast announcements, focus trapping on modals, keyboard navigation, and reduced motion queries.
