// GOR MENSWEAR — Collections Service
// Dedicated Collections entity — independent of products

export function generateSlug(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const INITIAL_COLLECTIONS = [
  {
    id: "col-1",
    name: "Atelier Edition",
    slug: "atelier-edition",
    image: "/images/lookbook/gor-lookbook-1.webp",
    description: "Hand-crafted limited edition pieces from our Italian atelier.",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "col-2",
    name: "Savile Core",
    slug: "savile-core",
    image: "/images/lookbook/gor-lookbook-2.webp",
    description: "Classic British tailoring translated for the modern wardrobe.",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "col-3",
    name: "Autumn 2026",
    slug: "autumn-2026",
    image: "/images/lookbook/gor-lookbook-4.webp",
    description: "Our seasonal Autumn 2026 collection featuring rich textures.",
    status: "Active",
    createdAt: "2026-03-01",
  },
  {
    id: "col-4",
    name: "Winter Bespoke",
    slug: "winter-bespoke",
    image: "/images/lookbook/gor-lookbook-6.webp",
    description: "Bespoke winter outerwear and tailored suiting.",
    status: "Active",
    createdAt: "2026-04-01",
  },
  {
    id: "col-5",
    name: "Streetwear Core",
    slug: "streetwear-core",
    image: "/images/products/gor-codset-burgundy-alo.webp",
    description: "Premium streetwear essentials with a luxury edge.",
    status: "Active",
    createdAt: "2026-05-01",
  },
];

class CollectionsService {
  constructor() {
    this.collections = [...INITIAL_COLLECTIONS];
  }

  getAll() {
    return [...this.collections];
  }

  getActive() {
    return this.collections.filter((c) => c.status === "Active");
  }

  getById(id) {
    if (!id) return null;
    const q = String(id).toLowerCase().trim();
    return (
      this.collections.find(
        (c) => c.id.toLowerCase() === q || c.slug.toLowerCase() === q
      ) || null
    );
  }

  create(data) {
    const name = data.name?.trim() || "Untitled Collection";
    const slug = generateSlug(name);
    const newCol = {
      id: `col-${Date.now()}`,
      name,
      slug,
      image: data.image || "",
      description: data.description || "",
      status: data.status || "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    this.collections.unshift(newCol);
    return newCol;
  }

  update(id, updates) {
    const idx = this.collections.findIndex(
      (c) => c.id === id || c.slug === id
    );
    if (idx === -1) return null;
    const updatedName = updates.name || this.collections[idx].name;
    this.collections[idx] = {
      ...this.collections[idx],
      ...updates,
      name: updatedName,
      slug: updates.slug || generateSlug(updatedName),
    };
    return this.collections[idx];
  }

  delete(id) {
    const before = this.collections.length;
    this.collections = this.collections.filter(
      (c) => c.id !== id && c.slug !== id
    );
    return this.collections.length < before;
  }
}

export const collectionsService = new CollectionsService();
