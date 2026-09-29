# GOR MENSWEAR — Product Image & Category Architecture Guide

This guide defines the standardized image storage, catalog directory hierarchy, and naming conventions for GOR Menswear.

---

## 🏛️ Directory Architecture Overview

The assets in `public/` are strictly organized into dedicated concerns:

```
public/
├── images/
│   ├── brand/                     ← Logo marks, watermarks, monogram SVGs, seals
│   ├── categories/                ← Category-level banner / cover / hero images ONLY
│   │   ├── t-shirts/
│   │   ├── shirts/
│   │   ├── polos/
│   │   ├── pants/
│   │   ├── trousers/
│   │   ├── jackets/
│   │   └── jerseys/
│   ├── lookbook/                  ← Editorial / Campaign / Grid photography
│   ├── codset/                    ← Co-ord sets legacy static assets (preserved)
│   └── products/                  ← Catalog product photography organized by category & subcategory
│       ├── t-shirts/
│       │   ├── oversized/
│       │   ├── regular-fit/
│       │   ├── graphic/
│       │   ├── basic/
│       │   └── full-sleeve/
│       ├── shirts/
│       │   ├── casual/
│       │   ├── formal/
│       │   ├── linen/
│       │   └── overshirts/
│       ├── polos/
│       │   ├── basic/
│       │   ├── premium/
│       │   └── graphic/
│       ├── pants/
│       │   ├── cargo/
│       │   ├── relaxed/
│       │   ├── joggers/
│       │   └── casual/
│       ├── trousers/
│       │   ├── pleated/
│       │   ├── straight-fit/
│       │   ├── relaxed-fit/
│       │   └── tailored/
│       ├── jackets/
│       │   ├── bomber/
│       │   ├── puffer/
│       │   ├── denim/
│       │   └── lightweight/
│       └── jerseys/
│           ├── football/
│           ├── basketball/
│           └── graphic/
└── uploads/
    └── products/                  ← Dynamic uploads created via Admin Panel (preserved)
```

> **CRITICAL RULE**: Never mix category banner images with product shoot images.
> - **Category Banners / Covers** ➔ `public/images/categories/<category-slug>/`
> - **Product Images** ➔ `public/images/products/<category-slug>/<subcategory-slug>/<product-slug>/`
> - **Admin File Uploads** ➔ `public/uploads/products/`

---

## 🎯 Top-Level Categories & Where Images Go

### 1. T-Shirts
* **Category Banner Location**: `public/images/categories/t-shirts/`
* **Product Images Location**: `public/images/products/t-shirts/<subcategory>/<product-slug>/`
* **Subcategories**:
  * `oversized/` — Oversized silhouettes, heavy drop-shoulder cuts
  * `regular-fit/` — Standard tailored everyday fits
  * `graphic/` — Printed, artwork, branded typography
  * `basic/` — Minimalist solids, neutral essentials
  * `full-sleeve/` — Long-sleeve tees, thermal knits

### 2. Shirts
* **Category Banner Location**: `public/images/categories/shirts/`
* **Product Images Location**: `public/images/products/shirts/<subcategory>/<product-slug>/`
* **Subcategories**:
  * `casual/` — Camp collar, textured casuals, weekend shirting
  * `formal/` — Spread collar, poplin, dress shirts
  * `linen/` — Pure and blended breathable linen shirting
  * `overshirts/` — Heavyweight twill/wool layering overshirts

### 3. Polos
* **Category Banner Location**: `public/images/categories/polos/`
* **Product Images Location**: `public/images/products/polos/<subcategory>/<product-slug>/`
* **Subcategories**:
  * `basic/` — Pique cotton staples, clean plackets
  * `premium/` — Silk-cotton blends, Johnny collar knit polos
  * `graphic/` — Crested, retro piped, jacquard patterned

