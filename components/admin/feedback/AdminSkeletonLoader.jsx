"use client";

export default function AdminSkeletonLoader({ count = 3, className = "h-24" }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-[#141414] border border-[#222222] rounded-[18px] animate-pulse ${className}`}
        />
      ))}
    </div>
  );
}
