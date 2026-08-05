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

  const headers = ["ID", "Name", "SKU", "Category", "Collection", "Price", "Stock", "Status"];
  const rows = products.map((p) => [
    `"${p.id || p._id}"`,
    `"${(p.name || "").replace(/"/g, '""')}"`,
    `"${p.sku || ""}"`,
    `"${(p.category || "").replace(/"/g, '""')}"`,
    `"${(p.collection || "").replace(/"/g, '""')}"`,
    p.price ?? 0,
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

class ProductService {
  constructor() {
    this._cachedProducts = [];
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
      const data = await res.json();
      if (data.success && data.data) {
        this._cachedProducts = data.data;
        return data.data;
      }
    } catch (err) {
      console.warn("API fetch error in ProductService.getProducts:", err);
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
    } catch (err) {
      console.warn("API fetch error in ProductService.getProduct:", err);
    }

    // 2. Robust fallback: search full product list by id, _id, slug, sku, or normalized name
    try {
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
    } catch (e) {}

    return null;
  }

  async searchProducts(query) {
    if (!query) return this.getProducts();
    try {
      const res = await fetch(`${this._getApiUrl()}/api/products?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    } catch (err) {
      console.warn("API fetch error in ProductService.searchProducts:", err);
    }
    return [];
  }

  async filterProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "all") params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.status) params.append("status", filters.status);

      const res = await fetch(`${this._getApiUrl()}/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    } catch (err) {
      console.warn("API fetch error in ProductService.filterProducts:", err);
    }
    return [];
  }

  async createProduct(productData) {
    try {
      const res = await fetch(`${this._getApiUrl()}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create product");
      }

      return data.product;
    } catch (err) {
      console.error("API error in ProductService.createProduct:", err);
      throw err;
    }
  }

  async updateProduct(id, productData) {
    if (!id) throw new Error("Product ID is required for update");
    try {
      const res = await fetch(`${this._getApiUrl()}/api/products/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update product");
      }

      return data.product;
    } catch (err) {
      console.error("API error in ProductService.updateProduct:", err);
      throw err;
    }
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

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete product");
      }

      return data.product;
    } catch (err) {
      console.error("API error in ProductService.softDeleteProduct:", err);
      throw err;
    }
  }

  async restoreProduct(id) {
    if (!id) throw new Error("Product ID is required for restore");
    try {
      const res = await fetch(`${this._getApiUrl()}/api/products/${encodeURIComponent(id)}/restore`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to restore product");
      }

      return data.product;
    } catch (err) {
      console.error("API error in ProductService.restoreProduct:", err);
      throw err;
    }
  }

  async duplicateProduct(id) {
    if (!id) throw new Error("Product ID is required for duplication");
    try {
      const res = await fetch(`${this._getApiUrl()}/api/products/${encodeURIComponent(id)}/duplicate`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to duplicate product");
      }

      return data.product;
    } catch (err) {
      console.error("API error in ProductService.duplicateProduct:", err);
      throw err;
    }
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
