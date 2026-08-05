"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";

export default function SizeGuideModal({
  isOpen = false,
  onClose = () => {},
}) {
  const [unitCm, setUnitCm] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[180] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl bg-[#111111] border border-[#2A2A2A] p-6 sm:p-8 rounded-2xl relative font-sans max-h-[90vh] overflow-y-auto shadow-2xl text-[#F7F5F2]"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Size Guide"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#0B0B0B] border border-[#2A2A2A] flex items-center justify-center text-[#B8B6B0] hover:text-[#C9A86A] hover:border-[#C9A86A] hover:rotate-90 transition-all duration-300 cursor-pointer shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-[#2A2A2A]">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C9A86A] font-bold block mb-1">
                TAILORING SPECIFICATIONS
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-normal">
                Garment Size Matrix
              </h3>
              <p className="text-xs text-[#B8B6B0] font-light mt-1">
                Precision sizing measurements for optimal drape and shoulder fit.
              </p>
            </div>

            {/* Sliding Unit Toggle */}
            <div className="relative flex items-center bg-[#0B0B0B] border border-[#2A2A2A] rounded-full p-1 text-xs shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setUnitCm(false)}
                className={`relative z-10 px-4 py-1.5 rounded-full font-bold transition-colors duration-200 cursor-pointer ${
                  !unitCm ? "bg-[#C9A86A] text-[#0B0B0B]" : "text-[#B8B6B0] hover:text-[#F7F5F2]"
                }`}
              >
                INCHES
              </button>
              <button
                type="button"
                onClick={() => setUnitCm(true)}
                className={`relative z-10 px-4 py-1.5 rounded-full font-bold transition-colors duration-200 cursor-pointer ${
                  unitCm ? "bg-[#C9A86A] text-[#0B0B0B]" : "text-[#B8B6B0] hover:text-[#F7F5F2]"
                }`}
              >
                CM
              </button>
            </div>
          </div>

          {/* Fit Profile Summary */}
          <div className="mb-6 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86A] font-bold block">
              FIT PROFILE: RELAXED OVERSIZED FIT
            </span>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl">
              <div className="py-2.5 text-center text-xs font-semibold text-[#B8B6B0]">
                Slim Fit
              </div>
              <div className="py-2.5 text-center text-xs font-semibold text-[#B8B6B0]">
                Regular Fit
              </div>
              <div className="py-2.5 text-center text-xs font-bold text-[#0B0B0B] bg-[#C9A86A] rounded-lg shadow-sm">
                Relaxed Fit
              </div>
            </div>
          </div>

          {/* Measurement Table */}
          <div className="border border-[#2A2A2A] rounded-xl overflow-hidden mb-6 shadow-md">
            <div className="overflow-x-auto max-h-[280px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-[#0B0B0B] border-b border-[#2A2A2A] z-10">
                  <tr className="text-[#C9A86A] uppercase tracking-wider text-[11px]">
                    <th className="px-4 py-3 font-bold">Size</th>
                    <th className="px-4 py-3 font-bold">Chest</th>
                    <th className="px-4 py-3 font-bold">Waist</th>
                    <th className="px-4 py-3 font-bold">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]/50">
                  {[
                    { sz: "XS", chest: unitCm ? "86 - 89 cm" : '34 - 35"', waist: unitCm ? "71 - 74 cm" : '28 - 29"', sh: unitCm ? "43 cm" : '17.0"' },
                    { sz: "S", chest: unitCm ? "91 - 96 cm" : '36 - 38"', waist: unitCm ? "76 - 79 cm" : '30 - 31"', sh: unitCm ? "44 cm" : '17.5"' },
                    { sz: "M", chest: unitCm ? "99 - 104 cm" : '39 - 41"', waist: unitCm ? "81 - 84 cm" : '32 - 33"', sh: unitCm ? "46 cm" : '18.0"' },
                    { sz: "L", chest: unitCm ? "107 - 112 cm" : '42 - 44"', waist: unitCm ? "86 - 89 cm" : '34 - 35"', sh: unitCm ? "47 cm" : '18.5"' },
                    { sz: "XL", chest: unitCm ? "114 - 119 cm" : '45 - 47"', waist: unitCm ? "91 - 96 cm" : '36 - 38"', sh: unitCm ? "48 cm" : '19.0"' },
                    { sz: "XXL", chest: unitCm ? "122 - 127 cm" : '48 - 50"', waist: unitCm ? "99 - 104 cm" : '39 - 41"', sh: unitCm ? "49 cm" : '19.5"' },
                  ].map((row, idx) => (
                    <tr
                      key={row.sz}
                      className={`transition-colors hover:bg-[#C9A86A]/10 ${
                        idx % 2 === 0 ? "bg-[#15181D]" : "bg-[#0B0B0B]"
                      }`}
                    >
                      <td className="px-4 py-3 font-bold text-[#C9A86A] text-sm">{row.sz}</td>
                      <td className="px-4 py-3 text-[#F7F5F2]">{row.chest}</td>
                      <td className="px-4 py-3 text-[#F7F5F2]">{row.waist}</td>
                      <td className="px-4 py-3 text-[#F7F5F2]">{row.sh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Model Specifications */}
          <div className="p-4 bg-[#0B0B0B] border border-[#2A2A2A] rounded-xl mb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86A] font-bold block mb-3 text-center sm:text-left">
              MODEL SPECIFICATIONS
            </span>
            <div className="grid grid-cols-3 gap-2 text-center divide-x divide-[#2A2A2A]">
              <div>
                <span className="text-[10px] uppercase text-[#B8B6B0] block mb-0.5 font-medium">Height</span>
                <span className="text-xs sm:text-sm font-bold text-[#F7F5F2]">6'1" (185 cm)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#B8B6B0] block mb-0.5 font-medium">Chest</span>
                <span className="text-xs sm:text-sm font-bold text-[#F7F5F2]">40" (101 cm)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#B8B6B0] block mb-0.5 font-medium">Size Worn</span>
                <span className="text-xs sm:text-sm font-bold text-[#C9A86A]">Size L</span>
              </div>
            </div>
          </div>

          {/* How to Measure */}
          <div className="pt-2 border-t border-[#2A2A2A]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A86A] font-bold block mb-3">
              HOW TO MEASURE
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg">
                <span className="font-bold text-[#F7F5F2] block mb-1">1. Chest</span>
                <p className="text-[10px] text-[#B8B6B0] leading-relaxed font-light">
                  Measure around fullest chest point keeping tape horizontal.
                </p>
              </div>
              <div className="p-3 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg">
                <span className="font-bold text-[#F7F5F2] block mb-1">2. Shoulder</span>
                <p className="text-[10px] text-[#B8B6B0] leading-relaxed font-light">
                  Measure seam-to-seam across back.
                </p>
              </div>
              <div className="p-3 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg">
                <span className="font-bold text-[#F7F5F2] block mb-1">3. Waist</span>
                <p className="text-[10px] text-[#B8B6B0] leading-relaxed font-light">
                  Measure natural waistline comfortably.
                </p>
              </div>
              <div className="p-3 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg">
                <span className="font-bold text-[#F7F5F2] block mb-1">4. Sleeve</span>
                <p className="text-[10px] text-[#B8B6B0] leading-relaxed font-light">
                  Measure from shoulder seam to wrist.
                </p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
