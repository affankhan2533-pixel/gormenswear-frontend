"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

function RecommendationCardComponent({ product, className = "" }) {
  if (!product) return null;

  const img = product.image || product.images?.[0] || product.img1 || "/images/products/gor-codset-burgundy-alo.webp";
  const pId = product.slug || product.id || product._id;

  return (
    <div
      className={`group flex flex-col bg-[#14171C] border border-[#C9A86A]/15 hover:border-[#C9A86A]/40 rounded-[14px] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 shadow-md hover:shadow-xl relative ${className}`}
    >
      {/* Product Image Stage */}
      <Link href={`/product/${pId}`} className="relative aspect-[4/5] w-full overflow-hidden bg-[#14171C] block shrink-0">
        <Image
          src={img}
          alt={product.name || "GOR Menswear Garment"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-top filter brightness-[0.96] group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#14171C]/90 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300" />

        {product.badge && (
          <span className="absolute top-2 left-2 font-sans text-[8.5px] uppercase tracking-[0.18em] bg-[#0E1013]/90 text-[#C9A86A] px-2 py-0.5 border border-[#C9A86A]/30 font-semibold rounded-[3px]">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-3 flex flex-col justify-between flex-1 bg-[#14171C]">
        <div>
          <span className="font-sans text-[9.5px] uppercase tracking-[0.18em] text-[#C9A86A] font-semibold block mb-0.5 truncate">
            {product.category || "RECOMMENDED"}
          </span>

          <Link href={`/product/${pId}`}>
            <h4 className="font-editorial text-xs sm:text-sm font-normal text-[#F7F5F2] group-hover:text-[#C9A86A] transition-colors line-clamp-1 leading-snug mb-1">
              {product.name}
            </h4>
          </Link>

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-sans text-xs sm:text-sm font-bold text-[#F7F5F2] price-display tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-[10px] text-[#B8B6B0]/60 line-through price-display tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* View Garment CTA */}
        <Link
          href={`/product/${pId}`}
          className="mt-2.5 pt-2 border-t border-[#C9A86A]/15 w-full h-[36px] rounded-[10px] bg-[#0E1013] hover:bg-[#C9A86A] text-[#C9A86A] hover:text-[#0E1013] border border-[#C9A86A]/30 font-sans text-[10px] uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer shrink-0"
        >
          <span>View Piece</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

const RecommendationCard = memo(RecommendationCardComponent);
export default RecommendationCard;
