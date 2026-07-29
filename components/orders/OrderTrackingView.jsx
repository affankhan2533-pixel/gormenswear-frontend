"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  RotateCcw,
  ShoppingBag,
  Download,
  MessageSquare,
  X,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Printer,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

const STAGES = [
  { id: "placed", title: "Order Placed", desc: "Order received in system", icon: ShoppingBag },
  { id: "confirmed", title: "Confirmed", desc: "Payment verified", icon: CheckCircle2 },
  { id: "packed", title: "Packed", desc: "Packaged & sealed", icon: Package },
  { id: "shipped", title: "Shipped", desc: "Dispatched to air hub", icon: Truck },
  { id: "out_for_delivery", title: "Out for Delivery", desc: "On courier vehicle", icon: MapPin },
  { id: "delivered", title: "Delivered", desc: "Delivered to address", icon: CheckCircle2 },
];

const SAMPLE_TRACKING_DATA = {
  orderId: "GOR-892401",
  date: "July 24, 2026",
  currentStageIndex: 3, // Shipped stage
  eta: "July 28, 2026",
  courier: "FedEx Express Priority",
  trackingCode: "FEDEX-892401-US",
  shippingAddress: {
    name: "Alexander Vance",
    street: "742 Evergreen Terrace, Suite 4B",
    city: "New York",
    state: "NY",
    pincode: "10001",
    country: "United States",
  },
  paymentMethod: "Credit Card (Visa ending in 4242)",
  items: [
    {
      id: "gor-codset-1",
      name: "GOR Alo Burgundy Heavyweight Co-Ord Set",
      size: "L",
      color: "Burgundy",
      qty: 1,
      price: 380,
      image: "/images/products/gor-codset-burgundy-alo.webp",
    },
    {
      id: "gor-codset-2",
      name: "Prada Desert Sand Textured Zip Set",
      size: "M",
      color: "Desert Sand",
      qty: 1,
      price: 520,
      image: "/images/products/gor-codset-beige-prada.webp",
    },
  ],
  subtotal: 900,
  shippingFee: 0, // Complimentary
  tax: 0,
  total: 900,
};