### 4. Pants
* **Category Banner Location**: `public/images/categories/pants/`
* **Product Images Location**: `public/images/products/pants/<subcategory>/<product-slug>/`
* **Subcategories**:
  * `cargo/` — Multi-pocket tactical & luxury utilitarian pants
  * `relaxed/` — Relaxed wide-leg cotton/twill pants
  * `joggers/` — Heavyweight fleece & structured cuffed joggers
  * `casual/` — Chinos, drawcord waist everyday pants

### 5. Trousers
* **Category Banner Location**: `public/images/categories/trousers/`
* **Product Images Location**: `public/images/products/trousers/<subcategory>/<product-slug>/`
* **Subcategories**:
  * `pleated/` — Single and double-pleated sartorial trousers
  * `straight-fit/` — Classic straight leg formal & smart trousers
  * `relaxed-fit/` — Wide fluid drape trousers
  * `tailored/` — Side-adjuster bespoke waistband trousers

### 6. Jackets
* **Category Banner Location**: `public/images/categories/jackets/`
* **Product Images Location**: `public/images/products/jackets/<subcategory>/<product-slug>/`
* **Subcategories**:
  * `bomber/` — Classic MA-1, suede, satin varsity bombers
  * `puffer/` — Down-filled quilted winter jackets
  * `denim/` — Raw and washed heavyweight denim jackets
  * `lightweight/` — Windbreakers, coach jackets, unlined shells

### 7. Jerseys
* **Category Banner Location**: `public/images/categories/jerseys/`
* **Product Images Location**: `public/images/products/jerseys/<subcategory>/<product-slug>/`
* **Subcategories**:
  * `football/` — Soccer-inspired kit silhouettes, retro collars
  * `basketball/` — Sleeveless mesh jerseys, athletic trims
  * `graphic/` — Motorsport, cycling, streetwear graphic jerseys

---

## 🎨 Product Multi-Color Variant Organization

**Core Rule**: When a product represents the same garment model in multiple colorways, **it remains ONE product entity with ONE folder**. Do not split into separate products.

All color variant photos reside inside the single product's folder using this naming convention:

```
public/images/products/<category>/<subcategory>/<product-slug>/
├── black-01.webp       (Primary front shot)
├── black-02.webp       (Back shot)
├── black-03.webp       (Detail / texture / collar)
├── white-01.webp
├── white-02.webp
├── green-01.webp
├── green-02.webp
├── navy-01.webp
└── navy-02.webp
```

* If a product has only one color: you may use `01.webp`, `02.webp`, `03.webp` or `<color>-01.webp`.
* Recommended formats: `.webp` (preferred for performance and quality), `.jpg`, `.png`.

---

## 📐 Real-World Reference Example

### Garment: GOR Essential Oversized Tee
* **Category**: T-Shirts (`cat-tshirts` / `t-shirts`)
* **Subcategory**: Oversized (`sub-tshirts-oversized` / `oversized`)
* **Price**: ₹1,499
* **Colors**: Black, White, Green, Navy
* **Sizes**: S, M, L, XL, XXL
* **SKU**: `GOR-TEE-OVR-01`

#### Folder Location:
```
public/images/products/t-shirts/oversized/gor-essential-oversized-tee/
```

#### Files:
```
├── black-01.webp
├── black-02.webp
├── white-01.webp
├── white-02.webp
├── green-01.webp
├── green-02.webp
├── navy-01.webp
└── navy-02.webp
```

