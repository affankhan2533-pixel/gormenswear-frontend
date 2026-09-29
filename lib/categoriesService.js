// GOR MENSWEAR — Categories Service
// Dedicated Categories entity — independent of products

export function generateSlug(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const INITIAL_CATEGORIES = [
  // --- 7 MAIN TOP-LEVEL CATEGORIES ---
  {
    id: "cat-tshirts",
    name: "T-Shirts",
    slug: "t-shirts",
    image: "/images/categories/t-shirts/banner.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [
      { id: "sub-tshirts-oversized", name: "Oversized", slug: "oversized" },
      { id: "sub-tshirts-regular", name: "Regular Fit", slug: "regular-fit" },
      { id: "sub-tshirts-graphic", name: "Graphic / Printed", slug: "graphic" },
      { id: "sub-tshirts-basic", name: "Basic / Essential", slug: "basic" },
      { id: "sub-tshirts-fullsleeve", name: "Full Sleeve", slug: "full-sleeve" },
    ],
  },
  {
    id: "cat-shirts",
    name: "Shirts",
    slug: "shirts",
    image: "/images/categories/shirts/banner.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [
      { id: "sub-shirts-casual", name: "Casual", slug: "casual" },
      { id: "sub-shirts-formal", name: "Formal", slug: "formal" },
      { id: "sub-shirts-linen", name: "Linen", slug: "linen" },
      { id: "sub-shirts-overshirts", name: "Overshirts", slug: "overshirts" },
    ],
  },
  {
    id: "cat-polos",
    name: "Polos",
    slug: "polos",
    image: "/images/categories/polos/banner.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [
      { id: "sub-polos-basic", name: "Basic", slug: "basic" },
      { id: "sub-polos-premium", name: "Premium", slug: "premium" },
      { id: "sub-polos-graphic", name: "Graphic", slug: "graphic" },
    ],
  },
  {
    id: "cat-pants",
    name: "Pants",
    slug: "pants",
    image: "/images/categories/pants/banner.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [
      { id: "sub-pants-cargo", name: "Cargo", slug: "cargo" },
      { id: "sub-pants-relaxed", name: "Relaxed", slug: "relaxed" },
      { id: "sub-pants-joggers", name: "Joggers", slug: "joggers" },
      { id: "sub-pants-casual", name: "Casual", slug: "casual" },
    ],
  },
  {
    id: "cat-2",
    name: "Trousers",
    slug: "trousers",
    image: "/images/lookbook/gor-lookbook-2.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [
      { id: "sub-trousers-pleated", name: "Pleated", slug: "pleated" },
      { id: "sub-trousers-straight", name: "Straight Fit", slug: "straight-fit" },
      { id: "sub-trousers-relaxed", name: "Relaxed Fit", slug: "relaxed-fit" },
      { id: "sub-trousers-tailored", name: "Tailored", slug: "tailored" },
    ],
  },
  {
    id: "cat-jackets",
    name: "Jackets",
    slug: "jackets",
    image: "/images/categories/jackets/banner.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [
      { id: "sub-jackets-bomber", name: "Bomber", slug: "bomber" },
      { id: "sub-jackets-puffer", name: "Puffer", slug: "puffer" },
      { id: "sub-jackets-denim", name: "Denim", slug: "denim" },
      { id: "sub-jackets-lightweight", name: "Lightweight", slug: "lightweight" },
    ],
  },
  {
    id: "cat-jerseys",
    name: "Jerseys",
    slug: "jerseys",
    image: "/images/categories/jerseys/banner.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [
      { id: "sub-jerseys-football", name: "Football", slug: "football" },
      { id: "sub-jerseys-basketball", name: "Basketball", slug: "basketball" },
      { id: "sub-jerseys-graphic", name: "Graphic", slug: "graphic" },
    ],
  },

  // --- PRESERVED EXISTING CATALOG CATEGORIES ---
  {
    id: "cat-1",
    name: "Shirts & Silks",
    slug: "shirts-silks",
    image: "/images/lookbook/gor-lookbook-1.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [
      { id: "sub-shirts-casual", name: "Casual", slug: "casual" },
      { id: "sub-shirts-formal", name: "Formal", slug: "formal" },
      { id: "sub-shirts-linen", name: "Linen", slug: "linen" },
      { id: "sub-shirts-overshirts", name: "Overshirts", slug: "overshirts" },
    ],
  },
  {
    id: "cat-3",
    name: "Outerwear",
    slug: "outerwear",
    image: "/images/lookbook/gor-lookbook-4.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [
      { id: "sub-jackets-bomber", name: "Bomber", slug: "bomber" },
      { id: "sub-jackets-puffer", name: "Puffer", slug: "puffer" },
      { id: "sub-jackets-denim", name: "Denim", slug: "denim" },
      { id: "sub-jackets-lightweight", name: "Lightweight", slug: "lightweight" },
    ],
  },
  {
    id: "cat-4",
    name: "Co-Ord Sets",
    slug: "co-ord-sets",
    image: "/images/products/gor-codset-burgundy-alo.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [],
  },
  {
    id: "cat-5",
    name: "Leather Accessories",
    slug: "leather-accessories",
    image: "/images/lookbook/gor-lookbook-3.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [],
  },
  {
    id: "cat-6",
    name: "Handcrafted Shoes",
    slug: "handcrafted-shoes",
    image: "/images/lookbook/gor-lookbook-5.webp",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [],
  },
];

class CategoriesService {
  constructor() {
    this.categories = [...INITIAL_CATEGORIES];
  }

  getAll() {
    return [...this.categories];
  }

  getCategories() {
    return this.getAll();
  }

  getActive() {
    return this.categories.filter((c) => c.status === "Active");
  }

  getById(id) {
    if (!id) return null;
    const q = String(id).toLowerCase().trim();
    return (
      this.categories.find(
        (c) => c.id.toLowerCase() === q || c.slug.toLowerCase() === q
      ) || null
    );
  }

  getSubcategories(categoryIdOrSlug) {
    const cat = this.getById(categoryIdOrSlug);
    return cat?.subcategories || [];
  }

  getSubcategory(categoryIdOrSlug, subIdOrSlug) {
    const subs = this.getSubcategories(categoryIdOrSlug);
    if (!subs.length || !subIdOrSlug) return null;
    const q = String(subIdOrSlug).toLowerCase().trim();
    return (
      subs.find(
        (s) => s.id.toLowerCase() === q || s.slug.toLowerCase() === q
      ) || null
    );
  }

  create(data) {
    const name = data.name?.trim() || "Untitled Category";
    const slug = data.slug || generateSlug(name);
    const newCat = {
      id: data.id || `cat-${Date.now()}`,
      name,
      slug,
      image: data.image || "",
      status: data.status || "Active",
      subcategories: Array.isArray(data.subcategories) ? data.subcategories : [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    this.categories.unshift(newCat);
    return newCat;
  }

  update(id, updates) {
    const idx = this.categories.findIndex(
      (c) => c.id === id || c.slug === id
    );
    if (idx === -1) return null;
    const updatedName = updates.name || this.categories[idx].name;
    this.categories[idx] = {
      ...this.categories[idx],
      ...updates,
      name: updatedName,
      slug: updates.slug || generateSlug(updatedName),
      subcategories:
        updates.subcategories !== undefined
          ? updates.subcategories
          : this.categories[idx].subcategories || [],
    };
    return this.categories[idx];
  }

  delete(id) {
    const before = this.categories.length;
    this.categories = this.categories.filter(
      (c) => c.id !== id && c.slug !== id
    );
    return this.categories.length < before;
  }
}

export const categoriesService = new CategoriesService();
