"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CartDrawer from "@/components/ui/CartDrawer";
import { Container } from "@/components/ui/Section";
import { useAuth } from "@/context/AuthContext";

const MEMBER_PERKS = [
  "Early access to new drops & limited collection releases",
  "15% off your first order with exclusive code GOR15",
  "Complimentary express shipping on orders over $500",
  "Signature GOR protective garment packaging on every order",
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((p) => ({ ...p, [field]: "" }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((p) => ({ ...p, [field]: true }));
  };

  // Password Strength Calculation
  const passwordScore = useMemo(() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score += 1;
    if (p.length >= 10) score += 1;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;
    return score; // 0 to 4
  }, [form.password]);

  const passwordStrengthLabel = useMemo(() => {
    if (passwordScore === 0) return null;
    if (passwordScore <= 1) return { label: "Weak", color: "bg-rose-500 text-rose-400" };
    if (passwordScore <= 2) return { label: "Fair", color: "bg-[#C8A45D] text-[#C8A45D]" };
    return { label: "Strong", color: "bg-emerald-500 text-emerald-400" };
  }, [passwordScore]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (!form.confirm) e.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    signup(form.name, form.email, form.password);
    router.push("/account");
  };

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-[#090909] text-[#F8F6F3] pt-24 pb-20 select-none">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-5xl mx-auto">
            
            {/* Left: Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#C8A45D] font-bold flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> JOIN GOR
                </span>
                <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#F8F6F3]">
                  CREATE ACCOUNT
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-[#8E8A85] font-light">
                  Become a member of the GOR inner circle and unlock exclusive benefits.
                </p>
              </div>

              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[16px] p-6 sm:p-8 space-y-6 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  {/* Floating Label Input: Full Name */}
                  <div className="relative">
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]/50 pointer-events-none" />
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange("name")}
                        onBlur={handleBlur("name")}
                        placeholder=" "
                        className={`peer w-full bg-[#090909] border rounded-[10px] pl-10 pr-10 pt-5 pb-2 text-xs font-sans text-[#F8F6F3] focus:outline-none transition-colors ${
                          errors.name
                            ? "border-rose-500"
                            : form.name.trim()
                            ? "border-emerald-500/60"
                            : "border-[#2A2A2A] focus:border-[#C8A45D]"
                        }`}
                      />
                      <label
                        htmlFor="name"
                        className="absolute left-10 top-2.5 text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8E8A85]/60 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:font-semibold peer-focus:text-[#C8A45D]"
                      >
                        Full Name
                      </label>
                      {form.name.trim() && !errors.name && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
                      )}
                    </div>
                    {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* Floating Label Input: Email Address */}
                  <div className="relative">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]/50 pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                        onBlur={handleBlur("email")}
                        placeholder=" "
                        className={`peer w-full bg-[#090909] border rounded-[10px] pl-10 pr-10 pt-5 pb-2 text-xs font-sans text-[#F8F6F3] focus:outline-none transition-colors ${
                          errors.email
                            ? "border-rose-500"
                            : form.email.includes("@")
                            ? "border-emerald-500/60"
                            : "border-[#2A2A2A] focus:border-[#C8A45D]"
                        }`}
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-10 top-2.5 text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8E8A85]/60 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:font-semibold peer-focus:text-[#C8A45D]"
                      >
                        Email Address
                      </label>
                      {form.email.includes("@") && !errors.email && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
                      )}
                    </div>
                    {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                  </div>

                  {/* Floating Label Input: Password & Strength Indicator */}
                  <div className="relative">
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]/50 pointer-events-none" />
                      <input
                        id="password"
                        type={showPw ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange("password")}
                        onBlur={handleBlur("password")}
                        placeholder=" "
                        className={`peer w-full bg-[#090909] border rounded-[10px] pl-10 pr-11 pt-5 pb-2 text-xs font-sans text-[#F8F6F3] focus:outline-none transition-colors ${
                          errors.password
                            ? "border-rose-500"
                            : form.password.length >= 6
                            ? "border-emerald-500/60"
                            : "border-[#2A2A2A] focus:border-[#C8A45D]"
                        }`}
                      />
                      <label
                        htmlFor="password"
                        className="absolute left-10 top-2.5 text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8E8A85]/60 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:font-semibold peer-focus:text-[#C8A45D]"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8A85]/60 hover:text-[#C8A45D] transition-colors"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {form.password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1 bg-[#090909] rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-300 ${passwordScore >= 1 ? passwordStrengthLabel.color.split(" ")[0] : "bg-transparent"} w-1/3`} />
                          <div className={`h-full transition-all duration-300 ${passwordScore >= 2 ? passwordStrengthLabel.color.split(" ")[0] : "bg-transparent"} w-1/3`} />
                          <div className={`h-full transition-all duration-300 ${passwordScore >= 3 ? passwordStrengthLabel.color.split(" ")[0] : "bg-transparent"} w-1/3`} />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-sans">
                          <span className="text-[#8E8A85]">Password Strength:</span>
                          <span className={`font-bold ${passwordStrengthLabel?.color.split(" ")[1]}`}>{passwordStrengthLabel?.label}</span>
                        </div>
                      </div>
                    )}
                    {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password}</p>}
                  </div>

                  {/* Floating Label Input: Confirm Password */}
                  <div className="relative">
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8A85]/50 pointer-events-none" />
                      <input
                        id="confirm"
                        type={showPw ? "text" : "password"}
                        value={form.confirm}
                        onChange={handleChange("confirm")}
                        onBlur={handleBlur("confirm")}
                        placeholder=" "
                        className={`peer w-full bg-[#090909] border rounded-[10px] pl-10 pr-10 pt-5 pb-2 text-xs font-sans text-[#F8F6F3] focus:outline-none transition-colors ${
                          errors.confirm
                            ? "border-rose-500"
                            : form.confirm && form.confirm === form.password
                            ? "border-emerald-500/60"
                            : "border-[#2A2A2A] focus:border-[#C8A45D]"
                        }`}
                      />
                      <label
                        htmlFor="confirm"
                        className="absolute left-10 top-2.5 text-[10px] uppercase tracking-wider text-[#8E8A85] font-semibold transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8E8A85]/60 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:font-semibold peer-focus:text-[#C8A45D]"
                      >
                        Confirm Password
                      </label>
                      {form.confirm && form.confirm === form.password && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
                      )}
                    </div>
                    {errors.confirm && <p className="text-[11px] text-rose-400 mt-1">{errors.confirm}</p>}
                  </div>

                  {/* Submit CTA Button with Hover Animation */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className="w-full h-[50px] bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] shadow-lg hover:shadow-xl hover:shadow-[#C8A45D]/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#090909] border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>CREATE ACCOUNT</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                </form>

                <div className="pt-4 border-t border-[#2A2A2A] text-center">
                  <p className="text-xs font-sans text-[#8E8A85]">
                    Already a member?{" "}
                    <Link href="/login" className="text-[#C8A45D] hover:underline font-semibold transition-colors">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: Member Benefits Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hidden lg:block"
            >
              <div className="bg-[#151515] border border-[#2A2A2A] rounded-[18px] p-8 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="space-y-2">
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-bold block">
                    MEMBER BENEFITS
                  </span>
                  <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
                    GOR INNER CIRCLE
                  </h2>
                  <p className="text-xs text-[#8E8A85] font-light leading-relaxed">
                    Joining GOR Menswear means becoming part of an exclusive GOR member community crafted for the discerning modern customer.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {MEMBER_PERKS.map((perk) => (
                    <div key={perk} className="flex items-start gap-3 bg-[#090909] p-3.5 rounded-[12px] border border-[#2A2A2A]">
                      <CheckCircle2 className="w-4 h-4 text-[#C8A45D] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#F8F6F3] leading-snug">{perk}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#2A2A2A]">
                  <p className="text-xs text-[#8E8A85] italic font-light">
                    &ldquo;GOR is more than clothing. It is a statement of intent.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </Container>
      </main>

      <CartDrawer />
      <Footer />
    </>
  );
}
