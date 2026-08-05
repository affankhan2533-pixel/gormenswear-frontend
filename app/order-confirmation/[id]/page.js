"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Sparkles,
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
      .catch((err) => console.warn("Could not fetch order:", err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const orderDateStr = dbOrder?.createdAt
    ? new Date(dbOrder.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const estimatedDelivery = dbOrder?.createdAt
    ? new Date(new Date(dbOrder.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

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
  const paymentMethodStr = dbOrder?.paymentMethod || "Instant UPI";
  const paymentStatusStr = dbOrder?.paymentStatus || "Paid";

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#0B0B0B] text-[#F7F5F2] pt-24 pb-24 relative overflow-hidden select-none">
        {/* Glow Effect */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#C9A86A]/5 rounded-full blur-[140px]" />
        </div>

        <Container className="relative z-10 max-w-[1200px]">
          
          {/* ── 1. SUCCESS HERO SECTION ── */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-20 h-20 rounded-full bg-[#C9A86A]/15 border-2 border-[#C9A86A] flex items-center justify-center text-[#C9A86A] mx-auto mb-6 shadow-2xl ring-8 ring-[#C9A86A]/10"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>

            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C9A86A] font-bold block mb-2">
              PURCHASE SUCCESSFUL
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F7F5F2] tracking-tight leading-[1.08] mb-3">
              Order Confirmed
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#B8B6B0] font-light max-w-lg mx-auto leading-relaxed">
              Your order has been recorded. We have sent a receipt to your email and are preparing your Atelier garments for express delivery.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 bg-[#111111] border border-[#2A2A2A] px-4 py-2 rounded-full text-xs font-sans">
              <span className="text-[#B8B6B0]">Order Reference:</span>
              <span className="text-[#C9A86A] font-mono font-bold">{displayOrderNo}</span>
              <span className="text-[#B8B6B0]">• {orderDateStr}</span>
            </div>
          </div>

          {/* ── 2. DELIVERY TIMELINE ── */}
          <div className="max-w-4xl mx-auto bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 mb-12 shadow-xl">
            <h3 className="font-serif text-2xl font-normal text-[#F7F5F2] mb-6 text-center sm:text-left">
              Delivery Timeline Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {[
                { status: "Order Placed", desc: "Confirmed & logged.", active: true, completed: true, icon: Check },
                { status: "Preparing", desc: "Hand-inspecting.", active: true, completed: false, icon: Package },
                { status: "Shipped", desc: "Air courier transit.", active: false, completed: false, icon: Truck },
                { status: "Out for Delivery", desc: "Local courier dispatch.", active: false, completed: false, icon: MapPin },
                { status: "Delivered", desc: "Enjoy your garments.", active: false, completed: false, icon: CheckCircle2 },
              ].map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        step.completed
                          ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A] shadow-md"
                          : step.active
                          ? "bg-[#0B0B0B] text-[#C9A86A] border-[#C9A86A] ring-4 ring-[#C9A86A]/20 animate-pulse"
                          : "bg-[#0B0B0B] text-[#B8B6B0] border-[#2A2A2A]"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <span className={`font-sans text-xs font-bold ${step.active || step.completed ? "text-[#F7F5F2]" : "text-[#B8B6B0]"}`}>
                      {step.status}
                    </span>
                    <p className="font-sans text-[10px] text-[#B8B6B0] font-light max-w-[130px]">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 3. ORDER SUMMARY & PURCHASED ITEMS ── */}
          <div className="max-w-4xl mx-auto bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 mb-12 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
              <h3 className="font-serif text-2xl font-normal text-[#F7F5F2]">Purchased Garments</h3>
              <span className="font-sans text-xs text-[#C9A86A] font-bold">Insured Express Package</span>
            </div>

            <div className="space-y-4">
              {displayItems.map((item, index) => (
                <div key={item.productId || index} className="flex items-center gap-4 bg-[#0B0B0B] p-3.5 border border-[#2A2A2A] rounded-xl">
                  <div className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden border border-[#2A2A2A] shrink-0 bg-[#0B0B0B]">
                    <Image
                      src={item.image || "/images/products/gor-codset-burgundy-alo.webp"}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-base text-[#F7F5F2] truncate">{item.name}</h4>
                      <span className="font-sans text-xs text-[#B8B6B0]">
                        Size: <strong className="text-[#F7F5F2]">{item.size || "M"}</strong> | Qty: {item.quantity || 1}
                      </span>
                    </div>
                    <span className="font-sans text-sm font-bold text-[#C9A86A] price-display">
                      {formatPrice(item.itemTotal || item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-[#2A2A2A] space-y-2 text-xs font-sans text-[#B8B6B0]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#F7F5F2] font-semibold price-display">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount Applied</span>
                  <span className="font-semibold price-display">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span className="text-[#F7F5F2] font-semibold">
                  {shippingFee > 0 ? formatPrice(shippingFee) : "Complimentary"}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#F7F5F2] pt-3 border-t border-[#2A2A2A]">
                <span>Total Paid</span>
                <span className="text-[#C9A86A] price-display">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 border-t border-[#2A2A2A]">
              <Link
                href="/account"
                className="w-full sm:flex-1 h-12 bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
              >
                <span>Track Order Status</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="w-full sm:flex-1 h-12 bg-[#0B0B0B] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#F7F5F2] font-sans text-xs uppercase tracking-widest font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer"
              >
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="w-full sm:w-auto px-6 h-12 bg-[#0B0B0B] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#C9A86A] font-sans text-xs uppercase tracking-widest font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Invoice</span>
              </button>
            </div>
          </div>

          {/* ── 4. RECOMMENDED PRODUCTS RAIL ── */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C9A86A] font-bold block mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> YOU MAY ALSO LIKE
                </span>
                <h2 className="font-serif text-3xl font-normal text-[#F7F5F2]">
                  Recommended Atelier Garments
                </h2>
              </div>
              <Link href="/shop" className="font-sans text-xs uppercase tracking-wider text-[#C9A86A] hover:underline font-bold">
                View Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
