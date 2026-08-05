"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CartDrawer from "@/components/ui/CartDrawer";
import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { useAuth } from "@/context/AuthContext";

function Field({ label, id, type = "text", value, onChange, error, placeholder, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-wider text-gor-grey mb-1.5">
        {label}
      </label>
      <div className="relative">
        {children ? children : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-gor-black border px-4 py-3 text-sm text-gor-offwhite placeholder-gor-grey/40 focus:outline-none transition-colors ${
              error ? "border-gor-rust focus:border-gor-rust" : "border-gor-gold/20 focus:border-gor-gold"
            }`}
          />
        )}
      </div>
      {error && <p className="text-xs text-gor-rust mt-1.5">{error}</p>}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get("redirect") || "/admin";

    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      if (typeof window !== "undefined") {
        window.location.href = redirectUrl;
      } else {
        router.push(redirectUrl);
      }
    } else {
      setGlobalError(result.error || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-gor-black bg-noise text-gor-offwhite flex items-center justify-center pt-24 pb-20 px-4">
        <Container size="small">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-10">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-gor-gold font-medium flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> GOR Atelier Member
              </span>
              <h1 className="font-serif text-4xl font-bold text-gor-offwhite">SIGN IN</h1>
              <p className="mt-3 text-sm text-gor-grey font-light">
                Access your orders, wishlist, and exclusive member benefits.
              </p>
            </div>

            {/* Card */}
            <div className="bg-gor-card border border-gor-gold/20 p-8 sm:p-10 space-y-5">
              {globalError && (
                <div className="bg-gor-rust/10 border border-gor-rust/40 px-4 py-3 text-xs text-gor-rust">
                  {globalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <Field label="Email Address" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="your@email.com">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gor-grey/50 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={`w-full bg-gor-black border pl-10 pr-4 py-3 text-sm text-gor-offwhite placeholder-gor-grey/40 focus:outline-none transition-colors ${errors.email ? "border-gor-rust" : "border-gor-gold/20 focus:border-gor-gold"}`}
                    />
                  </div>
                </Field>
                {errors.email && <p className="text-xs text-gor-rust -mt-3">{errors.email}</p>}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="text-xs uppercase tracking-wider text-gor-grey">Password</label>
                    <button type="button" className="text-xs text-gor-gold hover:text-gor-gold-light transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gor-grey/50 pointer-events-none" />
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-gor-black border pl-10 pr-11 py-3 text-sm text-gor-offwhite placeholder-gor-grey/40 focus:outline-none transition-colors ${errors.password ? "border-gor-rust" : "border-gor-gold/20 focus:border-gor-gold"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gor-grey/50 hover:text-gor-gold transition-colors"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-gor-rust mt-1.5">{errors.password}</p>}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  className="w-full mt-2"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In to Atelier"}
                </Button>
              </form>

              <div className="pt-4 border-t border-gor-gold/10 text-center">
                <p className="text-xs text-gor-grey">
                  New to GOR Menswear?{" "}
                  <Link href="/signup" className="text-gor-gold hover:text-gor-gold-light font-medium transition-colors">
                    Create an Account
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </Container>
      </main>

      <CartDrawer />
      <Footer />
    </>
  );
}
