export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gormenswear.com";

  // Static Application Routes
  const staticRoutes = [
    { route: "", priority: 1.0, changeFrequency: "daily" },
    { route: "/shop", priority: 0.9, changeFrequency: "daily" },
    { route: "/new-arrivals", priority: 0.9, changeFrequency: "daily" },
    { route: "/about", priority: 0.7, changeFrequency: "weekly" },
    { route: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { route: "/wishlist", priority: 0.5, changeFrequency: "weekly" },
    { route: "/login", priority: 0.4, changeFrequency: "monthly" },
    { route: "/signup", priority: 0.4, changeFrequency: "monthly" },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency,
    priority,
  }));

  // Category Catalog Routes
  const categoryRoutes = [
    "codset",
    "outerwear",
    "shirts",
    "trousers",
    "accessories",
  ].map((cat) => ({
    url: `${baseUrl}/shop/${cat}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Dynamic Product Routes — fetch from API
  let productRoutes = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/products?limit=200&fields=slug,_id,updatedAt`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        productRoutes = data.data.map((product) => ({
          url: `${baseUrl}/product/${product.slug || product._id}`,
          lastModified: product.updatedAt
            ? new Date(product.updatedAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          changeFrequency: "weekly",
          priority: 0.7,
        }));
      }
    }
  } catch {
    // Fail silently — static routes still included
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
