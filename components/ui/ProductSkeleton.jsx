"use client";

export default function ProductSkeleton({ count = 4 }) {
  return (
    <>
      {[...Array(count)].map((_, idx) => (
        <div key={idx} className="flex flex-col select-none">
          {/* 3:4 Aspect Ratio Neutral Placeholder Image */}
          <div className="aspect-[3/4] w-full bg-[#E9E5DD] relative mb-3 border border-[#D8D2C8]/50" />

          {/* Details Skeleton */}
          <div className="space-y-2">
            <div className="w-16 h-2 bg-[#D8D2C8]/60" />
            <div className="w-3/4 h-3.5 bg-[#D8D2C8]/80" />
            <div className="w-12 h-3 bg-[#D8D2C8]/60" />
          </div>
        </div>
      ))}
    </>
  );
}
