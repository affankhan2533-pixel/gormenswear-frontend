// GOR MENSWEAR Unified In-Memory & Database Delegate Module
import { productService, generateSlug } from "./productService";

export const CATEGORIES = [
  { id: "all", name: "All Collections" },
  { id: "t-shirts", name: "T-Shirts" },
  { id: "shirts", name: "Shirts" },
  { id: "polos", name: "Polos" },
  { id: "pants", name: "Pants" },
  { id: "trousers", name: "Trousers" },
  { id: "jackets", name: "Jackets" },
  { id: "jerseys", name: "Jerseys" },
  { id: "uncategorized", name: "Uncategorized" },
  // Preserved for backwards compatibility
  { id: "outerwear", name: "Outerwear" },
  { id: "codset", name: "Co-Ord Sets" },
  { id: "accessories", name: "Leather Accessories" },
  { id: "footwear", name: "Handcrafted Shoes" },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Proxy getter for backward compatibility
export const PRODUCTS = new Proxy([], {
  get(target, prop) {
    const list = productService.products || [];
    const activeProducts = list.filter(
      (p) => p.status !== "Archived" && p.visibility !== "Hidden"
    );
    if (prop === "length") return activeProducts.length;
    if (prop === "map" || prop === "filter" || prop === "find" || prop === "slice" || prop === "forEach") {
      return activeProducts[prop].bind(activeProducts);
    }
    return activeProducts[prop];
  },
});

export async function queryProducts({ category, subcategory, search, minPrice, maxPrice, sort, page = 1, limit = 12 }) {
  const allProducts = await productService.getProducts();
  let filtered = (allProducts || []).filter(
    (p) => p.status !== "Archived" && p.visibility !== "Hidden"
  );

  if (category && category !== "all") {
    const catNorm = String(category).toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    filtered = filtered.filter((p) => {
      const pCatStr = typeof p.category === "string" ? p.category : (p.category?.name || p.category?.slug || "");
      const pCatSlugStr = typeof p.categorySlug === "string" ? p.categorySlug : (p.category?.slug || "");
      const pCat = pCatStr.toLowerCase().replace(/[^a-z0-9]/g, "");
      const pCatSlug = pCatSlugStr.toLowerCase().replace(/[^a-z0-9]/g, "");
      const pCatId = String(p.categoryId || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      return (
        pCat === catNorm ||
        pCatSlug === catNorm ||
        pCatId === catNorm ||
        pCatId === `cat${catNorm}`
      );
    });
  }

  if (subcategory && subcategory !== "all") {
    const subLower = String(subcategory).toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const pSubStr = typeof p.subcategory === "string" ? p.subcategory : (p.subcategory?.name || p.subcategory?.slug || "");
      const pSubSlugStr = typeof p.subcategorySlug === "string" ? p.subcategorySlug : (p.subcategory?.slug || "");
      const pSub = pSubStr.toLowerCase();
      const pSubSlug = pSubSlugStr.toLowerCase();
      const pSubId = String(p.subcategoryId || "").toLowerCase();
      return pSub.includes(subLower) || pSubSlug === subLower || pSubId === subLower;
    });
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter((p) => {
      const nameStr = typeof p.name === "string" ? p.name : String(p.name || "");
      const descStr = typeof p.description === "string" ? p.description : String(p.description || "");
      const catStr = typeof p.category === "string" ? p.category : (p.category?.name || "");
      const skuStr = typeof p.sku === "string" ? p.sku : String(p.sku || "");
      return (
        nameStr.toLowerCase().includes(q) ||
        descStr.toLowerCase().includes(q) ||
        catStr.toLowerCase().includes(q) ||
        skuStr.toLowerCase().includes(q)
      );
    });
  }

  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filtered.sort((a, b) => (b.rating || 5) - (a.rating || 5));
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    products: paginated,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getProductById(idOrSlug) {
  if (!idOrSlug) return null;
  return await productService.getProduct(idOrSlug);
}

export async function getRelatedProducts(idOrSlug, limit = 4) {
  const allProducts = await productService.getProducts();
  const activeProducts = (allProducts || []).filter(
    (p) => p.status !== "Archived" && p.visibility !== "Hidden"
  );

  const current = activeProducts.find(
    (p) =>
      (p.id && String(p.id).toLowerCase() === String(idOrSlug).toLowerCase()) ||
      (p._id && String(p._id).toLowerCase() === String(idOrSlug).toLowerCase()) ||
      (p.slug && p.slug.toLowerCase() === String(idOrSlug).toLowerCase())
  );

  if (!current) return activeProducts.slice(0, limit);

  return activeProducts
    .filter((p) => (p.id || p._id) !== (current.id || current._id) && p.category === current.category)
    .concat(activeProducts.filter((p) => (p.id || p._id) !== (current.id || current._id) && p.category !== current.category))
    .slice(0, limit);
}
