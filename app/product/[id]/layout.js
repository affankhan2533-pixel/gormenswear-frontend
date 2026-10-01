// Server-side layout — generates per-product dynamic SEO metadata from MongoDB Atlas
// The page.js inside is "use client" so metadata must live here.

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gormenswear.com";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    // Try slug first, then id
    let product = null;
    const slugRes = await fetch(`${apiUrl}/api/products/slug/${id}`, {
      next: { revalidate: 3600 },
    });
    if (slugRes.ok) {
      const d = await slugRes.json();
      if (d.success && d.product) product = d.product;
    }

    if (!product) {
      const idRes = await fetch(`${apiUrl}/api/products/${id}`, {
        next: { revalidate: 3600 },
      });
      if (idRes.ok) {
        const d = await idRes.json();
        if (d.success && d.product) product = d.product;
      }
    }

    if (!product) {
      return {
        title: "Product — GOR Menswear",
        description: "Premium imported menswear at GOR Menswear.",
      };
    }

    const productUrl = `${baseUrl}/product/${product.slug || id}`;
    const ogImage =
      product.imageUrl ||
      product.image ||
      (product.images && product.images[0]) ||
      `${baseUrl}/images/lookbook/gor-lookbook-1.webp`;

    const priceStr =
      product.price != null
        ? `₹${Number(product.price).toLocaleString("en-IN")}`
        : "";

    const titleStr = product.name
      ? `${product.name} — GOR Menswear`
      : "Product — GOR Menswear";

    const descStr = product.description
      ? `${product.description.slice(0, 155).trim()}…`
      : `Shop ${product.name || "premium menswear"} at GOR Menswear. ${priceStr ? priceStr + " — " : ""}Imported men's fashion for today's generation.`;

    return {
      title: titleStr,
      description: descStr,
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        title: titleStr,
        description: descStr,
        url: productUrl,
        siteName: "GOR Menswear",
        locale: "en_IN",
        type: "website",
        images: [
          {
            url: ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`,
            width: 1200,
            height: 1200,
            alt: product.name || "GOR Menswear Product",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: titleStr,
        description: descStr,
        images: [ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`],
      },
    };
  } catch {
    return {
      title: "Product — GOR Menswear",
      description: "Premium imported menswear at GOR Menswear.",
    };
  }
}

export default function ProductLayout({ children }) {
  return children;
}