#### Code / Database Representation:
```json
{
  "id": "gor-tee-essential-oversized",
  "name": "GOR Essential Oversized Tee",
  "slug": "gor-essential-oversized-tee",
  "categoryId": "cat-tshirts",
  "category": "T-Shirts",
  "categorySlug": "t-shirts",
  "subcategoryId": "sub-tshirts-oversized",
  "subcategory": "Oversized",
  "subcategorySlug": "oversized",
  "price": 1499,
  "compareAtPrice": 1999,
  "stock": 48,
  "sku": "GOR-TEE-OVR-01",
  "colors": ["Black", "White", "Green", "Navy"],
  "sizes": ["S", "M", "L", "XL", "XXL"],
  "imageUrl": "/images/products/t-shirts/oversized/gor-essential-oversized-tee/black-01.webp",
  "images": [
    "/images/products/t-shirts/oversized/gor-essential-oversized-tee/black-01.webp",
    "/images/products/t-shirts/oversized/gor-essential-oversized-tee/black-02.webp",
    "/images/products/t-shirts/oversized/gor-essential-oversized-tee/white-01.webp",
    "/images/products/t-shirts/oversized/gor-essential-oversized-tee/white-02.webp",
    "/images/products/t-shirts/oversized/gor-essential-oversized-tee/green-01.webp",
    "/images/products/t-shirts/oversized/gor-essential-oversized-tee/green-02.webp",
    "/images/products/t-shirts/oversized/gor-essential-oversized-tee/navy-01.webp",
    "/images/products/t-shirts/oversized/gor-essential-oversized-tee/navy-02.webp"
  ],
  "variants": [
    { "color": "Black", "size": "S", "stock": 4, "sku": "GOR-TEE-OVR-BLK-S" },
    { "color": "Black", "size": "M", "stock": 6, "sku": "GOR-TEE-OVR-BLK-M" },
    { "color": "Black", "size": "L", "stock": 6, "sku": "GOR-TEE-OVR-BLK-L" },
    { "color": "Black", "size": "XL", "stock": 4, "sku": "GOR-TEE-OVR-BLK-XL" },
    { "color": "White", "size": "S", "stock": 3, "sku": "GOR-TEE-OVR-WHT-S" },
    { "color": "White", "size": "M", "stock": 5, "sku": "GOR-TEE-OVR-WHT-M" },
    { "color": "White", "size": "L", "stock": 5, "sku": "GOR-TEE-OVR-WHT-L" },
    { "color": "White", "size": "XL", "stock": 3, "sku": "GOR-TEE-OVR-WHT-XL" },
    { "color": "Green", "size": "M", "stock": 4, "sku": "GOR-TEE-OVR-GRN-M" },
    { "color": "Green", "size": "L", "stock": 4, "sku": "GOR-TEE-OVR-GRN-L" },
    { "color": "Navy", "size": "M", "stock": 2, "sku": "GOR-TEE-OVR-NVY-M" },
    { "color": "Navy", "size": "L", "stock": 2, "sku": "GOR-TEE-OVR-NVY-L" }
  ]
}
```

---

## 🛠️ Step-by-Step Workflows

### How to Add a New Category
1. Create banner directory: `public/images/categories/<category-slug>/`
2. Create product directory with subcategories: `public/images/products/<category-slug>/<subcategories...>/`
3. Add the category definition into `lib/categoriesService.js` (or via Admin Panel `/admin/categories`).
4. (Optional) Define default subcategories in `subcategories: [...]`.

### How to Add a New Product
1. Identify Category and Subcategory (e.g. `t-shirts` ➔ `oversized`).
2. Create folder: `public/images/products/<category>/<subcategory>/<product-slug>/`.
3. Drop product images inside (e.g. `01.webp`, `02.webp` or `<color>-01.webp`).
4. In Admin (`/admin/products/new`) or `lib/productService.js`:
   * Select **Category** (e.g. T-Shirts)
   * Select **Subcategory** (e.g. Oversized)
   * Enter **Product Name**, **Price**, **Colors**, **Sizes**, and **Stock**.
   * Link or upload the images.

### How to Add a New Product Colorway
1. Add the photos to the existing product folder:
   * E.g. `public/images/products/t-shirts/oversized/gor-essential-oversized-tee/sand-01.webp`
2. In the Product editor (`/admin/products/<id>`), add `"Sand"` into the **Colors** list.
3. Append image paths to the product's `images` array.
4. Save product.

---

## 🚀 Future Category Expansion
The architecture supports instant expansion. Later additions (such as **Hoodies**, **Sweatshirts**, **Jeans**, **Shorts**, **Co-ord Sets**, or **Accessories**) follow the identical pattern without any changes to core logic:
- `public/images/categories/<category>/`
- `public/images/products/<category>/<subcategory>/<product-slug>/`
