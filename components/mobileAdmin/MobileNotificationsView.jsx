"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, ShoppingBag, AlertTriangle, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function MobileNotificationsView({ notifications, onMarkAllRead }) {
  const [filterType, setFilterType] = useState("all");

  const filteredNotifications = notifications.filter(
    (n) => filterType === "all" || n.type === filterType
  );

  const getNotifIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-4 h-4 text-blue-400" />;
      case "stock":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "customer":
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case "system":
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-[#C8A45D]" />;
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Filter Tabs Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-editorial text-2xl text-[#F8F6F3]">
          Mobile Notification Push Feed
        </h3>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-xs text-[#C8A45D] font-bold hover:underline"
        >
          Mark All Read
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: "All Feed" },
          { id: "order", label: "Orders" },
          { id: "stock", label: "Low Stock" },
          { id: "customer", label: "Customer" },
          { id: "system", label: "System" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilterType(t.id)}
            className={`px-3 py-1.5 rounded-[8px] text-[11px] font-bold uppercase transition-colors shrink-0 ${
              filterType === t.id
                ? "bg-[#C8A45D] text-[#090909]"
                : "bg-[#151515] text-[#8E8A85] border border-[#2A2A2A]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 bg-[#151515] border rounded-[18px] space-y-1 shadow-md transition-all ${
              notif.read ? "border-[#2A2A2A] opacity-70" : "border-[#C8A45D]/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#090909] border border-[#2A2A2A] rounded-lg">
                  {getNotifIcon(notif.type)}
                </div>
                <h4 className="font-bold text-xs text-[#F8F6F3]">{notif.title}</h4>
              </div>
              <span className="text-[10px] font-mono text-[#8E8A85]">{notif.time}</span>
            </div>
            <p className="text-xs text-[#8E8A85] pl-8">{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
