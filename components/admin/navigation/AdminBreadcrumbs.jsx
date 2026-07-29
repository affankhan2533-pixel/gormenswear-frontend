"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#8E8A85] font-sans">
      <Link href="/admin" className="hover:text-[#F8F6F3] transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span>Admin</span>
      </Link>

      {pathSegments.slice(1).map((segment, idx) => {
        const url = `/admin/${pathSegments.slice(1, idx + 2).join("/")}`;
        const isLast = idx === pathSegments.length - 2;

        return (
          <div key={url} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-[#2A2A2A]" />
            {isLast ? (
              <span className="font-semibold text-[#C8A45D] uppercase tracking-wider text-[11px]">
                {segment.replace("-", " ")}
              </span>
            ) : (
              <Link href={url} className="hover:text-[#F8F6F3] capitalize transition-colors">
                {segment.replace("-", " ")}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
