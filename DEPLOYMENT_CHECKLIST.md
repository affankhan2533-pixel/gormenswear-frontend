# DEPLOYMENT CHECKLIST

Pre-deployment verification matrix for GOR Menswear production release.

---

## 📋 Pre-Flight Verification Checklist

### 1. Environment & API Configuration
- [x] **Production API URL Configured**: `NEXT_PUBLIC_API_URL` verified.
- [x] **Production Site URL Configured**: `NEXT_PUBLIC_SITE_URL` verified.
- [x] **Zero Hardcoded Localhost References**: Verified clean fallback handling.

### 2. Assets & Media Audit
- [x] **Image Load Audit**: All product images, lookbook media, and logos load without broken links.
- [x] **Image Optimization**: Pre-allocated aspect ratio containers (`aspect-[3/4]`) prevent layout shifts.
- [x] **Favicon & Brand Assets**: Favicon, touch icons, and brand graphics present.

### 3. SEO & Indexing Rules
- [x] **Dynamic Sitemap**: Dynamic XML sitemap verified at `/sitemap.xml`.
- [x] **Robots Policy**: Disallow policies for `/api/` & `/account/` verified at `/robots.txt`.
- [x] **OpenGraph & Twitter Cards**: Social preview images (`hero-main.jpg`) and meta tags verified.
- [x] **Canonical URLs**: Canonical URL tags verified on all pages.
- [x] **JSON-LD Schemas**: `Organization`, `WebSite`, `Product`, `SearchAction`, `BreadcrumbList` schemas verified.

### 4. Build & Performance Verification
- [x] **Clean Production Build**: `npm run build` compiled **100% successfully** across all 20 static and dynamic routes.
- [x] **Zero Build Warnings**: 0 compilation warnings or errors.
- [x] **Font Swap Loading**: Google Fonts configured with `display: 'swap'`.

### 5. Quality Assurance & Accessibility
- [x] **Mobile Responsive QA**: Tested on Desktop (1440px), Tablet (768px), and Mobile (375px).
- [x] **WCAG 2.2 AA Accessibility**: Screen reader announcements (`aria-live="polite"`), focus rings, and reduced motion queries verified.
- [x] **Copywriting Compliance**: Verified 100% exclusion of forbidden terms (`Atelier`, `Bespoke`, `Heritage`, `Tailoring`, `Concierge`, `Gentleman`).

---

© 2026 GOR Menswear Inc. All Rights Reserved.
