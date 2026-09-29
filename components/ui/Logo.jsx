"use client";

import Link from "next/link";

export default function Logo({ size = "md", invert = false, className = "" }) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const textColor = invert ? "text-[#F5F2EC]" : "text-[#111111]";
  const subColor = invert ? "text-[#D8D2C8]/70" : "text-[#716D66]";

  return (
    <Link href="/" className={`inline-flex flex-col items-start group select-none ${className}`}>
      <div className={`font-serif tracking-tight font-black leading-none ${textColor} ${
        isSm ? "text-2xl" : isLg ? "text-4xl sm:text-5xl" : "text-3xl"
      }`}>
        <span>GOR</span>
      </div>

      <div className={`flex items-center gap-1.5 ${subColor} ${isSm ? "mt-0.5" : "mt-1"}`}>
        <span
          className={`font-sans tracking-[0.35em] uppercase font-medium ${
            isSm ? "text-[7px]" : isLg ? "text-[10px]" : "text-[8.5px]"
          }`}
        >
          MENSWEAR
        </span>
      </div>
    </Link>
  );
}
