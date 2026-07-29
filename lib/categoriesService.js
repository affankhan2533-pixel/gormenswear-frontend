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
  {
    id: "cat-1",
    name: "Shirts & Silks",
    slug: "shirts-silks",
    image: "/images/lookbook/gor-lookbook-1.webp",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "cat-2",
    name: "Trousers",
    slug: "trousers",
    image: "/images/lookbook/gor-lookbook-2.webp",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "cat-3",
    name: "Outerwear",
    slug: "outerwear",
    image: "/images/lookbook/gor-lookbook-4.webp",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "cat-4",
    name: "Co-Ord Sets",
    slug: "co-ord-sets",
    image: "/images/products/gor-codset-burgundy-alo.webp",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "cat-5",
    name: "Leather Accessories",
    slug: "leather-accessories",
    image: "/images/lookbook/gor-lookbook-3.webp",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "cat-6",
    name: "Handcrafted Shoes",
    slug: "handcrafted-shoes",
    image: "/images/lookbook/gor-lookbook-5.webp",
    status: "Active",
    createdAt: "2026-01-10",
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

  create(data) {
    const name = data.name?.trim() || "Untitled Category";
    const slug = generateSlug(name);
    const newCat = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      image: data.image || "",
      status: data.status || "Active",
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
