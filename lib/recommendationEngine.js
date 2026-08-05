/**
 * GOR Menswear — Smart Recommendation & Discovery Engine
 * High-performance, client-side recommendation engine.
 * Computes multi-attribute product similarity scores (Category, Occasion, Color, Fabric, Price Range).
 * Reusable across PDP, Homepage, Cart, and AI Stylist.
 */

// Color Family Map for visual coordination
const COLOR_COORDINATION_MAP = {
  black: ["gold", "white", "sand", "grey", "silver", "burgundy"],
  white: ["black", "navy", "olive", "sand", "slate", "burgundy"],
  navy: ["white", "sand", "gold", "grey", "brown"],
  sand: ["navy", "black", "olive", "white", "espresso"],
  olive: ["sand", "black", "white", "gold"],
  burgundy: ["black", "white", "gold", "charcoal"],
  gold: ["black", "navy", "white", "charcoal"],
};

/**
 * Persist recently viewed product into localStorage (Max 12, newest first, deduplicated)
 */
export function addRecentlyViewed(product) {
  if (!product || typeof window === "undefined") return;
  try {
    const pId = product.id || product._id || product.slug;
    const stored = JSON.parse(localStorage.getItem("gor_recently_viewed") || "[]");
    const filtered = stored.filter((item) => (item.id || item._id || item.slug) !== pId);
    
    // Save lightweight product summary
    const summary = {
      id: product.id || product._id || product.slug,
      slug: product.slug || product.id || product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image || product.images?.[0] || product.img1,
      badge: product.badge,
    };

    const updated = [summary, ...filtered].slice(0, 12);
    localStorage.setItem("gor_recently_viewed", JSON.stringify(updated));
  } catch (e) {
    console.warn("[RecommendationEngine] Error saving recently viewed:", e);
  }
}

/**
 * Fetch recently viewed products from localStorage
 */
export function getRecentlyViewed() {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem("gor_recently_viewed") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (e) {
    return [];
  }
}

/**
 * Compute similarity score between target product and candidate (0-100)
 */
export function calculateSimilarityScore(target, candidate) {
  if (!target || !candidate) return 0;
  const targetId = target.id || target._id || target.slug;
  const candidateId = candidate.id || candidate._id || candidate.slug;
  if (targetId === candidateId) return 0;

  let score = 0;

  // Category match
  if (target.category && candidate.category) {
    if (target.category.toLowerCase() === candidate.category.toLowerCase()) {
      score += 45;
    }
  }

  // Occasion match
  if (target.occasion && candidate.occasion) {
    if (target.occasion.toLowerCase() === candidate.occasion.toLowerCase()) {
      score += 25;
    }
  }

  // Price range proximity (+/- 25%)
  if (target.price && candidate.price) {
    const priceDiffRatio = Math.abs(target.price - candidate.price) / target.price;
    if (priceDiffRatio <= 0.25) {
      score += 20;
    } else if (priceDiffRatio <= 0.5) {
      score += 10;
    }
  }

  // Color harmony check
  if (target.colors && candidate.colors) {
    const targetColorStr = String(target.colors).toLowerCase();
    const candidateColorStr = String(candidate.colors).toLowerCase();
    
    Object.entries(COLOR_COORDINATION_MAP).forEach(([primary, matchingList]) => {
      if (targetColorStr.includes(primary)) {
        matchingList.forEach((match) => {
          if (candidateColorStr.includes(match)) {
            score += 10;
          }
        });
      }
    });
  }

  return score;
}

/**
 * "You May Also Like" — Returns similar garments based on category, price, and attributes
 */
export function getYouMayAlsoLike(targetProduct, catalog = [], limit = 4) {
  if (!targetProduct || !Array.isArray(catalog) || catalog.length === 0) return [];

  const scored = catalog
    .filter((p) => (p.id || p._id || p.slug) !== (targetProduct.id || targetProduct._id || targetProduct.slug))
    .map((candidate) => ({
      product: candidate,
      score: calculateSimilarityScore(targetProduct, candidate),
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.product);
}

/**
 * "Complete The Look" — Selects complementary garments from DIFFERENT categories
 */
export function getCompleteTheLook(targetProduct, catalog = []) {
  if (!targetProduct || !Array.isArray(catalog) || catalog.length === 0) return [];

  const targetCategory = (targetProduct.category || "").toLowerCase();
  const candidates = catalog.filter(
    (p) =>
      (p.id || p._id || p.slug) !== (targetProduct.id || targetProduct._id || targetProduct.slug) &&
      (p.category || "").toLowerCase() !== targetCategory
  );

  if (candidates.length === 0) return [];

  const distinctCategoryItems = [];
  const usedCategories = new Set([targetCategory]);

  for (const candidate of candidates) {
    const cat = (candidate.category || "general").toLowerCase();
    if (!usedCategories.has(cat)) {
      usedCategories.add(cat);
      distinctCategoryItems.push(candidate);
      if (distinctCategoryItems.length >= 3) break;
    }
  }

  if (distinctCategoryItems.length < 2) {
    return [targetProduct, ...candidates.slice(0, 2)];
  }

  return [targetProduct, ...distinctCategoryItems];
}

export const recommendationEngine = {
  addRecentlyViewed,
  getRecentlyViewed,
  calculateSimilarityScore,
  getYouMayAlsoLike,
  getCompleteTheLook,
};
