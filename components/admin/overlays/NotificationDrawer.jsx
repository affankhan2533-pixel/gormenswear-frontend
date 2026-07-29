"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Bell, AlertTriangle, ShoppingBag, ShieldCheck } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

export default function NotificationDrawer() {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
  } = useAdmin();

  const [activeFilter, setActiveFilter] = useState("all"); // all vs unread

  if (!isNotificationDrawerOpen) return null;

  const filteredNotifs = notifications.filter((n) =>
    activeFilter === "unread" ? !n.read : true
  );

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-drawer-title"
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-[#121212] border-l border-[#2A2A2A] w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="space-y-4 border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#C8A45D]" />
                <h2 id="notification-drawer-title" className="font-editorial text-2xl font-normal">
                  Notifications Center
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-1.5 bg-[#090909] border border-[#2A2A2A] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs & Mark All Read */}
            <div className="flex items-center justify-between text-xs pt-2">
              <div className="flex items-center gap-1.5 bg-[#090909] p-1 rounded-[10px] border border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1 rounded-[6px] text-[11px] font-bold uppercase transition-colors ${
                    activeFilter === "all" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("unread")}
                  className={`px-3 py-1 rounded-[6px] text-[11px] font-bold uppercase transition-colors ${
                    activeFilter === "unread" ? "bg-[#C8A45D] text-[#090909]" : "text-[#8E8A85]"
                  }`}
                >
                  Unread
                </button>
              </div>

              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="text-[11px] font-bold text-[#C8A45D] hover:underline cursor-pointer"
              >
                Mark All as Read
              </button>
            </div>
          </div>

          {/* Timeline Grouped List */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-none">
            {filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 rounded-[16px] border transition-colors cursor-pointer space-y-1 ${
                  !n.read
                    ? "bg-[#090909] border-[#C8A45D]/40 shadow-lg"
                    : "bg-[#090909]/40 border-[#2A2A2A] opacity-75"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] font-bold text-[#C8A45D] uppercase">
                    {n.category} • {n.time}
                  </span>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </div>
                <h4 className="font-bold text-sm text-[#F8F6F3]">{n.title}</h4>
                <p className="text-xs text-[#8E8A85] leading-relaxed">{n.text}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#2A2A2A] text-center">
            <span className="text-[10px] text-[#8E8A85] font-mono">
              GOR Menswear Enterprise Admin v4.0 • All activity logged
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
