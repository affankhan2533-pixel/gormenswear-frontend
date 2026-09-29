"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { productService } from "@/lib/productService";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products in wishlist
  useEffect(() => {
    async function loadWishlistItems() {
      setLoading(true);
      try {
        const allItems = await productService.getStorefrontProducts();
        if (Array.isArray(allItems)) {
          const savedItems = allItems.filter((p) =>
            wishlist.includes(p.id || p._id || p.slug)
          );
          setProducts(savedItems);
        }
      } catch (err) {
        console.error("Failed to load wishlist items", err);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistItems();
  }, [wishlist]);

  const handleMoveToBag = (product) => {
    const size = product.sizes?.[0] || "M";
    const color = product.colors?.[0] || "Standard";
    addToCart(product, size, color, 1);
    toggleWishlist(product.id || product._id || product.slug);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#111111] flex flex-col selection:bg-[#111111] selection:text-[#F5F2EC]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 pt-28 sm:pt-36 pb-24">
        {/* Subtle Breadcrumbs */}
        <nav className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#716D66] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-[#111111]">WISHLIST</span>
        </nav>

        {/* Editorial Header */}
        <div className="border-b border-[#D8D2C8] pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#716D66] block mb-1">
              CURATED ARCHIVE
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-[#111111] font-normal tracking-tight">
              YOUR SAVED PIECES ({wishlist.length})
            </h1>
          </div>
          {wishlist.length > 0 && (
            <Link
              href="/shop"
              className="font-sans text-xs uppercase tracking-[0.2em] text-[#716D66] hover:text-[#111111] transition-colors flex items-center gap-1"
            >
              <span>EXPLORE MORE PIECES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#716D66] block">
              SAVED PIECES
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#111111]">
              YOUR SAVED PIECES
            </h2>
            <p className="font-sans text-xs text-[#716D66] font-light leading-relaxed">
              No saved products yet. Browse the collection and save your preferred silhouettes.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors"
              >
                EXPLORE SHOP
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Items Grid / Table */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            <AnimatePresence>
              {products.map((product) => {
                const prodId = product.id || product._id || product.slug;
                const img =
                  product.images?.[0] ||
                  product.imageUrl ||
                  product.image ||
                  "/images/lookbook/gor-lookbook-1.webp";

                const firstColor = Array.isArray(product.colors) && product.colors.length > 0
                  ? typeof product.colors[0] === "string"
                    ? product.colors[0]
                    : product.colors[0].name
                  : null;

                return (
                  <motion.div
                    key={prodId}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col group border border-[#D8D2C8] bg-[#EFECE6]/40 p-4"
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${prodId}`}
                      className="relative aspect-[3/4] w-full bg-[#E9E5DD] overflow-hidden mb-4 block"
                    >
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#716D66] block mb-1">
                          {product.category || "COLLECTION"}
                        </span>

                        <Link href={`/product/${prodId}`}>
                          <h3 className="font-editorial text-lg text-[#111111] hover:text-[#8C7A6B] transition-colors leading-snug mb-1">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between text-xs font-sans mt-1">
                          <span className="font-medium text-[#111111]">
                            {formatPrice(product.price)}
                          </span>
                          {firstColor && (
                            <span className="text-[#716D66] text-[11px]">
                              {firstColor}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 mt-3 border-t border-[#D8D2C8] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleMoveToBag(product)}
                          className="flex-1 py-2.5 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-[11px] uppercase tracking-[0.15em] font-medium text-center transition-colors cursor-pointer"
                        >
                          MOVE TO BAG
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(prodId)}
                          aria-label={`Remove ${product.name} from wishlist`}
                          className="p-2.5 border border-[#D8D2C8] text-[#716D66] hover:text-[#111111] hover:border-[#111111] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
