"use client";

import Link from "next/link";

export default function PlpHero({
  title = "THE GOR COLLECTION",
  subtitle = "Everyday silhouettes, considered proportions, and signature menswear tailoring.",
  categoryKey = "all",
  productCount = 0,
  silhouetteIndex = "01 / COLLECTION",
  breadcrumbs = [],
}) {
  return (
    <section className="w-full bg-[#F5F2EC] border-b border-[#D8D2C8] pt-28 sm:pt-36 pb-10 sm:pb-14 select-none">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Subtle Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#716D66] flex items-center gap-2 mb-6">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            HOME
          </Link>
          <span>/</span>
          {breadcrumbs.length > 0 ? (
            breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[#111111] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#111111]">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))
          ) : (
            <span className="text-[#111111]">{title}</span>
          )}
        </nav>

        {/* Editorial Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#716D66] block">
              {silhouetteIndex}
            </span>

            <h1 className="font-editorial text-4xl sm:text-6xl text-[#111111] font-normal tracking-tight uppercase leading-[1.05]">
              {title}
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#716D66] font-light leading-relaxed max-w-lg">
              {subtitle}
            </p>
          </div>

          {productCount > 0 && (
            <div className="font-sans text-xs uppercase tracking-[0.2em] text-[#716D66] self-start md:self-end pb-1">
              <span>{productCount} {productCount === 1 ? "PIECE" : "PIECES"} IN ARCHIVE</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
