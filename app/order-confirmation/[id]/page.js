"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  Truck,
  Download,
  ArrowRight,
  MapPin,
  Clock,
  Mail,
  Check,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import ProductCard from "@/components/ui/ProductCard";
import { Container } from "@/components/ui/Section";
import { formatPrice } from "@/lib/utils";

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.834 11.834 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.237-6.165-3.483-8.411" />
    </svg>
  );
}

// 4 Featured Recommendation Items
const RECOMMENDED_4_ITEMS = [
  {
    id: "gor-codset-1",
    name: "GOR Heavyweight Oversized Tee",
    price: 180,
    category: "Streetwear",
    image: "/images/products/gor-codset-burgundy-alo.webp",
  },
  {
    id: "gor-codset-2",
    name: "GOR Textured Zip Co-Ord Set",
    price: 520,
    category: "Co-Ord Sets",
    image: "/images/products/gor-codset-beige-prada.webp",
  },
  {
    id: "gor-shirt-1",
    name: "GOR Designer Camp Shirting",
    price: 240,
    category: "Designer Shirts",
    image: "/images/lookbook/gor-lookbook-2.webp",
  },
  {
    id: "gor-acc-1",
    name: "GOR Signature Leather Belt",
    price: 95,
    category: "Accessories",
    image: "/images/lookbook/gor-lookbook-5.webp",
  },
];

