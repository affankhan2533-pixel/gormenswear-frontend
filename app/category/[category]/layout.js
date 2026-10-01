// Server component layout — generates per-category SEO metadata from MongoDB
// The page.js inside uses "use client" so metadata must live here in the layout.

const CATEGORY_SEO = {
  "t-shirts": {
    title: "T-Shirts",
    description:
      "Shop premium men's T-Shirts at GOR Menswear. Oversized fits, graphic tees, heavyweight knits — crafted for modern streetwear.",
  },
  shirts: {
    title: "Shirts",
    description:
      "Explore GOR Menswear's shirts collection. Textured weaves, architectural collars, and tailored cuts for the discerning man.",
  },
  polos: {
    title: "Polos",
    description:
      "Shop luxury men's polo shirts at GOR Menswear. Elevated knitwear, waffle knit, and ribbed-collar polos from premium imported collections.",
  },
  pants: {
    title: "Pants",
    description:
      "GOR Menswear pants — cargo silhouettes, relaxed twill, and structured fits for everyday confidence.",
  },
  trousers: {
    title: "Trousers",
    description:
      "Refined men's trousers at GOR Menswear. Sartorial pleats, fluid drape, and clean tapered breaks.",
  },
  jackets: {
    title: "Jackets",
    description:
      "Shop men's jackets at GOR Menswear. Structured bombers, zip overshirts, and unlined transitional jackets.",
  },
  jerseys: {
    title: "Jerseys",
    description:
      "GOR Menswear athletic jerseys — collegiate mesh, vintage graphics, and modern streetwear silhouettes.",
  },
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gormenswear.com";

export async function generateMetadata({ params }) {
  const resolvedParams = params && typeof params.then === "function" ? await params : (params || {});
  const category = resolvedParams?.category || "t-shirts";
  const slug = (category || "").toLowerCase().trim();
  const seo = CATEGORY_SEO[slug];

  const titleStr = seo
    ? `${seo.title} — GOR Menswear`
    : `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — GOR Menswear`;

  const descStr = seo
    ? seo.description
    : `Shop men's ${slug.replace(/-/g, " ")} at GOR Menswear. Premium imported menswear crafted for today's generation.`;

  const canonicalUrl = `${baseUrl}/category/${slug}`;
  const ogImage = `${baseUrl}/images/categories/${slug}/banner.webp`;

  return {
    title: titleStr,
    description: descStr,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: titleStr,
      description: descStr,
      url: canonicalUrl,
      siteName: "GOR Menswear",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `GOR Menswear — ${seo?.title || slug} Collection`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleStr,
      description: descStr,
      images: [ogImage],
    },
  };
}

export default function CategoryLayout({ children }) {
  return children;
}