export default function OrderTrackingView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [trackingData, setTrackingData] = useState(SAMPLE_TRACKING_DATA);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [returnReason, setReturnReason] = useState("size_issue");
  const [cancelReason, setCancelReason] = useState("changed_mind");

  const { addToCart, setIsCartOpen } = useCart();
  const { success, error } = useToast();

  // Search lookup handler - supports real MongoDB lookup
  const handleLookupOrder = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      error("Search Empty", "Please enter an order ID to track.");
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/orders/${encodeURIComponent(query)}`);
      const json = await res.json();

      if (json.success && json.order) {
        const o = json.order;
        const stageIndex =
          o.status === "Pending" ? 0 :
          o.status === "Confirmed" ? 1 :
          o.status === "Packed" || o.status === "Processing" ? 2 :
          o.status === "Shipped" ? 3 :
          o.status === "Out for Delivery" ? 4 :
          o.status === "Delivered" || o.status === "Fulfilled" ? 5 : 1;

        const formattedOrder = {
          orderId: o.orderNo || o.id,
          date: new Date(o.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          currentStageIndex: stageIndex,
          eta: new Date(new Date(o.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          courier: "FedEx Express Priority",
          trackingCode: `TRACK-${o.orderNo || o.id}`,
          shippingAddress: {
            name: o.customerName,
            street: o.shippingAddress?.address || "",
            city: o.shippingAddress?.city || "",
            state: o.shippingAddress?.state || "",
            pincode: o.shippingAddress?.zip || "",
            country: o.shippingAddress?.country || "United Kingdom",
          },
          paymentMethod: o.paymentMethod || "Cash on Delivery",
          items: (o.items || []).map((item) => ({
            id: item.productId || item._id,
            name: item.name,
            size: "Standard",
            color: "Luxury",
            qty: item.quantity,
            price: item.price,
            image: item.image || "/images/lookbook/gor-lookbook-1.webp",
          })),
          subtotal: o.subtotal,
          shippingFee: o.shippingFee || 0,
          tax: o.tax || 0,
          total: o.totalAmount,
        };

        setTrackingData(formattedOrder);
        success("Order Found", `Displaying tracking details for ${o.orderNo}.`);
      } else if (query.toUpperCase() === "GOR-892401") {
        setTrackingData(SAMPLE_TRACKING_DATA);
        success("Order Found", "Displaying sample tracking details for GOR-892401.");
      } else {
        error("Order Not Found", `No active order found matching "${query}".`);
      }
    } catch (err) {
      if (query.toUpperCase() === "GOR-892401") {
        setTrackingData(SAMPLE_TRACKING_DATA);
        success("Order Found", "Displaying sample tracking details.");
      } else {
        error("Search Error", "Could not connect to tracking server.");
      }
    }
  };

  // Reorder / Buy Again handler
  const handleReorder = () => {
    trackingData.items.forEach((item) => {
      addToCart(item, item.qty, item.size);
    });
    setIsCartOpen(true);
    success("Items Added to Bag", "Order items added to your shopping bag.");
  };

  // Printable Invoice trigger
  const handlePrintInvoice = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Handle Return Request Submit
  const handleReturnSubmit = (e) => {
    e.preventDefault();
    setShowReturnModal(false);
    success("Return Request Submitted", "Our support team will send return shipping labels to your email.");
  };

  // Handle Cancel Order Submit
  const handleCancelSubmit = (e) => {
    e.preventDefault();
    setShowCancelModal(false);
    success("Cancellation Requested", "Your order cancellation request has been logged.");
  };

  return (
    <div className="space-y-8 select-none font-sans">
      
      {/* ── 1. SEARCH / LOOKUP TOOLBAR ── */}
      <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-6 space-y-4 shadow-xl">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold block mb-1">
            EXPRESS TRACKING
          </span>
          <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
            Track Order & Delivery Status
          </h2>
        </div>

        <form onSubmit={handleLookupOrder} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. GOR-892401)..."
              className="w-full h-[46px] pl-11 pr-4 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[10px] text-xs font-mono text-[#F8F6F3] placeholder-[#8E8A85] outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto h-[46px] px-7 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <span>Track Order</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* ── 2. ACTIVE ORDER STATUS CARD & TIMELINE ── */}
      {trackingData && (
        <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 sm:p-8 space-y-8 shadow-2xl">
          
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-6">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                  Order #{trackingData.orderId}
                </h3>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded font-bold">
                  {STAGES[trackingData.currentStageIndex].title}
                </span>
              </div>
              <span className="text-xs text-[#8E8A85] block mt-1">
                Placed on {trackingData.date} • Courier: {trackingData.courier} ({trackingData.trackingCode})
              </span>
            </div>

            <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#8E8A85] block">Estimated Delivery</span>
              <span className="font-editorial text-xl font-bold text-[#C8A45D]">{trackingData.eta}</span>
            </div>
          </div>

          {/* ── 6-STAGE DELIVERY TIMELINE (Horizontal Desktop / Vertical Mobile) ── */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block">
              DELIVERY JOURNEY
            </span>

            {/* Desktop Horizontal Timeline */}
            <div className="hidden md:grid grid-cols-6 gap-2 relative pt-4">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx <= trackingData.currentStageIndex;
                const isCurrent = idx === trackingData.currentStageIndex;
                const IconComp = stage.icon;

                return (
                  <div key={stage.id} className="flex flex-col items-center text-center relative z-10 space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-[#C8A45D] border-[#C8A45D] text-[#090909] shadow-lg"
                          : "bg-[#090909] border-[#2A2A2A] text-[#8E8A85]"
                      } ${isCurrent ? "ring-4 ring-[#C8A45D]/30 scale-110" : ""}`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`text-xs font-bold block ${isCompleted ? "text-[#F8F6F3]" : "text-[#8E8A85]"}`}>
                        {stage.title}
                      </span>
                      <span className="text-[9.5px] text-[#8E8A85] block mt-0.5 leading-tight font-light">
                        {stage.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="md:hidden space-y-4 pl-4 border-l-2 border-[#2A2A2A] relative">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx <= trackingData.currentStageIndex;
                const isCurrent = idx === trackingData.currentStageIndex;
                const IconComp = stage.icon;

                return (
                  <div key={stage.id} className="flex items-start gap-3 relative">
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 -ml-[25px] transition-all ${
                        isCompleted
                          ? "bg-[#C8A45D] border-[#C8A45D] text-[#090909]"
                          : "bg-[#090909] border-[#2A2A2A] text-[#8E8A85]"
                      } ${isCurrent ? "ring-2 ring-[#C8A45D]/40" : ""}`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-xs font-bold block ${isCompleted ? "text-[#F8F6F3]" : "text-[#8E8A85]"}`}>
                        {stage.title}
                      </span>
                      <span className="text-[10px] text-[#8E8A85] font-light block">{stage.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 3. PURCHASED PRODUCTS LIST ── */}
          <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block">
              PURCHASED GARMENTS
            </span>

            <div className="space-y-3">
              {trackingData.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 rounded-[10px] overflow-hidden bg-[#151515] border border-[#2A2A2A] shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-editorial text-base text-[#F8F6F3]">{item.name}</h4>
                      <span className="text-xs text-[#8E8A85] block font-sans mt-0.5">
                        Size: <strong className="text-[#F8F6F3]">{item.size}</strong> • Color: {item.color} • Qty: {item.qty}
                      </span>
                      <span className="text-xs font-bold text-[#C8A45D] block mt-1 font-mono">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. SHIPPING ADDRESS & SUMMARY ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#2A2A2A]">
            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#C8A45D] font-bold block mb-1">
                DELIVERY ADDRESS
              </span>
              <h5 className="text-xs font-bold text-[#F8F6F3]">{trackingData.shippingAddress.name}</h5>
              <p className="text-xs text-[#8E8A85] font-light leading-relaxed">
                {trackingData.shippingAddress.street}<br />
                {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} {trackingData.shippingAddress.pincode}<br />
                {trackingData.shippingAddress.country}
              </p>
            </div>

            <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#C8A45D] font-bold block mb-1">
                ORDER TOTAL BREAKDOWN
              </span>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-[#8E8A85]">
                  <span>Subtotal:</span>
                  <span>{formatPrice(trackingData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#8E8A85]">
                  <span>Express Shipping:</span>
                  <span className="text-emerald-400 font-bold">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between text-[#F8F6F3] font-bold pt-2 border-t border-[#2A2A2A] text-sm">
                  <span>Grand Total:</span>
                  <span className="text-[#C8A45D]">{formatPrice(trackingData.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 5. ORDER ACTIONS BUTTON BAR ── */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={handleReorder}
              className="flex-1 h-[44px] bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reorder Items</span>
            </button>

            <button
              type="button"
              onClick={handlePrintInvoice}
              className="h-[44px] px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] font-sans text-xs uppercase tracking-wider font-semibold rounded-[10px] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#C8A45D]" />
              <span>Print Invoice</span>
            </button>

            <button
              type="button"
              onClick={() => setShowReturnModal(true)}
              className="h-[44px] px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#8E8A85] hover:text-[#F8F6F3] font-sans text-xs uppercase tracking-wider font-semibold rounded-[10px] transition-colors cursor-pointer"
            >
              Request Return
            </button>

            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="h-[44px] px-4 bg-[#090909] border border-[#2A2A2A] hover:border-rose-500/40 text-rose-400 font-sans text-xs uppercase tracking-wider font-semibold rounded-[10px] transition-colors cursor-pointer"
            >
              Cancel Order
            </button>
          </div>

        </div>
      )}

      {/* ── RETURN REQUEST MODAL ── */}
      {showReturnModal && (
        <div className="fixed inset-0 z-[230] bg-[#090909]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 max-w-md w-full shadow-2xl space-y-4 select-none">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Request Return</h3>
              <button type="button" onClick={() => setShowReturnModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                >
                  <option value="size_issue">Size / Fit Issue</option>
                  <option value="changed_mind">Changed Mind</option>
                  <option value="defective">Defect / Fabric Issue</option>
                </select>
              </div>

              <p className="text-[11px] text-[#8E8A85] font-light leading-relaxed">
                Complimentary 30-day return policy. Pre-printed shipping return labels will be emailed to your registered address.
              </p>

              <button
                type="submit"
                className="w-full h-11 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[10px] shadow-md"
              >
                Submit Return Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── CANCEL ORDER MODAL ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[230] bg-[#090909]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-6 max-w-md w-full shadow-2xl space-y-4 select-none">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Cancel Order</h3>
              <button type="button" onClick={() => setShowCancelModal(false)} className="text-[#8E8A85] hover:text-[#F8F6F3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#8E8A85] block mb-1">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full h-10 px-3 bg-[#090909] border border-[#2A2A2A] rounded-[8px] text-xs text-[#F8F6F3] outline-none"
                >
                  <option value="changed_mind">Changed Mind</option>
                  <option value="wrong_address">Incorrect Shipping Address</option>
                  <option value="duplicate">Duplicate Order</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-[10px] shadow-md"
              >
                Confirm Order Cancellation
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
