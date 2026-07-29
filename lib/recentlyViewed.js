"use client";

const MAX_RECENTLY_VIEWED = 10;
const STORAGE_KEY = "gor_recently_viewed_v2";

/**
  Add a product to recently viewed history
 */
export function addRecentlyViewed(product) {
  if (typeof window === "undefined" || !product) return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let items = raw ? JSON.parse(raw) : [];

    const targetId = String(product.id || product._id);

    // Filter out existing occurrence to move it to the top
    items = items.filter((p) => String(p.id || p._id) !== targetId);

    // Prepend product
    items.unshift({
      id: targetId,
      _id: targetId,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image || product.images?.[0],
    });

    // Enforce 10 item cap
    if (items.length > MAX_RECENTLY_VIEWED) {
      items = items.slice(0, MAX_RECENTLY_VIEWED);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to update recently viewed products", e);
  }
}

/**
  Get array of recently viewed products
 */
export function getRecentlyViewed() {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
