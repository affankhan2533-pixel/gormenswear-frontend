"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Bell,
  ArrowLeft,
  Camera,
  Barcode,
  Fingerprint,
  RefreshCw,
  Zap,
  ShieldCheck,
  Search,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/context/ToastContext";

// Data Imports
import {
  INITIAL_MOBILE_METRICS,
  INITIAL_MOBILE_ORDERS,
  INITIAL_MOBILE_PRODUCTS,
  INITIAL_MOBILE_CUSTOMERS,
  INITIAL_MOBILE_NOTIFICATIONS,
  INITIAL_OFFLINE_SYNC_STATE,
} from "@/lib/mobileAdminData";

// Components Import
import MobileDashboardView from "@/components/mobileAdmin/MobileDashboardView";
import MobileQuickActionsGrid from "@/components/mobileAdmin/MobileQuickActionsGrid";
import MobileOrderView from "@/components/mobileAdmin/MobileOrderView";
import MobileProductView from "@/components/mobileAdmin/MobileProductView";
import MobileCustomerView from "@/components/mobileAdmin/MobileCustomerView";
import MobileNotificationsView from "@/components/mobileAdmin/MobileNotificationsView";
import MobileOfflineSyncBar from "@/components/mobileAdmin/MobileOfflineSyncBar";
import MobileHardwareDeviceModal from "@/components/mobileAdmin/MobileHardwareDeviceModal";

