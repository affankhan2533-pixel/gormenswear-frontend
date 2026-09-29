import Link from "next/link";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "404 — Piece Not Found | GOR Menswear",
  description: "The page you're looking for doesn't exist. Return to the GOR collection.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#111111] flex flex-col justify-between selection:bg-[#111111] selection:text-[#F5F2EC]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-28 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#716D66] block">
            ERROR 404
          </span>

          <h1 className="font-editorial text-5xl sm:text-6xl text-[#111111] font-normal tracking-tight">
            PIECE NOT FOUND.
          </h1>

          <p className="font-sans text-xs text-[#716D66] font-light leading-relaxed max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been relocated within the GOR collection archive.
          </p>

          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#151515] text-[#F5F2EC] hover:bg-[#252525] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-200"
            >
              BACK TO SHOP
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
