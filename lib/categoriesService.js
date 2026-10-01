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
    id: "cat-trousers",
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
    image: "/images/categories/t-shirts/image copy 21.png",
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
  {
    id: "cat-uncategorized",
    name: "Uncategorized",
    slug: "uncategorized",
    image: "/images/categories/image.png",
    status: "Active",
    createdAt: "2026-01-10",
    subcategories: [],
  },
];

class CategoriesService {
  constructor() {
    this.categories = [...INITIAL_CATEGORIES];
    this._initialized = false;
    if (typeof window !== "undefined") {
      this.fetchCategories().catch(() => {});
    }
  }

  _getApiUrl() {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
    }
    if (typeof window !== "undefined") {
      return window.location.hostname === "localhost" ? "http://localhost:5000" : "";
    }
    return process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
  }

  async fetchCategories() {
    const apiUrl = this._getApiUrl();
    if (!apiUrl) return this.categories;
    try {
      const res = await fetch(`${apiUrl}/api/categories`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const items = data.categories || data.data;
        if (data.success && Array.isArray(items) && items.length > 0) {
          this.categories = items;
          this._initialized = true;
          return items;
        }
      }
    } catch (err) {
      console.warn("[GOR Categories] Backend API unreachable, using local cache:", err.message);
    }
    return this.categories;
  }

  getAll() {
    return [...this.categories];
  }

  async getAllAsync() {
    return await this.fetchCategories();
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
        (c) => (c.id && c.id.toLowerCase() === q) || (c.slug && c.slug.toLowerCase() === q) || (c._id && String(c._id).toLowerCase() === q)
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
        (s) => (s.id && s.id.toLowerCase() === q) || (s.slug && s.slug.toLowerCase() === q)
      ) || null
    );
  }

  async create(data) {
    const name = data.name?.trim() || "Untitled Category";
    const slug = data.slug || generateSlug(name);
    const newCat = {
      id: data.id || `cat-${slug}`,
      name,
      slug,
      image: data.image || "",
      bannerImage: data.bannerImage || "",
      description: data.description || "",
      status: data.status || "Active",
      subcategories: Array.isArray(data.subcategories) ? data.subcategories : [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    const apiUrl = this._getApiUrl();
    if (apiUrl) {
      try {
        const res = await fetch(`${apiUrl}/api/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCat),
        });
        const json = await res.json();
        if (res.ok && json.success && (json.category || json.data)) {
          const created = json.category || json.data;
          this.categories.unshift(created);
          return created;
        }
      } catch (err) {
        console.warn("[GOR Categories] API create failed, using local update:", err.message);
      }
    }

    this.categories.unshift(newCat);
    return newCat;
  }

  async update(id, updates) {
    const apiUrl = this._getApiUrl();
    if (apiUrl) {
      try {
        const res = await fetch(`${apiUrl}/api/categories/${encodeURIComponent(id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        const json = await res.json();
        if (res.ok && json.success && (json.category || json.data)) {
          const updated = json.category || json.data;
          const idx = this.categories.findIndex((c) => c.id === id || c.slug === id || c._id === id);
          if (idx !== -1) this.categories[idx] = updated;
          return updated;
        }
      } catch (err) {
        console.warn("[GOR Categories] API update failed, using local update:", err.message);
      }
    }

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

  async delete(id) {
    const apiUrl = this._getApiUrl();
    if (apiUrl) {
      try {
        await fetch(`${apiUrl}/api/categories/${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("[GOR Categories] API delete failed, using local delete:", err.message);
      }
    }

    const before = this.categories.length;
    this.categories = this.categories.filter(
      (c) => c.id !== id && c.slug !== id && c._id !== id
    );
    return this.categories.length < before;
  }
}

export const categoriesService = new CategoriesService();
