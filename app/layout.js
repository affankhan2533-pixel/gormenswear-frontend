import { Cormorant_Garamond, Inter, Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import OfflineBanner from "@/components/ui/OfflineBanner";
import StructuredData from "@/components/seo/StructuredData";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import CookieConsent from "@/components/analytics/CookieConsent";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gormenswear.com";

// Required separate export in Next.js 14+
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F1115",
};

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "GOR MENSWEAR | Premium Menswear & Modern Streetwear",
    template: "%s | GOR Menswear",
  },
  description: "Premium men's clothing designed for everyday confidence. Discover oversized tees, jerseys, co-ord sets and modern menswear crafted for today's generation.",
  keywords: ["men's fashion", "luxury menswear", "oversized tees", "co-ord sets", "jerseys", "streetwear", "GOR menswear", "premium menswear India"],
  authors: [{ name: "GOR Menswear" }],
  creator: "GOR Menswear",
  publisher: "GOR Menswear",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "GOR MENSWEAR | Premium Menswear & Modern Streetwear",
    description: "Premium men's clothing designed for everyday confidence. Discover oversized tees, jerseys, co-ord sets and modern menswear.",
    url: baseUrl,
    siteName: "GOR Menswear",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${baseUrl}/images/categories/gor-model-streetwear.webp`,
        width: 1200,
        height: 630,
        alt: "GOR Menswear — Premium Men's Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GOR MENSWEAR | Premium Menswear & Modern Streetwear",
    description: "Premium men's clothing designed for everyday confidence.",
    images: [`${baseUrl}/images/categories/gor-model-streetwear.webp`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${playfair.variable} ${manrope.variable} dark scroll-smooth`}>
      <body className="bg-[#0A0A0A] text-[#F8F6F3] font-sans antialiased selection:bg-[#C9A96E] selection:text-[#0A0A0A] min-h-screen flex flex-col overflow-x-hidden">
        <StructuredData type="Organization" />
        <StructuredData type="WebSite" />
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <OfflineBanner />
              <AnalyticsScripts />
              <CookieConsent />
              {children}
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
