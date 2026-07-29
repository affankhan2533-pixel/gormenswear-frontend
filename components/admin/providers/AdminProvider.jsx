"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  // Sidebar mode: 'expanded' | 'compact' | 'overlay' | 'hidden'
  const [sidebarMode, setSidebarMode] = useState("expanded");

  // Active Workspace: GOR London, Tokyo, NYC
  const [activeWorkspace, setActiveWorkspace] = useState("GOR London Mayfair (Primary)");

  // Modals Visibility
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  // Command Palette History & Recent Navigation
  const [recentNav, setRecentNav] = useState([
    { title: "Products Catalog", href: "/products" },
    { title: "Orders Management", href: "/orders" },
    { title: "AI Operations", href: "/admin/ai-ops" },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: "notif-01",
      title: "VIP Order #ORD-8801 Placed",
      time: "10m ago",
      timeline: "Today",
      category: "Sales",
      read: false,
      text: "Lord Julian Sterling purchased Biella Shearling Jacket ($2,450.00).",
    },
    {
      id: "notif-02",
      title: "Low Stock Alert: Suede Outerwear",
      time: "1h ago",
      timeline: "Today",
      category: "Inventory",
      read: false,
      text: "Biella Shearling Suede Jacket inventory below reorder threshold (3 units remaining).",
    },
    {
      id: "notif-03",
      title: "DevOps Dynamics 365 Sync Restored",
      time: "Yesterday",
      timeline: "Yesterday",
      category: "DevOps",
      read: true,
      text: "ERP connector synchronization latency normalized to 14ms.",
    },
  ]);

  // Load preferences from LocalStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("gor_admin_sidebar_mode");
      if (savedMode) setSidebarMode(savedMode);

      const savedWs = localStorage.getItem("gor_admin_workspace");
      if (savedWs) setActiveWorkspace(savedWs);
    } catch (e) {
      console.warn("LocalStorage access failed:", e);
    }
  }, []);

  // Save preferences to LocalStorage
  const handleSetSidebarMode = (mode) => {
    setSidebarMode(mode);
    try {
      localStorage.setItem("gor_admin_sidebar_mode", mode);
    } catch (e) {}
  };

  const handleSetWorkspace = (ws) => {
    setActiveWorkspace(ws);
    try {
      localStorage.setItem("gor_admin_workspace", ws);
    } catch (e) {}
  };

  // Keyboard Shortcuts (Ctrl+K, Ctrl+/, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setSidebarMode((prev) => (prev === "expanded" ? "compact" : "expanded"));
      } else if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
        setIsNotificationDrawerOpen(false);
        setIsQuickCreateOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Notification Actions
  const markAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    sidebarMode,
    setSidebarMode: handleSetSidebarMode,
    activeWorkspace,
    setWorkspace: handleSetWorkspace,

    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    isQuickCreateOpen,
    setIsQuickCreateOpen,

    recentNav,
    setRecentNav,

    notifications,
    unreadCount,
    markAllNotificationsRead,
    markNotificationRead,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}
