"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Sparkles,
} from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = "info", title, description = "", duration = 3500 }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast = { id, type, title, description, duration };

      setToasts((prev) => [newToast, ...prev].slice(0, 3)); // Max 3 visible toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      toast: addToast,
      success: (title, description, duration) => addToast({ type: "success", title, description, duration }),
      error: (title, description, duration) => addToast({ type: "error", title, description, duration }),
      warning: (title, description, duration) => addToast({ type: "warning", title, description, duration }),
      info: (title, description, duration) => addToast({ type: "info", title, description, duration }),
      removeToast,
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* ── GLOBAL TOAST CONTAINER (Top Right Desktop / Bottom Center Mobile) ── */}
      <div
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[250] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none pb-[env(safe-area-inset-bottom)] px-4 sm:px-0"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

function ToastItem({ toast, onClose }) {
  const { type, title, description, duration } = toast;

  const config = {
    success: {
      icon: CheckCircle2,
      badgeColor: "text-emerald-400 border-emerald-500/40 bg-emerald-950/60",
      progressBg: "bg-emerald-500",
    },
    error: {
      icon: AlertCircle,
      badgeColor: "text-rose-400 border-rose-500/40 bg-rose-950/60",
      progressBg: "bg-rose-500",
    },
    warning: {
      icon: AlertTriangle,
      badgeColor: "text-amber-400 border-amber-500/40 bg-amber-950/60",
      progressBg: "bg-amber-500",
    },
    info: {
      icon: Sparkles,
      badgeColor: "text-[#C8A45D] border-[#C8A45D]/40 bg-[#151515]",
      progressBg: "bg-[#C8A45D]",
    },
  }[type] || {
    icon: Info,
    badgeColor: "text-[#C8A45D] border-[#C8A45D]/40 bg-[#151515]",
    progressBg: "bg-[#C8A45D]",
  };

  const IconComp = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      className={`pointer-events-auto w-full p-4 rounded-[14px] border shadow-2xl backdrop-blur-xl relative overflow-hidden flex items-start gap-3 ${config.badgeColor}`}
    >
      <IconComp className="w-5 h-5 shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0 pr-4">
        <h4 className="font-sans text-xs font-bold text-[#F8F6F3]">{title}</h4>
        {description && (
          <p className="font-sans text-[11px] text-[#8E8A85] font-light mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="text-[#8E8A85] hover:text-[#F8F6F3] transition-colors p-1 cursor-pointer"
        aria-label="Close Notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress Bar Animation */}
      {duration > 0 && (
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className={`absolute bottom-0 left-0 h-0.5 ${config.progressBg}`}
        />
      )}
    </motion.div>
  );
}
