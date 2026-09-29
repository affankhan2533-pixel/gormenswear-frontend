// GOR MENSWEAR — Unified Product Service & Data Layer
// Connects directly to backend API (http://localhost:5000/api/products)

export function generateSlug(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function exportProductsCSV(products = []) {
  if (typeof window === "undefined" || !products.length) return;

  const headers = ["ID", "Name", "SKU", "Category", "Subcategory", "Collection", "Price", "Colors", "Sizes", "Stock", "Status"];
  const rows = products.map((p) => [
    `"${p.id || p._id}"`,
    `"${(p.name || "").replace(/"/g, '""')}"`,
    `"${p.sku || ""}"`,
    `"${(p.category || "").replace(/"/g, '""')}"`,
    `"${(p.subcategory || "").replace(/"/g, '""')}"`,
    `"${(p.collection || "").replace(/"/g, '""')}"`,
    p.price ?? 0,
    `"${(p.colors || []).join(", ").replace(/"/g, '""')}"`,
    `"${(p.sizes || []).join(", ").replace(/"/g, '""')}"`,
    p.stock ?? 0,
    `"${p.status || "Active"}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `gor_products_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const INITIAL_PRODUCTS_CATALOG = [
  // --- COMPLETE REFERENCE ARCHITECTURE EXAMPLE ---
  {
    id: "gor-tee-essential-oversized",
    name: "GOR Essential Oversized Tee",
    slug: "gor-essential-oversized-tee",
    categoryId: "cat-tshirts",
    category: "T-Shirts",
    categorySlug: "t-shirts",
    subcategoryId: "sub-tshirts-oversized",
    subcategory: "Oversized",
    subcategorySlug: "oversized",
    price: 1499,
    compareAtPrice: 1999,
    costPerItem: 650,
    stock: 48,
    minStockThreshold: 10,
    sku: "GOR-TEE-OVR-01",
    barcode: "89042109299",
    status: "Active",
    visibility: "Published",
    colors: ["Black", "White", "Green", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    imageUrl: "/images/products/t-shirts/oversized/gor-essential-oversized-tee/black-01.webp",
    images: [
      "/images/products/t-shirts/oversized/gor-essential-oversized-tee/black-01.webp",
      "/images/products/t-shirts/oversized/gor-essential-oversized-tee/black-02.webp",
      "/images/products/t-shirts/oversized/gor-essential-oversized-tee/white-01.webp",
      "/images/products/t-shirts/oversized/gor-essential-oversized-tee/white-02.webp",
      "/images/products/t-shirts/oversized/gor-essential-oversized-tee/green-01.webp",
      "/images/products/t-shirts/oversized/gor-essential-oversized-tee/green-02.webp",
      "/images/products/t-shirts/oversized/gor-essential-oversized-tee/navy-01.webp",
      "/images/products/t-shirts/oversized/gor-essential-oversized-tee/navy-02.webp",
    ],
    description: "Signature 280 GSM luxury heavyweight combed cotton oversized tee. Featuring drop shoulders, tailored neck ribbing, and seamless drape.",
    tags: ["Oversized", "Heavyweight", "Streetwear", "Essential"],
    variants: [
      { color: "Black", size: "S", stock: 4, sku: "GOR-TEE-OVR-BLK-S" },
      { color: "Black", size: "M", stock: 6, sku: "GOR-TEE-OVR-BLK-M" },
      { color: "Black", size: "L", stock: 6, sku: "GOR-TEE-OVR-BLK-L" },
      { color: "Black", size: "XL", stock: 4, sku: "GOR-TEE-OVR-BLK-XL" },
      { color: "White", size: "S", stock: 3, sku: "GOR-TEE-OVR-WHT-S" },
      { color: "White", size: "M", stock: 5, sku: "GOR-TEE-OVR-WHT-M" },
      { color: "White", size: "L", stock: 5, sku: "GOR-TEE-OVR-WHT-L" },
      { color: "White", size: "XL", stock: 3, sku: "GOR-TEE-OVR-WHT-XL" },
      { color: "Green", size: "M", stock: 4, sku: "GOR-TEE-OVR-GRN-M" },
      { color: "Green", size: "L", stock: 4, sku: "GOR-TEE-OVR-GRN-L" },
      { color: "Navy", size: "M", stock: 2, sku: "GOR-TEE-OVR-NVY-M" },
      { color: "Navy", size: "L", stock: 2, sku: "GOR-TEE-OVR-NVY-L" },
    ],
  },
  // --- PRESERVED EXISTING CATALOG PRODUCTS ---
  {
    id: "gor-codset-1",
    name: "GOR Alo Burgundy Heavyweight Co-Ord Set",
    slug: "gor-alo-burgundy-co-ord-set",
    categoryId: "cat-4",
    category: "Co-Ord Sets",
    categorySlug: "co-ord-sets",
    subcategoryId: null,
    subcategory: "",
    subcategorySlug: "",
    price: 380,
    compareAtPrice: 450,
    costPerItem: 120,
    stock: 18,
    reservedStock: 2,
    sku: "GOR-COD-ALO-01",
    barcode: "89042109281",
    status: "Published",
    visibility: "Published",
    image: "/images/products/gor-codset-burgundy-alo.webp",
    imageUrl: "/images/products/gor-codset-burgundy-alo.webp",
    images: ["/images/products/gor-codset-burgundy-alo.webp"],
    description: "Heavyweight Alo cotton blend co-ord set featuring structured shoulders and relaxed fit pants.",
    colors: ["Burgundy"],
    sizes: ["S", "M", "L", "XL"],
    views: 4200,
    wishlists: 680,
    sales: 142,
    conversion: "4.8%",
    variants: [
      { size: "S", color: "Burgundy", stock: 4, sku: "GOR-COD-ALO-S" },
      { size: "M", color: "Burgundy", stock: 6, sku: "GOR-COD-ALO-M" },
      { size: "L", color: "Burgundy", stock: 5, sku: "GOR-COD-ALO-L" },
      { size: "XL", color: "Burgundy", stock: 3, sku: "GOR-COD-ALO-XL" },
    ],
  },
  {
    id: "gor-codset-2",
    name: "Prada Desert Sand Textured Zip Set",
    slug: "prada-desert-sand-zip-set",
    categoryId: "cat-4",
    category: "Co-Ord Sets",
    categorySlug: "co-ord-sets",
    subcategoryId: null,
    subcategory: "",
    subcategorySlug: "",
    price: 520,
    compareAtPrice: 600,
    costPerItem: 180,
    stock: 4,
    reservedStock: 1,
    sku: "GOR-COD-PRA-02",
    barcode: "89042109282",
    status: "Published",
    visibility: "Published",
    image: "/images/products/gor-codset-beige-prada.webp",
    imageUrl: "/images/products/gor-codset-beige-prada.webp",
    images: ["/images/products/gor-codset-beige-prada.webp"],
    description: "Textured desert sand zip shirt with matching relaxed trousers crafted from technical poly-cotton.",
    colors: ["Desert Sand"],
    sizes: ["M", "L"],
    views: 3890,
    wishlists: 540,
    sales: 118,
    conversion: "5.1%",
    variants: [
      { size: "M", color: "Desert Sand", stock: 2, sku: "GOR-COD-PRA-M" },
      { size: "L", color: "Desert Sand", stock: 2, sku: "GOR-COD-PRA-L" },
    ],
  },
  {
    id: "gor-shirt-1",
    name: "GOR Designer Camp Shirting in Onyx",
    slug: "gor-designer-camp-shirting-onyx",
    categoryId: "cat-shirts",
    category: "Shirts",
    categorySlug: "shirts",
    subcategoryId: "sub-shirts-casual",
    subcategory: "Casual",
    subcategorySlug: "casual",
    price: 240,
    compareAtPrice: 280,
    costPerItem: 75,
    stock: 28,
    reservedStock: 4,
    sku: "GOR-SHT-CMP-03",
    barcode: "89042109283",
    status: "Published",
    visibility: "Published",
    image: "/images/lookbook/gor-lookbook-2.webp",
    imageUrl: "/images/lookbook/gor-lookbook-2.webp",
    images: ["/images/lookbook/gor-lookbook-2.webp"],
    description: "Open camp collar shirt with mother-of-pearl buttons and relaxed boxy silhouette.",
    colors: ["Onyx"],
    sizes: ["S", "M", "L"],
    views: 3100,
    wishlists: 410,
    sales: 95,
    conversion: "3.9%",
    variants: [
      { size: "S", color: "Onyx", stock: 8, sku: "GOR-SHT-CMP-S" },
      { size: "M", color: "Onyx", stock: 10, sku: "GOR-SHT-CMP-M" },
      { size: "L", color: "Onyx", stock: 10, sku: "GOR-SHT-CMP-L" },
    ],
  },
  {
    id: "gor-trouser-1",
    name: "Structured Tailored Trousers in Charcoal",
    slug: "structured-tailored-trousers-charcoal",
    categoryId: "cat-2",
    category: "Trousers",
    categorySlug: "trousers",
    subcategoryId: "sub-trousers-pleated",
    subcategory: "Pleated",
    subcategorySlug: "pleated",
    price: 290,
    compareAtPrice: 340,
    costPerItem: 90,
    stock: 14,
    reservedStock: 2,
    sku: "GOR-TRS-STR-04",
    barcode: "89042109284",
    status: "Published",
    visibility: "Published",
    image: "/images/lookbook/image copy 5.png",
    imageUrl: "/images/lookbook/image copy 5.png",
    images: ["/images/lookbook/image copy 5.png"],
    description: "Deep double-pleated trousers with side adjusters and clean tapered break.",
    colors: ["Charcoal"],
    sizes: ["30", "32"],
    views: 2750,
    wishlists: 390,
    sales: 84,
    conversion: "4.2%",
    variants: [
      { size: "30", color: "Charcoal", stock: 0, sku: "GOR-TRS-30" },
      { size: "32", color: "Charcoal", stock: 0, sku: "GOR-TRS-32" },
    ],
  },
];

class ProductService {
  constructor() {
    this._cachedProducts = [...INITIAL_PRODUCTS_CATALOG];
  }

  get products() {
    return this._cachedProducts || [];
  }

  _getApiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  }

  async getProducts() {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/products`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          this._cachedProducts = data.data;
          return data.data;
        }
      }
    } catch (err) {
      // Fallback to internal catalog cache
    }
    return this._cachedProducts || [];
  }

  async getStorefrontProducts() {
    return this.getProducts();
  }

  async getProduct(idOrSlug) {
    if (!idOrSlug) return null;
    const decoded = String(decodeURIComponent(idOrSlug)).toLowerCase();

    // 1. Primary API fetch by endpoint
    try {
      const res = await fetch(`${this._getApiUrl()}/api/products/${encodeURIComponent(idOrSlug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          return data.product;
        }
      }
    } catch (err) {}

    // 2. Fallback search cached/seed products
    const all = await this.getProducts();
    if (Array.isArray(all) && all.length > 0) {
      const found = all.find((p) => {
        const pId = String(p.id || p._id || "").toLowerCase();
        const pSlug = String(p.slug || "").toLowerCase();
        const pSku = String(p.sku || "").toLowerCase();
        const pNameSlug = String(p.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        return (
          pId === decoded ||
          pSlug === decoded ||
          pSku === decoded ||
          pNameSlug === decoded ||
          pId === String(idOrSlug).toLowerCase() ||
          pSlug === String(idOrSlug).toLowerCase()
        );
      });

      if (found) return found;
    }

    return null;
  }

  async searchProducts(query) {
    if (!query) return this.getProducts();
    try {
      const res = await fetch(`${this._getApiUrl()}/api/products?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
    } catch (err) {}

    const q = query.toLowerCase().trim();
    const all = await this.getProducts();
    return all.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.subcategory || "").toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.colors || []).some((c) => String(c).toLowerCase().includes(q))
    );
  }

  async filterProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "all") params.append("category", filters.category);
      if (filters.subcategory && filters.subcategory !== "all") params.append("subcategory", filters.subcategory);
      if (filters.search) params.append("search", filters.search);
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.status) params.append("status", filters.status);

      const res = await fetch(`${this._getApiUrl()}/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
    } catch (err) {}

    let list = await this.getProducts();
    if (filters.category && filters.category !== "all") {
      const c = filters.category.toLowerCase();
      list = list.filter((p) => (p.category || "").toLowerCase().includes(c) || (p.categorySlug || "").toLowerCase() === c || String(p.categoryId || "").toLowerCase() === c);
    }
    if (filters.subcategory && filters.subcategory !== "all") {
      const s = filters.subcategory.toLowerCase();
      list = list.filter((p) => (p.subcategory || "").toLowerCase().includes(s) || (p.subcategorySlug || "").toLowerCase() === s || String(p.subcategoryId || "").toLowerCase() === s);
    }
    if (filters.status) {
      list = list.filter((p) => p.status === filters.status);
    }
    return list;
  }

  async createProduct(productData) {
    const newProduct = {
      id: productData.id || `prod_${Date.now()}`,
      name: productData.name?.trim() || "Untitled Product",
      slug: productData.slug || generateSlug(productData.name),
      description: productData.description || "",
      imageUrl: productData.imageUrl || productData.images?.[0] || "/images/products/gor-codset-burgundy-alo.webp",
      images: Array.isArray(productData.images) && productData.images.length > 0 ? productData.images : ["/images/products/gor-codset-burgundy-alo.webp"],
      price: parseFloat(productData.price) || 0,
      compareAtPrice: productData.compareAtPrice ? parseFloat(productData.compareAtPrice) : null,
      categoryId: productData.categoryId || null,
      category: productData.category || "",
      categorySlug: productData.categorySlug || generateSlug(productData.category || ""),
      subcategoryId: productData.subcategoryId || null,
      subcategory: productData.subcategory || "",
      subcategorySlug: productData.subcategorySlug || generateSlug(productData.subcategory || ""),
      collectionId: productData.collectionId || null,
      collection: productData.collection || "",
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
      variants: Array.isArray(productData.variants) ? productData.variants : [],
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      stock: parseInt(productData.stock ?? 0, 10),
      minStockThreshold: parseInt(productData.minStockThreshold ?? 5, 10),
      sku: productData.sku || `GOR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      barcode: productData.barcode || "",
      status: productData.status || "Draft",
      visibility: productData.visibility || "Hidden",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${this._getApiUrl()}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (res.ok && data.success && data.product) {
        this._cachedProducts.unshift(data.product);
        return data.product;
      }
    } catch (err) {
      console.warn("API fallback to in-memory product creation:", err);
    }

    this._cachedProducts.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id, productData) {
    if (!id) throw new Error("Product ID is required for update");
    try {
      const res = await fetch(`${this._getApiUrl()}/api/products/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (res.ok && data.success && data.product) {
        const idx = this._cachedProducts.findIndex((p) => String(p.id || p._id).toLowerCase() === String(id).toLowerCase());
        if (idx !== -1) this._cachedProducts[idx] = data.product;
        return data.product;
      }
    } catch (err) {
      console.warn("API fallback to in-memory product update:", err);
    }

    const idx = this._cachedProducts.findIndex((p) => String(p.id || p._id).toLowerCase() === String(id).toLowerCase());
    if (idx !== -1) {
      this._cachedProducts[idx] = {
        ...this._cachedProducts[idx],
        ...productData,
        categorySlug: productData.categorySlug || (productData.category ? generateSlug(productData.category) : this._cachedProducts[idx].categorySlug),
        subcategorySlug: productData.subcategorySlug || (productData.subcategory ? generateSlug(productData.subcategory) : this._cachedProducts[idx].subcategorySlug),
        updatedAt: new Date().toISOString(),
      };
      return this._cachedProducts[idx];
    }
    return productData;
  }

  async deleteProduct(id) {
    return this.softDeleteProduct(id);
  }

  async softDeleteProduct(id) {
    if (!id) throw new Error("Product ID is required for deletion");
    try {
      const res = await fetch(`${this._getApiUrl()}/api/products/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data.product;
      }
    } catch (err) {}

    const idx = this._cachedProducts.findIndex((p) => String(p.id || p._id).toLowerCase() === String(id).toLowerCase());
    if (idx !== -1) {
      this._cachedProducts[idx].status = "Archived";
      return this._cachedProducts[idx];
    }
    return null;
  }

  async restoreProduct(id) {
    if (!id) throw new Error("Product ID is required for restore");
    try {
      const res = await fetch(`${this._getApiUrl()}/api/products/${encodeURIComponent(id)}/restore`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) return data.product;
    } catch (err) {}

    const idx = this._cachedProducts.findIndex((p) => String(p.id || p._id).toLowerCase() === String(id).toLowerCase());
    if (idx !== -1) {
      this._cachedProducts[idx].status = "Draft";
      return this._cachedProducts[idx];
    }
    return null;
  }

  async duplicateProduct(id) {
    if (!id) throw new Error("Product ID is required for duplication");
    const orig = await this.getProduct(id);
    if (!orig) return null;

    const dup = {
      ...orig,
      id: `prod_${Date.now()}`,
      name: `${orig.name} (Copy)`,
      slug: `${orig.slug}-copy-${Date.now().toString(36)}`,
      sku: `${orig.sku || "GOR"}-CPY`,
      status: "Draft",
      visibility: "Hidden",
    };

    return this.createProduct(dup);
  }

  async bulkActions(action, ids = []) {
    if (!ids.length) return;
    for (const id of ids) {
      try {
        if (action === "delete") {
          await this.softDeleteProduct(id);
        } else if (action === "activate") {
          await this.updateProduct(id, { status: "Active", visibility: "Published" });
        } else if (action === "draft") {
          await this.updateProduct(id, { status: "Draft", visibility: "Hidden" });
        }
      } catch (err) {
        console.warn(`Bulk action ${action} failed for ID ${id}:`, err);
      }
    }
  }
}

export const productService = new ProductService();
