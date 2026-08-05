"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Check, ShoppingBag, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { productService } from "@/lib/productService";

export default function OutfitBuilder({ currentProduct }) {
  const { addToCart } = useCart();
  const [addedAllSuccess, setAddedAllSuccess] = useState(false);
  const [bundleProducts, setBundleProducts] = useState([]);

  useEffect(() => {
    async function fetchBundleProducts() {
      if (!currentProduct) return;
      try {
        const allProds = await productService.getProducts();
        if (Array.isArray(allProds) && allProds.length > 0) {
          const mainId = currentProduct.id || currentProduct._id || currentProduct.slug;
          const others = allProds.filter(
            (p) => (p.id || p._id || p.slug) !== mainId
          );

          // Select 2 complementary items from different categories if possible
          const item2 = others.find((p) => p.category !== currentProduct.category) || others[0];
          const item3 = others.find((p) => p !== item2 && p.category !== currentProduct.category) || others[1] || others[0];

          if (item2 && item3) {
            setBundleProducts([currentProduct, item2, item3]);
          } else {
            setBundleProducts([currentProduct, ...others.slice(0, 2)]);
          }
        }
      } catch (e) {
        console.warn("Bundle products fetch warning:", e);
      }
    }

    fetchBundleProducts();
  }, [currentProduct]);

  if (!currentProduct || bundleProducts.length < 2) return null;

  const bundleTotal = bundleProducts.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  const handleAddBundleToBag = () => {
    bundleProducts.forEach((item) => {
      addToCart(
        item,
        Array.isArray(item.sizes) ? item.sizes[0] : "M",
        Array.isArray(item.colors) ? item.colors[0] : { name: "Onyx Black", hex: "#111111" },
        1
      );
    });
    setAddedAllSuccess(true);
    setTimeout(() => setAddedAllSuccess(false), 2500);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#111111] border-t border-b border-[#2A2A2A] select-none">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C9A86A] font-bold block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> CURATED OUTFIT LOOKBOOK
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F7F5F2]">
              Complete The Look
            </h2>
          </div>
          <p className="text-xs text-[#B8B6B0] font-light max-w-md">
            Styled by GOR Atelier fashion directors for effortless silhouette coordination.
          </p>
        </div>

        {/* Outfit Builder Grid Card */}
        <div className="bg-[#0B0B0B] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          
          {/* Thumbnails list */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {bundleProducts.map((item, idx) => {
              const itemImg = item.imageUrl || item.image || (Array.isArray(item.images) && item.images[0]) || "/images/lookbook/gor-lookbook-1.webp";
              return (
                <div
                  key={(item.id || item._id || idx) + idx}
                  className="bg-[#15181D] border border-[#2A2A2A] rounded-xl p-4 flex flex-col justify-between hover:border-[#C9A86A]/50 transition-colors"
                >
                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border border-[#2A2A2A] mb-3">
                    <Image
                      src={itemImg}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover object-top"
                    />
                    <span className="absolute top-2 left-2 bg-[#0B0B0B]/85 text-[#C9A86A] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#2A2A2A]">
                      Item {idx + 1}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#B8B6B0] font-semibold block truncate">
                      {idx === 0 ? "Main Garment" : item.category || "Atelier Accent"}
                    </span>
                    <h4 className="font-serif text-sm font-normal text-[#F7F5F2] line-clamp-1">
                      {item.name}
                    </h4>
                    <div className="flex justify-between items-center pt-1 font-sans text-xs">
                      <span className="font-bold text-[#F7F5F2]">{formatPrice(item.price)}</span>
                      <span className="text-[10px] text-[#B8B6B0] bg-[#0B0B0B] px-2 py-0.5 rounded border border-[#2A2A2A]">
                        {Array.isArray(item.sizes) ? item.sizes[0] : "M"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bundle Total & Single CTA Box */}
          <div className="lg:col-span-4 bg-[#15181D] border border-[#2A2A2A] rounded-xl p-6 flex flex-col justify-center space-y-5 text-center lg:text-left">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-bold block mb-1">
                COMPLETE LOOK BUNDLE
              </span>
              <h3 className="font-serif text-2xl text-[#F7F5F2]">3-Piece Coordinated Outfit</h3>
              <p className="text-xs text-[#B8B6B0] mt-1 font-light">
                Includes Main Garment and 2 hand-selected styling pieces.
              </p>
            </div>

            <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
              <span className="text-xs text-[#B8B6B0] font-semibold uppercase tracking-wider">
                Total Outfit Value
              </span>
              <span className="font-serif text-2xl font-bold text-[#F7F5F2]">
                {formatPrice(bundleTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddBundleToBag}
              className="w-full py-4 bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {addedAllSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Complete Look Added to Bag!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add Complete Look to Bag — {formatPrice(bundleTotal)}
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
