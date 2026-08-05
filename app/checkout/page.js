"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  Edit3,
  Gift,
  Sparkles,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { Container } from "@/components/ui/Section";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

// Delivery Methods
const DELIVERY_METHODS = [
  {
    id: "standard",
    title: "Standard Insured Delivery",
    eta: "3–5 Business Days",
    price: 0,
    badge: "FREE",
    desc: "Dispatched via air courier with signature requirement.",
  },
  {
    id: "express",
    title: "Express Priority Air",
    eta: "1–2 Business Days",
    price: 15,
    badge: "PRIORITY",
    desc: "Guaranteed next-day dispatch in premium GOR gift box.",
  },
  {
    id: "atelier",
    title: "Atelier Store Pickup",
    eta: "Ready in 24 Hours",
    price: 0,
    badge: "BOUTIQUE",
    desc: "Collect in person at your nearest GOR Flagship Boutique.",
  },
];

// Payment Methods
const PAYMENT_METHODS = [
  {
    id: "upi",
    icon: Smartphone,
    title: "Instant UPI (Google Pay / PhonePe / Paytm)",
    description: "Zero transaction fee. Instant payment via VPA ID.",
  },
  {
    id: "credit-card",
    icon: CreditCard,
    title: "Credit / Debit Card",
    description: "Visa, Mastercard, RuPay, and American Express.",
  },
  {
    id: "cod",
    icon: Wallet,
    title: "Cash on Delivery (COD)",
    description: "Pay upon physical delivery at your doorstep.",
  },
  {
    id: "net-banking",
    icon: Building2,
    title: "Net Banking",
    description: "Direct bank transfer via 50+ major banks.",
  },
];

