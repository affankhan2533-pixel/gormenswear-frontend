export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gormenswear.com";
  const today = new Date().toISOString().split("T")[0];

  // ── 1. Static public pages ─────────────────────────────────────────────────
  const staticRoutes = [
    { url: `${baseUrl}/`,             priority: 1.0, changeFrequency: "daily"   },
    { url: `${baseUrl}/shop`,         priority: 0.9, changeFrequency: "daily"   },
    { url: `${baseUrl}/new-arrivals`, priority: 0.9, changeFrequency: "daily"   },
    { url: `${baseUrl}/about`,        priority: 0.7, changeFrequency: "weekly"  },
    { url: `${baseUrl}/contact`,      priority: 0.6, changeFrequency: "monthly" },
  ].map((r) => ({ ...r, lastModified: today }));

  // ── 2. Category pages — exactly the 7 live categories ─────────────────────
  const LIVE_CATEGORY_SLUGS = [
    "t-shirts",
    "shirts",
    "polos",
    "pants",
    "trousers",
    "jackets",
    "jerseys",
  ];

  const categoryRoutes = LIVE_CATEGORY_SLUGS.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: today,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // ── 3. Published product pages — fetched from MongoDB via Express API ──────
  let productRoutes = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/products?limit=500`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const products = data.data || data.products || [];
      productRoutes = products
        .filter((p) => p.status === "Active" && p.visibility === "Published" && p.slug)
        .map((p) => ({
          url: `${baseUrl}/product/${p.slug}`,
          lastModified: p.updatedAt
            ? new Date(p.updatedAt).toISOString().split("T")[0]
            : today,
          changeFrequency: "weekly",
          priority: 0.7,
        }));
    }
  } catch {
    // Fail silently — static and category routes still included
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
