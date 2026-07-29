"use client";

export default function ProductSkeleton({ count = 4 }) {
  return (
    <>
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col bg-gor-card border border-gor-gold/15 overflow-hidden shadow-md"
        >
          {/* 4:5 Aspect Ratio Image Skeleton */}
          <div className="aspect-[4/5] w-full animate-shimmer relative">
            <div className="absolute top-3 left-3 w-16 h-4 bg-gor-black/40 rounded-none border border-gor-gold/10" />
          </div>

          {/* Details Skeleton */}
          <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-gor-card space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="w-16 h-2.5 bg-gor-gold/20 animate-shimmer rounded-none" />
                <div className="w-8 h-2.5 bg-gor-gold/20 animate-shimmer rounded-none" />
              </div>
              <div className="w-4/5 h-4 bg-gor-offwhite/15 animate-shimmer rounded-none" />
            </div>

            <div className="pt-3 border-t border-gor-gold/10 flex justify-between items-center">
              <div className="w-20 h-4 bg-gor-gold/30 animate-shimmer rounded-none" />
              <div className="w-12 h-2.5 bg-gor-grey/20 animate-shimmer rounded-none" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
