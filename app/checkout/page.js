"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  Check,
  Award,
  RotateCcw,
  Smartphone,
  Wallet,
  Building2,
  Plus,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

// Saved addresses loaded from user profile API in production
const SAVED_ADDRESSES = [];

// Shipping Options
const SHIPPING_OPTIONS = [
  {
    id: "standard",
    title: "Standard Insured Shipping",
    eta: "2–5 Business Days",
    price: 0,
    badge: "FREE",
  },
  {
    id: "express",
    title: "Express Air Dispatch",
    eta: "1–2 Business Days",
    price: 15,
    badge: "PRIORITY",
  },
];

// Payment Methods
const PAYMENT_METHODS = [
  {
    id: "cod",
    icon: Wallet,
    title: "Cash on Delivery (COD)",
    description: "Pay upon physical delivery at your doorstep.",
  },
  {
    id: "upi",
    icon: Smartphone,
    title: "Instant UPI (Google Pay / PhonePe / Paytm)",
    description: "Pay instantly via any UPI application or VPA ID.",
  },
  {
    id: "credit-card",
    icon: CreditCard,
    title: "Credit / Debit Card",
    description: "Supports Visa, Mastercard, RuPay & American Express.",
  },
  {
    id: "net-banking",
    icon: Building2,
    title: "Net Banking",
    description: "Direct bank transfer via 50+ major banks.",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems,
    subtotal,
    discountAmount,
    shipping: cartShipping,
    grandTotal: initialGrandTotal,
    applyPromoCode,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState("payment"); // info -> shipping -> payment
  const [selectedAddressId, setSelectedAddressId] = useState("addr-1");
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("cod");

  // Promo code state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);

  // Mobile Order Summary Collapse
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Form State for Customer / Delivery
  const [formData, setFormData] = useState({
    fullName: "Marcus Vance",
    email: "marcus.vance@gor.com",
    phone: "9876543210",
    flat: "Apt 14B, Skyline Towers",
    street: "740 Park Avenue",
    landmark: "Near Central Park",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    upiId: "",
    cardNumber: "•••• •••• •••• 4242",
    cardExp: "12/28",
    cardCvc: "888",
  });

  const [formErrors, setFormErrors] = useState({});

  // Calculate Shipping fee based on selection
  const selectedShippingObj = SHIPPING_OPTIONS.find((s) => s.id === selectedShipping);
  const shippingFee = selectedShippingObj ? selectedShippingObj.price : 0;
  const finalGrandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [subtotal, discountAmount, shippingFee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Valid Email is required";
    if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = "Valid 10-digit Mobile Number is required";
    if (!formData.flat.trim()) errors.flat = "House / Flat details are required";
    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.pincode.trim() || formData.pincode.length < 6) errors.pincode = "Valid 6-digit Pincode is required";

    if (selectedPayment === "upi" && !formData.upiId.trim()) {
      errors.upiId = "Please enter your UPI ID (e.g. name@upi)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Apply Promo Code
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyPromoCode(couponCode.trim());
    setCouponResult(res);
  };

  // Handle Place Order Submit
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submit

    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstName: formData.fullName.split(" ")[0] || formData.fullName,
            lastName: formData.fullName.split(" ").slice(1).join(" ") || "",
            email: formData.email,
            phone: formData.phone,
            address: `${formData.flat}, ${formData.street}, ${formData.landmark}`,
            city: formData.city,
            state: formData.state,
            zip: formData.pincode,
          },
          cart: {
            items: cartItems,
            subtotal,
            discountAmount,
            shipping: shippingFee,
            grandTotal: finalGrandTotal,
          },
          paymentMethod: selectedPayment,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        clearCart();
        router.push(`/order-confirmation/${data.order.orderId}`);
      } else {
        setFormErrors({ submit: data.error || "Order submission failed. Please try again." });
      }
    } catch (err) {
      console.error("Order submission error", err);
      setFormErrors({ submit: "Network error occurred while placing order." });
    } finally {
      setLoading(false);
    }
  };

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#090909] text-[#F8F6F3] flex flex-col items-center justify-center pt-24 text-center px-4">
        <div className="w-16 h-16 rounded-full border border-[#2A2A2A] bg-[#151515] text-[#C8A45D] flex items-center justify-center mb-4 shadow-xl">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">Your shopping bag is empty.</h2>
        <p className="font-sans text-xs text-[#8E8A85] mt-2 max-w-sm font-light">
          Add garments to your bag before proceeding to checkout.
        </p>
        <Link href="/shop" className="mt-6 px-7 py-3 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[8px] hover:bg-[#D4B77D] transition-colors shadow-lg">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-24 select-none">
        <Container>
          
          {/* ── CHECKOUT PROGRESS HEADER ── */}
          <div className="max-w-4xl mx-auto mb-10 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-sans text-[#8E8A85] uppercase tracking-widest mb-6">
              <Link href="/cart" className="hover:text-[#C8A45D] transition-colors">Cart</Link>
              <span>→</span>
              <span className={activeStep === "info" ? "text-[#C8A45D] font-bold" : "text-[#F8F6F3]"}>Information</span>
              <span>→</span>
              <span className={activeStep === "shipping" ? "text-[#C8A45D] font-bold" : "text-[#F8F6F3]"}>Shipping</span>
              <span>→</span>
              <span className={activeStep === "payment" ? "text-[#C8A45D] font-bold" : "text-[#F8F6F3]"}>Payment</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F8F6F3]">
              Express Checkout
            </h1>
            <p className="font-sans text-xs text-[#8E8A85] mt-1 font-light flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#C8A45D]" /> 256-Bit Encrypted & Compliant Checkout
            </p>
          </div>

          {/* ── EXPRESS QUICK PAYMENT BUTTONS ── */}
          <div className="max-w-xl mx-auto mb-10 p-4 bg-[#151515] border border-[#2A2A2A] rounded-[14px] text-center space-y-3">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#8E8A85] font-semibold block">EXPRESS CHECKOUT</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPayment("upi")}
                className="py-3 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[10px] text-xs font-sans font-bold text-[#F8F6F3] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Smartphone className="w-4 h-4 text-[#C8A45D]" /> Quick UPI Pay
              </button>
              <button
                type="button"
                onClick={() => setSelectedPayment("cod")}
                className="py-3 px-4 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-[10px] text-xs font-sans font-bold text-[#F8F6F3] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Wallet className="w-4 h-4 text-[#C8A45D]" /> Pay on Delivery
              </button>
            </div>
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2A2A2A]" /></div>
              <span className="relative bg-[#151515] px-3 font-sans text-[9px] uppercase tracking-widest text-[#8E8A85]">Or continue with shipping details</span>
            </div>
          </div>

          {/* ── MAIN CHECKOUT FORM (65% LEFT / 35% RIGHT) ── */}
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* ── LEFT COLUMN (65%): CUSTOMER INFO, ADDRESS, SHIPPING & PAYMENT ── */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* 1. CUSTOMER INFORMATION */}
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[14px] p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                  <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">1. Customer Information</h3>
                  <span className="font-sans text-[10px] text-[#C8A45D] uppercase tracking-wider font-semibold">Step 1 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Marcus Vance"
                      className={`w-full bg-[#090909] border rounded-[8px] px-4 py-2.5 text-xs font-sans text-[#F8F6F3] placeholder-[#8E8A85]/50 focus:outline-none transition-colors ${
                        formErrors.fullName ? "border-rose-500" : "border-[#2A2A2A] focus:border-[#C8A45D]"
                      }`}
                    />
                    {formErrors.fullName && <p className="text-[11px] text-rose-400 mt-1">{formErrors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit Mobile Number"
                      className={`w-full bg-[#090909] border rounded-[8px] px-4 py-2.5 text-xs font-sans text-[#F8F6F3] placeholder-[#8E8A85]/50 focus:outline-none transition-colors ${
                        formErrors.phone ? "border-rose-500" : "border-[#2A2A2A] focus:border-[#C8A45D]"
                      }`}
                    />
                    {formErrors.phone && <p className="text-[11px] text-rose-400 mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="marcus.vance@example.com"
                    className={`w-full bg-[#090909] border rounded-[8px] px-4 py-2.5 text-xs font-sans text-[#F8F6F3] placeholder-[#8E8A85]/50 focus:outline-none transition-colors ${
                      formErrors.email ? "border-rose-500" : "border-[#2A2A2A] focus:border-[#C8A45D]"
                    }`}
                  />
                  {formErrors.email && <p className="text-[11px] text-rose-400 mt-1">{formErrors.email}</p>}
                </div>
              </div>

              {/* 2. SAVED ADDRESS CARDS & DELIVERY ADDRESS */}
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[14px] p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                  <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#C8A45D]" /> 2. Delivery Address
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddNewAddress(!showAddNewAddress)}
                    className="font-sans text-xs uppercase tracking-wider text-[#C8A45D] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> {showAddNewAddress ? "Use Saved Cards" : "Add New Address"}
                  </button>
                </div>

                {/* Saved Address Cards Grid */}
                {!showAddNewAddress && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SAVED_ADDRESSES.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setFormData((prev) => ({
                            ...prev,
                            fullName: addr.fullName,
                            flat: addr.flat,
                            street: addr.street,
                            landmark: addr.landmark,
                            city: addr.city,
                            state: addr.state,
                            pincode: addr.pincode,
                            phone: addr.phone,
                          }));
                        }}
                        className={`p-4 rounded-[12px] border transition-all duration-200 cursor-pointer relative space-y-1.5 ${
                          selectedAddressId === addr.id
                            ? "bg-[#090909] border-[#C8A45D] ring-2 ring-[#C8A45D]/30 shadow-md"
                            : "bg-[#090909] border-[#2A2A2A] hover:border-[#C8A45D]/40 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-sans text-[10px] font-bold uppercase tracking-wider bg-[#C8A45D]/15 text-[#C8A45D] px-2 py-0.5 rounded border border-[#C8A45D]/30">
                            {addr.tag}
                          </span>
                          {selectedAddressId === addr.id && <Check className="w-4 h-4 text-[#C8A45D]" />}
                        </div>
                        <h4 className="font-sans text-xs font-bold text-[#F8F6F3]">{addr.fullName}</h4>
                        <p className="font-sans text-xs text-[#8E8A85] font-light leading-snug">
                          {addr.flat}, {addr.street}, {addr.city} — {addr.pincode}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Detailed Form Inputs */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">
                        House / Flat / Building *
                      </label>
                      <input
                        type="text"
                        name="flat"
                        value={formData.flat}
                        onChange={handleChange}
                        className="w-full bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] px-4 py-2.5 text-xs text-[#F8F6F3] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">
                        Street / Area *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] px-4 py-2.5 text-xs text-[#F8F6F3] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] px-4 py-2.5 text-xs text-[#F8F6F3] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] px-4 py-2.5 text-xs text-[#F8F6F3] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1.5">PIN Code *</label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] rounded-[8px] px-4 py-2.5 text-xs text-[#F8F6F3] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. SHIPPING METHOD CARDS */}
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[14px] p-6 sm:p-8 space-y-5">
                <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3] flex items-center gap-2 border-b border-[#2A2A2A] pb-4">
                  <Truck className="w-5 h-5 text-[#C8A45D]" /> 3. Select Shipping Option
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SHIPPING_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedShipping(opt.id)}
                      className={`p-4 rounded-[12px] border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                        selectedShipping === opt.id
                          ? "bg-[#090909] border-[#C8A45D] ring-2 ring-[#C8A45D]/30 shadow-md"
                          : "bg-[#090909] border-[#2A2A2A] hover:border-[#C8A45D]/40"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-sans text-xs font-bold text-[#F8F6F3]">{opt.title}</h4>
                          <span className="font-sans text-[11px] text-[#C8A45D] font-medium">{opt.eta}</span>
                        </div>
                        <span className="font-sans text-[9px] uppercase font-extrabold tracking-wider bg-[#C8A45D]/15 text-[#C8A45D] px-2 py-0.5 rounded border border-[#C8A45D]/30">
                          {opt.badge}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2A]/50">
                        <span className="font-sans text-xs text-[#8E8A85]">Shipping Fee</span>
                        <span className="font-sans text-xs font-bold text-[#F8F6F3]">
                          {opt.price === 0 ? "Free" : formatPrice(opt.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. PAYMENT METHOD CARDS */}
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[14px] p-6 sm:p-8 space-y-5">
                <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3] flex items-center gap-2 border-b border-[#2A2A2A] pb-4">
                  <CreditCard className="w-5 h-5 text-[#C8A45D]" /> 4. Select Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((pm) => {
                    const IconComp = pm.icon;
                    return (
                      <div
                        key={pm.id}
                        onClick={() => setSelectedPayment(pm.id)}
                        className={`p-4 rounded-[12px] border transition-all duration-200 cursor-pointer space-y-2 ${
                          selectedPayment === pm.id
                            ? "bg-[#090909] border-[#C8A45D] ring-2 ring-[#C8A45D]/30 shadow-md"
                            : "bg-[#090909] border-[#2A2A2A] hover:border-[#C8A45D]/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#C8A45D]">
                            <IconComp className="w-5 h-5" />
                            <h4 className="font-sans text-xs font-bold text-[#F8F6F3]">{pm.title}</h4>
                          </div>
                          {selectedPayment === pm.id && <Check className="w-4 h-4 text-[#C8A45D]" />}
                        </div>
                        <p className="font-sans text-[11px] text-[#8E8A85] font-light leading-relaxed">
                          {pm.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Conditional Payment Input Fields */}
                {selectedPayment === "upi" && (
                  <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[10px] space-y-2 mt-3">
                    <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold">
                      Enter VPA / UPI ID *
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="e.g. mobile@upi or username@okicici"
                      className="w-full bg-[#151515] border border-[#2A2A2A] focus:border-[#C8A45D] px-4 py-2 text-xs text-[#F8F6F3] rounded-[6px] focus:outline-none"
                    />
                    {formErrors.upiId && <p className="text-[11px] text-rose-400">{formErrors.upiId}</p>}
                  </div>
                )}

                {selectedPayment === "credit-card" && (
                  <div className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[10px] space-y-3 mt-3">
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full bg-[#151515] border border-[#2A2A2A] focus:border-[#C8A45D] px-4 py-2 text-xs text-[#F8F6F3] rounded-[6px] focus:outline-none font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="cardExp"
                          value={formData.cardExp}
                          onChange={handleChange}
                          className="w-full bg-[#151515] border border-[#2A2A2A] focus:border-[#C8A45D] px-4 py-2 text-xs text-[#F8F6F3] rounded-[6px] focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-wider text-[#8E8A85] font-semibold mb-1">CVV / CVC</label>
                        <input
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          className="w-full bg-[#151515] border border-[#2A2A2A] focus:border-[#C8A45D] px-4 py-2 text-xs text-[#F8F6F3] rounded-[6px] focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* ── RIGHT COLUMN (35%): STICKY ORDER SUMMARY & PLACE ORDER CTA ── */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-6 sm:p-8 space-y-6 lg:sticky lg:top-28 shadow-2xl">
                
                <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
                  <h3 className="font-editorial text-2xl font-normal text-[#F8F6F3]">
                    Order Summary ({cartItems.length})
                  </h3>
                  {/* Mobile collapse trigger */}
                  <button
                    type="button"
                    onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                    className="lg:hidden text-[#C8A45D] text-xs font-semibold flex items-center gap-1"
                  >
                    {mobileSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Items List */}
                <div className={`space-y-3.5 max-h-[320px] overflow-y-auto pr-1 ${mobileSummaryOpen ? "block" : "hidden lg:block"}`}>
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3 bg-[#090909] p-2.5 rounded-[10px] border border-[#2A2A2A]">
                      <img src={item.image} alt={item.name} className="w-12 aspect-[3/4] object-cover object-top rounded border border-[#2A2A2A] shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-editorial text-xs text-[#F8F6F3] truncate">{item.name}</h4>
                          <span className="font-sans text-[10px] text-[#8E8A85]">Size: {item.selectedSize || "M"} | Qty: {item.quantity}</span>
                        </div>
                        <span className="font-sans text-xs font-bold text-[#C8A45D] price-display">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expandable Coupon Form */}
                <div className="pt-2 border-t border-[#2A2A2A]">
                  <button
                    type="button"
                    onClick={() => setShowCouponInput(!showCouponInput)}
                    className="font-sans text-xs text-[#C8A45D] hover:underline font-semibold flex items-center gap-1.5 cursor-pointer mb-2"
                  >
                    <Tag className="w-3.5 h-3.5" /> Have a promo code?
                  </button>

                  <AnimatePresence>
                    {showCouponInput && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleApplyPromo}
                        className="flex gap-2 mb-2"
                      >
                        <input
                          type="text"
                          placeholder="Promo code (e.g. GOR15)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 bg-[#090909] border border-[#2A2A2A] focus:border-[#C8A45D] px-3 py-1.5 text-xs text-[#F8F6F3] rounded-[6px] focus:outline-none uppercase"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#C8A45D] text-xs font-sans font-bold rounded-[6px] cursor-pointer"
                        >
                          Apply
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {couponResult && (
                    <p className={`text-[11px] font-sans ${couponResult.success ? "text-emerald-400" : "text-rose-400"}`}>
                      {couponResult.message}
                    </p>
                  )}
                </div>

                {/* Financial Summary Breakdown */}
                <div className="space-y-2 text-xs font-sans text-[#8E8A85] pt-3 border-t border-[#2A2A2A]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#F8F6F3] font-semibold price-display">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#D86A32]">
                      <span>Discount</span>
                      <span className="price-display">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#F8F6F3]">{shippingFee === 0 ? "Free Express" : formatPrice(shippingFee)}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-[#F8F6F3] pt-3 border-t border-[#2A2A2A]">
                    <span>Grand Total</span>
                    <span className="text-[#C8A45D] price-display">{formatPrice(finalGrandTotal)}</span>
                  </div>
                </div>

                {/* Inline General Submission Error */}
                {formErrors.submit && (
                  <div className="p-3 bg-rose-950/60 border border-rose-500/30 text-rose-300 rounded-[8px] text-xs font-sans flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formErrors.submit}</span>
                  </div>
                )}

                {/* Primary Place Order CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-[52px] rounded-[12px] font-sans text-xs uppercase tracking-wider font-bold shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    loading
                      ? "bg-[#C8A45D]/50 text-[#090909] cursor-not-allowed"
                      : "bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] active:scale-[0.98]"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#090909] border-t-transparent rounded-full animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order & Pay — {formatPrice(finalGrandTotal)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Minimalist Trust Strip */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#2A2A2A] text-[9.5px] font-sans uppercase tracking-wider text-[#8E8A85]">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Fast Shipping</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>100% Original</span>
                  </div>
                </div>

              </div>
            </div>

          </form>
        </Container>

        {/* ── MOBILE STICKY PLACE ORDER BOTTOM BAR ── */}
        <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-[#090909]/95 border-t border-[#2A2A2A] p-3 backdrop-blur-xl flex items-center justify-between gap-3 shadow-2xl pb-[env(safe-area-inset-bottom)]">
          <div>
            <span className="font-sans text-[10px] text-[#8E8A85] uppercase block">Total Payable</span>
            <span className="font-sans text-sm font-bold text-[#C8A45D] price-display">{formatPrice(finalGrandTotal)}</span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading}
            className="h-[46px] px-6 bg-[#C8A45D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>

      </main>

      <Footer />
    </>
  );
}
