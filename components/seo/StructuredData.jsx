// Server Component — renders JSON-LD structured data with zero client JS

export default function StructuredData({ type = "Organization", data = {} }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gormenswear.com";

  let schema = null;

  if (type === "Organization") {
    schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "GOR Menswear",
      url: baseUrl,
      logo: `${baseUrl}/images/logo-gor.png`,
      sameAs: [
        "https://instagram.com/gormenswear",
        "https://twitter.com/gormenswear",
        "https://facebook.com/gormenswear",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-86919-21913",
        contactType: "customer service",
        areaServed: "Worldwide",
        availableLanguage: ["English"],
      },
    };
  } else if (type === "WebSite") {
    schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "GOR Menswear",
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/shop?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };
  } else if (type === "Product" && data) {
    schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: data.name,
      image: data.images && data.images.length > 0
        ? data.images.map((img) => img.startsWith("http") ? img : `${baseUrl}${img}`)
        : [data.imageUrl || data.image].filter(Boolean),
      description: data.description || "Elevated men's fashion engineered with precision standards.",
      sku: data.sku || undefined,
      brand: {
        "@type": "Brand",
        name: "GOR Menswear",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: data.price,
        availability:
          data.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `${baseUrl}/product/${data.slug || data.id || data._id}`,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
    };
  } else if (type === "BreadcrumbList" && data.items) {
    schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: data.items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
      })),
    };
  } else if (type === "FAQPage" && data.faqs) {
    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
