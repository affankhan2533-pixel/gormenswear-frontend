"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Users,
  Bell,
  Plus,
  Package,
  Layers,
  Tag,
  Zap,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function MobileDashboardView({
  metrics,
  onOpenQuickActions,
  onOpenOrders,
  onOpenLowStock,
}) {
  return (
    <div className="space-y-5 pb-6">
      {/* Top Welcome Card */}
      <div className="p-5 bg-[#151515] border border-[#2A2A2A] rounded-[22px] shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8A45D] font-bold block mb-1">
            MOBILE COMMAND CENTER
          </span>
          <h2 className="font-editorial text-2xl text-[#F8F6F3]">
            GOR Executive Control
          </h2>
          <p className="text-xs text-[#8E8A85] mt-0.5">
            Real-time smartphone & tablet operations.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenQuickActions}
          className="w-11 h-11 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
          title="Quick Actions"
        >
          <Zap className="w-5 h-5 fill-[#090909]" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-md">
          <div className="flex justify-between items-center text-[#8E8A85]">
            <DollarSign className="w-4 h-4 text-[#C8A45D]" />
            <span className="text-[10px] font-bold text-emerald-400">TODAY</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#8E8A85] block">
            Revenue Today
          </span>
          <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
            {metrics.revenueToday}
          </span>
        </div>

        <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[18px] space-y-1 shadow-md">
          <div className="flex justify-between items-center text-[#8E8A85]">
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400">ORDERS</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#8E8A85] block">
            Orders Today
          </span>
          <span className="font-editorial text-2xl font-bold text-[#F8F6F3] block">
            {metrics.ordersToday}
          </span>
        </div>

        <div
          onClick={onOpenOrders}
          className="p-4 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[18px] space-y-1 shadow-md cursor-pointer transition-colors"
        >
          <div className="flex justify-between items-center text-[#8E8A85]">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-bold text-purple-400">ACTION</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#8E8A85] block">
            Pending Orders
          </span>
          <span className="font-editorial text-2xl font-bold text-purple-400 block">
            {metrics.pendingOrders}
          </span>
        </div>

        <div
          onClick={onOpenLowStock}
          className="p-4 bg-[#151515] border border-[#2A2A2A] hover:border-amber-500/40 rounded-[18px] space-y-1 shadow-md cursor-pointer transition-colors"
        >
          <div className="flex justify-between items-center text-[#8E8A85]">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400">ALERT</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#8E8A85] block">
            Low Stock Items
          </span>
          <span className="font-editorial text-2xl font-bold text-amber-400 block">
            {metrics.lowStockAlerts}
          </span>
        </div>
      </div>

      {/* Quick Launch Action Launcher */}
      <div className="p-4 bg-[#151515] border border-[#2A2A2A] rounded-[20px] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C8A45D]">
            Mobile Quick Workflows
          </span>
          <button
            type="button"
            onClick={onOpenQuickActions}
            className="text-[11px] text-[#C8A45D] font-bold hover:underline flex items-center gap-1"
          >
            All Actions <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onOpenQuickActions}
            className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[14px] text-center space-y-1.5 hover:border-[#C8A45D] transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5 text-[#C8A45D] mx-auto" />
            <span className="text-[11px] font-bold text-[#F8F6F3] block">Add Product</span>
          </button>

          <button
            type="button"
            onClick={onOpenLowStock}
            className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[14px] text-center space-y-1.5 hover:border-[#C8A45D] transition-colors cursor-pointer"
          >
            <Package className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="text-[11px] font-bold text-[#F8F6F3] block">Update Stock</span>
          </button>

          <button
            type="button"
            onClick={onOpenOrders}
            className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[14px] text-center space-y-1.5 hover:border-[#C8A45D] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-blue-400 mx-auto" />
            <span className="text-[11px] font-bold text-[#F8F6F3] block">View Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
}
