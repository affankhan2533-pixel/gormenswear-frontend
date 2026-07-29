export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gormenswear.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/", "/checkout/", "/order-confirmation/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
