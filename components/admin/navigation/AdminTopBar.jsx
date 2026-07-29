"use client";

import { useState } from "react";
import { Search, Plus, Bell, Sparkles, Building2, ChevronDown, Menu } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import AdminBreadcrumbs from "./AdminBreadcrumbs";

export default function AdminTopBar({ onOpenMobileMenu }) {
  const {
    activeWorkspace,
    setWorkspace,
    setIsCommandPaletteOpen,
    setIsNotificationDrawerOpen,
    setIsQuickCreateOpen,
    unreadCount,
  } = useAdmin();

  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  const workspaces = [
    "GOR London Mayfair (Primary)",
    "GOR Tokyo Ginza Flagship",
    "GOR NYC Fifth Ave Store",
  ];

  return (
    <header className="h-14 sm:h-16 bg-[#0D0D0D] border-b border-[#222222] px-2.5 sm:px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Mobile Hamburger Toggle + Workspace Switcher + Breadcrumbs */}
      <div className="flex items-center gap-1.5 sm:gap-3.5 min-w-0">
        {/* Mobile Hamburger Toggle (< 1024px) */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 sm:p-2 rounded-[9px] bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-[#F8F6F3] transition-colors cursor-pointer shrink-0"
          title="Open Menu"
        >
          <Menu className="w-4 h-4 text-[#C8A45D]" />
        </button>

        {/* Workspace Switcher */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded-[9px] text-xs font-semibold text-[#F8F6F3] transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#C8A45D] shrink-0" />
            <span className="max-w-[85px] xs:max-w-[125px] sm:max-w-[170px] truncate text-[11px] sm:text-xs">
              {activeWorkspace}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E8A85] shrink-0" />
          </button>

          {isWorkspaceDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 sm:w-60 bg-[#151515] border border-[#2A2A2A] rounded-[14px] shadow-2xl p-1.5 z-50 space-y-1 text-xs">
              <span className="text-[10px] font-mono text-[#8E8A85] px-2 py-1 block uppercase">Switch Workspace</span>
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  type="button"
                  onClick={() => {
                    setWorkspace(ws);
                    setIsWorkspaceDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-[8px] transition-colors ${
                    activeWorkspace === ws
                      ? "bg-[#C8A45D] text-[#090909] font-bold"
                      : "text-[#F8F6F3] hover:bg-[#2A2A2A]"
                  }`}
                >
                  {ws}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:block h-4 w-px bg-[#222222]" />

        {/* Breadcrumb Navigation */}
        <div className="hidden sm:block min-w-0">
          <AdminBreadcrumbs />
        </div>
      </div>

      {/* Right: Search (Ctrl+K), Quick Create (+), Notifications, AI Status */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Universal Search (Ctrl+K) */}
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1.5 bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded-[9px] text-xs text-[#8E8A85] transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#8E8A85]" />
          <span className="hidden md:inline">Search & Actions...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-[#090909] text-[10px] font-mono text-[#C8A45D] border border-[#2A2A2A] rounded font-bold">
            Ctrl K
          </kbd>
        </button>

        {/* Global Quick Create (+) */}
        <button
          type="button"
          onClick={() => setIsQuickCreateOpen(true)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-bold flex items-center justify-center transition-colors shadow-md cursor-pointer shrink-0"
          title="Quick Create Resource (+)"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Notification Bell Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative p-1.5 sm:p-2 rounded-[9px] bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer shrink-0"
          title="Notification Center"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[#F8F6F3] text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* AI Co-Pilot Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-purple-950/40 border border-purple-500/30 rounded-[8px] text-[11px] text-purple-300 font-bold shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Active</span>
        </div>
      </div>
    </header>
  );
}
