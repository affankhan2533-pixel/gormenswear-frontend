"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders, Sparkles, Check } from "lucide-react";

/**
 * FindMySizeModal
 * Refinement #1: Simple recommendation flow using Height, Weight and Preferred Fit (Slim / Regular / Relaxed).
 * Architecture ready for future AI recommendation engine integration.
 */
export default function FindMySizeModal({
  isOpen = false,
  onClose = () => {},
  onSelectSize = () => {},
}) {
  const [height, setHeight] = useState(178); // cm
  const [weight, setWeight] = useState(74); // kg
  const [fitPref, setFitPref] = useState("relaxed"); // "slim" | "regular" | "relaxed"
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  if (!isOpen) return null;

  // Recommendation engine algorithm (prepared for future AI model hook endpoint)
  const handleCalculate = async () => {
    setIsCalculating(true);
    setResult(null);

    // Simulate instant AI sizing latency (can connect to backend AI size endpoint in future)
    await new Promise((res) => setTimeout(res, 350));

    const h = Number(height);
    const w = Number(weight);

    let recSize = "M";
    if (w < 62) recSize = "S";
    else if (w < 74) recSize = "M";
    else if (w < 85) recSize = "L";
    else if (w < 96) recSize = "XL";
    else recSize = "XXL";

    if (fitPref === "slim" && recSize !== "XS") {
      if (recSize === "M") recSize = "S";
      else if (recSize === "L") recSize = "M";
      else if (recSize === "XL") recSize = "L";
    } else if (fitPref === "relaxed" && recSize !== "XXL") {
      if (recSize === "M") recSize = "L";
      else if (recSize === "L") recSize = "XL";
    }

    setResult({
      size: recSize,
      confidence: "96%",
      explanation: `Calculated for ${h}cm, ${w}kg with a ${fitPref} fit preference.`,
    });
    setIsCalculating(false);
  };

  const handleApplySize = (sz) => {
    onSelectSize(sz);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[180] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md bg-[#111111] border border-[#2A2A2A] p-6 sm:p-8 rounded-2xl relative font-sans shadow-2xl text-[#F7F5F2]"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Find My Size"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#0B0B0B] border border-[#2A2A2A] flex items-center justify-center text-[#B8B6B0] hover:text-[#C9A86A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A86A] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> FIT INTELLIGENCE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal">Find My Size</h3>
            <p className="text-xs text-[#B8B6B0] mt-1 font-light">
              Simple sizing calculation based on your measurements & fit preference.
            </p>
          </div>

          <div className="space-y-5">
            {/* Height Input */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-semibold mb-2">
                Height (cm): <span className="text-[#F7F5F2] font-bold">{height} cm</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="140"
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] rounded-lg px-3.5 py-2 text-sm text-[#F7F5F2] focus:outline-none"
                />
              </div>
            </div>

            {/* Weight Input */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-semibold mb-2">
                Weight (kg): <span className="text-[#F7F5F2] font-bold">{weight} kg</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="40"
                  max="140"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#C9A86A] rounded-lg px-3.5 py-2 text-sm text-[#F7F5F2] focus:outline-none"
                />
              </div>
            </div>

            {/* Preferred Fit (Slim / Regular / Relaxed) */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B8B6B0] font-semibold mb-2">
                Preferred Fit
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "slim", label: "Slim Fit" },
                  { key: "regular", label: "Regular Fit" },
                  { key: "relaxed", label: "Relaxed Fit" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFitPref(item.key)}
                    className={`py-2.5 px-2 text-xs uppercase font-bold rounded-lg border transition-all cursor-pointer ${
                      fitPref === item.key
                        ? "bg-[#C9A86A] text-[#0B0B0B] border-[#C9A86A] shadow-md"
                        : "bg-[#0B0B0B] text-[#B8B6B0] border-[#2A2A2A] hover:border-white/30"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="button"
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full py-3.5 bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {isCalculating ? "Calculating..." : "Find Recommended Size"}
            </button>

            {/* Result Box */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#0B0B0B] border border-[#C9A86A]/40 rounded-xl text-center space-y-2"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B8B6B0]">
                  RECOMMENDED SIZE
                </span>
                <div className="font-serif text-4xl font-normal text-[#C9A86A]">
                  {result.size}
                </div>
                <p className="text-xs text-[#B8B6B0] font-light">{result.explanation}</p>

                <button
                  type="button"
                  onClick={() => handleApplySize(result.size)}
                  className="mt-2 w-full py-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-emerald-900/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Select Size {result.size} & Continue
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
