"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  Archive,
  ShoppingBag,
  Users,
  Ticket,
  Globe,
  Image as ImageIcon,
  FileText,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Code,
} from "lucide-react";

const NAV = [
  {
    group: "Main",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    group: "Products",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Collections", href: "/admin/collections", icon: Layers },
      { label: "Categories", href: "/admin/categories", icon: Tag },
      { label: "Inventory", href: "/admin/inventory", icon: Archive },
    ],
  },
  {
    group: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Coupons", href: "/admin/coupons", icon: Ticket },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Website", href: "/admin/website", icon: Globe },
      { label: "CMS Pages", href: "/admin/cms", icon: FileText },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    group: "Insights",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Audit Logs", href: "/admin/audit", icon: ShieldCheck },
    ],
  },
  {
    group: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Roles & Access", href: "/admin/rbac", icon: Users },
    ],
  },
];

export default function AdminSidebar({ isCompact, onToggle, onNavItemClick, isMobile = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (onNavItemClick) onNavItemClick();
    await logout();
    router.push("/login");
  };

  const handleLinkClick = () => {
    if (onNavItemClick) {
      onNavItemClick();
    }
  };

  return (
    <aside
      className={`bg-[#0D0D0D] border-r border-[#1E1E1E] flex flex-col shrink-0 transition-all duration-300 h-full ${
        isMobile ? "w-full" : isCompact ? "w-[60px]" : "w-[220px]"
      }`}
    >
      {/* Brand & Header */}
      <div
        className={`h-14 flex items-center border-b border-[#1E1E1E] px-4 ${
          isCompact && !isMobile ? "justify-center" : "justify-between"
        }`}
      >
        {(!isCompact || isMobile) && (
          <Link href="/admin" onClick={handleLinkClick} className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-wider text-[#F8F6F3]">GOR</span>
            <span className="text-[10px] font-mono uppercase bg-[#C8A45D]/15 text-[#C8A45D] border border-[#C8A45D]/30 px-1.5 py-0.5 rounded font-bold">
              V4
            </span>
          </Link>
        )}
        {isCompact && !isMobile && (
          <span className="font-extrabold text-xs tracking-wider text-[#C8A45D]">G</span>
        )}

        {!isMobile && (
          <button
            type="button"
            onClick={onToggle}
            className="p-1 rounded bg-[#161616] text-[#888] hover:text-[#E8E4DF] border border-[#222]"
            title={isCompact ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCompact ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-none">
        {NAV.map((group) => (
          <div key={group.group}>
            {(!isCompact || isMobile) && (
              <div className="px-3 text-[9px] font-bold uppercase tracking-wider text-[#555] mb-1">
                {group.group}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-[#C8A45D] text-[#0D0D0D] font-bold"
                        : "text-[#999] hover:bg-[#161616] hover:text-[#E8E4DF]"
                    } ${isCompact && !isMobile ? "justify-center px-0" : ""}`}
                    title={isCompact ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {(!isCompact || isMobile) && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer Bar */}
      <div className="p-3 border-t border-[#1E1E1E] bg-[#0A0A0A]">
        <div className="flex items-center justify-between">
          {(!isCompact || isMobile) && (
            <div className="min-w-0 pr-2">
              <div className="text-xs font-bold text-[#E8E4DF] truncate">{user?.name || "Super Admin"}</div>
              <div className="text-[10px] text-[#666] truncate">{user?.role || "Store Owner"}</div>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded text-[#777] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