export default function OrderConfirmationPage({ params }) {
  const { id } = use(params);
  const [dbOrder, setDbOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${baseUrl}/api/orders/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.order) {
          setDbOrder(json.order);
        }
      })
      .catch((err) => console.warn("Could not fetch real order:", err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Formatted Order Date & Delivery window
  const orderDateStr = dbOrder?.createdAt
    ? new Date(dbOrder.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const estimatedDelivery = dbOrder?.createdAt
    ? new Date(new Date(dbOrder.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const handleDownloadInvoice = () => {
    window.print();
  };

  const displayOrderNo = dbOrder?.orderNo || id || "GOR-892401";
  const displayItems = dbOrder?.items?.length ? dbOrder.items : [
    {
      name: "GOR Alo Burgundy Heavyweight Co-Ord Set",
      size: "L",
      quantity: 1,
      price: 380,
      itemTotal: 380,
      image: "/images/products/gor-codset-burgundy-alo.webp",
    },
    {
      name: "Prada Desert Sand Textured Zip Set",
      size: "M",
      quantity: 1,
      price: 520,
      itemTotal: 520,
      image: "/images/products/gor-codset-beige-prada.webp",
    },
  ];

  const subtotal = dbOrder?.subtotal !== undefined ? dbOrder.subtotal : 900;
  const discount = dbOrder?.discount || 0;
  const shippingFee = dbOrder?.shippingFee || 0;
  const totalAmount = dbOrder?.totalAmount !== undefined ? dbOrder.totalAmount : 900;
  const customerName = dbOrder?.customerName || "Marcus Vance";
  const shippingAddr = dbOrder?.shippingAddress?.address || "740 Park Avenue, Apt 14B, Mayfair, London";
  const paymentMethodStr = dbOrder?.paymentMethod || "Cash on Delivery (COD)";
  const paymentStatusStr = dbOrder?.paymentStatus || "Paid";

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 relative overflow-hidden">
        {/* Subtle Champagne Gold Light Effect */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#C8A45D]/5 rounded-full blur-[140px]" />
        </div>

        <Container className="relative z-10">
          {/* ── 1. SUCCESS HERO SECTION ── */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-20 h-20 rounded-full bg-[#C8A45D]/15 border-2 border-[#C8A45D] flex items-center justify-center text-[#C8A45D] mx-auto mb-6 shadow-2xl ring-8 ring-[#C8A45D]/10"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>

            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold block mb-2">
              ORDER SUCCESS
            </span>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F8F6F3] tracking-tight leading-[1.08] mb-3">
              Order Confirmed
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#8E8A85] font-light max-w-lg mx-auto leading-relaxed">
              Your order has been successfully recorded in MongoDB. We’ll notify you as it moves through express preparation and dispatch.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-[#151515] border border-[#2A2A2A] px-4 py-1.5 rounded-full text-xs font-sans">
              <span className="text-[#8E8A85]">Order Reference:</span>
              <span className="text-[#C8A45D] font-mono font-bold">{displayOrderNo}</span>
              <span className="text-[#8E8A85]">• {orderDateStr}</span>
            </div>
          </div>

          {/* ── 2. UPGRADED DELIVERY STATUS TIMELINE ── */}
          <div className="max-w-4xl mx-auto bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-6 sm:p-8 mb-12 shadow-xl">
            <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3] mb-6 text-center sm:text-left">
              Delivery Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {[
                { status: "Order Confirmed", desc: "Order recorded.", active: true, completed: true, icon: Check },
                { status: "Preparing", desc: "Packing items.", active: true, completed: false, icon: Package },
                { status: "Shipped", desc: "Express tracking.", active: false, completed: false, icon: Truck },
                { status: "Out for Delivery", desc: "On the way.", active: false, completed: false, icon: MapPin },
                { status: "Delivered", desc: "Enjoy your garments.", active: false, completed: false, icon: CheckCircle2 },
              ].map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center space-y-2 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        step.completed
                          ? "bg-[#C8A45D] text-[#090909] border-[#C8A45D] shadow-md"
                          : step.active
                          ? "bg-[#090909] text-[#C8A45D] border-[#C8A45D] ring-4 ring-[#C8A45D]/20 animate-pulse"
                          : "bg-[#090909] text-[#8E8A85] border-[#2A2A2A]"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <span className={`font-sans text-xs font-bold ${step.active || step.completed ? "text-[#F8F6F3]" : "text-[#8E8A85]"}`}>
                      {step.status}
                    </span>
                    <p className="font-sans text-[10px] text-[#8E8A85] font-light leading-snug max-w-[130px]">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 3. ORDER DETAILS CARDS GRID (4 CARDS) ── */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {/* Card 1: Order Number */}
            <div className="p-5 bg-[#151515] border border-[#2A2A2A] rounded-[12px] space-y-1">
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#C8A45D] font-semibold">ORDER NUMBER</span>
              <p className="font-mono text-sm font-bold text-[#F8F6F3]">{displayOrderNo}</p>
              <p className="font-sans text-[11px] text-[#8E8A85]">Placed on {orderDateStr}</p>
            </div>

            {/* Card 2: Payment */}
            <div className="p-5 bg-[#151515] border border-[#2A2A2A] rounded-[12px] space-y-1">
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#C8A45D] font-semibold">PAYMENT METHOD</span>
              <p className="font-sans text-xs font-bold text-[#F8F6F3] truncate">{paymentMethodStr}</p>
              <p className={`font-sans text-[11px] font-semibold ${paymentStatusStr === "Paid" ? "text-emerald-400" : "text-amber-400"}`}>
                Status: {paymentStatusStr}
              </p>
            </div>

            {/* Card 3: Delivery Address */}
            <div className="p-5 bg-[#151515] border border-[#2A2A2A] rounded-[12px] space-y-1">
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#C8A45D] font-semibold">DELIVERY ADDRESS</span>
              <p className="font-sans text-xs font-bold text-[#F8F6F3] truncate">{customerName}</p>
              <p className="font-sans text-[11px] text-[#8E8A85] truncate font-light">{shippingAddr}</p>
            </div>

            {/* Card 4: Total & Arrival */}
            <div className="p-5 bg-[#151515] border border-[#2A2A2A] rounded-[12px] space-y-1">
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#C8A45D] font-semibold">ESTIMATED ARRIVAL</span>
              <p className="font-sans text-sm font-bold text-[#C8A45D]">{estimatedDelivery}</p>
              <p className="font-sans text-[11px] text-[#8E8A85]">Standard Express Courier</p>
            </div>
          </div>

          {/* ── 4. ORDER SUMMARY & ACTION BUTTONS ── */}
          <div className="max-w-4xl mx-auto bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-6 sm:p-8 mb-12 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">Purchased Items</h3>
              <span className="font-sans text-xs text-[#C8A45D] font-semibold">Insured Package</span>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-4">
              {displayItems.map((item, index) => (
                <div key={item.productId || index} className="flex items-center gap-4 bg-[#090909] p-3.5 border border-[#2A2A2A] rounded-[12px]">
                  <img
                    src={item.image || "/images/lookbook/gor-lookbook-1.webp"}
                    alt={item.name}
                    className="w-16 aspect-[3/4] object-cover object-top rounded-[6px] border border-[#2A2A2A] shrink-0"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-editorial text-base text-[#F8F6F3] truncate">{item.name}</h4>
                      <span className="font-sans text-xs text-[#8E8A85]">
                        SKU: <strong className="text-[#F8F6F3]">{item.sku || "GOR-SKU"}</strong> | Qty: {item.quantity || 1}
                      </span>
                    </div>
                    <span className="font-sans text-sm font-bold text-[#C8A45D] price-display">
                      {formatPrice(item.itemTotal || item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-[#2A2A2A] space-y-2 text-xs font-sans text-[#8E8A85]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#F8F6F3] font-semibold price-display">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount Applied</span>
                  <span className="font-semibold price-display">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Express Shipping</span>
                <span className="text-[#F8F6F3] font-semibold">
                  {shippingFee > 0 ? formatPrice(shippingFee) : "Complimentary"}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#F8F6F3] pt-3 border-t border-[#2A2A2A]">
                <span>Total Amount Paid</span>
                <span className="text-[#C8A45D] price-display">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 border-t border-[#2A2A2A]">
              <Link
                href="/account"
                className="w-full sm:flex-1 h-[48px] rounded-[10px] bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Track Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="w-full sm:flex-1 h-[48px] rounded-[10px] bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center cursor-pointer"
              >
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="w-full sm:w-auto px-5 h-[48px] bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#C8A45D] font-sans text-xs uppercase tracking-wider font-semibold rounded-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice</span>
              </button>
            </div>
          </div>

          {/* ── 5. CUSTOMER SUPPORT CARDS ── */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3] mb-4 text-center sm:text-left">
              Need Assistance With Your Order?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="https://wa.me/918691921913?text=Hi%20GOR%20Support,%20I%20need%20help%20with%20my%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 bg-[#151515] border border-[#2A2A2A] hover:border-[#25D366] rounded-[12px] flex items-center gap-3 transition-colors cursor-pointer group/wa"
              >
                <WhatsAppIcon className="w-6 h-6 text-[#C8A45D] group-hover/wa:text-[#25D366] transition-colors" />
                <div>
                  <h4 className="font-sans text-xs font-bold text-[#F8F6F3]">WhatsApp Support</h4>
                  <p className="font-sans text-[10px] text-[#8E8A85]">Instant 24/7 Agent Chat</p>
                </div>
              </a>

              <a
                href="mailto:support@gor.com"
                className="p-5 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[12px] flex items-center gap-3 transition-colors cursor-pointer"
              >
                <Mail className="w-6 h-6 text-[#C8A45D]" />
                <div>
                  <h4 className="font-sans text-xs font-bold text-[#F8F6F3]">Email Support</h4>
                  <p className="font-sans text-[10px] text-[#8E8A85]">support@gormenswear.com</p>
                </div>
              </a>

              <div className="p-5 bg-[#151515] border border-[#2A2A2A] rounded-[12px] flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#C8A45D]" />
                <div>
                  <h4 className="font-sans text-xs font-bold text-[#F8F6F3]">Business Hours</h4>
                  <p className="font-sans text-[10px] text-[#8E8A85]">Mon – Sat: 10:00 – 19:00 IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 6. RECOMMENDED FOR YOU ── */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold block mb-1">
                  RECOMMENDED FOR YOU
                </span>
                <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                  You May Also Like
                </h2>
              </div>
              <Link href="/shop" className="font-sans text-xs uppercase tracking-wider text-[#C8A45D] hover:underline font-semibold">
                View All Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              {RECOMMENDED_4_ITEMS.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
