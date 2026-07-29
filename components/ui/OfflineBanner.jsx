"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      success("Connection Restored", "You are back online.");
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [success]);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[260] bg-rose-950/95 border-b border-rose-500/40 text-rose-200 px-4 py-2.5 backdrop-blur-md flex items-center justify-center gap-2 text-xs font-sans font-semibold shadow-2xl"
          role="status"
          aria-live="assertive"
        >
          <WifiOff className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>You are currently offline. Reconnecting...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
