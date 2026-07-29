"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MapPin,
  Clock,
  Phone,
  Mail,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CartDrawer from "@/components/ui/CartDrawer";
import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}


const STORE_INFO = [
  {
    icon: MapPin,
    label: "Flagship Store",
    lines: ["GOR Menswear Atelier", "Fashion Street, Colaba", "Mumbai, Maharashtra 400001"],
  },
  {
    icon: Clock,
    label: "Store Hours",
    lines: ["Mon – Sat: 10:00 AM – 9:00 PM", "Sunday: 12:00 PM – 7:00 PM", "Public Holidays: Closed"],
  },
  {
    icon: Phone,
    label: "WhatsApp & Phone",
    lines: ["+91 98765 43210", "WhatsApp Available", "Mon – Sat, 10AM – 6PM IST"],
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["atelier@gormenswear.com", "Replies within 24 hours", "Bespoke inquiries welcome"],
  },
];

const SUBJECTS = [
  "General Inquiry",
  "Order Support",
  "Bespoke / Custom Order",
  "Wholesale / Partnership",
  "Press & Media",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    else if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    // TODO: wire up backend email / contact API endpoint
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const inputCls = (field) =>
    `w-full bg-gor-black border px-4 py-3 text-sm text-gor-offwhite placeholder-gor-grey/40 focus:outline-none transition-colors ${
      errors[field] ? "border-gor-rust focus:border-gor-rust" : "border-gor-gold/20 focus:border-gor-gold"
    }`;

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="min-h-screen bg-gor-black bg-noise text-gor-offwhite pt-24 pb-20">
        {/* Header */}
        <div className="bg-gor-card border-b border-gor-gold/15 py-14 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gor-navy/25 rounded-full blur-[130px] pointer-events-none" />
          <Container>
            <nav className="text-xs text-gor-grey font-sans uppercase tracking-widest mb-3 flex items-center gap-2">
              <Link href="/" className="hover:text-gor-gold">Home</Link>
              <span>/</span>
              <span className="text-gor-gold font-semibold">Contact</span>
            </nav>
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-gor-gold font-medium flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Get in Touch
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gor-offwhite">
              CONTACT THE ATELIER
            </h1>
            <p className="mt-3 text-sm text-gor-grey font-light max-w-md leading-relaxed">
              Questions about a piece, a bespoke order, or just want to talk menswear? We&apos;re here.
            </p>
          </Container>
        </div>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* ── Left: Form ── */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gor-card border border-gor-gold/30 p-10 text-center gold-glow"
                  >
                    <div className="w-16 h-16 rounded-full bg-gor-gold/15 border border-gor-gold/40 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-gor-gold" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-gor-offwhite mb-3">
                      MESSAGE RECEIVED
                    </h2>
                    <p className="text-sm text-gor-grey font-light leading-relaxed max-w-sm mx-auto">
                      Thank you, <span className="text-gor-offwhite font-medium">{form.name}</span>. Our atelier team will respond to <span className="text-gor-gold">{form.email}</span> within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" }); }}
                      className="mt-8 text-xs uppercase tracking-widest text-gor-gold border border-gor-gold/30 hover:border-gor-gold px-6 py-3 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gor-card border border-gor-gold/20 p-8 sm:p-10"
                  >
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gor-grey mb-1.5">Full Name</label>
                          <input type="text" value={form.name} onChange={set("name")} placeholder="Alexander Rothschild" className={inputCls("name")} />
                          {errors.name && <p className="text-xs text-gor-rust mt-1.5">{errors.name}</p>}
                        </div>
                        {/* Email */}
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gor-grey mb-1.5">Email Address</label>
                          <input type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" className={inputCls("email")} />
                          {errors.email && <p className="text-xs text-gor-rust mt-1.5">{errors.email}</p>}
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gor-grey mb-1.5">Subject</label>
                        <select
                          value={form.subject}
                          onChange={set("subject")}
                          className="w-full bg-gor-black border border-gor-gold/20 px-4 py-3 text-sm text-gor-offwhite focus:outline-none focus:border-gor-gold appearance-none cursor-pointer"
                        >
                          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gor-grey mb-1.5">Message</label>
                        <textarea
                          value={form.message}
                          onChange={set("message")}
                          rows={6}
                          placeholder="Tell us how we can help you..."
                          className={`${inputCls("message")} resize-none`}
                        />
                        {errors.message && <p className="text-xs text-gor-rust mt-1.5">{errors.message}</p>}
                      </div>

                      <Button type="submit" variant="primary" size="lg" icon={Send} className="w-full" disabled={loading}>
                        {loading ? "Sending to Atelier..." : "Send Message"}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right: Store Info ── */}
            <div className="lg:col-span-5 space-y-5">
              {STORE_INFO.map(({ icon: Icon, label, lines }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4 bg-gor-card border border-gor-gold/15 p-5 hover:border-gor-gold/35 transition-colors"
                >
                  <div className="w-9 h-9 border border-gor-gold/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gor-gold" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gor-gold font-medium mb-1.5">{label}</p>
                    {lines.map((line) => (
                      <p key={line} className="text-sm text-gor-grey">{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Social */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gor-navy/20 border border-gor-gold/20 p-5"
              >
                <p className="text-xs uppercase tracking-widest text-gor-gold font-medium mb-3">Follow the Atelier</p>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-gor-offwhite hover:text-gor-gold transition-colors"
                >
                  <InstagramIcon className="w-5 h-5" />
                  @gormenswear
                </a>
              </motion.div>
            </div>
          </div>
        </Container>
      </main>

      <CartDrawer />
      <Footer />
    </>
  );
}
