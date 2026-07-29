import Link from "next/link";
import { Home, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "404 — Page Not Found | GOR Menswear",
  description: "The page you are looking for does not exist. Return to the GOR Menswear collection.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090909] text-[#F8F6F3] flex flex-col items-center justify-center px-4 relative overflow-hidden select-none">
      {/* Background Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#C8A45D]/5 rounded-full blur-[160px] pointer-events-none" />

      <div
        className="relative z-10 text-center max-w-xl bg-[#151515] border border-[#2A2A2A] rounded-[20px] p-8 sm:p-12 shadow-2xl space-y-6"
        style={{ animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* 404 Number */}
        <div className="relative mb-2">
          <span
            className="font-editorial text-8xl sm:text-9xl font-normal leading-none text-transparent"
            style={{
              WebkitTextStroke: "1px rgba(200,164,93,0.3)",
              backgroundImage: "linear-gradient(135deg, #F8F6F3 0%, #C8A45D 50%, #8E8A85 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            404
          </span>
        </div>

        <div>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C8A45D] font-bold block mb-1">
            404 • PAGE NOT FOUND
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#F8F6F3]">
            This Page Does Not Exist
          </h1>
        </div>

        <p className="font-sans text-xs text-[#8E8A85] font-light leading-relaxed max-w-md mx-auto">
          The page you are looking for has been moved, removed, or never existed in our store. Let us guide you back to the collection.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full h-[46px] px-6 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-sans text-xs uppercase tracking-wider font-bold rounded-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              <span>Return Home</span>
            </button>
          </Link>

          <Link href="/shop" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full h-[46px] px-6 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] text-[#F8F6F3] font-sans text-xs uppercase tracking-wider font-semibold rounded-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#C8A45D]" aria-hidden="true" />
              <span>Browse Shop</span>
            </button>
          </Link>
        </div>

        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#8E8A85]/50 pt-4 border-t border-[#2A2A2A]">
          GOR MENSWEAR • TREND START HERE
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