export default function EnterpriseMobileAdminPage() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, orders, products, customers, notifications

  // State Management
  const [metrics, setMetrics] = useState(INITIAL_MOBILE_METRICS);
  const [orders, setOrders] = useState(INITIAL_MOBILE_ORDERS);
  const [products, setProducts] = useState(INITIAL_MOBILE_PRODUCTS);
  const [customers, setCustomers] = useState(INITIAL_MOBILE_CUSTOMERS);
  const [notifications, setNotifications] = useState(INITIAL_MOBILE_NOTIFICATIONS);
  const [offlineState, setOfflineState] = useState(INITIAL_OFFLINE_SYNC_STATE);

  // Modals Visibility
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [hardwareFeature, setHardwareFeature] = useState("camera");

  const { success, info, error: toastError } = useToast();

  // ── HANDLERS: ORDERS ──
  const handleUpdateOrder = (updatedOrder) => {
    setOrders(orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    success("Order Updated", `Order #${updatedOrder.orderId} status set to ${updatedOrder.status}.`);
  };

  // ── HANDLERS: PRODUCTS ──
  const handleUpdateProduct = (updatedProd) => {
    setProducts(products.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    success("Product Updated", `${updatedProd.productName} parameters saved.`);
  };

  // ── HANDLERS: CUSTOMERS ──
  const handleSaveCustomerNote = (custId, newNotes) => {
    setCustomers(
      customers.map((c) => (c.id === custId ? { ...c, notes: newNotes } : c))
    );
    success("Customer Notes Saved", "VIP concierge notes updated.");
  };

  // ── HANDLERS: NOTIFICATIONS ──
  const handleMarkAllNotifsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setMetrics({ ...metrics, unreadNotifications: 0 });
    info("Notifications Cleared", "All mobile push alerts marked as read.");
  };

  // ── HANDLERS: OFFLINE SYNC ──
  const handleToggleOnlineMode = () => {
    const nextOnline = !offlineState.isOnline;
    setOfflineState({ ...offlineState, isOnline: nextOnline });
    info(
      "Network State Toggled",
      nextOnline ? "Mobile Admin Connected Online." : "Offline Mode Activated. Viewing cached data."
    );
  };

  const handleSyncPendingChanges = () => {
    setOfflineState({
      ...offlineState,
      pendingChangesCount: 0,
      lastSyncTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    success("Sync Completed", "All pending mobile changes synchronized with GOR cloud.");
  };

  // ── HANDLER: QUICK ACTION EXECUTION ──
  const handleExecuteQuickAction = (actionId) => {
    if (actionId === "add-prod" || actionId === "update-inv") {
      setActiveTab("products");
    } else if (actionId === "view-orders") {
      setActiveTab("orders");
    } else if (actionId === "manage-cust") {
      setActiveTab("customers");
    } else {
      success("Quick Action Executed", `Workflow trigger #${actionId} initiated.`);
    }
  };

  const handleOpenHardware = (feature) => {
    setHardwareFeature(feature);
    setIsHardwareModalOpen(true);
  };

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-28 select-none relative font-sans">
        <Container className="max-w-xl mx-auto px-4">

          {/* ── TOP MOBILE PLATFORM HEADER BAR ── */}
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] p-4 mb-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Link
                  href="/admin"
                  className="p-2 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-5 h-5 text-[#C8A45D]" />
                  <span className="font-editorial text-xl font-normal text-[#F8F6F3]">
                    Mobile Admin
                  </span>
                </div>
              </div>

              {/* Hardware Actions & Biometric Unlock */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenHardware("camera")}
                  className="p-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] rounded-[10px] border border-[#2A2A2A] transition-colors cursor-pointer"
                  title="Camera Scan"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenHardware("barcode")}
                  className="p-2 bg-[#090909] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] rounded-[10px] border border-[#2A2A2A] transition-colors cursor-pointer"
                  title="Barcode Scanner"
                >
                  <Barcode className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenHardware("biometrics")}
                  className="p-2 bg-[#090909] hover:bg-blue-600 text-blue-400 rounded-[10px] border border-[#2A2A2A] transition-colors cursor-pointer"
                  title="Biometric Face ID"
                >
                  <Fingerprint className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Offline Sync Status Bar */}
            <MobileOfflineSyncBar
              offlineState={offlineState}
              onToggleOnlineMode={handleToggleOnlineMode}
              onSyncPendingChanges={handleSyncPendingChanges}
            />
          </div>

          {/* ── MAIN TAB VIEW CONTENT ── */}
          {activeTab === "dashboard" && (
            <MobileDashboardView
              metrics={metrics}
              onOpenQuickActions={() => setIsQuickActionsOpen(true)}
              onOpenOrders={() => setActiveTab("orders")}
              onOpenLowStock={() => setActiveTab("products")}
            />
          )}

          {activeTab === "orders" && (
            <MobileOrderView
              orders={orders}
              onUpdateOrder={handleUpdateOrder}
            />
          )}

          {activeTab === "products" && (
            <MobileProductView
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onOpenHardwareModal={handleOpenHardware}
            />
          )}

          {activeTab === "customers" && (
            <MobileCustomerView
              customers={customers}
              onSaveCustomerNote={handleSaveCustomerNote}
            />
          )}

          {activeTab === "notifications" && (
            <MobileNotificationsView
              notifications={notifications}
              onMarkAllRead={handleMarkAllNotifsRead}
            />
          )}

        </Container>
      </main>

      {/* ── FIXED TOUCH-FRIENDLY BOTTOM NAVIGATION BAR (Min 48px touch targets) ── */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#151515]/95 backdrop-blur-xl border-t border-[#2A2A2A] py-2 px-4 shadow-2xl"
      >
        <div className="max-w-md mx-auto flex items-center justify-around">
          {[
            { id: "dashboard", label: "Overview", icon: LayoutDashboard },
            { id: "orders", label: "Orders", icon: ShoppingBag, badge: metrics.pendingOrders },
            { id: "products", label: "Products", icon: Package },
            { id: "customers", label: "Customers", icon: Users },
            { id: "notifications", label: "Alerts", icon: Bell, badge: metrics.unreadNotifications },
          ].map((navItem) => {
            const IconComponent = navItem.icon;
            const isActive = activeTab === navItem.id;
            return (
              <button
                key={navItem.id}
                type="button"
                onClick={() => setActiveTab(navItem.id)}
                className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 rounded-xl transition-all cursor-pointer ${
                  isActive ? "text-[#C8A45D]" : "text-[#8E8A85] hover:text-[#F8F6F3]"
                }`}
              >
                <div className="relative">
                  <IconComponent className={`w-5 h-5 ${isActive ? "stroke-[2.2]" : "stroke-[1.5]"}`} />
                  {navItem.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-[#C8A45D] text-[#090909] text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                      {navItem.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-bold ${isActive ? "text-[#C8A45D]" : "text-[#8E8A85]"}`}>
                  {navItem.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── MODALS ── */}
      <MobileQuickActionsGrid
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onExecuteAction={handleExecuteQuickAction}
      />

      <MobileHardwareDeviceModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        initialFeature={hardwareFeature}
      />

      <Footer />
    </>
  );
}
