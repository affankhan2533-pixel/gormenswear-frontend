"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Barcode, Bell, Fingerprint, Scan, CheckCircle2, ShieldCheck } from "lucide-react";

export default function MobileHardwareDeviceModal({
  isOpen,
  onClose,
  initialFeature = "camera", // camera, barcode, biometrics, push
}) {
  const [activeFeature, setActiveFeature] = useState(initialFeature);
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      if (activeFeature === "barcode") {
        setScanResult("SKU: GOR-JKT-SUEDE-BIELLA (Barcode: 849201938401)");
      } else if (activeFeature === "camera") {
        setScanResult("Image captured (2400x1800 RGB Atelier Photo). Uploaded to GOR CDN.");
      } else if (activeFeature === "biometrics") {
        setScanResult("Face ID authenticated successfully. Mobile Admin unlocked.");
      } else if (activeFeature === "push") {
        setScanResult("Test push notification dispatched to Apple APNs & Google FCM.");
      }
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="device-feature-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-t-[28px] sm:rounded-[24px] max-w-sm w-full p-6 shadow-2xl space-y-5 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-[#C8A45D]" />
              <h3 id="device-feature-title" className="font-editorial text-xl text-[#F8F6F3]">
                Smartphone Device Feature
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-[#090909] border border-[#2A2A2A] rounded-full text-[#8E8A85]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Feature Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-[#090909] p-1 rounded-xl border border-[#2A2A2A]">
            {[
              { id: "camera", label: "Camera" },
              { id: "barcode", label: "Barcode" },
              { id: "biometrics", label: "Face ID" },
              { id: "push", label: "Push" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveFeature(t.id);
                  setScanResult(null);
                }}
                className={`flex-1 py-1.5 rounded-[8px] text-[11px] font-bold uppercase transition-colors ${
                  activeFeature === t.id
                    ? "bg-[#C8A45D] text-[#090909]"
                    : "text-[#8E8A85]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Simulation Display Frame */}
          <div className="p-6 bg-[#090909] border border-[#2A2A2A] rounded-[20px] text-center space-y-4">
            {activeFeature === "camera" && (
              <div className="space-y-3">
                <Camera className="w-12 h-12 text-[#C8A45D] mx-auto animate-pulse" />
                <div>
                  <h4 className="font-bold text-sm text-[#F8F6F3]">Camera Photo Capture</h4>
                  <p className="text-[11px] text-[#8E8A85]">
                    Simulate smartphone camera lens for instant product photo upload.
                  </p>
                </div>
              </div>
            )}

            {activeFeature === "barcode" && (
              <div className="space-y-3">
                <Barcode className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
                <div>
                  <h4 className="font-bold text-sm text-[#F8F6F3]">Laser Barcode Scanner</h4>
                  <p className="text-[11px] text-[#8E8A85]">
                    Scan product SKU barcodes for instant warehouse stock lookup.
                  </p>
                </div>
              </div>
            )}

            {activeFeature === "biometrics" && (
              <div className="space-y-3">
                <Fingerprint className="w-12 h-12 text-blue-400 mx-auto animate-pulse" />
                <div>
                  <h4 className="font-bold text-sm text-[#F8F6F3]">Biometric Authentication</h4>
                  <p className="text-[11px] text-[#8E8A85]">
                    Face ID / Fingerprint sensor verification for admin access.
                  </p>
                </div>
              </div>
            )}

            {activeFeature === "push" && (
              <div className="space-y-3">
                <Bell className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
                <div>
                  <h4 className="font-bold text-sm text-[#F8F6F3]">Native Push Notifications</h4>
                  <p className="text-[11px] text-[#8E8A85]">
                    Dispatches high-priority order and stock push alerts to smartphone lockscreen.
                  </p>
                </div>
              </div>
            )}

            {scanResult ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/30 rounded-[10px] text-xs text-emerald-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{scanResult}</span>
              </div>
            ) : (
              <button
                type="button"
                disabled={scanning}
                onClick={handleSimulateScan}
                className="w-full py-2.5 bg-[#C8A45D] text-[#090909] font-bold text-xs uppercase tracking-wider rounded-[10px] cursor-pointer shadow-md disabled:opacity-50"
              >
                {scanning ? "Processing Hardware Sensor..." : `Trigger ${activeFeature.toUpperCase()} Action`}
              </button>
            )}
          </div>

          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-[#090909] text-[#8E8A85] rounded-[10px] text-xs font-bold uppercase"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
