"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { getRecentlyViewed } from "@/lib/recentlyViewed";
import { useCart } from "@/context/CartContext";

export default function PersonalizedRecommendations({ currentProductId, category }) {
  const { wishlist, cart } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/products`);
        const data = await res.json();
        if (data.success) {
          setAllProducts(data.data || []);
        }
      } catch (e) {
        console.error("Failed to load recommendation catalog", e);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const recommendedItems = useMemo(() => {
    if (!allProducts.length) return [];

    const seenIds = new Set();
    if (currentProductId) {
      seenIds.add(String(currentProductId));
    }

    const recommendations = [];

    // Priority 1: Recently Viewed
    const recentlyViewed = getRecentlyViewed();
    recentlyViewed.forEach((item) => {
      const id = String(item.id || item._id);
      if (!seenIds.has(id)) {
        const fullProd = allProducts.find((p) => String(p.id || p._id) === id);
        if (fullProd) {
          seenIds.add(id);
          recommendations.push(fullProd);
        }
      }
    });

    // Priority 2: Wishlist items
    allProducts.forEach((prod) => {
      const id = String(prod.id || prod._id);
      if (wishlist.includes(id) && !seenIds.has(id)) {
        seenIds.add(id);
        recommendations.push(prod);
      }
    });

    // Priority 3: Same Category items
    if (category) {
      allProducts.forEach((prod) => {
        const id = String(prod.id || prod._id);
        if (prod.category?.toLowerCase() === category.toLowerCase() && !seenIds.has(id)) {
          seenIds.add(id);
          recommendations.push(prod);
        }
      });
    }

    // Priority 4: Featured catalog fallback
    allProducts.forEach((prod) => {
      const id = String(prod.id || prod._id);
      if (!seenIds.has(id)) {
        seenIds.add(id);
        recommendations.push(prod);
      }
    });

    return recommendations.slice(0, 4);
  }, [allProducts, currentProductId, category, wishlist]);

  if (loading || recommendedItems.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-[#2A2A2A]">
      <div className="mb-6">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold block mb-1">
          PERSONALIZED SELECTION
        </span>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Recommended For You
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {recommendedItems.map((prod) => (
          <ProductCard key={prod.id || prod._id} product={prod} />
        ))}
      </div>
    </section>
  );
}