const COUNTRIES = ["India", "United States", "United Kingdom", "United Arab Emirates", "Canada", "Australia"];

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
  const [networkError, setNetworkError] = useState(null);

  // Stepper State: 1 = Address, 2 = Delivery, 3 = Payment, 4 = Review
  const [currentStep, setCurrentStep] = useState(1);

  // Delivery & Payment state
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("upi");

  // Gift Note & Packaging
  const [includeGiftBox, setIncludeGiftBox] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  // Promo Code state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);

  // Mobile Summary Collapse
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Shipping Form State
  const [formData, setFormData] = useState({
    fullName: "Marcus Vance",
    email: "marcus.vance@gor.com",
    phone: "9876543210",
    country: "India",
    flat: "Apt 14B, Skyline Towers",
    street: "740 Park Avenue",
    landmark: "Near Central Park",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    addressType: "Home",
    upiId: "",
    cardNumber: "•••• •••• •••• 4242",
    cardExp: "12/28",
    cardCvc: "888",
  });

  const [formErrors, setFormErrors] = useState({});

  // Dynamic Shipping Fee
  const selectedDeliveryObj = DELIVERY_METHODS.find((d) => d.id === selectedDelivery);
  const shippingFee = selectedDeliveryObj ? selectedDeliveryObj.price : 0;
  const estimatedTax = useMemo(() => Math.round(subtotal * 0.05), [subtotal]);
  const finalGrandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [subtotal, discountAmount, shippingFee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validation Engine
  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Valid Email is required";
      if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = "Valid 10-digit Mobile Number is required";
      if (!formData.flat.trim()) errors.flat = "House / Flat details are required";
      if (!formData.street.trim()) errors.street = "Street address is required";
      if (!formData.city.trim()) errors.city = "City is required";
      if (!formData.pincode.trim() || formData.pincode.length < 6) errors.pincode = "Valid 6-digit PIN Code is required";
    } else if (step === 3) {
      if (selectedPayment === "upi" && !formData.upiId.trim()) {
        errors.upiId = "Please enter your UPI VPA ID (e.g. user@upi)";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyPromoCode(couponCode.trim());
    setCouponResult(res);
  };

  // Final Order Submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validateStep(1) || !validateStep(3)) {
      setCurrentStep(1);
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    setLoading(true);
    setNetworkError(null);

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
            address: `${formData.flat}, ${formData.street}, ${formData.landmark || ""}`,
            city: formData.city,
            state: formData.state,
            zip: formData.pincode,
            country: formData.country,
          },
          cart: {
            items: cartItems,
            subtotal,
            discountAmount,
            shipping: shippingFee,
            grandTotal: finalGrandTotal,
          },
          deliveryMethod: selectedDelivery,
          paymentMethod: selectedPayment,
          giftOptions: {
            includeGiftBox,
            giftMessage,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        clearCart();
        router.push(`/order-confirmation/${data.order.orderId}`);
      } else {
        setNetworkError(data.error || "Order submission failed. Please check payment details and retry.");
      }
    } catch (err) {
      console.error("Order submission error", err);
      setNetworkError("Network connectivity error occurred while placing order. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F7F5F2] flex flex-col items-center justify-center pt-24 text-center px-4 select-none">
        <div className="w-16 h-16 rounded-full border border-[#2A2A2A] bg-[#111111] text-[#C9A86A] flex items-center justify-center mb-4 shadow-xl">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-normal text-[#F7F5F2]">Your shopping bag is empty.</h2>
        <p className="font-sans text-xs text-[#B8B6B0] mt-2 max-w-sm font-light">
          Add garments to your bag before proceeding to luxury checkout.
        </p>
        <Link
          href="/shop"
          className="mt-6 px-8 py-3.5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#D4B57C] transition-colors shadow-lg cursor-pointer"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#0B0B0B] text-[#F7F5F2] pt-24 pb-24 select-none">
        <Container className="max-w-[1400px]">

          {/* ── STEPPER PROGRESS BAR (Shipping → Delivery → Payment → Review) ── */}
          <div className="max-w-4xl mx-auto mb-10 text-center">
            <div className="flex items-center justify-center gap-3 text-xs font-sans uppercase tracking-[0.2em] mb-6">
              {[
                { step: 1, label: "Shipping" },
                { step: 2, label: "Delivery" },
                { step: 3, label: "Payment" },
                { step: 4, label: "Review" },
              ].map((st, idx, arr) => (
                <div key={st.step} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (st.step < currentStep) setCurrentStep(st.step);
                    }}
                    className={`flex items-center gap-2 transition-colors ${
                      currentStep === st.step
                        ? "text-[#C9A86A] font-bold"
                        : currentStep > st.step
                        ? "text-[#F7F5F2] hover:text-[#C9A86A] cursor-pointer"
                        : "text-[#B8B6B0]/40 cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold font-mono border ${
                        currentStep === st.step
                          ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A]"
                          : currentStep > st.step
                          ? "bg-[#111111] text-[#C9A86A] border-[#C9A86A]"
                          : "bg-[#111111] text-[#B8B6B0]/40 border-[#2A2A2A]"
                      }`}
                    >
                      {currentStep > st.step ? <Check className="w-3 h-3" /> : st.step}
                    </span>
                    <span>{st.label}</span>
                  </button>

                  {idx < arr.length - 1 && <span className="text-[#2A2A2A]">→</span>}
                </div>
              ))}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#F7F5F2] tracking-tight">
              Atelier Express Checkout
            </h1>
            <p className="font-sans text-xs text-[#B8B6B0] mt-1.5 font-light flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#C9A86A]" /> 256-Bit SSL Encrypted & PCI-DSS Compliant
            </p>
          </div>

          {/* ── MAIN LAYOUT: LEFT 65% CHECKOUT FORM / RIGHT 35% ORDER SUMMARY ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* ── LEFT COLUMN (65%): ACCORDION CHECKOUT STEPS ── */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* ── STEP 1: SHIPPING ADDRESS ── */}
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-5 h-5 text-[#C9A86A]" />
                    <h3 className="font-serif text-2xl font-normal text-[#F7F5F2]">1. Shipping Address</h3>
                  </div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[#C9A86A] hover:underline font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  )}
                </div>

                {currentStep === 1 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Marcus Vance"
                          className={`w-full bg-[#0B0B0B] border rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] placeholder-[#B8B6B0]/40 focus:outline-none transition-colors ${
                            formErrors.fullName ? "border-rose-500" : "border-[#2A2A2A] focus:border-[#C9A86A]"
                          }`}
                        />
                        {formErrors.fullName && <p className="text-[11px] text-rose-400 mt-1">{formErrors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">Mobile Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit Mobile Number"
                          className={`w-full bg-[#0B0B0B] border rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] placeholder-[#B8B6B0]/40 focus:outline-none transition-colors ${
                            formErrors.phone ? "border-rose-500" : "border-[#2A2A2A] focus:border-[#C9A86A]"
                          }`}
                        />
                        {formErrors.phone && <p className="text-[11px] text-rose-400 mt-1">{formErrors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="marcus.vance@example.com"
                          className={`w-full bg-[#0B0B0B] border rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] placeholder-[#B8B6B0]/40 focus:outline-none transition-colors ${
                            formErrors.email ? "border-rose-500" : "border-[#2A2A2A] focus:border-[#C9A86A]"
                          }`}
                        />
                        {formErrors.email && <p className="text-[11px] text-rose-400 mt-1">{formErrors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">Country *</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] focus:outline-none cursor-pointer"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">House / Flat / Building *</label>
                        <input
                          type="text"
                          name="flat"
                          value={formData.flat}
                          onChange={handleChange}
                          placeholder="Apt 14B, Skyline Towers"
                          className={`w-full bg-[#0B0B0B] border rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] placeholder-[#B8B6B0]/40 focus:outline-none transition-colors ${
                            formErrors.flat ? "border-rose-500" : "border-[#2A2A2A] focus:border-[#C9A86A]"
                          }`}
                        />
                        {formErrors.flat && <p className="text-[11px] text-rose-400 mt-1">{formErrors.flat}</p>}
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">Street / Area *</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          placeholder="740 Park Avenue"
                          className={`w-full bg-[#0B0B0B] border rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] placeholder-[#B8B6B0]/40 focus:outline-none transition-colors ${
                            formErrors.street ? "border-rose-500" : "border-[#2A2A2A] focus:border-[#C9A86A]"
                          }`}
                        />
                        {formErrors.street && <p className="text-[11px] text-rose-400 mt-1">{formErrors.street}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold mb-1.5">PIN Code *</label>
                        <input
                          type="text"
                          name="pincode"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={handleChange}
                          className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] rounded-xl px-4 py-2.5 text-xs text-[#F7F5F2] focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-3.5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#D4B57C] transition-colors cursor-pointer shadow-lg flex items-center gap-2"
                      >
                        <span>Continue to Delivery</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-xs text-[#B8B6B0] space-y-1">
                    <p className="font-bold text-[#F7F5F2]">{formData.fullName} • {formData.phone}</p>
                    <p>{formData.flat}, {formData.street}, {formData.city}, {formData.country} — {formData.pincode}</p>
                  </div>
                )}
              </div>

              {/* ── STEP 2: DELIVERY METHOD ── */}
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-5 h-5 text-[#C9A86A]" />
                    <h3 className="font-serif text-2xl font-normal text-[#F7F5F2]">2. Delivery Method</h3>
                  </div>
                  {currentStep > 2 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-[#C9A86A] hover:underline font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  )}
                </div>

                {currentStep === 2 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {DELIVERY_METHODS.map((dm) => (
                        <div
                          key={dm.id}
                          onClick={() => setSelectedDelivery(dm.id)}
                          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer space-y-2 flex flex-col justify-between ${
                            selectedDelivery === dm.id
                              ? "bg-[#0B0B0B] border-[#C9A86A] ring-2 ring-[#C9A86A]/40 shadow-md"
                              : "bg-[#0B0B0B] border-[#2A2A2A] hover:border-[#C9A86A]/40"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[9px] uppercase tracking-widest font-extrabold bg-[#C9A86A]/15 text-[#C9A86A] px-2 py-0.5 rounded border border-[#C9A86A]/30">
                                {dm.badge}
                              </span>
                              {selectedDelivery === dm.id && <Check className="w-4 h-4 text-[#C9A86A]" />}
                            </div>
                            <h4 className="font-serif text-sm font-bold text-[#F7F5F2] mt-1">{dm.title}</h4>
                            <p className="font-sans text-xs text-[#C9A86A] font-semibold">{dm.eta}</p>
                            <p className="font-sans text-[11px] text-[#B8B6B0] font-light mt-1">{dm.desc}</p>
                          </div>

                          <div className="pt-2 border-t border-[#2A2A2A] flex justify-between items-center text-xs font-bold">
                            <span className="text-[#B8B6B0]">Fee</span>
                            <span className="text-[#F7F5F2]">{dm.price === 0 ? "FREE" : formatPrice(dm.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3.5 bg-[#0B0B0B] border border-[#2A2A2A] text-[#B8B6B0] font-sans text-xs uppercase tracking-wider font-bold rounded-xl hover:text-[#F7F5F2] flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-3.5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#D4B57C] transition-colors cursor-pointer shadow-lg flex items-center gap-2"
                      >
                        <span>Continue to Payment</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : currentStep > 2 ? (
                  <div className="text-xs text-[#B8B6B0] flex justify-between items-center">
                    <span>{selectedDeliveryObj?.title} ({selectedDeliveryObj?.eta})</span>
                    <span className="font-bold text-[#F7F5F2]">{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
                  </div>
                ) : null}
              </div>

              {/* ── STEP 3: PAYMENT METHOD ── */}
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-[#C9A86A]" />
                    <h3 className="font-serif text-2xl font-normal text-[#F7F5F2]">3. Payment Method</h3>
                  </div>
                  {currentStep > 3 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-[#C9A86A] hover:underline font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  )}
                </div>

                {currentStep === 3 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PAYMENT_METHODS.map((pm) => {
                        const IconComp = pm.icon;
                        return (
                          <div
                            key={pm.id}
                            onClick={() => setSelectedPayment(pm.id)}
                            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer space-y-2 ${
                              selectedPayment === pm.id
                                ? "bg-[#0B0B0B] border-[#C9A86A] ring-2 ring-[#C9A86A]/40 shadow-md"
                                : "bg-[#0B0B0B] border-[#2A2A2A] hover:border-[#C9A86A]/40"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[#C9A86A]">
                                <IconComp className="w-5 h-5" />
                                <h4 className="font-serif text-sm font-bold text-[#F7F5F2]">{pm.title}</h4>
                              </div>
                              {selectedPayment === pm.id && <Check className="w-4 h-4 text-[#C9A86A]" />}
                            </div>
                            <p className="font-sans text-[11px] text-[#B8B6B0] font-light leading-relaxed">
                              {pm.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Conditional UPI / Card Input */}
                    {selectedPayment === "upi" && (
                      <div className="p-4 bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl space-y-2">
                        <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-bold">VPA / UPI ID *</label>
                        <input
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleChange}
                          placeholder="e.g. username@upi or mobile@okicici"
                          className="w-full bg-[#111111] border border-[#2A2A2A] focus:border-[#C9A86A] px-4 py-2 text-xs text-[#F7F5F2] rounded-lg focus:outline-none"
                        />
                        {formErrors.upiId && <p className="text-[11px] text-rose-400">{formErrors.upiId}</p>}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3.5 bg-[#0B0B0B] border border-[#2A2A2A] text-[#B8B6B0] font-sans text-xs uppercase tracking-wider font-bold rounded-xl hover:text-[#F7F5F2] flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-3.5 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#D4B57C] transition-colors cursor-pointer shadow-lg flex items-center gap-2"
                      >
                        <span>Review Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : currentStep > 3 ? (
                  <div className="text-xs text-[#B8B6B0]">
                    <p className="font-bold text-[#F7F5F2]">{PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.title}</p>
                  </div>
                ) : null}
              </div>

              {/* ── STEP 4: REVIEW ORDER & GIFT OPTIONS ── */}
              {currentStep === 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="border-b border-[#2A2A2A] pb-4">
                    <h3 className="font-serif text-2xl font-normal text-[#F7F5F2]">4. Final Order Review</h3>
                    <p className="font-sans text-xs text-[#B8B6B0] font-light mt-1">
                      Please verify your shipping details, chosen delivery option, and payment method before placing your order.
                    </p>
                  </div>

                  {/* Luxury Gift Note Option */}
                  <div className="p-4 bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl space-y-3">
                    <label className="flex items-center gap-2 font-sans text-xs uppercase tracking-wider text-[#F7F5F2] font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeGiftBox}
                        onChange={(e) => setIncludeGiftBox(e.target.checked)}
                        className="accent-[#C9A86A] w-4 h-4"
                      />
                      <Gift className="w-4 h-4 text-[#C9A86A]" />
                      <span>Include Luxury Gift Packaging & Custom Note</span>
                    </label>

                    {includeGiftBox && (
                      <textarea
                        rows={3}
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Write your custom gift message here..."
                        className="w-full bg-[#111111] border border-[#2A2A2A] focus:border-[#C9A86A] p-3 text-xs text-[#F7F5F2] placeholder-[#B8B6B0]/40 rounded-xl focus:outline-none resize-none font-sans"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3.5 bg-[#0B0B0B] border border-[#2A2A2A] text-[#B8B6B0] font-sans text-xs uppercase tracking-wider font-bold rounded-xl hover:text-[#F7F5F2] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Payment
                    </button>
                  </div>
                </motion.div>
              )}

            </div>

            {/* ── RIGHT COLUMN (35%): STICKY ORDER SUMMARY & PLACE ORDER CTA ── */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-28 shadow-2xl">
                
                <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
                  <h3 className="font-serif text-2xl font-normal text-[#F7F5F2]">
                    Order Summary ({cartItems.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                    className="lg:hidden text-[#C9A86A] text-xs font-bold flex items-center gap-1"
                  >
                    {mobileSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Cart Items List */}
                <div className={`space-y-3.5 max-h-[320px] overflow-y-auto pr-1 ${mobileSummaryOpen ? "block" : "hidden lg:block"}`}>
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3 bg-[#0B0B0B] p-3 rounded-xl border border-[#2A2A2A]">
                      <div className="relative w-14 aspect-[3/4] rounded-lg overflow-hidden border border-[#2A2A2A] shrink-0">
                        <Image src={item.image || "/images/products/gor-codset-burgundy-alo.webp"} alt={item.name} fill unoptimized className="object-cover object-top" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-xs text-[#F7F5F2] truncate">{item.name}</h4>
                          <span className="font-sans text-[10px] text-[#B8B6B0]">Size: {item.selectedSize || "M"} | Qty: {item.quantity}</span>
                        </div>
                        <span className="font-sans text-xs font-bold text-[#C9A86A] price-display">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expandable Coupon Form */}
                <div className="pt-2 border-t border-[#2A2A2A]">
                  <button
                    type="button"
                    onClick={() => setShowCouponInput(!showCouponInput)}
                    className="font-sans text-xs text-[#C9A86A] hover:underline font-bold flex items-center gap-1.5 cursor-pointer mb-2"
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
                          placeholder="PROMO CODE"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] px-3 py-1.5 text-xs text-[#F7F5F2] rounded-xl focus:outline-none uppercase font-bold"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-[#0B0B0B] border border-[#2A2A2A] hover:border-[#C9A86A] text-[#C9A86A] text-xs font-sans font-bold rounded-xl cursor-pointer"
                        >
                          Apply
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {couponResult && (
                    <p className={`text-[11px] font-sans font-semibold ${couponResult.success ? "text-emerald-400" : "text-rose-400"}`}>
                      {couponResult.message}
                    </p>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="space-y-2 text-xs font-sans text-[#B8B6B0] pt-3 border-t border-[#2A2A2A]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#F7F5F2] font-bold price-display">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#D86A32]">
                      <span>VIP Discount</span>
                      <span className="price-display">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="text-[#F7F5F2] font-semibold">{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax (5%)</span>
                    <span className="text-[#F7F5F2] font-semibold">{formatPrice(estimatedTax)}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-[#F7F5F2] pt-3 border-t border-[#2A2A2A]">
                    <span>Total Amount</span>
                    <span className="text-[#C9A86A] price-display">{formatPrice(finalGrandTotal)}</span>
                  </div>
                </div>

                {/* Error Banner */}
                {networkError && (
                  <div className="p-3.5 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-sans flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{networkError}</span>
                  </div>
                )}

                {/* Primary Place Order CTA */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className={`w-full h-12 rounded-xl font-sans text-xs uppercase tracking-widest font-bold shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    loading
                      ? "bg-[#C9A86A]/50 text-[#0B0B0B] cursor-not-allowed"
                      : "bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0B0B0B] active:scale-98"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0B0B0B]" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order & Pay — {formatPrice(finalGrandTotal)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Minimalist Trust Badges */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#2A2A2A] text-[10px] font-sans uppercase tracking-wider text-[#B8B6B0]">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>256-Bit SSL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>Easy Exchange</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </Container>

        {/* ── MOBILE STICKY BOTTOM PAY BAR ── */}
        <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-[#0B0B0B]/95 border-t border-[#2A2A2A] p-3.5 backdrop-blur-xl flex items-center justify-between gap-3 shadow-2xl pb-[env(safe-area-inset-bottom)]">
          <div>
            <span className="font-sans text-[10px] text-[#B8B6B0] uppercase block font-bold">Total Payable</span>
            <span className="font-sans text-sm font-bold text-[#C9A86A] price-display">{formatPrice(finalGrandTotal)}</span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading}
            className="h-11 px-6 bg-[#C9A86A] text-[#0B0B0B] font-sans text-xs uppercase tracking-wider font-bold rounded-xl active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>

      </main>

      <Footer />
    </>
  );
}
